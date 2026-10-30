import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { submitContact } from '../controllers/contact.controller.js';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Too many messages. Please try again later.' },
});

const router = Router();
router.post('/', limiter, submitContact);
export default router;
