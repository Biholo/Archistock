const Right = require("../models/rightModel");
const sharedStorageSpace = require("../models/sharedStorageSpaceModel");
const company = require("../models/companyModel");

exports.updateRights = async (req, res) => {
    const { userId, sharedStorageSpaceId, roles, companyId, currentUserId } = req.body;

    try {
        // Fetch the right that the current user has
        const currentUserRight = await Right.findOne({
            where: {
                userId: currentUserId,
                sharedStorageSpaceId,
            },
        });

        if (!currentUserRight) {
            return res.status(403).json({
                message: "You do not have permission to update roles in this shared storage space.",
            });
        }

        // Initialize RolesManager and check if the current user can assign the given role
        const rolesManager = new RolesManager();

        if (!rolesManager.canAssignRole([currentUserRight.roles], roles)) {
            return res.status(403).json({
                message: "You cannot assign a role higher than your own.",
            });
        }

        // Fetch the right that needs to be updated
        const right = await Right.findOne({
            where: {
                userId,
                sharedStorageSpaceId,
            },
        });

        if (right) {
            // Update the right with the new role and companyId
            await right.update({
                roles,
                companyId,
            });

            res.status(200).json({
                message: "Right updated successfully.",
                data: right,
            });
        } else {
            res.status(404).json({
                message: "Right not found.",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message || "Some error occurred while updating the right.",
        });
    }
};