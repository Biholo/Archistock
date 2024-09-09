const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Address = require("../models/addressModel");
const UserSubscription = require("../models/userSubscriptionModel");
const Subscription = require("../models/subscriptionModel");
const File = require("../models/fileModel");
const Folder = require("../models/folderModel");
const Mailer = require("../services/mailer");
const Invoices = require("../models/invoicesModel");
const userSubscriptionController = require("./userSubscriptionController");
require("dotenv").config();

const { v4: uuidv4 } = require("uuid");
const mailer = new Mailer();
//--------- Create a user ---------//

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body.user;
    const { street, city, postalCode, countryId } = req.body.address;

    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(400).json({ message: "This email is already in use." });
    }

    const address = await Address.create({
      street,
      city,
      postalCode,
    });
    
    // create user and get address 
    await User.create({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      addressId: address.id,
    });

    const user = await User.findOne({
      where: { email: email },
      include: [
        {
          model: Address,
          as: "address",
        },
      ],
    });

    const refreshToken = uuidv4();
    user.refreshToken = refreshToken;
    await user.save();

    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1h" });

    mailer.sendAccountConfirmationEmail(email, user.id);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 3600000),
      path: "/",
    });

    mailer.sendWelcomeEmail(email, user);

    const subscription = await Subscription.findOne({ where: { id: 1 } });

    let userSubscription = {};

    userSubscription.subscriptionId = subscription.id;
    userSubscription.userId = user.id;
    userSubscription.startDate = new Date();

    let newSubscription = await UserSubscription.create(userSubscription);

    await Folder.create({
      name: "root",
      userSubscriptionId: newSubscription.id,
    });

    // create invoice 
    await userSubscriptionController.createInvoice(user, subscription, newSubscription);

    mailer.sendSubscriptionThankYouEmail(email, user);

    res.status(201).json({ user, accessToken: token, refreshToken });
  } catch (error) {
    console.error("Error while registering the user: ", error);
    res.status(500).json({ message: "Error while registering the user" });
  }
};


//--------- Login a user ---------//

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const existingUser = await User.findOne({
      where: { email },
      include: [{ model: Address, as: "address" }],
    });

    if (!existingUser) {
      return res.status(401).json({ message: "Incorrect email." });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    const refreshToken = uuidv4();
    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser.id,
        role: existingUser.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Seulement en production
      sameSite: "strict",
      expires: new Date(Date.now() + 3600000),
      path: "/",
    });

    res
      .status(200)
      .json({ user: existingUser, accessToken: token, refreshToken });
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
    res.status(500).json({ message: "Error while fetching users" });
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
    res.status(500).json({ error: "Error while fetching the user" });
  }
};

//--------- Update a user ---------//

exports.updateUser = async (req, res) => {
  try {

    const token = req.headers.authorization;
    let email = null;

    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (token) {
      email = jwt.verify(token, process.env.SECRET_KEY).email;
    }

    const userToUpdate = await User.findOne({
      where: { email: email },
    });

    if(!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = req.body;

    // Update the user information
    userToUpdate.email = user.email;
    userToUpdate.firstName = user.firstName;
    userToUpdate.lastName = user.lastName;
    userToUpdate.phoneNumber = user.phoneNumber;

    const addressToUpdate = await Address.findByPk(userToUpdate.addressId);
    addressToUpdate.street = user.address.street;
    addressToUpdate.city = user.address.city;
    addressToUpdate.postalCode = user.address.postalCode;

    await addressToUpdate.save();
    await userToUpdate.save();

    const getUpdatedUser = await User.findOne({
      where: { email: user.email },
      include: [
        {
          model: Address,
          as: "address",
        },
      ],
    });

    res.status(200).json({ message: "User information updated successfully", data: getUpdatedUser, status: 200 });
  } catch (error) {
    console.error("Error while updating user information:", error);
    res.status(500).json({
      message: "Error while updating user information",
      error: error.message, // Optionally include the error message for debugging
    });
  }
};

//--------- Confirm account ---------//

exports.confirmAccount = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const tokenDecoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!tokenDecoded || !tokenDecoded.userId) {
      return res.status(400).json({ message: "Invalid token" });
    }

    console.log(tokenDecoded.userId);
    const user = await User.findByPk(tokenDecoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.accountIsConfirmed) {
      return res.status(200).json({ message: "Account is already confirmed" });
    }

    user.accountIsConfirmed = true;
    await user.save();

    res.status(200).json({ message: "Account confirmed successfully" });
  } catch (error) {
    console.error("Error while confirming account:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid token" });
    }

    res.status(500).json({ message: "Error while confirming account" });
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
    res.status(500).json({ message: "Error while deleting the user" });
  }
};

// --------- Get user by access token ---------//

