const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const multer = require('multer');
require("dotenv").config();

//--------- Create a user ---------//

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, country, city, street } = req.body;

    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(400).json({ message: "This email is already in use." });
    }

    const hash = await bcrypt.hashSync(password, 10);
    const user = await User.create(
      {
        email,
        password: hash,
        firstName,
        lastName,
        country,
        city,
        street,
      }
    );

    // Generate a refresh token with expiration (e.g., 7 days)
    const refreshToken = jwt.sign({ email: user.email }, process.env.REFRESH_SECRET_KEY, {
      expiresIn: "7d",
    });

    // Update the refresh token in the database (this is an example, you should adjust according to your data model)
    user.refreshToken = refreshToken;
    await user.save();

    // Return the JWT token and the refresh token
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(201).json({ token, refreshToken });
  } catch (error) {
    console.error("Error while registering the user: ", error);
    res.status(500).json({ message: "Error while registering the user" });
  }
};

//--------- Login a user ---------//

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ where: { email: email } });

    if (!existingUser) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    const hash = bcrypt.compareSync(password, existingUser.password);
    if (!hash) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    // Generate a refresh token
    const refreshToken = jwt.sign({ email: existingUser.email }, process.env.REFRESH_SECRET_KEY);

    // Update the refresh token in the database (this is an example, you should adjust according to your data model)
    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    // Return the JWT token and the refresh token
    const token = jwt.sign({ email: existingUser.email, id: existingUser.id, role: existingUser.role }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ token, refreshToken });
  } catch (error) {
    console.error("Error during user authentication: ", error);
    res.status(500).json({ message: "Error during user authentication" });
  }
};

// Refresh a user token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not provided" });
  }

  try {
    // Check the validity of the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

    // Find the user in the database by their email
    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if the refresh token stored in the database matches the provided one
    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate a new access token
    const newAccessToken = jwt.sign({ email: user.email, id: user.id, role: user.role }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Return the new access token and maybe also the refresh token
    res.status(200).json({ token: newAccessToken, refreshToken: refreshToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
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

    // Find the user in the database by their email (or another identifier)
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
    const userId = req.params.id; // Assume the user ID to be deleted is passed in the URL parameters

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
