const UserSubscription = require("../models/userSubscriptionModel");
const User = require("../models/userModel");
const Subscription = require("../models/subscriptionModel");

// Create a user subscription (POST)
exports.add = async (req, res) => {
  try {
    const userSubscription = req.body;
    await UserSubscription.create(userSubscription);
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
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "User subscription not found" });
    }
  } catch (error) {
    console.error("Error updating user subscription: ", error);
    res.status(500).json({ error: "Error updating user subscription" });
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
