import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_af1wd5d';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const emailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

export async function sendContact({ name, email, subject, message }) {
  if (!emailConfigured) {
    throw Object.assign(new Error('Email service is not configured yet. Please email me directly.'), { fieldErrors: {} });
  }
  try {
    return await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      { from_name: name, from_email: email, reply_to: email, subject, message },
      { publicKey: PUBLIC_KEY },
    );
  } catch (err) {
    throw Object.assign(new Error(err?.text || 'Could not send your message. Please try again.'), { fieldErrors: {} });
  }
}
