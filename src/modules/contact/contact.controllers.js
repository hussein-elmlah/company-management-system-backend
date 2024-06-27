import Contact from './contact.model.js';
import asyncHandler from '../../../lib/asyncHandler.js';
import CustomError from '../../../lib/customError.js';
import sendEmail from '../../../utils/sendEmail.js';

export const createContact = asyncHandler(async (req, res) => {
  const { name, email, message, subject } = req.body;

  if (!name || !email || !message || !subject) {
    throw new CustomError('All fields are required', 400);
  }


  const contact = new Contact({ name, email, message });
  await contact.save();
  const emailSubject = subject;
  const emailText = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  await sendEmail(process.env.GMAIL_USER, emailSubject, emailText);

  res.status(201).json({ message: 'Message sent successfully' });
});
