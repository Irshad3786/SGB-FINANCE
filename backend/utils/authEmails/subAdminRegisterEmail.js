import nodemailer from "nodemailer";

export const sendSubAdminOtp = async (user, otp) => {
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
      subject: "Your Sub-Admin Account OTP",
      html: `<p>Dear ${user.name},</p>
                        <p>Your OTP for Sub-Admin account verification is: <b>${otp}</b></p>
                        <p>Role: ${user.roleName}</p>
                        <p>This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
                        <p>Best regards,<br/>SGB FINANCE Team</p>`,
    };

    await transport.sendMail(mailOptions);
    return {
      success: true,
      message: "OTP email sent successfully.",
      otp, // ⚠️ Remove this in production
    };
  } catch (error) {
    console.error("Error sending Sub-Admin OTP email:", error);
    return {
      success: false,
      message: "Failed to send OTP email.",
    };
  }
};
