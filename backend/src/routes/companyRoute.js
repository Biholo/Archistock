const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const CompanyController = require("../controllers/companyController");
const middleware = require("../middleware/middleware");
const upload = require('../middleware/imageUpload');

router.post("/create", CompanyController.createCompany);

router.put("/update/:id", upload, CompanyController.updateCompany);

router.get("/all", middleware.authenticator, CompanyController.getAll);
router.get("/all/user/:userId", CompanyController.getAllCompaniesForUser);

module.exports = router;
