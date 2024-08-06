const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const SubscriptionController = require("../controllers/subscriptionController");
const middleware = require("../middleware/middleware");

// Create an subscription (POST)
router.post("/add", middleware.authenticator, SubscriptionController.add);

// Delete subscription (DELETE)
router.delete(
  "/delete/:id",
  middleware.authenticator,
  SubscriptionController.delete
);

// Get all subscription (GET)
router.get("/all", middleware.authenticator, SubscriptionController.getAll);

// Get subscription by ID (GET)
router.get(
  "/get/:id",
  middleware.authenticator,
  SubscriptionController.getById
);

// Update subscription (PUT)
router.put(
  "/update/:id",
  middleware.authenticator,
  SubscriptionController.update
);

module.exports = router;
