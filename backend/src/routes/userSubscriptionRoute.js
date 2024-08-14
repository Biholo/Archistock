const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const UserSubscriptionController = require("../controllers/userSubscriptionController");
const middleware = require("../middleware/middleware");

// Create an subscription (POST)
router.post("/add", middleware.authenticator, UserSubscriptionController.add);

// Delete subscription (DELETE)
router.delete(
  "/delete/:id",
  middleware.authenticator,
  UserSubscriptionController.delete
);

// Get all subscription (GET)
router.get("/all", middleware.authenticator, UserSubscriptionController.getAll);

// Get subscription by ID (GET)
router.get(
  "/get/:id",
  middleware.authenticator,
  UserSubscriptionController.getById
);

// Update subscription (PUT)
router.put(
  "/update/:id",
  middleware.authenticator,
  UserSubscriptionController.update
);

router.get(
  "/me",
  middleware.authenticator,
  UserSubscriptionController.getByUserId
);

router.get(
  "/files/me",
  middleware.authenticator,
  UserSubscriptionController.getByUserIdWithFiles
);

module.exports = router;
