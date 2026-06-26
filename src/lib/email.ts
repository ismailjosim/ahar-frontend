import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,

  port: Number(process.env.SMTP_PORT),

  secure: process.env.SMTP_PORT === "465",
  // true for 465, false for 587

  auth: {
    user: process.env.SMTP_USER,

    pass: process.env.SMTP_PASS,
  },
})

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
  expiresIn,
}: {
  to: string
  name: string
  resetUrl: string
  expiresIn: string
}) {
  const result = await transporter.sendMail({
    from: `"Ahar Bengal" <${process.env.SMTP_USER}>`,
    to,
    subject: "Reset your password — Ahar Bengal",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;">
        <div style="margin-bottom:24px;">
          <span style="font-size:22px;font-weight:700;color:#b91c1c;">
            আ
          </span>
          <span style="font-size:16px;font-weight:600;color:#111;margin-left:8px;">
            Ahar Bengal
          </span>
        </div>
        <h1 style="font-size:20px;font-weight:700;color:#111;margin:0 0 8px;">
          Reset your password
        </h1>
        <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;">
          Hi ${name}, we received a request to reset your password.
          Click the button below to choose a new one.
          This link expires in <strong>${expiresIn}</strong>.
        </p>
        <a href="${resetUrl}"
          style="
            display:inline-block;
            padding:12px 24px;
            background:#b91c1c;
            color:#fff;
            border-radius:8px;
            font-size:14px;
            font-weight:600;
            text-decoration:none;
          "
        >
          Reset password
        </a>
        <p style="color:#999;font-size:12px;margin-top:24px;line-height:1.5;">
          If you didn't request this, you can safely ignore this email.
          Your password won't change.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="color:#bbb;font-size:11px;">
          Ahar Bengal · Restaurant management platform
        </p>
      </div>
    `,
  })

  console.log("Email sent:", result.messageId)

  return result
}
