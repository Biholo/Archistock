const express = require("express");
const router = express.Router();
const UserSubscriptionController = require("../controllers/userSubscriptionController");
const middleware = require("../middleware/middleware");

const multer = require('multer');
const path = require('path');

// Configuration de multer pour conserver le nom original des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/files/');  // Le dossier où les fichiers seront sauvegardés
  },
  filename: function (req, file, cb) {
    // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Option pour ajouter une date au nom
    cb(null, file.originalname);  // Conserve le nom original du fichier
  }
});

const upload = multer({ storage: storage });

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

// add file to subscription
router.post(
  "/add-files",
  middleware.authenticator,
  upload.array('files', 10),
  UserSubscriptionController.addFile
);

// Route to get all users with their storage usage and available storage
router.get(
  "/users-with-storage",
  middleware.authenticator,
  UserSubscriptionController.getAllUsersWithStorage
);


module.exports = router;
