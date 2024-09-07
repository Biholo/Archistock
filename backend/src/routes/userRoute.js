const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const UserController = require("../controllers/userController");
const middleware = require("../middleware/middleware");

// Create a user (POST)
router.post("/register", UserController.register);

// Login a user (POST)
router.post("/login", UserController.login);

// Login a user (POST)
router.post("/refreshToken", UserController.refreshToken);

// Login a user (POST)
router.post("/verifyAccessToken", UserController.verifyAccessToken);

// Get all users (GET)
router.get("/all", middleware.authenticator, UserController.getAllUsers);

// Get a user by ID (GET)
router.get("/one/:id", middleware.authenticator, UserController.getById);

// Update a user (PUT)
router.put("/update", middleware.authenticator, UserController.updateUser);

// Delete a user (DELETE)
router.delete(
  "/delete/:id",
  middleware.authenticator,
  UserController.deleteUser
);

router.get('/email-available/:email', UserController.isEmailUnique);

router.get("/profile", UserController.getProfile);

router.post("/refreshToken", UserController.refreshToken);

router.post("/reset-password", UserController.resetPassword);

router.post("/update-password", UserController.updatePassword);

router.post("/confirm-account", UserController.confirmAccount);

router.get("/invoices", middleware.authenticator, UserController.getInvoices);

router.get(
  "/files/:userId",
  // middleware.authenticator,
  UserController.getFilesByUserId
);

router.delete('/account/:id', UserController.deleteUserAccount);

module.exports = router;
