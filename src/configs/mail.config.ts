import nodemailer, { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

export function getTransporter(): Transporter {
  if (transporter) return transporter;

  const service = process.env.MAIL_SERVICE;
  const host = process.env.MAIL_HOST;
  const port = parseInt(process.env.MAIL_PORT ?? "587");
  const secure = process.env.MAIL_SECURE === "true";
  const user = process.env.MAIL_USER!;
  const password = process.env.MAIL_PASSWORD!;

  if (!user || !password) {
    throw new Error(
      "MAIL_USER and MAIL_PASSWORD must be set in environment variables.",
    );
  }

  transporter = nodemailer.createTransport(
    service
      ? { service, auth: { user, pass: password } }
      : {
          host: host ?? "smtp.gmail.com",
          port,
          secure,
          auth: { user, pass: password },
          tls: { rejectUnauthorized: false },
        },
  );

  return transporter;
}

export async function verifyMailConnection(): Promise<void> {
  try {
    await getTransporter().verify();
  } catch (err: any) {
    console.error("Mail transporter verification failed:", err.message);
  }
}
