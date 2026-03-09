import { getTransporter } from "../configs/mail.config.js";
import { buildOwnerNotificationMail, buildAutoReplyMail } from "../templates/mail.template.js";
// ─── Basic validators ──────────────────────────────────────────────────────────
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isEmpty = (str) => !str || !str.trim();
/**
 * POST /api/contact
 *
 * Accepts a contact form submission, sends:
 *   1. A notification email to YOU (the portfolio owner)
 *   2. An auto-reply confirmation to the visitor
 *
 * Required env vars:
 *   MAIL_USER         – your email address (sender + recipient for notifications)
 *   MAIL_PASSWORD     – your email app-password
 *   OWNER_NAME        – your display name, e.g. "John Doe"   (falls back to MAIL_USER)
 *   OWNER_EMAIL       – where YOU want to receive messages   (falls back to MAIL_USER)
 *   MAIL_SERVICE / MAIL_HOST / MAIL_PORT / MAIL_SECURE  → see mailer.config.ts
 */
export const sendContactMessage = async (req, res) => {
    const { name, email, subject, message } = req.body;
    // ── Validation ───────────────────────────────────────────────────────────────
    const errors = {};
    if (isEmpty(name))
        errors.name = "Name is required.";
    if (isEmpty(email))
        errors.email = "Email is required.";
    else if (!isValidEmail(email))
        errors.email = "Please provide a valid email address.";
    if (isEmpty(subject))
        errors.subject = "Subject is required.";
    if (isEmpty(message))
        errors.message = "Message is required.";
    if (message && message.trim().length > 5000)
        errors.message = "Message must be under 5000 characters.";
    if (Object.keys(errors).length > 0) {
        res.status(400).json({
            success: false,
            message: "Validation failed. Please check the fields below.",
            errors,
        });
        return;
    }
    // ── Config from env ───────────────────────────────────────────────────────────
    const ownerEmail = process.env.OWNER_EMAIL ?? process.env.MAIL_USER;
    const ownerName = process.env.OWNER_NAME ?? ownerEmail;
    const fromLabel = `"${ownerName} Portfolio" <${process.env.MAIL_USER}>`;
    // ── Build email content ───────────────────────────────────────────────────────
    const notifyMail = buildOwnerNotificationMail({ name, email, subject, message });
    const autoReply = buildAutoReplyMail({ name, email, subject, message }, ownerName);
    try {
        const transporter = getTransporter();
        // Send both emails concurrently
        await Promise.all([
            // 1 — Notify you
            transporter.sendMail({
                from: fromLabel,
                to: ownerEmail,
                replyTo: email, // so "Reply" in your mail client goes to the visitor
                subject: `[Portfolio] ${subject.trim()}`,
                html: notifyMail.html,
                text: notifyMail.text,
            }),
            // 2 — Auto-reply to the visitor
            transporter.sendMail({
                from: fromLabel,
                to: email,
                subject: `Re: ${subject.trim()} — Thanks for reaching out!`,
                html: autoReply.html,
                text: autoReply.text,
            }),
        ]);
        res.status(200).json({
            success: true,
            message: "Your message has been sent successfully! I'll get back to you soon.",
        });
    }
    catch (err) {
        console.error("[Contact] Mail sending failed:", err.message ?? err);
        res.status(503).json({
            success: false,
            message: "Failed to send your message due to a mail server error. Please try again later.",
        });
    }
};
