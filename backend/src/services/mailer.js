const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const TemplateService = require('./templateService');
const path = require('path');


class Mailer {
    constructor() {
        const smtpConfig = {
            host: 'frweb11.pulseheberg.net',
            port: 465,
            secure: true,
            auth: {
              user: 'archistock@fiddle.fr',
              pass: 'p6$5Bgu65'
            }
          };
    
        this.templateService = new TemplateService(path.join(__dirname, '../emailTemplates'));
        this.transporter = nodemailer.createTransport(smtpConfig);
        this.baseUrl = 'http://localhost:5174';
        this.senderEmail = 'archistock@fiddle.fr';
    }

    sendMail(from, to, subject, text, html) {
        const mailOptions = {
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html
        };

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });
    }

    generateTemporaryLink(userId, expiration, type) {
        const token = jwt.sign({ userId: userId }, process.env.SECRET_KEY, { expiresIn: expiration });
        return `${this.baseUrl}/temp/${type}/${token}`;
    }

    // Méthode pour envoyer un e-mail de confirmation de compte
    sendAccountConfirmationEmail(to, userId) {
        const confirmationLink = this.generateTemporaryLink(userId, '1h', 'confirm-account');

        const subject = 'Confirmation de compte';
        const text = `Bonjour,\n\nMerci de vous être inscrit sur notre site. Veuillez cliquer sur le lien suivant pour confirmer votre compte :\n${confirmationLink}\n\nCordialement, L'équipe du site`;
        const html = `<p>Bonjour,</p><p>Merci de vous être inscrit sur notre site. Veuillez cliquer sur le lien suivant pour confirmer votre compte :</p><p><a href="${confirmationLink}">${confirmationLink}</a></p><p>Cordialement,<br>L'équipe du site</p>`;
        return this.sendMail( this.senderEmail, to, subject, text, html);
    }


    // Email pour informer de la suppression de compte
    sendAccountDeletionEmail(to) {
        const subject = 'Suppression de compte';
        const text = `Bonjour,\n\nVotre compte a été supprimé avec succès.\n\nCordialement, L'équipe du site`;
        const html = `<p>Bonjour,</p><p>Votre compte a été supprimé avec succès.</p><p>Cordialement,<br>L'équipe du site</p>`;
        return this.sendMail( this.senderEmail, to, subject, text, html);
    }

    // Email pour informer de la suppression de compte pour l'admin
    sendAccountDeletionEmailAdmin(to, user, nbFilesDeleted) {
        const subject = 'Suppression de compte';
        const text = `Bonjour,\n\nLe compte de ${user.firstName} ${user.lastName} a été supprimé avec succès. ${nbFilesDeleted} fichiers ont été supprimés.\n\nCordialement, L'équipe du site`;
        const html = `<p>Bonjour,</p><p>Le compte de ${user.firstName} ${user.lastName} a été supprimé avec succès. ${nbFilesDeleted} fichiers ont été supprimés.</p><p>Cordialement,<br>L'équipe du site</p>`;
        return this.sendMail( this.senderEmail, to, subject, text, html);
    }

    // Email de confirmation pour l'achat d'espace de stockage en +
    sendStorageSpacePurchaseConfirmationEmail(to, user, storageSpace) {
        const confirmationLink = this.generateTemporaryLink(user.id, '1h', 'confirm-storage-space-purchase');
        const subject = 'Confirmation d\'achat d\'espace de stockage';
        const text = `Bonjour,\n\nVous avez acheté ${storageSpace} Go d'espace de stockage supplémentaire. Veuillez cliquer sur le lien suivant pour confirmer votre achat :\n${confirmationLink}\n\nCordialement, L'équipe du site`;
        const html = `<p>Bonjour,</p><p>Vous avez acheté ${storageSpace} Go d'espace de stockage supplémentaire. Veuillez cliquer sur le lien suivant pour confirmer votre achat :</p><p><a href="${confirmationLink}">${confirmationLink}</a></p><p>Cordialement,<br>L'équipe du site</p>`;
        return this.sendMail( this.senderEmail, to, subject, text, html);
    }

    // Email invitant un utilisateur avec un compte à rejoindre une entreprise
    sendCompanyInvitationEmail(to, user, companyName, role) {
        const subject = `Invitation à rejoindre ${companyName}`;
        const html = this.templateService.renderTemplate('invitationRequestWithAccount', { 
            firstName: user.firstName, 
            lastName: user.lastName, 
            companyName,
            role,
            confirmationLink: `${this.baseUrl}/login`,
        });

        return this.sendMail(this.senderEmail, to, subject, '', html);
    }
        

    //Email invitant un utilisateur sans compte à rejoindre une entreprise
    sendCompanyInvitationEmailNoAccount(to, email, companyName, role, invitationUUID) {
        const subject = `Invitation à rejoindre ${companyName}`;
        const html = this.templateService.renderTemplate('invitationRequestWithAccount', { 
            email,
            companyName,
            role,
            confirmationLink: `${this.baseUrl}/register/invitation/${invitationUUID}`,
        });

        return this.sendMail(this.senderEmail, to, subject, '', html);
    }

     // Méthode pour envoyer un e-mail de réinitialisation de mot de passe
    sendPasswordResetEmail(to, user) {
        const resetLink = this.generateTemporaryLink(user.id, '1h', 'reset-password');
        const subject = 'Réinitialisation de mot de passe';
        const html = this.templateService.renderTemplate('resetPasswordTemplate', { 
            firstName: user.firstName, 
            lastName: user.lastName, 
            resetLink 
        });

        return this.sendMail(this.senderEmail, to, subject, '', html);
    }

    sendSubscriptionThankYouEmail(to, user) {
        const subject = 'Merci pour votre abonnement';
        const html = this.templateService.renderTemplate('subscriptionThankYouTemplate', { 
            firstName: user.firstName, 
            lastName: user.lastName, 
        });
    
        return this.sendMail(this.senderEmail, to, subject, '', html);
    }

    sendWelcomeEmail(to, user) {
        const subject = 'Bienvenue sur ArchiStock';
        const html = this.templateService.renderTemplate('welcomeTemplate', { 
            firstName: user.firstName, 
            lastName: user.lastName, 
        });
    
        return this.sendMail(this.senderEmail, to, subject, '', html);
    }
    
}

module.exports = Mailer;
