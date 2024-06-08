const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const FileController = require("../controllers/fileController");

// Create an file (POST)
router.post("/add", FileController.add);

// Delete file (DELETE)
router.post("/delete/:id", FileController.delete);

// Get all file (GET)
router.post("/all", FileController.getAll);

// Get file by ID (GET)
router.get("/get/:id", FileController.getById);

// Update file (PUT)
router.put("/update/:id", FileController.update);


module.exports = router;