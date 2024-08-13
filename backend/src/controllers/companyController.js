const Address = require("../models/addressModel");
const Company = require("../models/companyModel");
const Country = require("../models/countryModel");
const Right = require("../models/rightModel");
const User = require("../models/userModel");

const { Op } = require("sequelize");


//--------- Create Company ---------//
exports.createCompany = async (req, res) => {
  const { name, city, countryId, street, userId, postalCode } = req.body;
  let icon = req.file ? req.file.path : null;
  console.log({ name, city, countryId, street, userId, postalCode});
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