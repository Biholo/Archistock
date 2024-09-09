const sharedStorageSpaceModel = require("../models/sharedStorageSpaceModel");
const rightModel = require("../models/rightModel");

exports.createSharedStorageSpace = async (req, res) => {
    const { name, companyId } = req.body;
    try {
        const sharedStorageSpace = await sharedStorageSpaceModel.create({
            name,
            companyId,
        });

        await rightModel.create({
            userId: req.user.id,
            sharedStorageSpaceId: sharedStorageSpace.id,
            roles: "owner",
        });

        res.status(201).send(sharedStorageSpace);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while creating the SharedStorageSpace.",
        });
    }
}

exports.findAllSharedStorageSpaces = async (req, res) => {
    try {
        const sharedStorageSpaces = await sharedStorageSpaceModel.findAll();
        res.status(200).send(sharedStorageSpaces);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving sharedStorageSpaces.",
        });
    }
}

exports.findOneSharedStorageSpace = async (req, res) => {
    const id = req.params.id;
    try {
        const sharedStorageSpace = await sharedStorageSpaceModel.findByPk(id);
        res.status(200).send(sharedStorageSpace);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving SharedStorageSpace.",
        });
    }
}

exports.updateSharedStorageSpace = async (req, res) => {
    const id = req.params.id;
    const { name, userId } = req.body;


    try {
        const right = await rightModel.findOne({
            where: {
                userId,
                sharedStorageSpaceId: id,
            },
        });

        if (!right || right.roles !== "owner" || right.roles !== "admin") {
            return res.status(403).send({
                message: "You do not have the right to update this shared storage space.",
            });
        }

        const sharedStorageSpace = await sharedStorageSpaceModel.update({
            name,
        }, {
            where: {
                id,
            },
        });
        res.status(200).send(sharedStorageSpace);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while updating the SharedStorageSpace.",
        });
    }
}

exports.deleteSharedStorageSpace = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;

    try {
        const right = await rightModel.findOne({
            where: {
                userId,
                sharedStorageSpaceId: id,
            },
        });

        if (!right || right.roles !== "owner") {
            return res.status(403).send({
                message: "You do not have the right to delete this shared storage space.",
            });
        }

        await sharedStorageSpaceModel.destroy({
            where: {
                id,
            },
        });
        res.status(200).send({
            message: "SharedStorageSpace was deleted successfully!",
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while deleting the SharedStorageSpace.",
        });
    }
}

//remove user from shared storage space
exports.removeUserFromSharedStorageSpace = async (req, res) => {
    const { sharedStorageSpaceId, userId } = req.body;

    try {
        const right = await rightModel.findOne({
            where: {
                userId,
                sharedStorageSpaceId,
            },
        });

        if (!right || right.roles !== "owner" || right.roles !== "admin") {
            return res.status(403).send({
                message: "You do not have the right to remove this user from the shared storage space.",
            });
        }

        await rightModel.destroy({
            where: {
                userId,
                sharedStorageSpaceId,
            },
        });
        res.status(200).send({
            message: "User was removed from the shared storage space successfully!",
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while removing the user from the shared storage space.",
        });
    }
}