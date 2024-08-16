const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const CompanyController = require("../controllers/companyController");
const middleware = require("../middleware/middleware");
const upload = require('../middleware/imageUpload');

router.post("/create", upload, CompanyController.createCompany);

router.put("/update/:id", CompanyController.updateCompany);

router.get("/all", middleware.authenticator, CompanyController.getAll);
router.get("/all/user/:userId", CompanyController.getAllCompaniesForUser);
router.get("/one/:id", CompanyController.getCompanyById);
router.get("/informations/one/:id", CompanyController.getAllInformationsForACompany);

module.exports = router;
