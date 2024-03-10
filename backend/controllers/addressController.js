const Address = require("../models/addressModel");
require("dotenv").config();

// Create an address (POST)
exports.add = async (req, res) => {
  try {
    const address = req.body;
    await Address.create(address);
    res.status(201).json("Address added");
  } catch (error) {
    console.error("Error adding address : ", error);
    res.status(500).json({ error: "Error adding address" });
  }
};

// Get all address (GET)
exports.getAll = async (req, res) => {
  try {
    const address = await Address.findAll();
    res.status(200).json(address);
  } catch (error) {
    console.error("Error retrieving address : ", error);
    res.status(500).json({ error: "Error retrieving address" });
  }
};

// Get address by ID (GET)
exports.getById = async (req, res) => {
  const idP = req.params.id;
  try {
    const result = await Address.findByPk(idP);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "Address not found" });
    }
  } catch (error) {
    console.error("Error retrieving the address: ", error);
    res.status(500).json({ error: "Error retrieving the address" });
  }
};

// Update address (PUT)
exports.update = async (req, res) => {
  let idP = req.params.id;
  let addressUpdate = req.body;
  try {
    const result = await Address.findByPk(idP);
    if (result) {
      await result.update(addressUpdate);
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "Address not found" });
    }
  } catch (error) {
    console.error("Error updating address: ", error);
    res.status(500).json({ error: "Error update address" });
  }
  let address = await Address.update(addressUpdatate, {
    where: {
      id: idP,
    },
  });
  res.status(200).json(address);
};

// Delete address (DELETE)
exports.delete = async (req, res) => {
  const idP = req.params.id;
  try {
    const result = Address.findByPk(idP);
    if (result) {
      await result.destroy();
      res.status(200).json("Address successfully deleted");
    } else {
      res.status(404).json({ error: "Address not found" });
    }
  } catch (error) {
    console.error("Error deleting address : ", error);
    res.status(500).json({ error: "Error deleting address" });
  }
};