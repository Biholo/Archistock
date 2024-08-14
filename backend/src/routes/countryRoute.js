const express = require("express");
const router = express.Router();
const countryController = require("../controllers/countryController");

router.get("/all", countryController.findAllCountries);

module.exports = router;