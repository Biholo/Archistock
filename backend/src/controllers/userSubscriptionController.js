const UserSubscription = require("../models/userSubscriptionModel");
const User = require("../models/userModel");
const File = require("../models/fileModel");
const Subscription = require("../models/subscriptionModel");
const jwt = require("jsonwebtoken");
const Folder = require("../models/folderModel");
require("dotenv").config();

// Create a user subscription (POST)
exports.add = async (req, res) => {
  try {
    const userSubscription = req.body;
    const token = req.headers.authorization;
    let email = null;
    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }
    if (token) {
      email = jwt.verify(token, process.env.SECRET_KEY).email;
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    userSubscription.userId = user.id;
    userSubscription.startDate = new Date();

    let subscription = await UserSubscription.create(userSubscription);
    
    await Folder.create({
      name: "root",
      userSubscriptionId: subscription.id,
    });

    res.status(201).json("User subscription added");
  } catch (error) {
    console.error("Error adding user subscription: ", error);
    res.status(500).json({ error: "Error adding user subscription" });
  }
};

// Delete user subscription (DELETE)
exports.delete = async (req, res) => {
  const idP = req.params.id;
  try {
    const result = await UserSubscription.findByPk(idP);
    if (result) {
      await result.destroy();
      res.status(200).json("User subscription successfully deleted");
    } else {
      res.status(404).json({ error: "User subscription not found" });
    }
  } catch (error) {
    console.error("Error deleting user subscription: ", error);
    res.status(500).json({ error: "Error deleting user subscription" });
  }
};

// Update user subscription (PUT)
exports.update = async (req, res) => {
  const idP = req.params.id;
  const userSubscription = req.body;
  try {
    const result = await UserSubscription.findByPk(idP);
    if (result) {
      await result.update(userSubscription);
      res.status(201).json({ status: 201, message: "User subscription updated successfully" });
    } else {
      res.status(404).json({ status: 404, error: "User subscription not found" });
    }
  } catch (error) {
    console.error("Error updating user subscription: ", error);
    res.status(500).json({ status: 500, error: "Error updating user subscription" });
  }
};

// Get user subscription by Id (GET)
exports.getById = async (req, res) => {
  const idP = req.params.id;
  try {
    const result = await UserSubscription.findByPk(idP, {
      include: [
        { model: User, as: 'user' },
        { model: Subscription, as: 'subscription' },
      ],
    });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "User subscription not found" });
    }
  } catch (error) {
    console.error("Error retrieving the user subscription:", error);
    res.status(500).json({ error: "Error retrieving the user subscription" });
  }
};

// Get all user subscriptions (GET)
exports.getAll = async (req, res) => {
  try {
    const result = await UserSubscription.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Subscription, as: 'subscription' },
      ],
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving the user subscriptions:", error);
    res.status(500).json({ error: "Error retrieving the user subscriptions" });
  }
};

// Get user subscriptions by user Id (GET)
exports.getByUserId = async (req, res) => {
  setTimeout(() => {
    console.log("Timeout completed");
  }, 5000);
  
  let token = req.headers.authorization;
  let email = null;
  
  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }
  
  if (token) {
    email = jwt.verify(token, process.env.SECRET_KEY).email;
  }

  try {
    const user = await User.findOne({ where: { email: email } });
    const result = await UserSubscription.findAll({
      where: { userId: user.id },
      include: [
        { model: User, as: 'user' },
        { model: Subscription, as: 'subscription' },
      ],
    });

    // for erach userSubscription, get the files size. (Files are store in Mo)
    for (let i = 0; i < result.length; i++) {
      let userSubscription = result[i];
      let files = await File.findAll({ where: { userSubscriptionId: userSubscription.id } });
      let totalSize = 0;
      for (let j = 0; j < files.length; j++) {
        totalSize += files[j].size;
      }
      userSubscription.dataValues.totalSize = totalSize;
    }
    
    res.status(200).json(result);  // Send the result as a JSON response
  } catch (error) {
    console.error("Error retrieving the user subscriptions:", error);
    res.status(500).json({ error: "Error retrieving the user subscriptions" });
  }
};

// Get user subscriptions by user Id with files (GET)
exports.getByUserIdWithFiles = async (req, res) => {
  setTimeout(() => {
    console.log("Timeout completed");
  }, 5000);
  
  let token = req.headers.authorization;
  let email = null;
  
  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }
  
  if (token) {
    email = jwt.verify(token, process.env.SECRET_KEY).email;
  }

  try {
    const user = await User.findOne({ where: { email: email } });
    const result = await UserSubscription.findAll({
      where: { userId: user.id },
      include: [
        { model: User, as: 'user' },
        { model: Subscription, as: 'subscription' },
        { model: File, as: 'files' },
        { model: Folder, as: 'folders', include: [{ model: File, as: 'files' }] },
      ],
    });

    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving the user subscriptions:", error);
    res.status(500).json({ error: "Error retrieving the user subscriptions" });
  }
};


exports.addFile = async (req, res) => {
  let files = req.files;
  let userSubscriptionId = req.body.userSubscriptionId;
  try {
    for (let i = 0; i < files.length; i++) {
      await File.create({
        name: files[i].originalname,
        size: (files[i].size / 1048576).toFixed(2),
        format: files[i].mimetype.split("/")[1],
        parentId: null,
        userSubscriptionId: userSubscriptionId,
      });
    }
    res.status(201).json("Files added to subscription");
  } catch (error) {
    console.error("Error adding files to subscription: ", error);
    res.status(500).json({ error: "Error adding files to subscription" });
  }
}