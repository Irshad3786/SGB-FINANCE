const UserOtpTemplate = (user, otp) => {
  return `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <!-- Header with Logo and Branding -->
      <div style="background: linear-gradient(135deg, #65B741 0%, #40FF00 100%); padding: 40px 20px; text-align: center;">
        <div style="font-size: 32px; font-weight: 900; color: #ffffff; margin-bottom: 10px; letter-spacing: 1px;">SGB FINANCE</div>
        <div style="font-size: 12px; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">Email Verification</div>
      </div>

      <!-- Main Content -->
      <div style="padding: 40px 30px; background-color: #ffffff;">
        <h2 style="color: #65B741; font-size: 24px; margin-bottom: 10px; font-weight: 700;">Verify Your Email Address</h2>
        <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #65B741 0%, #40FF00 100%); margin-bottom: 20px; border-radius: 2px;"></div>

        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">Hello <strong>${user.username || "User"}</strong>,</p>

        <p style="color: #555555; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">Thank you for registering with SGB FINANCE. To complete your email verification and activate your account, please use the OTP code below:</p>

        <!-- OTP Box -->
        <div style="background: linear-gradient(135deg, #e6f5e0 0%, #f0fae8 100%); border: 2px solid #65B741; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
          <p style="color: #65B741; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; font-weight: bold;">Your OTP Code</p>
          <div style="font-size: 48px; font-weight: 900; color: #40FF00; letter-spacing: 8px; font-family: 'Courier New', monospace; margin-bottom: 10px;">${otp}</div>
          <p style="color: #65B741; font-size: 13px; margin: 0;"><strong>⏱️ Valid for 10 minutes</strong></p>
        </div>

        <p style="color: #666666; font-size: 14px; line-height: 1.6; margin-bottom: 20px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
          <strong>🔒 Security Tip:</strong> Never share your OTP with anyone. SGB FINANCE will never ask for your OTP via email or phone.
        </p>

        <p style="color: #555555; font-size: 14px; line-height: 1.6;">
          If you did not create this account or expect this email, please contact our support team immediately at <a href="mailto:support@sgbfinance.com" style="color: #65B741; text-decoration: none; font-weight: bold;">support@sgbfinance.com</a>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f0f0f0; padding: 30px 20px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #65B741; font-size: 14px; font-weight: bold; margin-bottom: 8px;">SGB FINANCE</p>
        <p style="color: #888888; font-size: 12px; line-height: 1.6; margin-bottom: 8px;">Your Trusted Financial Partner for Vehicle Finance</p>
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
          <p style="color: #999999; font-size: 11px; margin: 0;">This is an automated message. Please do not reply to this email.</p>
          <p style="color: #999999; font-size: 11px; margin: 5px 0 0;">© 2024 SGB FINANCE. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;
};

export default UserOtpTemplate;
