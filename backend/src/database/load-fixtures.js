const fs = require("fs");
const path = require("path");
const fixtures = require("sequelize-fixtures");
const sequelize = require("../database/database");
const Country = require("../models/countryModel");
const Address = require("../models/addressModel");
const Company = require("../models/companyModel");
const SharedStorageSpace = require("../models/sharedStorageSpaceModel");
const Subscription = require("../models/subscriptionModel");
const User = require("../models/userModel");
const UserSubscription = require("../models/userSubscriptionModel");
const Folder = require("../models/folderModel");
const File = require("../models/fileModel");
require("dotenv").config();

// Fonction pour charger les fixtures
const loadFixtures = async () => {
  try {
    console.log("Loading data...");
    console.log("Sequelize config:", {
      database: sequelize.config.database,
      username: sequelize.config.username,
      host: sequelize.config.host,
      port: sequelize.config.port,
      dialect: sequelize.config.dialect,
    });

    // Charger les fixtures
    await fixtures.loadFiles(
      [path.join(__dirname, "../fixtures/json/countries.json")],
      { Country },
      { sequelize }
    );

    await fixtures.loadFiles(
      [path.join(__dirname, "../fixtures/json/address.json")],
      { Address },
      { sequelize }
    );

    await fixtures.loadFiles(
      [path.join(__dirname, "../fixtures/json/company.json")],
      { Company },
      { sequelize }
    );

    await fixtures.loadFiles(
      [path.join(__dirname, "../fixtures/json/sharedStorageSpace.json")],
      { SharedStorageSpace },
      { sequelize }
    );

    await fixtures.loadFiles(
      [path.join(__dirname, "../fixtures/json/subscription.json")],
      { Subscription },
      { sequelize }
    );

    await fixtures.loadFiles(
      [path.join(__dirname, "../fixtures/json/user.json")],
      { User },
      { sequelize }
    );

    await fixtures.loadFiles(
      [path.join(__dirname, "../fixtures/json/userSubscription.json")],
      { UserSubscription },
      { sequelize }
    );

    await fixtures.loadFiles(
      [path.join(__dirname, "../fixtures/json/folder.json")],
      { Folder },
      { sequelize }
    );

    await fixtures.loadFiles(
      [path.join(__dirname, "../fixtures/json/file.json")],
      { File },
      { sequelize }
    );

    console.log("Data loaded successfully");
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    // Fermer la connexion à la base de données
    await sequelize.close();
    console.log("Database connection closed.");
  }
};

// Fonction pour générer les fixtures
const generateFixtures = () => {
  require("../fixtures/js/countries");
};

// Fonction principale pour générer et charger les fixtures
const generateAndLoadFixtures = async () => {
  // Générer les fixtures
  generateFixtures();

  // Attendre un petit moment pour s'assurer que le fichier est généré avant de charger les fixtures
  setTimeout(async () => {
    console.log("Loading fixtures...");
    await loadFixtures();
  }, 1000); // Délai de 1 seconde, ajustez si nécessaire
};

// Exécuter la fonction principale
generateAndLoadFixtures();
