const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const SubscribeController = require("../controllers/subscribeController");

// Create an subscribe (POST)
router.post("/add", SubscribeController.add);

// Delete subscribe (DELETE)
router.post("/delete/:id", SubscribeController.delete);

// Get all subscribe (GET)
router.post("/all", SubscribeController.getAll);

// Get subscribe by ID (GET)
router.get("/get/:id", SubscribeController.getById);

// Update subscribe (PUT)
router.put("/update/:id", SubscribeController.update);


module.exports = router;