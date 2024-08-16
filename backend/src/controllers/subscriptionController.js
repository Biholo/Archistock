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

// Update subscription (PUT)
exports.update = async (req, res) => {
  const idP = req.params.id;
  const subscription = req.body;
  try {
    const result = await Subscription.findByPk(idP);
    if (result) {
      await result.update(subscription);
      res.status(201).json({ status: 201, message: "Subscription updated successfully" });
    } else {
      res.status(404).json({ status: 404, error: "Subscription not found" });
    }
  } catch (error) {
    console.error("Error updating subscription : ", error);
    res.status(500).json({ error: "Error updating subscription" });
  }
};

// Get subscription by Id (GET)
exports.getById = async (req, res) => {
  const idP = req.params.id;
  try {
    const result = await Subscription.findByPk(idP);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "Subscription not found" });
    }
  } catch (error) {
    console.error("Error retrieving the subscription:", error);
    res.status(500).json({ error: "Error retrieving the subscription" });
  }
};

//--------- Get all subscription ---------//
exports.getAll = async (req, res) => {
  try {
    const result = await Subscription.findAll();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving the subscription:", error);
    res.status(500).json({ error: "Error retrieving the subscription" });
  }
};
