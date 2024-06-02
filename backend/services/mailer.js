const nodemailer = require('nodemailer');

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

        this.transporter = nodemailer.createTransport(smtpConfig);
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
        const token = jwt.sign({ userId: userId }, this.secretKey, { expiresIn: expiration });
        return `https://example.com/temp/${type}/${token}`;
    }

    // Méthode pour envoyer un e-mail de réinitialisation de mot de passe
    sendPasswordResetEmail(to, userId) {
        const resetLink = this.generateTemporaryLink(userId, '1h', 'reset-password');
        const subject = 'Réinitialisation de mot de passe';
        const text = `Bonjour,\n\nVous avez demandé la réinitialisation de votre mot de passe. Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe :\n${resetLink}\n\nCordialement, L'équipe du site`;
        const html = `<p>Bonjour,</p><p>Vous avez demandé la réinitialisation de votre mot de passe. Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe :</p><p><a href="${resetLink}">${resetLink}</a></p><p>Cordialement,<br>L'équipe du site</p>`;
        return this.sendMail('noreply@example.com', to, subject, text, html);
    }

    // Méthode pour envoyer un e-mail de confirmation de compte
    sendAccountConfirmationEmail(to, userId) {
        const confirmationLink = this.generateTemporaryLink(userId, '1h', 'confirm-account');

        const subject = 'Confirmation de compte';
        const text = `Bonjour,\n\nMerci de vous être inscrit sur notre site. Veuillez cliquer sur le lien suivant pour confirmer votre compte :\n${confirmationLink}\n\nCordialement, L'équipe du site`;
        const html = `<p>Bonjour,</p><p>Merci de vous être inscrit sur notre site. Veuillez cliquer sur le lien suivant pour confirmer votre compte :</p><p><a href="${confirmationLink}">${confirmationLink}</a></p><p>Cordialement,<br>L'équipe du site</p>`;
        return this.sendMail('noreply@example.com', to, subject, text, html);
    }


    // Email pour informer de la suppression de compte
    sendAccountDeletionEmail(to) {
        const subject = 'Suppression de compte';
        const text = `Bonjour,\n\nVotre compte a été supprimé avec succès.\n\nCordialement, L'équipe du site`;
        const html = `<p>Bonjour,</p><p>Votre compte a été supprimé avec succès.</p><p>Cordialement,<br>L'équipe du site</p>`;
        return this.sendMail('noreply@example.com', to, subject, text, html);
    }

    // Email pour informer de la suppression de compte pour l'admin
    sendAccountDeletionEmailAdmin(to, user, nbFilesDeleted) {
        const subject = 'Suppression de compte';
        const text = `Bonjour,\n\nLe compte de ${user.firstName} ${user.lastName} a été supprimé avec succès. ${nbFilesDeleted} fichiers ont été supprimés.\n\nCordialement, L'équipe du site`;
        const html = `<p>Bonjour,</p><p>Le compte de ${user.firstName} ${user.lastName} a été supprimé avec succès. ${nbFilesDeleted} fichiers ont été supprimés.</p><p>Cordialement,<br>L'équipe du site</p>`;
        return this.sendMail('noreply@example.com', to, subject, text, html);
    }

    // Email de confirmation pour l'achat d'espace de stockage en +
    sendStorageSpacePurchaseConfirmationEmail(to, user, storageSpace) {
        const confirmationLink = this.generateTemporaryLink(user.id, '1h', 'confirm-storage-space-purchase');
        const subject = 'Confirmation d\'achat d\'espace de stockage';
        const text = `Bonjour,\n\nVous avez acheté ${storageSpace} Go d'espace de stockage supplémentaire. Veuillez cliquer sur le lien suivant pour confirmer votre achat :\n${confirmationLink}\n\nCordialement, L'équipe du site`;
        const html = `<p>Bonjour,</p><p>Vous avez acheté ${storageSpace} Go d'espace de stockage supplémentaire. Veuillez cliquer sur le lien suivant pour confirmer votre achat :</p><p><a href="${confirmationLink}">${confirmationLink}</a></p><p>Cordialement,<br>L'équipe du site</p>`;
        return this.sendMail('noreply@example.com', to, subject, text, html);
    }

}

module.exports = Mailer;
