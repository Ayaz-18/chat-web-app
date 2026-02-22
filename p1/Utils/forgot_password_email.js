import dotenv from 'dotenv';
dotenv.config();
import transporter from './email.js';
export const sendVerificationEmail_forgotpassword = async (toEmail, verificationCode) => {
  const verificationLink = `${process.env.FRONTEND_URL}/reset-password?code=${verificationCode}&email=${toEmail}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Reset Password',
    html: `<p>Please reset your password by clicking on the link below:</p>
           <a href="${verificationLink}">Verify Email</a>`
  };
    try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};