import { contactSchema } from '../schemas/contact.schema.js';
import { sendContactEmail } from '../services/email.service.js';

export async function submitContact(req, res, next) {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, message: 'Please check the form.', errors: parsed.error.flatten().fieldErrors });
    }
    if (parsed.data.website) return res.status(200).json({ ok: true, message: 'Message sent.' });
    await sendContactEmail(parsed.data);
    res.status(200).json({ ok: true, message: 'Message accepted by the mail server.' });
  } catch (err) {
    next(err);
  }
}
