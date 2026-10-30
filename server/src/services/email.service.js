import nodemailer from 'nodemailer';
import { env, isMailConfigured } from '../config/env.js';

let transporter;
const getTransporter = () => {
  transporter ??= nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });
  return transporter;
};

const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export async function sendContactEmail({ name, email, subject, message }) {
  if (!isMailConfigured()) {
    const err = new Error('Email service is not configured.');
    err.status = 503;
    err.expose = true;
    throw err;
  }
  const info = await getTransporter().sendMail({
    from: `"Portfolio Contact" <${env.mailFrom}>`,
    to: env.contactTo,
    replyTo: `"${name.replace(/["\r\n]/g, '')}" <${email}>`,
    subject: `[Portfolio] ${subject.replace(/[\r\n]/g, ' ')}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
  });
  return info.messageId;
}
