import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = `${process.env.RESEND_FROM_NAME || "Da Hausa Initiative"} <${process.env.RESEND_FROM_EMAIL || "newsletter@dahausa.org"}>`;

// Send welcome email to new subscriber
export async function sendWelcomeEmail(to: string, name?: string) {
  const displayName = name || "Friend";

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Welcome to Da Hausa Initiative</title>
<style>
  body { margin:0; padding:0; background:#F5F5F5; font-family: Arial, Helvetica, sans-serif; }
  .wrapper { max-width:600px; margin:0 auto; background:#ffffff; }
  .header { background:#BF4E14; padding:32px 40px; }
  .header-logo { color:#ffffff; font-size:22px; font-weight:700; letter-spacing:0.5px; text-decoration:none; }
  .header-tagline { color:#f9cbb0; font-size:12px; margin-top:4px; }
  .body { padding:40px; }
  .body h1 { color:#BF4E14; font-size:26px; margin:0 0 16px; }
  .body p { color:#000000; font-size:15px; line-height:1.7; margin:0 0 16px; }
  .divider { border:none; border-top:2px solid #F5F5F5; margin:28px 0; }
  .btn { display:inline-block; background:#BF4E14; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:3px; font-size:14px; font-weight:600; }
  .footer { background:#F5F5F5; padding:24px 40px; }
  .footer p { color:#4A4A4A; font-size:12px; line-height:1.6; margin:0; }
  .footer a { color:#BF4E14; }
  .pill { display:inline-block; background:#F5F5F5; color:#BF4E14; font-size:11px; font-weight:700; padding:4px 10px; border-radius:20px; margin-right:6px; text-transform:uppercase; letter-spacing:0.5px; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <div class="header-logo">Da Hausa Initiative</div>
    <div class="header-tagline">Simplifying concepts, Strengthening communities</div>
  </div>
  <div class="body">
    <h1>Welcome, ${displayName}.</h1>
    <p>Thank you for subscribing to the Da Hausa Initiative newsletter. You're now part of a growing community working towards financial and data literacy in Northern Nigeria.</p>
    <p>Here's what you can expect from us:</p>
    <p>
      <span class="pill">Programmes</span> Updates on courses, scholarships &amp; coaching<br><br>
      <span class="pill">Research</span> Findings and policy briefs from our work<br><br>
      <span class="pill">Resources</span> Podcast episodes, video tutorials, and guides
    </p>
    <hr class="divider">
    <p>In the meantime, explore our programmes and see if any of them are right for you.</p>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/programmes" class="btn">Explore Our Programmes</a>
  </div>
  <div class="footer">
    <p>You're receiving this because you subscribed at <a href="${process.env.NEXT_PUBLIC_SITE_URL}">${process.env.NEXT_PUBLIC_SITE_URL || "dahausa.org"}</a>.<br>
    Da Hausa Initiative · FCT, Nigeria<br>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?email=${to}">Unsubscribe</a></p>
  </div>
</div>
</body>
</html>
  `;

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to Da Hausa Initiative",
    html,
  });
}

// Send newsletter campaign to subscriber
export async function sendNewsletterEmail(
  to: string,
  subject: string,
  body: string,
  name?: string
) {
  const displayName = name || "Friend";

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${subject}</title>
<style>
  body { margin:0; padding:0; background:#F5F5F5; font-family: Arial, Helvetica, sans-serif; }
  .wrapper { max-width:600px; margin:0 auto; background:#ffffff; }
  .header { background:#BF4E14; padding:32px 40px; }
  .header-logo { color:#ffffff; font-size:22px; font-weight:700; letter-spacing:0.5px; }
  .header-tagline { color:#f9cbb0; font-size:12px; margin-top:4px; }
  .body { padding:40px; }
  .body h2 { color:#BF4E14; font-size:24px; margin:0 0 20px; }
  .body p { color:#000000; font-size:15px; line-height:1.8; margin:0 0 16px; }
  .body a { color:#BF4E14; }
  .divider { border:none; border-top:2px solid #F5F5F5; margin:28px 0; }
  .footer { background:#F5F5F5; padding:24px 40px; }
  .footer p { color:#4A4A4A; font-size:12px; line-height:1.6; margin:0; }
  .footer a { color:#BF4E14; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <div class="header-logo">Da Hausa Initiative</div>
    <div class="header-tagline">Simplifying concepts, Strengthening communities</div>
  </div>
  <div class="body">
    <h2>${subject}</h2>
    <p>Dear ${displayName},</p>
    ${body
      .split("\n")
      .map((p) => (p.trim() ? `<p>${p}</p>` : "<br>"))
      .join("\n")}
  </div>
  <hr class="divider" style="margin:0">
  <div class="footer">
    <p>You're receiving this because you subscribed at <a href="${process.env.NEXT_PUBLIC_SITE_URL}">${process.env.NEXT_PUBLIC_SITE_URL || "dahausa.org"}</a>.<br>
    Da Hausa Initiative · FCT, Nigeria<br>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?email=${to}">Unsubscribe</a></p>
  </div>
</div>
</body>
</html>
  `;

  return resend.emails.send({
    from: FROM,
    to,
    subject,
    html,
  });
}

// Send contact form notification to admin
export async function sendContactNotification(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin:0; padding:0; background:#F5F5F5; font-family: Arial, Helvetica, sans-serif; }
  .wrapper { max-width:600px; margin:0 auto; background:#ffffff; padding:40px; }
  h2 { color:#BF4E14; margin:0 0 20px; }
  .field { margin-bottom:16px; }
  .label { font-size:12px; font-weight:700; color:#BF4E14; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px; }
  .value { font-size:15px; color:#000; line-height:1.6; }
  .divider { border:none; border-top:2px solid #F5F5F5; margin:20px 0; }
</style>
</head>
<body>
<div class="wrapper">
  <h2>New Contact Form Submission</h2>
  <div class="field"><div class="label">Name</div><div class="value">${name}</div></div>
  <div class="field"><div class="label">Email</div><div class="value">${email}</div></div>
  <div class="field"><div class="label">Subject</div><div class="value">${subject || "—"}</div></div>
  <hr class="divider">
  <div class="field"><div class="label">Message</div><div class="value">${message.replace(/\n/g, "<br>")}</div></div>
</div>
</body>
</html>
  `;

  return resend.emails.send({
    from: FROM,
    to: process.env.RESEND_FROM_EMAIL || "info@dahausa.org",
    subject: `New Contact: ${subject || name}`,
    html,
  });
}
