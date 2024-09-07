const UserSubscription = require("../models/userSubscriptionModel");
const User = require("../models/userModel");
const File = require("../models/fileModel");
const Invoice = require("../models/invoicesModel");
const Subscription = require("../models/subscriptionModel");
const Address = require("../models/addressModel");
const jwt = require("jsonwebtoken");
const Folder = require("../models/folderModel");
const crypto = require("crypto");
const path = require("path");
const { Op, where } = require("sequelize");
const { jsPDF } = require("jspdf");
const Mailer = require("../services/mailer");
require("dotenv").config();

const mailer = new Mailer();
// Create a user subscription (POST)
exports.add = async (req, res) => {
  try {
    let token = req.headers.authorization;
    const userSubscription = req.body;
    let email = null;

    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (token) {
      email = jwt.verify(token, process.env.SECRET_KEY).email;
    }

    const user = await User.findOne({
      where: { email: email },
      include: [
        {
          model: Address,
          as: "address",
        },
      ],
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const subId = userSubscription.subscriptionId;

    const subscription = await Subscription.findByPk(subId);
    if (!subscription) {
      res.status(404).json({ error: "Subscription not found" });
      return;
    }

    userSubscription.userId = user.id;
    userSubscription.startDate = new Date();

    let newSubscription = await UserSubscription.create(userSubscription);

    await Folder.create({
      name: "root",
      userSubscriptionId: newSubscription.id,
    });

    // create invoice 
    await this.createInvoice(user, subscription, newSubscription);

    mailer.sendSubscriptionThankYouEmail(email, user);

    // Envoyer la réponse avec le chemin de la facture
    res.status(201).json({
      message: "User subscription added",
      status: 201,
    });

  } catch (error) {
    console.error("Error adding user subscription: ", error);
    res.status(500).json({ error: "Error adding user subscription" });
  }
};

exports.createInvoice = async (user, subscription, userSubscription) => {
  const fs = require('fs')
  const invoicesDir = path.join(__dirname, '../files/invoices');

  // Vérifier et créer le répertoire src/factures s'il n'existe pas
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  const today = new Date().getTime().toString();
  const invoiceFileName = `facture_${userSubscription.id}_${today}.pdf`;
  const invoicePath = path.join(invoicesDir, invoiceFileName);

  const doc = new jsPDF();

  // Contenu du PDF
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Archistock", 20, 20);
  doc.text(`Facture n° ${today}`, 140, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Acheteur:`, 20, 30);
  doc.setFont("helvetica", "bold");
  doc.text(`${user.firstName} ${user.lastName}`, 20, 35);
  doc.setFont("helvetica", "normal");
  doc.text(`${user.email}`, 20, 40);
  doc.text(`${user.phoneNumber}`, 20, 45);
  doc.text(`${user.address.street}`, 20, 50);
  doc.text(`${user.address.postalCode} ${user.address.city}`, 20, 55);

  const sellerX = 140;  
  const sellerY = 40;
  doc.setFont("helvetica", "normal");
  doc.text("Vendeur:", sellerX, sellerY);
  doc.setFont("helvetica", "bold");
  doc.text("AZ Architecture Sarl", sellerX, sellerY + 5);
  doc.text("contact@az-architectes.com", sellerX, sellerY + 10);
  doc.text("107 All. François Mitterrand,", sellerX, sellerY + 15);
  doc.text("76100 Rouen", sellerX, sellerY + 20);

  const tableTop = 100;
  const tableLeft = 20;
  const rowHeight = 10;
  const columnWidths = [90, 40, 40];
  const columnPositions = [tableLeft, tableLeft + columnWidths[0], tableLeft + columnWidths[0] + columnWidths[1]];
  const headers = ["Nom", "Quantité", "Prix"];

  doc.setFont("helvetica", "bold");
  headers.forEach((header, i) => {
    doc.rect(columnPositions[i], tableTop, columnWidths[i], rowHeight); 
    doc.text(header, columnPositions[i] + 5, tableTop + 7); 
  });

  const itemName = `${subscription.name} - ${subscription.size} Go`;
  const itemData = [itemName, "1", `${subscription.price} €`];

  doc.setFont("helvetica", "normal");
  itemData.forEach((data, i) => {
    doc.rect(columnPositions[i], tableTop + rowHeight, columnWidths[i], rowHeight); 
    doc.text(data, columnPositions[i] + 5, tableTop + rowHeight + 7); 
  });

  const prixTTC = subscription.price;
  const tauxTVA = 0.20;
  const prixHT = prixTTC / (1 + tauxTVA);
  const prixTVA = prixTTC - prixHT;

  doc.setFont("helvetica", "bold");
  doc.text(`Prix HT: ${prixHT.toFixed(2)} €`, columnPositions[2], tableTop + 3 * rowHeight + 20);
  doc.text(`Prix TVA: ${prixTVA.toFixed(2)} €`, columnPositions[2], tableTop + 3 * rowHeight + 30);
  doc.text(`Prix TTC: ${prixTTC.toFixed(2)} €`, columnPositions[2], tableTop + 3 * rowHeight + 40);

  doc.setFont("helvetica", "normal");
  doc.text("Merci pour votre achat!", 105, tableTop + 3 * rowHeight + 60, { align: "center" });
  doc.text("Si vous avez des questions, contactez-nous via la page Support", 105, doc.internal.pageSize.height - 20, { align: "center" });

  doc.save(invoicePath);

  await Invoice.create({
    userId: user.id,
    userSubscriptionId: userSubscription.id,
    name: invoiceFileName,
    invoiceDate: new Date(),
  });
};

// Delete user subscription (DELETE)
exports.delete = async (req, res) => {
  const idP = req.params.id;
  try {
    const result = await UserSubscription.findByPk(idP);
    if (result) {
      await result.destroy();
      res.status(200).json("User subscription successfully deleted");
    } else {
      res.status(404).json({ error: "User subscription not found" });
    }
  } catch (error) {
    console.error("Error deleting user subscription: ", error);
    res.status(500).json({ error: "Error deleting user subscription" });
  }
};

// Update user subscription (PUT)
exports.update = async (req, res) => {
  const idP = req.params.id;
  const userSubscription = req.body;
  try {
    const result = await UserSubscription.findByPk(idP);
    if (result) {
      await result.update(userSubscription);
      res
        .status(201)
        .json({
          status: 201,
          message: "User subscription updated successfully",
        });
    } else {
      res
        .status(404)
        .json({ status: 404, error: "User subscription not found" });
    }
  } catch (error) {
    console.error("Error updating user subscription: ", error);
    res
      .status(500)
      .json({ status: 500, error: "Error updating user subscription" });
  }
};

// Get user subscription by Id (GET)
exports.getById = async (req, res) => {
  const idP = req.params.id;
  try {
    const result = await UserSubscription.findByPk(idP, {
      include: [
        { model: User, as: "user" },
        { model: Subscription, as: "subscription" },
      ],
    });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "User subscription not found" });
    }
  } catch (error) {
    console.error("Error retrieving the user subscription:", error);
    res.status(500).json({ error: "Error retrieving the user subscription" });
  }
};

// Get all user subscriptions (GET)
exports.getAll = async (req, res) => {
  try {
    const result = await UserSubscription.findAll({
      include: [
        { model: User, as: "user" },
        { model: Subscription, as: "subscription" },
      ],
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving the user subscriptions:", error);
    res.status(500).json({ error: "Error retrieving the user subscriptions" });
  }
};

// Get user subscriptions by user Id (GET)
exports.getByUserId = async (req, res) => {
  setTimeout(() => {
    console.log("Timeout completed");
  }, 5000);

  let token = req.headers.authorization;
  let email = null;

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  if (token) {
    email = jwt.verify(token, process.env.SECRET_KEY).email;
  }

  try {
    const user = await User.findOne({ where: { email: email } });
    const result = await UserSubscription.findAll({
      where: {
        userId: user.id,
        status: ["active", "inactive"]
      },
      include: [
        { model: User, as: "user" },
        { model: Subscription, as: "subscription" },
      ],
    });

    // for erach userSubscription, get the files size. (Files are store in Mo)
    for (let i = 0; i < result.length; i++) {
      let userSubscription = result[i];
      let files = await File.findAll({
        where: { userSubscriptionId: userSubscription.id },
      });
      let totalSize = 0;
      for (let j = 0; j < files.length; j++) {
        totalSize += files[j].size;
      }
      userSubscription.dataValues.totalSize = totalSize;
    }

    res.status(200).json(result); // Send the result as a JSON response
  } catch (error) {
    console.error("Error retrieving the user subscriptions:", error);
    res.status(500).json({ error: "Error retrieving the user subscriptions" });
  }
};

// Get user subscriptions by user Id with files (GET)
exports.getByUserIdWithFiles = async (req, res) => {

  // get searchTerm from query
  const searchTerm = req.query.searchTerm;
  setTimeout(() => {
    console.log("Timeout completed");
  }, 5000);

  let token = req.headers.authorization;
  let email = null;

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  if (token) {
    email = jwt.verify(token, process.env.SECRET_KEY).email;
  }

  try {
    const user = await User.findOne({ where: { email: email } });
    let result = null;
    setTimeout(() => {
      
    console.log("Search term", searchTerm)
    }, 2000)
    if(searchTerm) {
      result = await File.findAll({
        where: {
            name: {
                [Op.like]: `%${searchTerm}%`
            }
        },
        include: [
            {
                model: UserSubscription,
                as: 'usersubscription',
                where: {
                  userId: user.id,
                  status: ["active", "inactive"]
                },
                include: [
                    { model: Subscription, as: 'subscription' }
                ]
            },
            { model: Folder, as: 'parent' }
        ],
    });
    } else {
      result = await UserSubscription.findAll({
        where: {
          userId: user.id,
          status: ["active", "inactive"]
        },
        include: [
          { model: User, as: 'user' },
          { model: Subscription, as: 'subscription' },
          { model: File, as: 'files' },
          { model: Folder, as: 'folders', include: [{ model: File, as: 'files' }] },
        ],
        limit: 10,
      });
    }
    res.status(200).json(result);  // Send the result as a JSON response
  } catch (error) {
    console.error("Error retrieving the user subscriptions:", error);
    res.status(500).json({ error: "Error retrieving the user subscriptions" });
  }
};

/*
// add file to subscription
router.post(
  "/add-file",
  middleware.authenticator,
  upload.array('files', 10),
  UserSubscriptionController.addFile
);

*/

exports.addFile = async (req, res) => {
  const fs = require('fs').promises;

  let files = req.files;
  let userSubscriptionId = req.body.userSubscriptionId;

  let savedFiles = [];
  let unsavedFiles = [];

  try {
    // Récupérer les informations de la souscription de l'utilisateur, y compris les fichiers associés
    const userSubscription = await UserSubscription.findOne({
      where: { id: userSubscriptionId },
      include: [
        { model: User, as: 'user' },
        { model: Subscription, as: 'subscription' },
        { model: File, as: 'files' },
      ],
    });

    if (!userSubscription) {
      return res.status(404).json({ error: "Souscription introuvable." });
    }

    // Calculer la taille totale utilisée par les fichiers existants (en Mo)
    const totalUsedStorage = userSubscription.files.reduce((acc, file) => acc + parseFloat(file.size), 0); // Taille en Mo
    const totalStorage = userSubscription.subscription.size; // Stockage total déjà en Mo
    let remainingStorage = totalStorage - totalUsedStorage;

    for (let i = 0; i < files.length; i++) {
      try {
        // Taille du fichier en Mo
        const fileSizeInMo = (files[i].size / 1048576).toFixed(2); // Conversion octets -> Mo et formatage à 2 décimales

        // Vérifier si la taille du fichier est > 2 Go (2048 Mo)
        if (parseFloat(fileSizeInMo) > 2048) {
          await fs.unlink(`src/files/${files[i].filename}`);
          unsavedFiles.push({ name: files[i].originalname, reason: "Le fichier dépasse la taille maximale de 2 Go." });
          continue;
        }

        // Vérifier si le fichier peut être stocké dans l'espace restant
        if (parseFloat(fileSizeInMo) > remainingStorage) {
          unsavedFiles.push({ name: files[i].originalname, reason: "Espace de stockage insuffisant." });
          continue;
        }

        let hash = crypto.randomBytes(20).toString("hex");
        const extension = path.extname(files[i].filename);

        // Renommer le fichier
        await fs.rename(`src/files/${files[i].filename}`, `src/files/${hash}${extension}`);

        // Si le nom de fichier original est > 128 caractères, générer un hash pour le nom de fichier
        if (files[i].originalname.length > 128) {
          files[i].originalname = hash;
        }

        // Stocker les informations du fichier dans la base de données
        await File.create({
          name: files[i].originalname.split('.')[0],
          pathName: hash,
          size: parseFloat(fileSizeInMo), // Taille en Mo, stockée sous forme numérique avec 2 décimales
          format: extension.slice(1), // Retirer le point de l'extension
          parentId: null,
          userSubscriptionId: userSubscriptionId,
        });

        // Mettre à jour le stockage restant
        remainingStorage -= parseFloat(fileSizeInMo);

        // Ajouter à la liste des fichiers sauvegardés
        savedFiles.push(files[i].originalname);
      } catch (fileError) {
        console.error(`Erreur lors du traitement du fichier ${files[i].originalname}: `, fileError);
        unsavedFiles.push({ name: files[i].originalname, reason: "Erreur lors du traitement du fichier." });
      }
    }

    // Envoyer la réponse avec les fichiers sauvegardés et non sauvegardés
    res.status(201).json({
      message: "Files processed",
      status: 201,
      savedFiles: savedFiles,
      unsavedFiles: unsavedFiles.map(file => `${file.name}: ${file.reason}`)
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout des fichiers à l'abonnement: ", error);
    res.status(500).json({ error: "Erreur lors de l'ajout des fichiers à l'abonnement" });
  }
};



exports.renewSubscription = async (req, res) => {
  let token = req.headers.authorization;
  let email = null;
  
  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }
  
  if (token) {
    email = jwt.verify(token, process.env.SECRET_KEY).email;
  }
  
  try {
    // check if user exists
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }

    // check if userSubscription belongs to the user and userSubscriptionId
    const userSubscription = await UserSubscription.findOne({
      where: { userId: user.id, id: req.params.userSubscriptionId },
      include: [
        { model: User, as: 'user' },
        { model: Subscription, as:'subscription' },
        { model: File, as: 'files' },
      ],
    });

    if(!userSubscription) {
      return res.status(404).json({ error: "Souscription introuvable ou non appartenant à l'utilisateur." });
    }
    
    setTimeout(() => {
      console.log("Timeout completed");
    }, 1000)

    // switch renew 
    if (userSubscription.status === "active") {
      userSubscription.status = "inactive";
    } else if(userSubscription.status === "inactive") {
      userSubscription.status = "active";
    }
      

    // save changes
    await userSubscription.save();
    res.status(201).json({status: 201, storage: userSubscription});
    return;
  } catch (error) {
    console.error("Erreur lors de la récupération des informations de l'utilisateur ou de la souscription:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des informations de l'utilisateur ou de la souscription" });
    return;
  }
}

