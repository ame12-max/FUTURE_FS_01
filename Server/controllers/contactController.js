// portfolio-backend/controllers/contactController.js
const db = require('../config/db');
const axios = require('axios');
const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

exports.submitContact = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  try {
    // 1. Save to contacts table
    await db.query(
      'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, subject, message]
    );

    // 2. Send email via Resend
    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_FROM,
      subject: `New Contact: ${subject}`,
      html: emailHtml,
    });

    // 3. Send to CRM backend
    const CRM_API_URL = process.env.CRM_API_URL || 'http://localhost:5000';
    await axios.post(`${CRM_API_URL}/api/leads`, {
      name,
      email,
      phone: phone || null,
      source: 'portfolio_contact',
      message,
    }).catch(err => console.error('CRM error:', err.message));

    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
