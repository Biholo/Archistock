const express = require('express');
const router = express.Router();
const sharedStorageSpaceController = require('../controllers/sharedStorageSpaceController');

router.post('/create', sharedStorageSpaceController.createSharedStorageSpace);
router.post('/delete/:id', sharedStorageSpaceController.removeUserFromSharedStorageSpace);

router.put('/update/:id', sharedStorageSpaceController.updateSharedStorageSpace);

router.get('/all', sharedStorageSpaceController.findAllSharedStorageSpaces);
router.get('/one/:id', sharedStorageSpaceController.findOneSharedStorageSpace);

module.exports = router;



