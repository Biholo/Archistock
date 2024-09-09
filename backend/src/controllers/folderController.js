const sequelize = require("../database/database");
const Folder = require("../models/folderModel");
const UserSubscription = require("../models/userSubscriptionModel");
const File = require("../models/fileModel");

// Create a folder (POST)
exports.add = async (req, res) => {
    try {
        const folder = req.body;
        await Folder.create(folder);
        res.status(201).json({ status: 201, message: "Folder added successfully" });
    } catch (error) {
        console.error("Error adding folder: ", error);
        res.status(500).json({ status: 500, error: "Error adding folder" });
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
            res.status(400).json({ stauts: 400, error: "Folder has children, cannot delete" });
            return;
        }
        await result.destroy();
        res.status(201).json({ status: 201, message: "Folder deleted successfully" });
    } else {
      res.status(404).json({ status: 404, error: "Folder not found" });
    }
  } catch (error) {
    console.error("Error deleting folder: ", error);
    res.status(500).json({ status: 500, error: "Error deleting folder" });
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
      res.status(201).json({ status: 201, message: "Folder updated successfully" });
    } else {
      res.status(404).json({ status: 404, error: "Folder not found" });
    }
  } catch (error) {
    console.error("Error updating folder: ", error);
    res.status(500).json({ status: 500, error: "Error updating folder" });
  }
};

exports.getFolder = async (req, res) => {
    const idP = req.params.id;
    try {
        const folder = await Folder.findByPk(idP, {
            include: [
                { model: File, as: "files" },
                { model: Folder, as: "children" }
            ]
        });
        if (folder) {
            res.status(200).json(folder);
        } else {
            res.status(404).json({ status: 404, error: "Folder not found" });
        }
    } catch (error) {
        console.error("Error getting folder: ", error);
        res.status(500).json({ status: 500, error: "Error getting folder" });
    }
}

exports.getRootFolder = async (req, res) => {
    // take userSubscriptionId (id) from req
    const idP = req.params.id;

    try {
        const userSubscription = await UserSubscription.findByPk(idP);
        if (userSubscription) {
            // get folder where parentId is null and userSubscriptionId is id
            const children = await Folder.findAll({ where: { parentId: null, userSubscriptionId: idP } });
            // get files where parentId is null and userSubscriptionId is id
            const files = await File.findAll({ where: { parentId: null, userSubscriptionId: idP } });

            return res.status(200).json({ children, files });
        } else {
            res.status(404).json({ status: 404, error: "User subscription not found" });
        }
    } catch (error) {
        console.error("Error getting root folder: ", error);
        res.status(500).json({ status: 500, error: "Error getting root folder" });
    } 
}
