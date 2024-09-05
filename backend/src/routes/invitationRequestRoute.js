const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware');
const invitationRequestController = require('../controllers/invitationRequestController');

router.post('/ask-to-join', invitationRequestController.askToJoin);
router.post('/invite', invitationRequestController.inviteToJoin);
router.post ('/many-person', invitationRequestController.inviteManyPersonByEmailToCompany);

router.put('/accept/:id', middleware.authenticator, invitationRequestController.acceptInvitationRequest);
router.put('/decline/:id', middleware.authenticator, invitationRequestController.declineInvitationRequest);
router.put('/cancel', middleware.authenticator, invitationRequestController.cancelInvitationRequest);

router.get('/all/user/:userId', invitationRequestController.findAllInvitationRequestsNotDoneByUserId);
router.get('/all/company/:companyId', invitationRequestController.findAllInvitationRequestsNotDoneByCompanyId);
router.get('/all/sharedStorageSpace/:sharedStorageSpaceId', invitationRequestController.findAllInvitationRequestsNotDoneBySharedStorageSpaceId);
router.get('/one/:id', invitationRequestController.findOneInvitationRequest);

module.exports = router;

