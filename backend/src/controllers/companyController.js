const Address = require("../models/addressModel");
const Company = require("../models/companyModel");
const Country = require("../models/countryModel");
const Right = require("../models/rightModel");
const User = require("../models/userModel");
const RolesManager = require("../services/rolesManager");
const InvitationRequest = require("../models/invitationRequestModel");
const SharedStorageSpace = require("../models/sharedStorageSpaceModel");
const UserInvitation = require("../models/userInvitationModel");

const { Op } = require("sequelize");

const rolesManager = new RolesManager();

//--------- Create Company ---------//
exports.createCompany = async (req, res) => {
  const { name, city, countryId, street, userId, postalCode } = req.body;
  let icon = req.file ? req.file.path : null;
  console.log({ name, city, countryId, street, userId, postalCode, icon });
  try {

    const country = await Country.findByPk(countryId);

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    const address = await Address.create({
      city,
      countryId,
      street,
      postalCode
    });

    const company = await Company.create({
      name,
      icon,
      addressId: address.id,
    });

    await Right.create({
      userId: userId,
      companyId: company.id,
      roles: "owner",
    });

    res.status(200).json({
      message: "Company created successfully.",
      data: company,
    });
  } catch (error) {
    console.error("Error creating company : ", error);
    res.status(500).json({ message: "Error creating company" });
  }
}

//--------- Update Company ---------//
exports.updateCompany = async (req, res) => {
  const companyId = req.params.id;
  const { name, city, countryId, street } = req.body;
  let icon = req.file ? req.file.path : null;
  try {
    const company = await Company.findByPk(companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const country = await Country.findByPk(countryId);

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    const address = await Address.findByPk(company.addressId);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    await address.update({
      city,
      countryId,
      street,
    });

    await company.update({
      name,
      icon,
    });

    res.status(200).json({
      message: "Company updated successfully.",
      data: company,
    });
  } catch (error) {
    console.error("Error updating company : ", error);
    res.status(500).json({ message: "Error updating company" });
  }
}

//--------- Get all Company ---------//
exports.getAll = async (req, res) => {
  try {
    const companies = await Company.findAll(

    );
    res.status(200).json({
      message: "Companies found successfully.",
      data: companies
    });
  } catch (error) {
    console.error("Error finding companies : ", error);
    res.status(500).json({ message: "Error finding companies" });
  }
}

//--------- Get all Companies for a user ---------//
exports.getAllCompaniesForUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const rights = await Right.findAll({
      where: {
        userId,
        companyId: { [Op.not]: null },
      },
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
                  as: "country",
                },
              ],
            },
          ],
        },
      ],

    });
    res.status(200).json({
      message: "Companies found successfully.",
      data: rights,
    });
  } catch (error) {
    console.error("Error finding companies : ", error);
    res.status(500).json({ message: "Error finding companies" });
  }
}

//--------- Get Company by ID ---------//
exports.getCompanyById = async (req, res) => {
  const companyId = req.params.id;
  const userId = req.query.userId;

  const right = await Right.findOne({
    where: {
      userId: userId,
      companyId,
    },
  });

  if (!right) {
    return res.status(403).json({
      message: "You do not have permission to view this company.",
    });
  }
  try {
    const company = await Company.findByPk(companyId, {
      include: [
        {
          model: Address,
          as: "address",
          include: [
            {
              model: Country,
              as: "country",
            },
          ],
        },
      ],
    });
    res.status(200).json({
      message: "Company found successfully.",
      data: company,
    });
  } catch (error) {
    console.error("Error finding company : ", error);
    res.status(500).json({ message: "Error finding company" });
  }
}

exports.getAllInformationsForACompany = async (req, res) => {
  const companyId = req.params.id;
  const userId = req.query.userId;

  try {
    // Vérification des droits de l'utilisateur pour accéder à la société
    const right = await Right.findOne({
      where: {
        userId: userId,
        companyId: companyId,
      },
    });

    // Vérifier si l'utilisateur a les permissions nécessaires
    if (!right || !rolesManager.hasPermission([right.roles], "inviteToJoin")) {
      return res.status(403).json({
        message: "You do not have permission to view this company.",
      });
    }

    // Récupération des informations de la société, y compris l'adresse et le pays
    const company = await Company.findByPk(companyId, {
      include: [
        {
          model: Address,
          as: "address",
          include: [
            {
              model: Country,
              as: "country",
            },
          ],
        },
      ],
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
      });
    }

    // Récupération des utilisateurs associés à la société
    const users = await User.findAll({
      include: [
        {
          model: Right,
          as: "rights",
          where: {
            companyId: companyId,
          },
        },
      ],
    });

    // Récupération des espaces de stockage partagés associés à la société
    const sharedStorageSpaces = await SharedStorageSpace.findAll({
      where: {
        companyId: companyId,
      },
    });

    // Récupération des demandes d'invitation associées à la société
    const invitationRequests = await InvitationRequest.findAll({
      where: {
        companyId: companyId,
      },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    const userInvitations = await UserInvitation.findAll({
      where: {
        invitedByCompanyId: companyId,
        isAccepted: null
      },
    });

    // Envoi de la réponse avec toutes les données récupérées
    return res.status(200).json({
      message: "Company found successfully.",
      data: {
        company,
        users,
        sharedStorageSpaces,
        invitationRequests,
        userInvitations
      },
    });
  } catch (error) {
    console.error("Error finding company:", error);
    return res.status(500).json({ message: "An error occurred while finding the company." });
  }
};
