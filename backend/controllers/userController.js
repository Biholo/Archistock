const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Address = require("../models/addressModel");
const multer = require('multer');
require("dotenv").config();

const { v4: uuidv4 } = require('uuid');

//--------- Create a user ---------//

exports.register = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password, firstName, lastName, phoneNumner } = req.body.user;
        const {street, city, postalCode, countryId} = req.body.address;

        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ message: "This email is already in use." });
        }

        const address = await Address.create(
            {
                street: street,
                city: city,
                postalCode: postalCode,
            }
        );

        const hash = await bcrypt.hashSync(password, 10);
        const user = await User.create(
            {
                email,
                password: hash,
                firstName,
                lastName,
                phoneNumner,
                addressId: address.id,
            }
        );



        // Generate a refresh token with expiration
        const refreshToken = uuidv4();


        // Update the refresh token in the database
        user.refreshToken = refreshToken;
        await user.save();

        // Return the JWT token and the refresh token
        const token = jwt.sign({ email }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });
        res.status(201).json({ user, accessToken:token, refreshToken });
    } catch (error) {
        console.log(error);
        console.error("Error while registering the user: ", error);
        res.status(500).json({ message: "Error while registering the user" });
    }
};

//--------- Login a user ---------//

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const existingUser = await User.findOne({ where: { email: email } });

        if (!existingUser) {
            return res.status(401).json({ message: "Incorrect email." });
        }

        const hash = bcrypt.compareSync(password, existingUser.password);
        if (!hash) {
            return res.status(401).json({ message: "Incorrect email or password." });
        }

        // Generate a refresh token
        const refreshToken = uuidv4();

        // Update the refresh token in the database
        existingUser.refreshToken = refreshToken;
        await existingUser.save();

        // Return the JWT token and the refresh token
        const token = jwt.sign({ email: existingUser.email, id: existingUser.id, role: existingUser.role }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });
        res.status(200).json({ user:existingUser, accessToken:token, refreshToken });
    } catch (error) {
        console.error("Error during user authentication: ", error);
        res.status(500).json({ message: "Error during user authentication" });
    }
};



// Verify the validity of the access token
exports.verifyAccessToken = async (req, res) => {
    const { accessToken } = req.body;

    if (!accessToken) {
        return res.status(401).json({ message: "Access token not provided" });
    }

    try {
        // Check the validity of the access token
        const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);

        // Find the user in the database by their email
        const user = await User.findOne({ where: { email: decoded.email } });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // The access token is valid
        res.status(200).json({ message: "Access token is valid", user: user });
    } catch (error) {
        return res.status(403).json({ message: "Invalid access token" });
    }
};

//--------- Get all users ---------//

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error while fetching users" });
    }
};

//--------- Get a user by id ---------//

exports.getById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findByPk(userId);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error while fetching the user:", error);
        res
            .status(500)
            .json({ error: "Error while fetching the user" });
    }
};


//--------- Update a user ---------//

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id; // Assume the user ID to be updated is passed in the URL parameters
        const { email, password } = req.body;

        // Check if the user to update exists in the database
        const userToUpdate = await User.findByPk(userId);
        if (!userToUpdate) {
            return res.status(404).json({ message: "User not found" });
        }

        if (email) {
            userToUpdate.email = email;
        }
        if (password) {
            const hash = await bcrypt.hashSync(password, 10);
            userToUpdate.password = hash;
        }

        // Save the modifications to the database
        await userToUpdate.save();

        res
            .status(200)
            .json({ message: "User information updated successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error while updating user information",
        });
    }
};


//--------- Delete a user ---------//

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if the user to delete exists in the database
        const userToDelete = await User.findByPk(userId);
        if (!userToDelete) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the user from the database
        await userToDelete.destroy();

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error while deleting the user" });
    }
};


// --------- Get user by access token ---------//

exports.getProfile = async (req, res) => {
    const token = req.headers.authorization;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne(
            { 
                where: { 
                    email: 
                    decoded.email 
                },
            });
        res.status(200).json(user);
    } catch (error) {
        console.error("Error recovering user by token:", error);
        res.status(500).json({ message: "Error recovering user by token" });
    }
};


//--------- Refresh a token ---------//

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        // Find the user with the provided refresh token
        const user = await User.findOne({ where: { refreshToken: refreshToken } });
        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Generate a new JWT token
        const accessToken = jwt.sign({ email: user.email, id: user.id, role: user.role, type: user.userType }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });

        //generate a new refresh token
        const newRefreshToken = uuidv4();

        // Save the new refresh token to the user record in the database
        user.refreshToken = newRefreshToken;
        await user.save();

        res.status(200).json({ accessToken: accessToken, refreshToken: newRefreshToken});
    } catch (error) {
        res.status(500).json({ message: "Error refreshing token" });
    }
};