const Country = require("../models/countryModel");

exports.findAllCountries = async (req, res) => {
    try {
        const countries = await Country.findAll();
        res.status(200).json({
            message: "Countries found successfully.",
            data: countries,
        });
    } catch (error) {
        console.error("Error finding countries : ", error);
        res.status(500).json({ error: "Error finding countries" });
    }
}