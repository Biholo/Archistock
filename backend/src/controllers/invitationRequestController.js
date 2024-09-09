const User = require("../models/userModel");

const InvitationRequest = require("../models/invitationRequestModel");
const Right = require("../models/rightModel");
const UserInvitation = require("../models/userInvitationModel");
const Company = require("../models/companyModel");

const Mailer = require("../services/mailer");
const RolesManager = require("../services/rolesManager");
const { getInvitationRequests } = require('../helpers/invitationRequestHelper');
const { checkRight } = require('../helpers/rightHelper');


const { Op } = require("sequelize");
const mailer = new Mailer();
const roleHierarchy = ["employee", "manager", "admin", "owner"];

//ask to join
exports.askToJoin = async (req, res) => {
    try {
        const { companyId, sharedStorageSpaceId, userId } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!companyId && !sharedStorageSpaceId) {
            return res.status(400).json({ message: "CompanyId or SharedStorageSpaceId is required" });
        }

        if (companyId && sharedStorageSpaceId) {
            return res.status(400).json({ message: "CompanyId and SharedStorageSpaceId cannot both be provided" });
        }

        if (companyId && user.companyId === companyId) {
            return res.status(400).json({ message: "User is already in the company" });
        }

        if (sharedStorageSpaceId && user.sharedStorageSpaceId === sharedStorageSpaceId) {
            return res.status(400).json({ message: "User is already in the shared storage space" });
        }


        const invitationRequest = await InvitationRequest.create({
            type: "request",
            userId,
            companyId,
            sharedStorageSpaceId,
            status: "pending",
        });

        res.status(201).json({
            message: "Invitation request created successfully",
            data: invitationRequest
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//invite to join
exports.inviteToJoin = async (req, res) => {
    try {
        const { userId, companyId, sharedStorageSpaceId, inviterId, acceptedRole } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!companyId && !sharedStorageSpaceId) {
            return res.status(400).json({ message: "CompanyId or SharedStorageSpaceId is required" });
        }

        if (companyId && user.companyId === companyId) {
            return res.status(400).json({ message: "User is already in the company" });
        }

        if (sharedStorageSpaceId && user.sharedStorageSpaceId === sharedStorageSpaceId) {
            return res.status(400).json({ message: "User is already in the shared storage space" });
        }

        const inviter = await User.findByPk(inviterId);
        if (!inviter) {
            return res.status(404).json({ message: "Inviter not found" });
        }

        if (companyId && inviter.companyId !== companyId) {
            return res.status(400).json({ message: "Inviter is not in the company" });
        }

        if (sharedStorageSpaceId && inviter.sharedStorageSpaceId !== sharedStorageSpaceId) {
            return res.status(400).json({ message: "Inviter is not in the shared storage space" });
        }

        //check if 

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

        res.status(201).json({
            message: "Invitation request created successfully",
            data: invitationRequest
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.acceptInvitationRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const invitationRequest = await InvitationRequest.findByPk(id);

        if (!invitationRequest) {
            return res.status(404).json({ message: "Invitation request not found" });
        }

        if (invitationRequest.userId !== userId) {
            return res.status(403).json({ message: "You do not have the right to accept this invitation request" });
        }

        if (invitationRequest.type === "invitation") {
            const right = await Right.create({
                userId,
                companyId: invitationRequest.companyId,
                sharedStorageSpaceId: invitationRequest.sharedStorageSpaceId,
                roles: invitationRequest.acceptedRole ? invitationRequest.acceptedRole : "employee"
            });
        }

        invitationRequest.status = "accepted";
        await invitationRequest.save();

        res.status(200).json({
            message: "Invitation request accepted successfully",
            data: invitationRequest
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.declineInvitationRequest = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.user.id;

        // Fetch the invitation request
        const invitationRequest = await InvitationRequest.findByPk(id);
        if (!invitationRequest) {
            return res.status(404).json({ message: "Invitation request not found" });
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
                return res.status(403).json({ message: "You do not have permission to decline this request." });
            }

            const rolesManager = new RolesManager();
            const userRoles = [right.roles];  // Assuming `right.roles` is a single role; adjust if it's an array

            // Check if the user has permission to decline the request
            if (!rolesManager.canAcceptRequest(userRoles)) {
                return res.status(403).json({ message: "You do not have the necessary permissions to decline this request." });
            }

            // Update the status of the invitation request to "declined"
            invitationRequest.status = "declined";
            invitationRequest.acceptedBy = userId;
            await invitationRequest.save();

            return res.status(200).json({
                message: "Invitation request declined successfully.",
                data: invitationRequest
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.cancelInvitationRequest = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.user.id;

        // Fetch the invitation request
        const invitationRequest = await InvitationRequest.findByPk(requestId);
        if (!invitationRequest) {
            return res.status(404).json({ message: "Invitation request not found" });
        }

        // Check if the user is the one who sent the invitation or has permissions to cancel it
        if (invitationRequest.userId === userId || checkRight(userId, invitationRequest.companyId, "admin")) {
            // Case 1: Inviter cancelling their own invitation
            if (invitationRequest.status !== 'pending') {
                return res.status(400).json({ message: "Only pending requests can be cancelled." });
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
                return res.status(403).json({ message: "You do not have permission to cancel this request." });
            }

            const rolesManager = new RolesManager();
            const userRoles = [right.roles];  // Assuming `right.roles` is a single role; adjust if it's an array

            // Check if the user has permission to cancel the request
            if (!rolesManager.hasPermission(userRoles, 'assignRole')) {
                return res.status(403).json({ message: "You do not have the necessary permissions to cancel this request." });
            }

            // Ensure the request is still in a pending state before cancelling
            if (invitationRequest.status !== 'pending') {
                return res.status(400).json({ message: "Only pending requests can be cancelled." });
            }

            // Update the status of the invitation request to "cancelled"
            invitationRequest.status = "cancelled";
            invitationRequest.acceptedBy = userId;  // Optionally record the user who cancelled
            await invitationRequest.save();

            return res.status(200).json({
                message: "Invitation request cancelled successfully.",
                data: invitationRequest
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.findAllInvitationRequestsNotDoneByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        const invitationRequests = await getInvitationRequests({
            findOne: false,
            conditions: { userId }
        });
        res.status(200).json({
            message: "Invitation requests retrieved successfully",
            data: invitationRequests
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.findAllInvitationRequestsNotDoneByCompanyId = async (req, res) => {
    try {
        const companyId = req.params.companyId;

        const invitationRequests = await getInvitationRequests({
            findOne: false,
            conditions: { companyId }
        });

        res.status(200).json({
            message: "Invitation requests retrieved successfully",
            data: invitationRequests
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


exports.findAllInvitationRequestsNotDoneBySharedStorageSpaceId = async (req, res) => {
    try {
        const sharedStorageSpaceId = req.params.sharedStorageSpaceId;

        const invitationRequests = await getInvitationRequests({
            findOne: false,
            conditions: { sharedStorageSpaceId }
        });

        res.status(200).json({
            message: "Invitation requests retrieved successfully",
            data: invitationRequests
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.findOneInvitationRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const invitationRequest = await getInvitationRequests({
            conditions: { id },
            findOne: true,
        });

        if (!invitationRequest) {
            return res.status(404).json({ message: "Invitation request not found" });
        }

        res.status(200).json({
            message: "Invitation request retrieved successfully",
            data: invitationRequest
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//TODO FINISH THIS
exports.inviteManyPersonByEmailToCompany = async (req, res) => {
    const { companyId, inviterId, users } = req.body;
    console.log(companyId, inviterId, users);
    try {

        const inviter = await User.findByPk(inviterId);
        if (!inviter) {
            return res.status(404).json({ message: "Inviter not found" });
        }

        const right = await Right.findOne({
            where: {
                userId: inviterId,
                companyId
            }
        });

        if (!right || !["owner", "admin"].includes(right.roles)) {
            return res.status(403).send({
                message: "You do not have the right to invite to this company.",
            });
        }

        const company = await Company.findByPk(companyId);

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const invitationRequests = [];
        const userInvitations = [];
        for (const user of users) {
            const invitedUser = await User.findOne({
                where: {
                    email: user.email
                }
            });

            if (!invitedUser) {

                const existingInvitation = await UserInvitation.findOne({
                    where: {
                        invitedEmail: user.email,
                        invitedByCompanyId: companyId
                    }
                });

                if (existingInvitation) {
                    continue;
                }

                const userInvitation = await UserInvitation.create({
                    invitedEmail: user.email,
                    invitedByUserId: inviterId,
                    invitedByCompanyId: companyId,
                    isAccepted: false,
                    acceptedRole: user.permission
                });

                userInvitations.push(userInvitation);

                mailer.sendCompanyInvitationEmailNoAccount(user.email, user.email, company.name, user.permission, userInvitation.id);
                continue;
            } else {
                const invitationRequest = await InvitationRequest.create({
                    type: "invitation",
                    userId: invitedUser.id,
                    companyId,
                    status: "pending",
                    acceptedRole: user.role
                });

                invitationRequests.push(invitationRequest);
                mailer.sendCompanyInvitationEmail(invitedUser.email, invitedUser, company.name, user.permission);
            }

            res.status(201).json({
                message: "Invitations created successfully",
                data: invitationRequests
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}