import nodemailer from "nodemailer";
// ─── Transporter singleton ────────────────────────────────────────────────────
let transporter = null;
/**
 * Returns a cached nodemailer transporter.
 * Reads credentials from environment variables so nothing is hard-coded.
 *
 * Required .env keys:
 *   MAIL_SERVICE   – e.g. "gmail" | "outlook" | "yahoo"  (optional if using SMTP host)
 *   MAIL_HOST      – SMTP host, e.g. "smtp.gmail.com"    (used when SERVICE is not set)
 *   MAIL_PORT      – SMTP port, e.g. 465 or 587
 *   MAIL_SECURE    – "true" for port 465, "false" for 587 with STARTTLS
 *   MAIL_USER      – your email address / SMTP username
 *   MAIL_PASSWORD  – your email app-password or SMTP password
 */
export function getTransporter() {
    if (transporter)
        return transporter;
    const service = process.env.MAIL_SERVICE; // e.g. "gmail"
    const host = process.env.MAIL_HOST; // e.g. "smtp.gmail.com"
    const port = parseInt(process.env.MAIL_PORT ?? "587");
    const secure = process.env.MAIL_SECURE === "true"; // true = 465, false = 587
    const user = process.env.MAIL_USER;
    const password = process.env.MAIL_PASSWORD;
    if (!user || !password) {
        throw new Error("MAIL_USER and MAIL_PASSWORD must be set in environment variables.");
    }
    transporter = nodemailer.createTransport(service
        ? // ── Named service (Gmail, Outlook, Yahoo …) ────────────────────────
            {
                service,
                auth: { user, pass: password },
            }
        : // ── Raw SMTP host (any provider) ────────────────────────────────────
            {
                host: host ?? "smtp.gmail.com",
                port,
                secure,
                auth: { user, pass: password },
                tls: { rejectUnauthorized: false },
            });
    return transporter;
}
/**
 * Smoke-test the transporter at server startup.
 * Call this once in your app entry point so you know early if creds are wrong.
 */
export async function verifyMailConnection() {
    try {
        await getTransporter().verify();
        console.log("✅  Mail transporter connected successfully.");
    }
    catch (err) {
        console.error("❌  Mail transporter verification failed:", err.message);
        // Don't crash the server — contact endpoint will return 503 if mail fails
    }
}
