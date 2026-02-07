const AdminOtpTemplate = (admin, otp) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
      <h2 style="color: #2196F3;">Admin Account Verification - SGB FINANCE</h2>
      <p>Hi <strong>${admin.name || "Admin"}</strong>,</p>
      <p>You have been registered as a Admin. Please use the OTP below to verify your email address:</p>

      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
        <h1 style="letter-spacing: 2px;">${otp}</h1>
        <p style="color: #555;">(Valid for 10 minutes)</p>
      </div>

      <p>If you did not expect this email, please contact the system administrator immediately.</p>

      <p style="margin-top: 40px;">Best regards,<br><strong>SGB FINANCE Team</strong></p>

      <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply.</p>
    </div>
  `;
};

export default AdminOtpTemplate;
