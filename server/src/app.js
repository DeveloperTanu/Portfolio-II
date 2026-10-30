import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import contactRoutes from './routes/contact.routes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: env.clientOrigin, methods: ['POST', 'GET'] }));
  app.use(express.json({ limit: '10kb' }));
  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.use('/api/contact', contactRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
