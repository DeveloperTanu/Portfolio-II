import dotenv from 'dotenv';
dotenv.config();

const e = process.env;
export const env = {
  port: Number(e.PORT) || 5000,
  nodeEnv: e.NODE_ENV || 'development',
  clientOrigin: (e.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim()),
  smtp: {
    host: e.SMTP_HOST || '',
    port: Number(e.SMTP_PORT) || 587,
    secure: e.SMTP_SECURE === 'true',
    user: e.SMTP_USER || '',
    pass: e.SMTP_PASS || '',
  },
  mailFrom: e.MAIL_FROM || e.SMTP_USER || '',
  contactTo: e.CONTACT_TO_EMAIL || '',
};

export const isMailConfigured = () =>
  Boolean(env.smtp.host && env.smtp.user && env.smtp.pass && env.mailFrom && env.contactTo);
