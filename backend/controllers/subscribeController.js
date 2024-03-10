const Subscribe = require("../models/subscribeModel");
require("dotenv").config();

// Create an subscribe (POST)
exports.add = async (req, res) => {
  try {
    const subscribe = req.body;
    await Subscribe.create(subscribe);
    res.status(201).json("Subscribe added");
  } catch (error) {
    console.error("Error adding subscribe : ", error);
    res.status(500).json({ error: "Error adding subscribe" });
  }
};

// Get all subscribe (GET)
exports.getAll = async (req, res) => {
  try {
    const subscribe = await Subscribe.findAll();
    res.status(200).json(subscribe);
  } catch (error) {
    console.error("Error retrieving subscribe : ", error);
    res.status(500).json({ error: "Error retrieving subscribe" });
  }
};

// Get subscribe by ID (GET)
exports.getById = async (req, res) => {
  const idP = req.params.id;
  try {
    const result = await Subscribe.findByPk(idP);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "Subscribe not found" });
    }
  } catch (error) {
    console.error("Error retrieving the subscribe: ", error);
    res.status(500).json({ error: "Error retrieving the subscribe" });
  }
};

// Update subscribe (PUT)
exports.update = async (req, res) => {
  let idP = req.params.id;
  let subscribeUpdate = req.body;
  try {
    const result = await Subscribe.findByPk(idP);
    if (result) {
      await result.update(subscribeUpdate);
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "Subscribe not found" });
    }
  } catch (error) {
    console.error("Error updating subscribe: ", error);
    res.status(500).json({ error: "Error update subscribe" });
  }
  let subscribe = await Subscribe.update(subscribeUpdatate, {
    where: {
      id: idP,
    },
  });
  res.status(200).json(subscribe);
};

// Delete subscribe (DELETE)
exports.delete = async (req, res) => {
  const idP = req.params.id;
  try {
    const result = Subscribe.findByPk(idP);
    if (result) {
      await result.destroy();
      res.status(200).json("Subscribe successfully deleted");
    } else {
      res.status(404).json({ error: "Subscribe not found" });
    }
  } catch (error) {
    console.error("Error deleting subscribe : ", error);
    res.status(500).json({ error: "Error deleting subscribe" });
  }
};