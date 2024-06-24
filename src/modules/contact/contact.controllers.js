import Contact from './contact.model.js';
import asyncHandler from '../../../lib/asyncHandler.js';
import CustomError from '../../../lib/customError.js';
import sendEmail from '../../../utils/sendEmail.js';

export const createContact = asyncHandler(async (req, res) => {
  // console.log(req.body)
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    throw new CustomError('All fields are required', 400);
  }

  const contact = new Contact({ name, email, message });
  await contact.save();

  const emailSubject = `New Contact Us Message from ${name}`;
  const emailText = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  await sendEmail('recipient-email@example.com', emailSubject, emailText);

  res.status(201).json({ message: 'Message sent successfully' });
});
