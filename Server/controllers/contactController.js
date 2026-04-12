// portfolio-backend/controllers/contactController.js
const db = require('../config/db');
const nodemailer = require('nodemailer');
const axios = require('axios'); // <-- add this

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.submitContact = async (req, res) => {
  const { name, email, phone, subject, message } = req.body; 
  try {
    // Update contacts table (add phone column if not exists)
    await db.query(
      'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, subject, message]
    );

    // Email notification (include phone)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact: ${subject}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
             <p><strong>Message:</strong> ${message}</p>`
    });

    // Send to CRM (include phone)
    const CRM_API_URL = process.env.CRM_API_URL || 'http://localhost:5000';
    await axios.post(`${CRM_API_URL}/api/leads`, {
      name,
      email,
      phone: phone || null,
      source: 'portfolio_contact',
      message
    });

    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};