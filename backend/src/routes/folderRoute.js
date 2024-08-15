const express = require("express");
const router = express.Router();
const Folder = require("../models/folderModel");
const FolderController = require("../controllers/folderController");

router.post("/add", FolderController.add);
router.delete("/delete/:id", FolderController.delete);
router.put("/update/:id", FolderController.update);
router.get("/root/:id", FolderController.getRootFolder);
router.get("/:id", FolderController.getFolder);

module.exports = router;