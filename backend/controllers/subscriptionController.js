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

// Update subscription (PUT)
exports.update = async (req, res) => {
  const idP = req.params.id;
  const subscription = req.body;
  try {
    const result = await Subscription.findByPk(idP);
    if (result) {
      await result.update(subscription);
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "Subscription not found" });
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

//--------- Get all tools ---------//
exports.getAll = async (req, res) => {
  try {
    const results = await Subscription.findAll();

    const subscriptionDetails = await Promise.all(
      results.map(async (result) => {
        const user = await User.findByPk(result.userId);
        const subscribe = await Subscribe.findByPk(result.subscribeId);
        return {
          id: result.id,
          name: result.name,
          space: result.space,
          price: result.price,
          firstname: user.firstname,
          lastname: user.lastname,
          model: model.name,
        };
      })
    );

    res.status(200).json(subscriptionDetails);
  } catch (error) {
    console.error("Error retrieving the subscription:", error);
    res.status(500).json({ error: "Error retrieving the subscription" });
  }
};
