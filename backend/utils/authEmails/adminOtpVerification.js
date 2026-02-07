import nodemailer from "nodemailer";
import AdminOtpTemplate from "../emailTemplates/adminOtpVerifyTemplete.js";
const AdminOtpVerifyEmail = async (admin) => {
  try {
    // Configure Nodemailer
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

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 90000).toString();

    // Save OTP to user (hashed in pre-save hook)
    admin.otp = otp;
    admin.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    await admin.save();

    //Prepare email using template
    const mailOptions = {
      from: `"SGB FINANCE" <${process.env.EMAIL_USER}>`,
      to: admin.email,
      subject: "OTP for Account Verification",
      html: AdminOtpTemplate(admin, otp), // 👈 use template here
    };

    await transport.sendMail(mailOptions);

    return {
      success: true,
      message: "OTP email sent successfully.",
      otp, // ⚠️ Remove this in production
    };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return {
      success: false,
      message: "Failed to send OTP email.",
    };
  }
};

export default AdminOtpVerifyEmail;
