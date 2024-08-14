const fs = require('fs');
const path = require('path');
const fixtures = require('sequelize-fixtures');
const sequelize = require('../database/database');
const Country = require('../models/countryModel');
require('dotenv').config();

// Fonction pour charger les fixtures
const loadFixtures = async () => {
    try {
        console.log('Loading data...');
        console.log('Sequelize config:', {
            database: sequelize.config.database,
            username: sequelize.config.username,
            host: sequelize.config.host,
            port: sequelize.config.port,
            dialect: sequelize.config.dialect
        });

        // Charger les fixtures
        await fixtures.loadFiles([
            path.join(__dirname, '../fixtures/json/countries.json')
        ], { Country }, { sequelize });

        console.log('Data loaded successfully');
    } catch (error) {
        console.error('Error loading data:', error);
    } finally {
        // Fermer la connexion à la base de données
        await sequelize.close();
        console.log('Database connection closed.');
    }
};

// Fonction pour générer les fixtures
const generateFixtures = () => {
    require('../fixtures/js/countries'); // Assurez-vous que ce module génère le fichier JSON correctement
};

// Fonction principale pour générer et charger les fixtures
const generateAndLoadFixtures = async () => {
    // Générer les fixtures
    generateFixtures();
    
    // Attendre un petit moment pour s'assurer que le fichier est généré avant de charger les fixtures
    setTimeout(async () => {
        console.log('Loading fixtures...');
        await loadFixtures();
    }, 1000); // Délai de 1 seconde, ajustez si nécessaire
};

// Exécuter la fonction principale
generateAndLoadFixtures();
