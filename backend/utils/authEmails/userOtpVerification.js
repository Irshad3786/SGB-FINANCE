import nodemailer from "nodemailer";
import UserOtpTemplate from "../emailTemplates/userOtpVerifyTemplete.js";

const UserOtpVerifyEmail = async (user) => {
  try {
    console.log('📧 [UserOtpVerifyEmail] Starting OTP email sending for:', user.email);

    // Configure Nodemailer
    console.log('⚙️ [UserOtpVerifyEmail] Configuring email transport...');
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log('✅ [UserOtpVerifyEmail] Email transport configured');
    console.log('📧 [UserOtpVerifyEmail] Sender email:', process.env.EMAIL_USER);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 90000).toString();
    console.log('🔐 [UserOtpVerifyEmail] Generated OTP:', otp);

    // Save OTP to user (hashed in pre-save hook)
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.lastOtpSentAt = Date.now();
    console.log('💾 [UserOtpVerifyEmail] Saving OTP to user...');
    await user.save();
    console.log('✅ [UserOtpVerifyEmail] OTP saved to user');

    // Prepare email using template
    const mailOptions = {
      from: `"SGB FINANCE" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify Your Email - SGB FINANCE",
      html: UserOtpTemplate(user, otp),
    };

    console.log('📨 [UserOtpVerifyEmail] Email options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    console.log('📤 [UserOtpVerifyEmail] Sending email...');
    await transport.sendMail(mailOptions);
    console.log('✅ [UserOtpVerifyEmail] Email sent successfully');

    return {
      success: true,
      message: "OTP email sent successfully.",
      otp, // ⚠️ Remove this in production
    };
  } catch (error) {
    console.error('❌ [UserOtpVerifyEmail] Error sending OTP email:', error);
    console.error('❌ [UserOtpVerifyEmail] Error code:', error.code);
    console.error('❌ [UserOtpVerifyEmail] Error response:', error.response);
    
    return {
      success: false,
      message: "Failed to send OTP email. " + error.message,
    };
  }
};

export default UserOtpVerifyEmail;
