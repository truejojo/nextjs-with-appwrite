import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({email, emailType, userId}: {email: string, emailType: 'VERIFY' | 'RESET', userId: string}) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === 'VERIFY') {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === 'RESET') {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
});
const mailOptions = {
  from: 'johannesveh@yahoo.de',
  to: email,
  subject:
    emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
  html: `<p>Click <a href="${
    process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${
      emailType === 'VERIFY' ? 'verify your email' : 'reset your password'
    } or copy and paste the following link into your browser: ${
      process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`,
};

return await transport.sendMail(mailOptions);
  } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);}
}

