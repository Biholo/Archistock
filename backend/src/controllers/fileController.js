const File = require("../models/fileModel");
const Subscription = require("../models/subscriptionModel");

// Create a file (POST)
exports.add = async (req, res) => {
  try {
    const file = req.body;
    await File.create(file);
    res.status(201).json("File added");
  } catch (error) {
    console.error("Error adding file:", error);
    res.status(500).json({ error: "Error adding file" });
  }
};

// Delete file (DELETE)
exports.delete = async (req, res) => {
  const idP = req.params.id;
  try {
    const result = await File.findByPk(idP);
    if (result) {
      await result.destroy();
      res.status(200).json("File successfully deleted");
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Error deleting file" });
  }
};

// Update file (PUT)
exports.update = async (req, res) => {
  const idP = req.params.id;
  const file = req.body;
  try {
    const result = await File.findByPk(idP);
    if (result) {
      await result.update(file);
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ error: "Error updating file" });
  }
};

// Get file by Id (GET)
exports.getById = async (req, res) => {
  const idP = req.params.id;
  try {
    const result = await File.findByPk(idP, {
      include: [{ model: Subscription, as: "subscription" }],
    });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    console.error("Error retrieving the file:", error);
    res.status(500).json({ error: "Error retrieving the file" });
  }
};

// Get all files (GET)
exports.getAll = async (req, res) => {
  try {
    const results = await File.findAll({
      include: [{ model: Subscription, as: "subscription" }],
    });

    const fileDetails = results.map((result) => ({
      id: result.id,
      name: result.name,
      format: result.format,
      size: result.size,
      createdAt: result.createdAt,
      subscriptionName: result.subscription ? result.subscription.name : null,
      subscriptionSize: result.subscription ? result.subscription.size : null,
      subscriptionPrice: result.subscription ? result.subscription.price : null,
      subscriptionFeatures: result.subscription ? result.subscription.features : null,
      subscriptionDuration: result.subscription ? result.subscription.duration : null,
    }));

    res.status(200).json(fileDetails);
  } catch (error) {
    console.error("Error retrieving the files:", error);
    res.status(500).json({ error: "Error retrieving the files" });
  }
};
