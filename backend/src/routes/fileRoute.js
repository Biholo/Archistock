const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const FileController = require("../controllers/fileController");
const middleware = require("../middleware/middleware");

// Create an file (POST)
router.post("/add", middleware.authenticator, FileController.add);

// Delete file (DELETE)
router.delete("/delete/:id", middleware.authenticator, FileController.delete);

// Get all file (GET)
router.get("/all", middleware.authenticator, FileController.getAll);

// Get file by ID (GET)
router.get("/get/:id", middleware.authenticator, FileController.getById);

// Update file (PUT)
router.put("/update/:id", middleware.authenticator, FileController.update);

module.exports = router;
