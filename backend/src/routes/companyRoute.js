const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const CompanyController = require("../controllers/companyController");

// Create an company (POST)
router.post("/add", CompanyController.add);

// Delete company (DELETE)
router.post("/delete/:id", CompanyController.delete);

// Get all company (GET)
router.post("/all", CompanyController.getAll);

// Get company by ID (GET)
router.get("/get/:id", CompanyController.getById);

// Update company (PUT)
router.put("/update/:id", CompanyController.update);


module.exports = router;