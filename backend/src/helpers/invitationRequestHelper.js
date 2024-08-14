const { Op } = require('sequelize');
const InvitationRequest = require('../models/invitationRequestModel');
const Company = require('../models/companyModel');
const SharedStorageSpace = require('../models/sharedStorageSpaceModel');
const Address = require('../models/addressModel');
const Country = require('../models/countryModel'); // Assuming this model exists

const getInvitationRequests = async (options = {}) => {
    const { findOne = false, conditions = {} } = options;

    const commonInclude = [
        {
            model: Company,
            as: "company",
            include: [
                {
                    model: Address,
                    as: "address",
                    include: [
                        {
                            model: Country,
                            as: "country"
                        }
                    ],
                    attributes: {
                        exclude: ['countryId']
                    }
                }
            ],
            attributes: {
                exclude: ['addressId']
            }
        },
        {
            model: SharedStorageSpace,
            as: "sharedStorageSpace",
            include: [
                {
                    model: Company,
                    as: "company",
                    include: [
                        {
                            model: Address,
                            as: "address",
                            include: [
                                {
                                    model: Country,
                                    as: "country"
                                }
                            ],
                            attributes: {
                                exclude: ['countryId']
                            }
                        }
                    ]
                }
            ]
        }
    ];

    if (findOne) {
        return await InvitationRequest.findOne({
            where: {
                status: {
                    [Op.not]: ["accepted", "declined", "cancelled"]
                },
                ...conditions
            },
            include: commonInclude,
            attributes: {
                exclude: ['companyId', 'sharedStorageSpaceId']
            }
        });
    } else {
        return await InvitationRequest.findAll({
            where: {
                status: {
                    [Op.not]: ["accepted", "declined", "cancelled"]
                },
                ...conditions
            },
            include: commonInclude,
            attributes: {
                exclude: ['companyId', 'sharedStorageSpaceId']
            }
        });
    }
};

module.exports = { getInvitationRequests };
