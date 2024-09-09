const express = require('express');
const router = express.Router();
const userInvitationController = require('../controllers/userInvitationController');

router.post('/accept/:id', userInvitationController.acceptInvitation);

router.get('/one/:id', userInvitationController.getInvitation);
router.get('/all', userInvitationController.getAll);


module.exports = router;