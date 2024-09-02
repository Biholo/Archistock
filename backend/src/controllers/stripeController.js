const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const UserSubscription = require('../models/userSubscriptionModel');
const Subscription = require('../models/subscriptionModel');

exports.createCheckoutSession = async (req, res) => {
    const { subscriptionId, userId } = req.body;

    if(!subscriptionId) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    if(!userId) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const subscription = await Subscription.findByPk(subscriptionId);

        const newUserSubscription  = await UserSubscription.create({
            userId,
            subscriptionId,
            startDate: new Date()
        });

        const session = await stripe.subscriptions.create({
            customer: newUserSubscription.userId,
            items: [
                {
                    price: subscription.price
                }
            ],
            payment_method_types: ['card'],
            success_url: `${process.env.CLIENT_URL}/dashboard`,
            cancel_url: `${process.env.CLIENT_URL}/pricing`,
        });

        res.status(200).json({ sessionId: session.id });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

   if (event.type === 'invoice.payment_succeeded') {
        const invoice = event.data.object;

        const userSubscription = await UserSubscription.findOne({
            where: {
                userId: invoice.customer
            }
        });

        userSubscription.lastPaymentDate = new Date();
        await userSubscription.save();
    }

    res.status(200).json({ received: true });
};
