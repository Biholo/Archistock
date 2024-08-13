const Address = require("../models/addressModel");
const Company = require("../models/companyModel");
const Country = require("../models/countryModel");

// Create a company (POST)
exports.add = async (req, res) => {
  try {
    const company = req.body;
    await Company.create(company);
    res.status(201).json("Company added");
  } catch (error) {
    console.error("Error adding company : ", error);
    res.status(500).json({ error: "Error adding company" });
  }
};

// Delete company (DELETE)
exports.delete = async (req, res) => {
  const idP = req.params.id;
  try {
    const result = await Company.findByPk(idP);
    if (result) {
      await result.destroy();
      res.status(200).json("Company successfully deleted");
    } else {
      res.status(404).json({ error: "Company not found" });
    }
  } catch (error) {
    console.error("Error deleting company : ", error);
    res.status(500).json({ error: "Error deleting company" });
  }
};

// Update company (PUT)
exports.update = async (req, res) => {
  const idP = req.params.id;
  const company = req.body;
  try {
    const result = await Company.findByPk(idP);
    if (result) {
      await result.update(company);
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "Company not found" });
    }
  } catch (error) {
    console.error("Error updating company : ", error);
    res.status(500).json({ error: "Error updating company" });
  }
};

// Get company by Id (GET)
exports.getById = async (req, res) => {
  const idP = req.params.id;
  try {
    const result = await Company.findByPk(idP);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "Company not found" });
    }
  } catch (error) {
    console.error("Error retrieving the company:", error);
    res.status(500).json({ error: "Error retrieving the company" });
  }
};

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
    res.status(500).json({ error: "Error finding companies" });
  }
}

//--------- Get all Companies for a user ---------//
exports.getAllCompaniesForUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const companies = await Company.findAll({
      where: {
        userId,
      },
      include: {
        model: Address,
        as: "address",
        include: {
          model: Country,
          as: "country",
        }
      },
    });
    res.status(200).json({
      message: "Companies found successfully.",
      data: companies,
    });
  } catch (error) {
    console.error("Error finding companies : ", error);
    res.status(500).json({ error: "Error finding companies" });
  }
}