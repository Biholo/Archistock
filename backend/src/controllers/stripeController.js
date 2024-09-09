const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const UserSubscription = require('../models/userSubscriptionModel');
const Subscription = require('../models/subscriptionModel');
const bcrypt = require("bcrypt");
const User = require('../models/userModel');
const Address = require('../models/addressModel');
const Folder = require("../models/folderModel");
const Mailer = require("../services/mailer");
const userSubscriptionController = require("./userSubscriptionController");

const { v4: uuidv4 } = require("uuid");
const mailer = new Mailer();


exports.createCheckoutSession = async (req, res) => {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    const { street, city, postalCode, countryId } = req.body;
    const { subscriptionId } = req.body;

    const hash = await bcrypt.hashSync(password, 10);


    if (!subscriptionId) {
        return res.status(400).json({ error: "Missing required fields: subscriptionId" });
    }

    const subscription = await Subscription.findByPk(subscriptionId);

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: subscription.name,
                        },
                        unit_amount: subscription.price * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment', // Paiement unique
            success_url: `${process.env.CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`, // URL de succès
            cancel_url: `${process.env.CLIENT_URL}/pricing`, // URL d'annulation
            payment_intent_data: {
                metadata: {

                    email,
                    firstName,
                    lastName,
                    phoneNumber,
                    street,
                    city,
                    postalCode,
                    countryId: 77,
                    password: hash,
                    subscriptionId
                },
            }
        });

        res.status(200).json({ sessionId: session.id });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.stripeWebhook = async (req, res) => {
    console.log('Stripe webhook received');
    const sig = req.headers['stripe-signature'];

    const event = req.body;

    // try {
    //     event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    // } catch (err) {
    //     console.error(`⚠️  Webhook signature verification failed.`, err.message);
    //     return res.status(400).send(`Webhook Error: ${err.message}`);
    // }

    if (event.type === 'payment_intent.succeeded') {
        const invoice = event.data.object;

        console.log(`🔔  Webhook received! Payment for Invoice: ${invoice.id} is successful`);
        console.log('invoice', invoice);

        try {
            const address = await Address.create({
                street: invoice.metadata.street,
                city: invoice.metadata.city,
                postalCode: invoice.metadata.postalCode,
                countryId: invoice.metadata.countryId,
            });

            await User.create({
                email: invoice.metadata.email,
                password: invoice.metadata.password,
                firstName: invoice.metadata.firstName,
                lastName: invoice.metadata.lastName,
                phoneNumber: invoice.metadata.phoneNumber,
                addressId: address.id,
            });


            const user = await User.findOne({
                where: { email: invoice.metadata.email },
                include: [
                  {
                    model: Address,
                    as: "address",
                  },
                ],
              });

            const refreshToken = uuidv4();
            user.refreshToken = refreshToken;
            await user.save();

            const userSubscription = await UserSubscription.create({
                userId: user.id,
                subscriptionId: invoice.metadata.subscriptionId,
                startDate: new Date(),
                name: 'New storage',
                status: 'active',
            });

            mailer.sendAccountConfirmationEmail(invoice.metadata.email, user.id);

            mailer.sendWelcomeEmail(invoice.metadata.email, user);

            const subscription = await Subscription.findOne({ where: { id: 1 } });


            await Folder.create({
                name: "root",
                userSubscriptionId: userSubscription.id,
            });
            console.log('user', user);
            console.log('userSubscription', userSubscription);
            console.log('subscription', subscription);

            // create invoice 
            await userSubscriptionController.createInvoice(user, subscription, userSubscription);

            mailer.sendSubscriptionThankYouEmail(invoice.metadata.email, user);


            if (userSubscription) {

                console.log(`✅ Paiement réussi pour l'utilisateur ${userSubscription.userId}`);
            } else {
                console.warn(`⚠️  Aucune souscription trouvée pour le client Stripe : ${invoice.customer}`);
            }
        } catch (err) {
            console.error(`❌ Erreur lors du traitement du paiement :`, err);
            return res.status(500).send('Erreur interne lors du traitement de la souscription');
        }
    }

    res.status(200).json({ received: true });
};
