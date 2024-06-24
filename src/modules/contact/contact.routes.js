import express from 'express';
import * as contactController from './contact.controllers.js';

const router = express.Router();

router.post('/', contactController.createContact);

export default router;
