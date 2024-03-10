const Subscribe = require("../models/subscribeModel");
const User = require("../models/userModel");
const Subscription = require("../models/subscriptionModel");

// Create a subscription (POST)
exports.add = async (req, res) => {
  try {
    const subscription = req.body;
    await Subscription.create(subscription);
    res.status(201).json("Subscription added");
  } catch (error) {
    console.error("Error adding subscription : ", error);
    res.status(500).json({ error: "Error adding subscription" });
  }
};

// Delete subscription (DELETE)
exports.delete = async (req, res) => {
  const idP = req.params.id;
  try {
    const result = await Subscription.findByPk(idP);
    if (result) {
      await result.destroy();
      res.status(200).json("Subscription successfully deleted");
    } else {
      res.status(404).json({ error: "Subscription not found" });
    }
  } catch (error) {
    console.error("Error deleting subscription : ", error);
    res.status(500).json({ error: "Error deleting subscription" });
  }
};
