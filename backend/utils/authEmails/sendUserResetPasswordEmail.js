import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import {
  resetUserPasswordEmailHTML,
  resetUserPasswordEmailText,
} from "../emailTemplates/resetPasswordUserTemplete.js";

const UserPasswordResetEmail = async (user) => {
  const frontendBaseURL =
    process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "http://localhost:5173";
  const resetPasswordSecret =
    process.env.RESET_PASSWORD_SECRET || process.env.ACCESS_TOKEN_SECRET;
  const emailUser = process.env.EMAIL_USER;
  const emailPass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "");

  if (
    !emailUser ||
    !emailPass ||
    !resetPasswordSecret
  ) {
    return {
      success: false,
      message: "Email service configuration is missing on server",
    };
  }

  try {
    const token = jwt.sign(
      { id: user._id, email: user.email },
      resetPasswordSecret,
      { expiresIn: process.env.RESET_PASSWORD_EXPIRY || "1h" }
    );

    const resetLink = `${frontendBaseURL}/reset-user-password/${token}`;
    const displayName = user.username || "User";

    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    await transport.sendMail({
      from: `"SGB FINANCE" <${emailUser}>`,
      to: user.email,
      subject: "Reset Your SGB FINANCE Password",
      html: resetUserPasswordEmailHTML(displayName, resetLink),
      text: resetUserPasswordEmailText(displayName, resetLink),
    });

    return { success: true, message: "Reset link sent successfully" };
  } catch (error) {
    console.error("User reset email error:", error);
    return { success: false, message: "Failed to send reset link" };
  }
};

export default UserPasswordResetEmail;
