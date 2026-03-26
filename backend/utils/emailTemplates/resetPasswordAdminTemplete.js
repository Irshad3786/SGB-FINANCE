// 📩 Admin Reset Password - HTML Email
export const resetAdminPasswordEmailHTML = (displayName, resetLink) => `
  <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <!-- Header with Logo and Branding -->
    <div style="background: linear-gradient(135deg, #0e6b53 0%, #14493b 100%); padding: 40px 20px; text-align: center;">
      <div style="font-size: 32px; font-weight: 900; color: #B0FF1C; margin-bottom: 10px; letter-spacing: 1px;">SGB FINANCE</div>
      <div style="font-size: 12px; color: #bff86a; letter-spacing: 2px; text-transform: uppercase;">Trusted Financial Solutions</div>
    </div>

    <!-- Main Content -->
    <div style="padding: 40px 30px; background-color: #ffffff;">
      <h2 style="color: #0e6b53; font-size: 24px; margin-bottom: 10px; font-weight: 700;">Password Reset Request</h2>
      <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #B0FF1C 0%, #40FF00 100%); margin-bottom: 20px; border-radius: 2px;"></div>

      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">Hello <strong>${displayName}</strong>,</p>

      <p style="color: #555555; font-size: 15px; line-height: 1.6; margin-bottom: 15px;">We received a request to reset your Admin account password. Please click the button below to reset your password:</p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 35px 0;">
        <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #B0FF1C 0%, #40FF00 100%); color: #000000; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; border: 2px solid #000000; transition: transform 0.2s;">
          Reset Password
        </a>
      </div>

      <p style="color: #666666; font-size: 14px; line-height: 1.6; margin-bottom: 20px; padding: 15px; background-color: #eafef2; border-left: 4px solid #bff86a; border-radius: 4px;">
        <strong>⏱️ Important:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your account will remain secure.
      </p>

      <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 0;">
        If you have any questions or didn't request this reset, please contact our support team immediately.
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

// 📩 Admin Reset Password - Plain Text Email
export const resetAdminPasswordEmailText = (displayName, resetLink) => `
═══════════════════════════════════════════════════════════
                    SGB FINANCE
              Trusted Financial Solutions
═══════════════════════════════════════════════════════════

PASSWORD RESET REQUEST

Hello ${displayName},

We received a request to reset your Admin account password. Please use the link below to reset your password:

${resetLink}

⏱️ IMPORTANT: This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email and your account will remain secure.

If you have any questions, please contact our support team immediately.

═══════════════════════════════════════════════════════════
SGB FINANCE - Your Trusted Financial Partner
© 2024 SGB FINANCE. All rights reserved.

This is an automated message. Please do not reply to this email.
═══════════════════════════════════════════════════════════
`;
