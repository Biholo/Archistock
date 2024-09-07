const fs = require('fs');
const path = require('path');
const worldCountries = require('world-countries');

const generateCountryFixtures = () => {
    // Définir le chemin du répertoire et du fichier
    const fixturesDir = path.join(__dirname, '../json');
    const outputPath = path.join(fixturesDir, 'countries.json');

    // Vérifier si le répertoire existe, sinon le créer
    if (!fs.existsSync(fixturesDir)) {
        fs.mkdirSync(fixturesDir, { recursive: true });
    }    

    // Préparer les données des pays pour les fixtures
    const countryFixtures = worldCountries.map(country => ({
        model: 'Country',
        data: {
            name: country.name.common,
            code: country.cca2
        }
    }));

    // Écrire les données dans le fichier JSON
    fs.writeFileSync(outputPath, JSON.stringify(countryFixtures, null, 2), 'utf8');
    console.log(`Country fixtures written to ${outputPath}`);
};

generateCountryFixtures();
