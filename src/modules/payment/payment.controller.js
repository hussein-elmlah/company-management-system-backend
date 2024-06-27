import Stripe from 'stripe';
import asyncHandler from '../../../lib/asyncHandler.js';
import Project from '../project/project.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { currency = 'usd', projectId } = req.body;
  
  const origin = req.headers.origin || process.env.FRONTEND_URL;

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const amount = parseFloat(project.amount) * 100;

  if (isNaN(amount) || amount <= 0) {
    console.error(`Invalid amount: ${amount}`);
    return res.status(400).json({ error: 'Invalid project amount' });
  }

  console.log(`Amount to be charged in cents: ${amount}`);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: 'Project Payment',
          },
          unit_amount: Math.round(amount),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cancel`,
  });

  await Project.findByIdAndUpdate(projectId, {
    paymentAmount: amount,
  });

  res.status(201).json({ url: session.url });
});
