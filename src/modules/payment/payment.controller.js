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

  const amount = project.amount;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: 'project',
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

  await Project.findByIdAndUpdate(projectId, {
    paymentAmount: amount,
  });

  res.status(201).json({ url: session.url });
});
