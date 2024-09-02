const express = require("express");
const router = express.Router();
const StripeController = require("../controllers/stripeController");

// Create a payment intent (POST)
router.post("/create-subscription", StripeController.createCheckoutSession);

// Create a checkout session (POST)
router.post("/webhook", StripeController.stripeWebhook);

module.exports = router;