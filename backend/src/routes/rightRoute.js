const express = require('express');
const router = express.Router();
const rightController = require('../controllers/rightController');

router.put('/update', rightController.updateRights);

module.exports = router;
