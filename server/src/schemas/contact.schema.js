import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(80),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.').max(120),
  subject: z.string().trim().min(3, 'Please add a subject.').max(120),
  message: z.string().trim().min(10, 'Message should be at least 10 characters.').max(3000),
  website: z.string().max(200).optional().default(''),
});
