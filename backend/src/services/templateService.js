// src/services/templateService.js
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

class TemplateService {
    constructor(templateDir) {
        this.templateDir = templateDir;
        this.registerPartials();
    }

    // Fonction pour enregistrer les partials
    registerPartials() {
        const partialsDir = path.join(this.templateDir, '');
        const headerPath = path.join(partialsDir, './components/header.html');
        const footerPath = path.join(partialsDir, '/components/footer.html');
        
        const headerTemplate = fs.readFileSync(headerPath, 'utf8');
        const footerTemplate = fs.readFileSync(footerPath, 'utf8');

        handlebars.registerPartial('HeaderEmail', headerTemplate);
        handlebars.registerPartial('FooterEmail', footerTemplate);
    }

    loadTemplate(templateName) {
        const templatePath = path.join(this.templateDir, `${templateName}.html`);
        const source = fs.readFileSync(templatePath, 'utf8');
        return handlebars.compile(source);
    }

    renderTemplate(templateName, data) {
        const template = this.loadTemplate(templateName);
        return template(data);
    }
}

module.exports = TemplateService;
