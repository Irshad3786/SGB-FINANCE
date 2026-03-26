import nodemailer from "nodemailer";

const adminRegisterEmailTemplate = (name, otp) => {
  return `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <!-- Header with Logo and Branding -->
      <div style="background: linear-gradient(135deg, #0e6b53 0%, #14493b 100%); padding: 40px 20px; text-align: center;">
        <div style="font-size: 32px; font-weight: 900; color: #B0FF1C; margin-bottom: 10px; letter-spacing: 1px;">SGB FINANCE</div>
        <div style="font-size: 12px; color: #bff86a; letter-spacing: 2px; text-transform: uppercase;">Admin Registration</div>
      </div>

      <!-- Main Content -->
      <div style="padding: 40px 30px; background-color: #ffffff;">
        <h2 style="color: #0e6b53; font-size: 24px; margin-bottom: 10px; font-weight: 700;">Welcome to SGB FINANCE</h2>
        <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #B0FF1C 0%, #40FF00 100%); margin-bottom: 20px; border-radius: 2px;"></div>

        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">Hello <strong>${name}</strong>,</p>

        <p style="color: #555555; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">Congratulations! Your Admin account has been successfully created. To activate your account and get started, please verify your email address using the OTP code below:</p>

        <!-- OTP Box -->
        <div style="background: linear-gradient(135deg, #eafef2 0%, #f0f9f5 100%); border: 2px solid #bff86a; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
          <p style="color: #0e6b53; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; font-weight: bold;">Your OTP Code</p>
          <div style="font-size: 48px; font-weight: 900; color: #0e6b53; letter-spacing: 8px; font-family: 'Courier New', monospace; margin-bottom: 10px;">${otp}</div>
          <p style="color: #14493b; font-size: 13px; margin: 0;"><strong>⏱️ Valid for 5 minutes</strong></p>
        </div>

        <p style="color: #666666; font-size: 14px; line-height: 1.6; margin-bottom: 20px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
          <strong>🔒 Security Tip:</strong> Never share your OTP with anyone. SGB FINANCE team will never ask for your OTP via email or phone.
        </p>

        <div style="background-color: #eafef2; padding: 20px; border-radius: 8px; border-left: 4px solid #0e6b53; margin-bottom: 20px;">
          <p style="color: #0e6b53; font-size: 14px; font-weight: bold; margin-bottom: 8px;">What You Can Do Now:</p>
          <ul style="color: #555555; font-size: 13px; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>Access your admin dashboard</li>
            <li>Manage user accounts and permissions</li>
            <li>Monitor financial transactions</li>
            <li>Generate reports and analytics</li>
          </ul>
        </div>

        <p style="color: #555555; font-size: 14px; line-height: 1.6;">
          If you have any questions or need assistance, please contact our support team at <a href="mailto:support@sgbfinance.com" style="color: #0e6b53; text-decoration: none; font-weight: bold;">support@sgbfinance.com</a>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f0f0f0; padding: 30px 20px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #0e6b53; font-size: 14px; font-weight: bold; margin-bottom: 8px;">SGB FINANCE</p>
        <p style="color: #888888; font-size: 12px; line-height: 1.6; margin-bottom: 8px;">Your Trusted Financial Partner</p>
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
          <p style="color: #999999; font-size: 11px; margin: 0;">This is an automated message. Please do not reply to this email.</p>
          <p style="color: #999999; font-size: 11px; margin: 5px 0 0;">© 2024 SGB FINANCE. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;
};

export const sendAdminOtp = async (user, otp) => {
  try {
    // 1️⃣ Configure Nodemailer
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

    // prepare email using template
    const mailOptions = {
      from: `"SGB FINANCE" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify Your Admin Account - SGB FINANCE",
      html: adminRegisterEmailTemplate(user.name, otp),
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
