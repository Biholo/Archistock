const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const UserController = require('../controllers/userController');

// Create a user (POST)
router.post('/register', UserController.register);

// Login a user (POST)
router.post('/login', UserController.login);

// Login a user (POST)
router.post('/refreshToken', UserController.refreshToken);

// Login a user (POST)
router.post('/verifyAccessToken', UserController.verifyAccessToken);

// Get all users (GET)
router.get('/all', UserController.getAllUsers);

// Get a user by ID (GET)
router.get('/one/:id', UserController.getById);

// Update a user (PUT)
router.put('/update/:id', UserController.updateUser);

// Delete a user (DELETE)
router.delete('/delete/:id', UserController.deleteUser);

router.get('/profile', UserController.getProfile);

router.post('/refreshToken', UserController.refreshToken);


module.exports = router;