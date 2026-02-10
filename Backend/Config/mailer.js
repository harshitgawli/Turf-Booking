// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASSWORD
//   }
// });

// module.exports = transporter;



// Config/mailer.js
const { Resend } = require('resend');

console.log('🔑 RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'LOADED ✓' : 'MISSING ❌');

const resend = new Resend(process.env.RESEND_API_KEY);

// Function that mimics your current transporter.sendMail()
const sendMail = async (mailOptions) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Turf Booking <noreply@gawliharshit.com>',  // Update this domain later
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: `<strong>${mailOptions.text}</strong>`,  // Convert text to HTML
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Email failed');
    }

    console.log('✅ Email sent:', data.id);
    return data;  // Mimics Nodemailer's response
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw error;
  }
};

module.exports = { sendMail };
