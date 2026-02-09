// 📩 SubAdmin Reset Password - HTML Email
export const resetAdminPasswordEmailHTML = (displayName, resetLink) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;">
    <h1 style="text-align:center;color:#222;margin:0 0 10px;font-weight:700;">SGB FINANCE</h1>
    <h2 style="text-align:center;color:#333;margin-top:0;">Admin Password Reset</h2>
    <p>Hello ${displayName},</p>
    <p>We received a request to reset your Admin account password. Click the button below to reset it:</p>
    <div style="text-align:center;margin:20px 0;">
      <a href="${resetLink}" target="_blank" style="padding:12px 20px;background-color:#007bff;color:white;text-decoration:none;border-radius:5px;font-weight:bold;">
        Reset Password
      </a>
    </div>
    <p>This link will expire in 1 hour. If you didn’t request this, you can safely ignore this email.</p>
    <p>Thanks,<br/>The CRTD Technology Team</p>
  </div>
`;

// 📩 SubAdmin Reset Password - Plain Text Email
export const resetAdminPasswordEmailText = (displayName, resetLink) => `
Hello ${displayName},

We received a request to reset your Admin account password. Use the link below to do so:

${resetLink}

This link will expire in 1 hour. If you didn’t request this, you can safely ignore this email.

Thanks,
The CRTD Technology Team
`;
