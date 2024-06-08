const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const SubscriptionController = require("../controllers/subscriptionController");

// Create an subscription (POST)
router.post("/add", SubscriptionController.add);

// Delete subscription (DELETE)
router.post("/delete/:id", SubscriptionController.delete);

// Get all subscription (GET)
router.post("/all", SubscriptionController.getAll);

// Get subscription by ID (GET)
router.get("/get/:id", SubscriptionController.getById);

// Update subscription (PUT)
router.put("/update/:id", SubscriptionController.update);


module.exports = router;