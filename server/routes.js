const express = require('express');
const router = express.Router();
const db = require('./db');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/contact', async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !service || !message) {
    return res.status(400).json({ error: 'Todos los campos requeridos deben ser completados' });
  }

  try {
    await db.query(
      'INSERT INTO contacts (name, email, phone, service, message) VALUES ($1, $2, $3, $4, $5)',
      [name, email, phone, service, message]
    );

    // Enviar email de notificación
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'gruposrc007@gmail.com',
      subject: 'Nuevo mensaje de contacto - SRC Solutions',
      html: `
        <h2>Nuevo Contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
        <p><strong>Servicio:</strong> ${service}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
      `
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Error sending email:', error);
      }
    });

    res.json({ success: true, message: 'Mensaje enviado exitosamente' });
  } catch (err) {
    console.error('Error inserting contact:', err);
    res.status(500).json({ error: 'Error al procesar tu solicitud' });
  }
});

router.get('/contacts', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM contacts');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ error: 'Error al obtener los contactos' });
  }
});

module.exports = router;