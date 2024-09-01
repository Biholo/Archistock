const UserSubscription = require("../models/userSubscriptionModel");
const User = require("../models/userModel");
const File = require("../models/fileModel");
const Subscription = require("../models/subscriptionModel");
const jwt = require("jsonwebtoken");
const Folder = require("../models/folderModel");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const { Op, where } = require("sequelize");
require("dotenv").config();

// Create a user subscription (POST)
exports.add = async (req, res) => {
  try {
    const userSubscription = req.body;
    const token = req.headers.authorization;
    let email = null;
    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }
    if (token) {
      email = jwt.verify(token, process.env.SECRET_KEY).email;
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    userSubscription.userId = user.id;
    userSubscription.startDate = new Date();

    let subscription = await UserSubscription.create(userSubscription);
    
    await Folder.create({
      name: "root",
      userSubscriptionId: subscription.id,
    });

    res.status(201).json("User subscription added");
  } catch (error) {
    console.error("Error adding user subscription: ", error);
    res.status(500).json({ error: "Error adding user subscription" });
  }
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
      res.status(201).json({ status: 201, message: "User subscription updated successfully" });
    } else {
      res.status(404).json({ status: 404, error: "User subscription not found" });
    }
  } catch (error) {
    console.error("Error updating user subscription: ", error);
    res.status(500).json({ status: 500, error: "Error updating user subscription" });
  }
};

// Get user subscription by Id (GET)
exports.getById = async (req, res) => {
  const idP = req.params.id;
  try {
    const result = await UserSubscription.findByPk(idP, {
      include: [
        { model: User, as: 'user' },
        { model: Subscription, as: 'subscription' },
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
        { model: User, as: 'user' },
        { model: Subscription, as: 'subscription' },
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
      where: { userId: user.id },
      include: [
        { model: User, as: 'user' },
        { model: Subscription, as: 'subscription' },
      ],
    });

    // for erach userSubscription, get the files size. (Files are store in Mo)
    for (let i = 0; i < result.length; i++) {
      let userSubscription = result[i];
      let files = await File.findAll({ where: { userSubscriptionId: userSubscription.id } });
      let totalSize = 0;
      for (let j = 0; j < files.length; j++) {
        totalSize += files[j].size;
      }
      userSubscription.dataValues.totalSize = totalSize;
    }

    console.log(result);  // Log the result directly
    res.status(200).json(result);  // Send the result as a JSON response
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
                    userId: user.id
                },
                include: [
                    { model: Subscription, as: 'subscription' }
                ]
            },
            { model: Folder, as: 'parent' }
        ],
        limit: 10,
    });
    } else {
      result = await UserSubscription.findAll({
        where: { userId: user.id },
        include: [
          { model: User, as: 'user' },
          { model: Subscription, as: 'subscription' },
          { model: File, as: 'files' },
          { model: Folder, as: 'folders', include: [{ model: File, as: 'files' }] },
        ],
        limit: 10,
      });
    }
    

    console.log(result);  // Log the result directly
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
  let files = req.files;
  let userSubscriptionId = req.body.userSubscriptionId;
  setTimeout(() => {console.log(userSubscriptionId);}, 3000);
  try {
    
    for (let i = 0; i < files.length; i++) {
    
      // Si la taille du fichier est > 2 GB, ne pas l'ajouter à l'abonnement
      if (files[i].size > 2147483648) {
        // Supprimer le fichier
        await fs.unlink(`src/files/${files[i].filename}`);
        continue;
      }
    
      let hash = crypto.randomBytes(20).toString("hex");
    
      setTimeout(() => {
        console.log(`${files[i].filename} ${files[i].mimetype}`);
      }, 5000);
    
      // Récupérer l'extension du fichier de manière correcte
      const extension = path.extname(files[i].filename);
    
      // Renommer le fichier
      await fs.rename(`src/files/${files[i].filename}`, `src/files/${hash}${extension}`);
    
      // Si le nom du fichier est > 128 caractères, générer un hash pour le nom du fichier
      if (files[i].originalname.length > 128) {
        files[i].originalname = hash;
      }
    
      // Stocker les informations du fichier dans la base de données
      await File.create({
        name: files[i].originalname.split('.')[0],
        pathName: hash,
        size: (files[i].size / 1048576).toFixed(2), // Convertir la taille en MB
        format: extension.slice(1), // Enlever le point de l'extension
        parentId: null,
        userSubscriptionId: userSubscriptionId,
      });
    }
    
    res.status(201).json("Files added to subscription");
  } catch (error) {
    console.error("Error adding files to subscription: ", error);
    res.status(500).json({ error: "Error adding files to subscription" });
  }
}
