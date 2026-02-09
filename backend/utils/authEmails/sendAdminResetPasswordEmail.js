import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { resetAdminPasswordEmailHTML , resetAdminPasswordEmailText } from "../emailTemplates/resetPasswordAdminTemplete.js";


const AdminPasswordResetEmail = async (user) => {
  const frontendBaseURL = process.env.CORS_ORIGIN

  // 🔒 Ensure required environment variables are present
  if (
    !frontendBaseURL ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS ||
    !process.env.RESET_PASSWORD_SECRET
  ) {
    throw new Error(
      "Missing required environment variables for password reset"
    );
  }

  try {
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.RESET_PASSWORD_SECRET,
      { expiresIn: process.env.RESET_PASSWORD_EXPIRY || "1h" }
    );
    console.log("Generated JWT token for password reset:", token); // Debugging line
    const resetLink = `${process.env.CORS_ORIGIN}/reset-admin-password/${token}`;
    const displayName = user.fullName || user.username || "User";

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

    const mailOptions = {
      from: `"SGB FINANCE" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset Your SGB FINANCE Password",
      html: resetAdminPasswordEmailHTML(displayName, resetLink),
      text: resetAdminPasswordEmailText(displayName, resetLink),
    };

    await transport.sendMail(mailOptions);

    return { success: true, message: "Reset link sent successfully" };
  } catch (error) {
    console.error("Reset email error:", error);
    return { success: false, message: "Failed to send reset link" };
  }
};

export default AdminPasswordResetEmail ;
