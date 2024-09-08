const express = require("express");
const router = express.Router();
const UserSubscriptionController = require("../controllers/userSubscriptionController");
const middleware = require("../middleware/middleware");
const multer = require('multer');
const path = require('path');

// Configuration of multer for retaining the original file name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/files/');  // Folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);  // Preserve the original file name
  }
});

// File filter to accept any file type
const fileFilter = (req, file, cb) => {
  cb(null, true);  // Accept all file types
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter 
});

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

// Get all subscription with user (GET)
router.get(
  '/users-with-storage',
  middleware.authenticator,
  UserSubscriptionController.getAllUsersWithStorage
)


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

// add file to subscription
router.post(
  "/add-files",
  middleware.authenticator,
  upload.array('files', 50),
  UserSubscriptionController.addFile
);

// renew subscription
router.post(
  "/renew/:userSubscriptionId",
  middleware.authenticator,
  UserSubscriptionController.renewSubscription
)


module.exports = router;
