const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const AddressController = require("../controllers/addressController");

// Create an address (POST)
router.post("/add", AddressController.add);

// Delete address (DELETE)
router.post("/delete/:id", AddressController.delete);

// Get all address (GET)
router.post("/all", AddressController.getAll);

// Get address by ID (GET)
router.get("/get/:id", AddressController.getById);

// Update address (PUT)
router.put("/update/:id", AddressController.update);


module.exports = router;