import express from 'express';
import { createCheckoutSession } from '../payment/payment.controller.js';

const router = express.Router();

router.post('/', createCheckoutSession);

export default router;
