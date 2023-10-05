import express from 'express';
import stripe from 'stripe';

const stripeP=stripe("sk_test_51Nsp56DACU61b2bjQFY4P9sYSdxQnOaD73ADiA9QvPCieNICkE1czDMxOzslAs2ifj9uOVRXQfYMtjoGjzubA5m800TwAZrhwx")

const router = express.Router();

router.post('/payment', async(req, res) => {
   const paymentIntent = await stripeP.paymentIntents.create({
    description:req.body.name,
    amount: req.body.amount,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true
    }
  })

  return res.json(paymentIntent.client_secret)
})

export default router;