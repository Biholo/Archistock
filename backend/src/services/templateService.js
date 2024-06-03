// src/services/templateService.js
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

class TemplateService {
    constructor(templateDir) {
        this.templateDir = templateDir;
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
