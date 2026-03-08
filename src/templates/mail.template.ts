import { ContactFormBody } from "../types/contact.type";

// ─── Helper ────────────────────────────────────────────────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ─── 1. Email YOU receive when someone fills the contact form ──────────────────
export function buildOwnerNotificationMail(data: ContactFormBody) {
  const { name, email, subject, message } = data;
  const safeName    = escapeHtml(name);
  const safeEmail   = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");
  const receivedAt  = new Date().toLocaleString("en-US", { timeZone: "UTC", dateStyle: "full", timeStyle: "short" });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Portfolio Message</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#09090b;padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#71717a;">Portfolio</p>
                    <h1 style="margin:6px 0 0;font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.4px;">New Message Received</h1>
                  </td>
                  <td align="right">
                    <div style="width:40px;height:40px;background:#ffffff15;border-radius:10px;display:flex;align-items:center;justify-content:center;">
                      <span style="font-size:20px;">✉️</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px 0;">

              <!-- Sender info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border:1px solid #e4e4e7;border-radius:12px;margin-bottom:20px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#a1a1aa;">From</p>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#09090b;">${safeName}</p>
                    <a href="mailto:${safeEmail}" style="font-size:13px;color:#3b82f6;text-decoration:none;">${safeEmail}</a>
                  </td>
                </tr>
              </table>

              <!-- Subject -->
              <p style="margin:0 0 6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#a1a1aa;">Subject</p>
              <p style="margin:0 0 20px;font-size:15px;font-weight:600;color:#09090b;">${safeSubject}</p>

              <!-- Message -->
              <p style="margin:0 0 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#a1a1aa;">Message</p>
              <div style="background:#f9f9f9;border:1px solid #e4e4e7;border-left:3px solid #09090b;border-radius:0 12px 12px 0;padding:16px 20px;margin-bottom:24px;">
                <p style="margin:0;font-size:14px;color:#3f3f46;line-height:1.7;">${safeMessage}</p>
              </div>

            </td>
          </tr>

          <!-- Reply CTA -->
          <tr>
            <td style="padding:0 32px 28px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#09090b;border-radius:10px;">
                    <a href="mailto:${safeEmail}?subject=Re: ${safeSubject}" style="display:inline-block;padding:12px 24px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;">Reply to ${safeName} →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #f4f4f5;">
              <p style="margin:0;font-size:11px;color:#a1a1aa;">Received at ${receivedAt} UTC · Sent via your portfolio contact form</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `New portfolio message from ${name} <${email}>\n\nSubject: ${subject}\n\n${message}\n\n---\nReceived: ${receivedAt}`;

  return { html, text };
}

// ─── 2. Auto-reply email sent TO the visitor ───────────────────────────────────
export function buildAutoReplyMail(data: ContactFormBody, ownerName: string) {
  const { name, subject } = data;
  const safeName    = escapeHtml(name);
  const safeSubject = escapeHtml(subject);
  const safeOwner   = escapeHtml(ownerName);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Thanks for reaching out</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#09090b;padding:28px 32px;text-align:center;">
              <p style="margin:0 0 8px;font-size:28px;">👋</p>
              <h1 style="margin:0;font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.4px;">Thanks for reaching out!</h1>
              <p style="margin:8px 0 0;font-size:13px;color:#a1a1aa;">I'll get back to you as soon as possible.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 16px;font-size:14px;color:#3f3f46;line-height:1.7;">
                Hi <strong style="color:#09090b;">${safeName}</strong>,
              </p>
              <p style="margin:0 0 16px;font-size:14px;color:#3f3f46;line-height:1.7;">
                Thank you for getting in touch! I've received your message about <strong style="color:#09090b;">"${safeSubject}"</strong> and will review it shortly.
              </p>
              <p style="margin:0 0 24px;font-size:14px;color:#3f3f46;line-height:1.7;">
                I typically respond within <strong style="color:#09090b;">24–48 hours</strong>. In the meantime, feel free to check out my work.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #f4f4f5;margin:0 0 20px;"/>

              <p style="margin:0;font-size:13px;color:#a1a1aa;line-height:1.6;">
                Best regards,<br/>
                <strong style="color:#09090b;">${safeOwner}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #f4f4f5;text-align:center;">
              <p style="margin:0;font-size:11px;color:#a1a1aa;">This is an automated reply. Please do not reply directly to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Hi ${name},\n\nThank you for reaching out! I've received your message about "${subject}" and will get back to you within 24–48 hours.\n\nBest regards,\n${ownerName}\n\n---\nThis is an automated reply. Please do not reply directly.`;

  return { html, text };
}