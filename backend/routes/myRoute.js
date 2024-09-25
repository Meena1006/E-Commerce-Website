const express = require('express');
const stripe = require('stripe')('sk_test_51Q0jkWP9YB5tzFF9p1I5y1Rckpap4IqrmY4nW1i9JBHLebHxonQAhhHp8gD2bu7gQS3vnd9iUkuiKfRnzyvHVskX00ABbOAZF7');
const router = express.Router();

router.post('/create-payment-intent', async (req, res) => {
  const { amount, currency, paymentMethodId } = req.body;
  try {
    // Create a PaymentIntent with the provided amount, currency, and payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
    });
    
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return res.status(400).send({
      error: {
        message: error.message,
      },
    });
  }
});

module.exports = router;
