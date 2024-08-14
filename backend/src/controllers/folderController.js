const sequelize = require("../database/database");
const Folder = require("../models/folderModel");
const UserSubscription = require("../models/userSubscriptionModel");
const File = require("../models/fileModel");

// Create a folder (POST)
exports.add = async (req, res) => {
    try {
        const folder = req.body;
        await Folder.create(folder);
        res.status(201).json("Folder added");
    } catch (error) {
        console.error("Error adding folder: ", error);
        res.status(500).json({ error: "Error adding folder" });
    }
};

// Delete folder (DELETE)
exports.delete = async (req, res) => {
  const idP = req.params.id;
  try {
    const result = await Folder.findByPk(idP);
    if (result) {
      // if folder has children, don't delete
        const children = await Folder.findAll({ where: { parentId: idP } });
        if (children.length > 0) {
            res.status(400).json({ error: "Folder has children" });
            return;
        }
        await result.destroy();
        res.status(200).json("Folder successfully deleted");
    } else {
      res.status(404).json({ error: "Folder not found" });
    }
  } catch (error) {
    console.error("Error deleting folder: ", error);
    res.status(500).json({ error: "Error deleting folder" });
  }
};

// Update folder (PUT)
exports.update = async (req, res) => {
  const idP = req.params.id;
  const folder = req.body;
  try {
    const result = await Folder.findByPk(idP);
    if (result) {
      await result.update(folder);
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "Folder not found" });
    }
  } catch (error) {
    console.error("Error updating folder: ", error);
    res.status(500).json({ error: "Error updating folder" });
  }
};

exports.getFolderFiles = async (req, res) => {
    const idP = req.params.id;
    try {
        const result = await Folder.findByPk(idP);
        if (result) {
        const files = await File.findAll({ where: { folderId: idP } });
        res.status(200).json(files);
        } else {
        res.status(404).json({ error: "Folder not found" });
        }
    } catch (error) {
        console.error("Error getting folder files: ", error);
        res.status(500).json({ error: "Error getting folder files" });
    }
}
