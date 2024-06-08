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
    const results = await Company.findAll();

    const companyDetails = await Promise.all(
      results.map(async (result) => {
        const address = await Address.findByPk(result.addressId);
        const country = await Country.findByPk(result.countryId);
        return {
          id: result.id,
          name: result.name,
          addressCity: address.city,
          addressStreet: address.street,
          addresssPostalCode: address.postalCode,
          countryName: country.name,
          countryCode: country.code,
        };
      })
    );
    res.status(200).json(companyDetails);
  } catch (error) {
    console.error("Error retrieving the company:", error);
    res.status(500).json({ error: "Error retrieving the company" });
  }
};
