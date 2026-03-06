import express from 'express';
const router = express.Router();
import { sendContactForm } from '../controllers/contactController.js';

// POST /api/contact - Send contact form
router.post('/', sendContactForm);

export default router;
