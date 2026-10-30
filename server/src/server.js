import { createApp } from './app.js';
import { env, isMailConfigured } from './config/env.js';

createApp().listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
  if (!isMailConfigured()) console.warn('SMTP not configured: /api/contact will return 503 until server/.env is set.');
});
