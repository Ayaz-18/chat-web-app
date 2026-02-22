import dotenv from 'dotenv';
dotenv.config();
import transporter from './email.js';
export const sendVerificationEmail = async (toEmail, verificationCode) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?code=${verificationCode}&email=${toEmail}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Email Verification',
    html: `<p>Please verify your email by clicking on the link below:</p>
           <a href="${verificationLink}">Verify Email</a>`
  };
    try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};