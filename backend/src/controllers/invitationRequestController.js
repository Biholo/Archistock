const User = require("../models/userModel");
const Company = require("../models/companyModel");
const SharedStorageSpace = require("../models/sharedStorageSpaceModel");
const InvitationRequest = require("../models/invitationRequestModel");
const Right = require("../models/rightModel");
const RolesManager = require("../utils/rolesManager");

const { Op } = require("sequelize");

const roleHierarchy = ["employee", "manager", "admin", "owner"];

//ask to join
exports.askToJoin = async (req, res) => {
    try {
        const { companyId, sharedStorageSpaceId } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if(!companyId && !sharedStorageSpaceId){
            return res.status(400).json({ error: "CompanyId or SharedStorageSpaceId is required" });
        }

        if(companyId && sharedStorageSpaceId){
            return res.status(400).json({ error: "CompanyId and SharedStorageSpaceId cannot both be provided" });
        }

        if(companyId && user.companyId === companyId){
            return res.status(400).json({ error: "User is already in the company" });
        }

        if(sharedStorageSpaceId && user.sharedStorageSpaceId === sharedStorageSpaceId){
            return res.status(400).json({ error: "User is already in the shared storage space" });
        }

        const invitationRequest = await InvitationRequest.create({
            type: "request",
            userId,
            companyId,
            sharedStorageSpaceId,
            status: "pending",
        });

        res.status(201).json({ invitationRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//invite to join
exports.inviteToJoin = async (req, res) => {
    try {
        const { userId, companyId, sharedStorageSpaceId, inviterId, acceptedRole } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!companyId && !sharedStorageSpaceId) {
            return res.status(400).json({ error: "CompanyId or SharedStorageSpaceId is required" });
        }

        if (companyId && user.companyId === companyId) {
            return res.status(400).json({ error: "User is already in the company" });
        }

        if (sharedStorageSpaceId && user.sharedStorageSpaceId === sharedStorageSpaceId) {
            return res.status(400).json({ error: "User is already in the shared storage space" });
        }

        const inviter = await User.findByPk(inviterId);
        if (!inviter) {
            return res.status(404).json({ error: "Inviter not found" });
        }

        if (companyId && inviter.companyId !== companyId) {
            return res.status(400).json({ error: "Inviter is not in the company" });
        }

        if (sharedStorageSpaceId && inviter.sharedStorageSpaceId !== sharedStorageSpaceId) {
            return res.status(400).json({ error: "Inviter is not in the shared storage space" });
        }

        const right = await Right.findOne({
            where: {
                userId: inviterId,
                [Op.or]: [
                    { companyId },
                    { sharedStorageSpaceId }
                ]
            }
        });

        if (!right || !["owner", "admin"].includes(right.roles)) {
            return res.status(403).send({
                message: "You do not have the right to invite to this shared storage space.",
            });
        }

        if (roleHierarchy.indexOf(acceptedRole) > roleHierarchy.indexOf(right.roles)) {
            return res.status(403).send({
                message: "You cannot assign a role higher than your own.",
            });
        }

        const invitationRequest = await InvitationRequest.create({
            type: "invitation",
            userId,
            companyId,
            sharedStorageSpaceId,
            status: "pending",
            acceptedRole
        });

        res.status(201).json({ invitationRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.acceptInvitationRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const invitationRequest = await InvitationRequest.findByPk(id);

        if (!invitationRequest) {
            return res.status(404).json({ error: "Invitation request not found" });
        }

        if (invitationRequest.userId !== userId) {
            return res.status(403).json({ error: "You do not have the right to accept this invitation request" });
        }

        if (invitationRequest.type === "invitation") {
            const right = await Right.create({
                userId,
                companyId: invitationRequest.companyId,
                sharedStorageSpaceId: invitationRequest.sharedStorageSpaceId,
                roles: invitationRequest.acceptedRole
            });
        }

        invitationRequest.status = "accepted";
        await invitationRequest.save();

        res.status(200).json({ invitationRequest });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
exports.declineInvitationRequest = async (req, res) => {
    try {
        const { requestId, userId } = req.body;

        // Fetch the invitation request
        const invitationRequest = await InvitationRequest.findByPk(requestId);
        if (!invitationRequest) {
            return res.status(404).json({ error: "Invitation request not found" });
        }

        // Check if the user is the one who was invited or has permissions to manage the request
        if (invitationRequest.userId === userId) {
            // Case 1: Invited user declining their own invitation
            invitationRequest.status = "declined";
            invitationRequest.acceptedBy = userId;
            await invitationRequest.save();

            return res.status(200).json({ message: "Invitation request declined successfully." });
        } else {
            // Case 2: Admin or inviter declining the request
            const right = await Right.findOne({
                where: {
                    userId,
                    [Op.or]: [
                        { companyId: invitationRequest.companyId },
                        { sharedStorageSpaceId: invitationRequest.sharedStorageSpaceId }
                    ]
                }
            });

            if (!right) {
                return res.status(403).json({ error: "You do not have permission to decline this request." });
            }

            const rolesManager = new RolesManager();
            const userRoles = [right.roles];  // Assuming `right.roles` is a single role; adjust if it's an array

            // Check if the user has permission to decline the request
            if (!rolesManager.canAcceptRequest(userRoles)) {
                return res.status(403).json({ error: "You do not have the necessary permissions to decline this request." });
            }

            // Update the status of the invitation request to "declined"
            invitationRequest.status = "declined";
            invitationRequest.acceptedBy = userId;
            await invitationRequest.save();

            return res.status(200).json({ message: "Invitation request declined successfully." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.cancelInvitationRequest = async (req, res) => {
    try {
        const { requestId, userId } = req.body;

        // Fetch the invitation request
        const invitationRequest = await InvitationRequest.findByPk(requestId);
        if (!invitationRequest) {
            return res.status(404).json({ error: "Invitation request not found" });
        }

        // Check if the user is the one who sent the invitation or has permissions to cancel it
        if (invitationRequest.userId === userId) {
            // Case 1: Inviter cancelling their own invitation
            if (invitationRequest.status !== 'pending') {
                return res.status(400).json({ error: "Only pending requests can be cancelled." });
            }

            // Update the status of the invitation request to "cancelled"
            invitationRequest.status = "cancelled";
            invitationRequest.acceptedBy = userId;  // Optionally record the user who cancelled
            await invitationRequest.save();

            return res.status(200).json({ message: "Invitation request cancelled successfully." });
        } else {
            // Case 2: Admin or another user with permissions cancelling the request
            const right = await Right.findOne({
                where: {
                    userId,
                    [Op.or]: [
                        { companyId: invitationRequest.companyId },
                        { sharedStorageSpaceId: invitationRequest.sharedStorageSpaceId }
                    ]
                }
            });

            if (!right) {
                return res.status(403).json({ error: "You do not have permission to cancel this request." });
            }

            const rolesManager = new RolesManager();
            const userRoles = [right.roles];  // Assuming `right.roles` is a single role; adjust if it's an array

            // Check if the user has permission to cancel the request
            if (!rolesManager.hasPermission(userRoles, 'assignRole')) {
                return res.status(403).json({ error: "You do not have the necessary permissions to cancel this request." });
            }

            // Ensure the request is still in a pending state before cancelling
            if (invitationRequest.status !== 'pending') {
                return res.status(400).json({ error: "Only pending requests can be cancelled." });
            }

            // Update the status of the invitation request to "cancelled"
            invitationRequest.status = "cancelled";
            invitationRequest.acceptedBy = userId;  // Optionally record the user who cancelled
            await invitationRequest.save();

            return res.status(200).json({ message: "Invitation request cancelled successfully." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.findAllInvitationRequestsNotDoneByUserId = async (req, res) => {
    try {
        const userId = req.body.id;

        const invitationRequests = await InvitationRequest.findAll({
            where: {
                userId,
                status: {
                    [Op.not]: ["accepted", "declined", "cancelled"]
                }
            }
        });

        res.status(200).json({ invitationRequests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.findAllInvitationRequestsNotDoneByCompanyId = async (req, res) => {
    try {
        const companyId = req.body.id;

        const invitationRequests = await InvitationRequest.findAll({
            where: {
                companyId,
                status: {
                    [Op.not]: ["accepted", "declined", "cancelled"]
                }
            }
        });

        res.status(200).json({ invitationRequests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


exports.findAllInvitationRequestsNotDoneBySharedStorageSpaceId = async (req, res) => {
    try {
        const sharedStorageSpaceId = req.body.id;

        const invitationRequests = await InvitationRequest.findAll({
            where: {
                sharedStorageSpaceId,
                status: {
                    [Op.not]: ["accepted", "declined", "cancelled"]
                }
            }
        });

        res.status(200).json({ invitationRequests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.findOneInvitationRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const invitationRequest = await InvitationRequest.findByPk(id);

        if (!invitationRequest) {
            return res.status(404).json({ error: "Invitation request not found" });
        }

        res.status(200).json({ invitationRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}