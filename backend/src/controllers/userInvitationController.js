const UserInvitation = require("../models/userInvitationModel");
const User = require("../models/userModel");
const Company = require("../models/companyModel");
const Right = require("../models/rightModel");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

//--------- Get invitation  ---------//

exports.getInvitation = async (req, res) => {
    const { id } = req.params;

    try {
        const invitation = await UserInvitation.findByPk(id, {
            include: [
                {
                    model: Company,
                    as: "invitedByCompany",

                },
            ],
        });

        if (!invitation) {
            return res.status(404).json({ message: "Invitation not found" });
        }

        res.status(200).json({
            message: "Invitation found successfully.",
            data: invitation,
        });
    } catch (error) {
        console.error("Error getting invitation : ", error);
        res.status(500).json({ message: "Error getting invitation" });
    }
};

//--------- Get all invitations  ---------//

exports.getAll = async (req, res) => {
    try {
        const invitations = await UserInvitation.findAll({
            include: [
                {
                    model: User,
                    as: "invitedBy",
                    attributes: ["id", "email"],
                },
                {
                    model: Company,
                    as: "invitedByCompany",
                    attributes: ["id", "name"],
                },
            ],
        });

        res.status(200).json({
            message: "Invitations found successfully.",
            data: invitations,
        });
    } catch (error) {
        console.error("Error finding invitations : ", error);
        res.status(500).json({ message: "Error finding invitations" });
    }
};

//--------- Accept invitation  ---------//

exports.acceptInvitation = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, password, phoneNumner } = req.body;

    try {
        const invitation = await UserInvitation.findByPk(id);

        if (!invitation) {
            return res.status(404).json({ message: "Invitation not found" });
        }

        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ message: "This email is already in use." });
        }

        const hash = await bcrypt.hashSync(password, 10);
        const user = await User.create({
            email,
            password: hash,
            firstName,
            lastName,
            phoneNumner,
        });

        await Right.create({
            userId: user.id,
            companyId: invitation.invitedByCompanyId,
            role: invitation.acceptedRole,
        });

        await UserInvitation.update({
            isAccepted: true,
            userId: user.id,
        },
            {
                where: {
                    id,
                },
            }
        );
        const refreshToken = uuidv4();

        // Update the refresh token in the database
        user.refreshToken = refreshToken;
        await user.save();

        // Return the JWT token and the refresh token
        const token = jwt.sign({ email }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            expires: new Date(Date.now() + 3600000),
            path: "/",
        });

        res.status(201).json({ 
            message: "User registered successfully.",
            data: {
                user,
                accessToken: token,
                refreshToken
            },
         });
    } catch (error) {
        console.error("Error while registering the user: ", error);
        res.status(500).json({ message: "Error while registering the user" });
    }
};