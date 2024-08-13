const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const CompanyController = require("../controllers/companyController");
const middleware = require("../middleware/middleware");

// Create an company (POST)
router.post("/add", middleware.authenticator, CompanyController.add);

// Delete company (DELETE)
router.delete(
  "/delete/:id",
  middleware.authenticator,
  CompanyController.delete
);

// Get all company (GET)
router.get("/all", middleware.authenticator, CompanyController.getAll);

// Get company by ID (GET)
router.get("/get/:id", middleware.authenticator, CompanyController.getById);

// Update company (PUT)
router.put("/update/:id", middleware.authenticator, CompanyController.update);

router.get("/all/user/:userId", CompanyController.getAllCompaniesForUser);

module.exports = router;