exports.getProfile = async (req, res) => {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({
      where: {
        email: decoded.email,
      },
      include: [
        {
          model: Address,
          as: "address",
        },
      ],
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
    const accessToken = jwt.sign(
      { email: user.email, id: user.id, role: user.role, type: user.userType },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    //generate a new refresh token
    const newRefreshToken = uuidv4();

    // Save the new refresh token to the user record in the database
    user.refreshToken = newRefreshToken;
    await user.save();

    res
      .status(200)
      .json({ accessToken: accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(500).json({ message: "Error refreshing token" });
  }
};

//--------- Reset password ---------//

exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a temporary link
    mailer.sendPasswordResetEmail(email, user);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error while resetting password: ", error);
    res.status(500).json({ message: "Error while resetting password" });
  }
};

//--------- Update user password ---------//

exports.updatePassword = async (req, res) => {
  try {
    const { password, jwtToken } = req.body;
    const decoded = jwt.verify(jwtToken, process.env.SECRET_KEY);
    const userId = decoded.userId;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hash = await bcrypt.hashSync(password, 10);
    user.password = hash;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error while updating password: ", error);
    res.status(500).json({ message: "Error while updating password" });
  }
};

//--------- Change user password ---------//

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, userId } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hash = await bcrypt.compareSync(oldPassword, user.password);
    if (!hash) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const newHash = await bcrypt.hashSync(newPassword, 10);
    user.password = newHash;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error while updating password: ", error);
    res.status(500).json({ message: "Error while updating password" });
  }
};

//--------- Get files by user ID ---------//
exports.getFilesByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Retrieve all subscriptions for the user along with the associated files via UserSubscription
    const userSubscriptions = await UserSubscription.findAll({
      where: { userId: userId },
      include: [
        {
          model: Subscription,
        },
        {
          model: File,
          as: "files",
        },
      ],
    });

    if (!userSubscriptions || userSubscriptions.length === 0) {
      return res
        .status(404)
        .json({ error: "No subscriptions or files found for this user" });
    }

    // Extract files from the user subscriptions
    const files = userSubscriptions.flatMap(
      (userSubscription) => userSubscription.files
    );

    res.status(200).json(files);
  } catch (error) {
    console.error("Error retrieving files:", error);
    res.status(500).json({ error: "An error occurred while retrieving files" });
  }
};

//--------- Delete all about user ---------//
exports.deleteUserAccount = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const subscriptions = await UserSubscription.findAll({
      where: { userId: user.id },
    });
    let totalFilesDeleted = 0;

    for (const subscription of subscriptions) {
      const folders = await Folder.findAll({
        where: { userSubscriptionId: subscription.id },
      });
      for (const folder of folders) {
        await File.destroy({ where: { parentId: folder.id } });
      }
      totalFilesDeleted += await File.destroy({
        where: { userSubscriptionId: subscription.id },
      });
      await Folder.destroy({ where: { userSubscriptionId: subscription.id } });
    }

    await InvitationRequest.destroy({ where: { userId: user.id } });
    await UserSubscription.destroy({ where: { userId: user.id } });
    await Right.destroy({ where: { userId: user.id } });
    await user.destroy();

    res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'strict' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' });

    // Envoyer un email à l'utilisateur pour confirmer la suppression de son compte
    await mailer.sendAccountDeletionEmail(user.email);

    // Envoyer un email aux administrateurs avec le nombre de fichiers supprimés
    const admins = await User.findAll({ where: { role: "admin" } })
    for (const admin of admins) {
      await mailer.sendAccountDeletionEmailAdmin(
        admin.email,
        user,
        totalFilesDeleted
      );
    }

    // Répondre au client avec un message de succès
    res.status(200).json({
      message: `Compte supprimé avec succès, ${totalFilesDeleted} fichiers ont été supprimés.`,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du compte." });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    let token = req.headers.authorization;
    let email = null;

    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (token) {
      email = jwt.verify(token, process.env.SECRET_KEY).email;
    }

    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const invoices = await Invoices.findAll({
      where: { userId: user.id },
      include: [
        {
          model: UserSubscription,
          as: "usersubscription",  // Use 'as' to specify the alias
          include: [
            {
              model: Subscription,
              as: "subscription",
            }
          ],
        },
      ],
    });

    res.status(200).json(invoices);

  } catch (error) {
    console.error('Erreur lors de la récupération des factures :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des factures' });
  }
}

exports.isEmailUnique = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      res.status(200).json({ unique: false });
    } else {
      res.status(200).json({ unique: true });
    }
  }
  catch (error) {
    console.error('Error while checking email uniqueness:', error);
    res.status(500).json({ message: 'Error while checking email uniqueness' });
  }
}
