import express from 'express';
import * as contactController from '../controllers/contact.controllers.js';

const router = express.Router();

router.post('/contactus', contactController.createContact);

export default router;
