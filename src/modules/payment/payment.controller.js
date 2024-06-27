import Stripe from 'stripe';
import asyncHandler from '../../../lib/asyncHandler.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { amount, currency = 'usd' } = req.body;
  
  const origin = req.headers.origin || process.env.FRONTEND_URL;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: 'Sample Product',
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cancel`,
  });

  res.status(201).json({ url: session.url });
});