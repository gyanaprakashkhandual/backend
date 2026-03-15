import { Request, Response } from "express";
import { getTransporter } from "../configs/mail.config.js";
import {
  buildOwnerNotificationMail,
  buildAutoReplyMail,
} from "../templates/mail.template.js";
import { ContactFormBody } from "../types/contact.type.js";

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isEmpty = (str: string): boolean => !str || !str.trim();

export const sendContactMessage = async (
  req: Request<{}, {}, ContactFormBody>,
  res: Response,
): Promise<void> => {
  const { name, email, subject, message } = req.body;

  const errors: Record<string, string> = {};
  if (isEmpty(name)) errors.name = "Name is required.";
  if (isEmpty(email)) errors.email = "Email is required.";
  else if (!isValidEmail(email))
    errors.email = "Please provide a valid email address.";
  if (isEmpty(subject)) errors.subject = "Subject is required.";
  if (isEmpty(message)) errors.message = "Message is required.";
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

  const ownerEmail = process.env.OWNER_EMAIL ?? process.env.MAIL_USER!;
  const ownerName = process.env.OWNER_NAME ?? ownerEmail;
  const fromLabel = `"${ownerName} Portfolio" <${process.env.MAIL_USER}>`;

  const notifyMail = buildOwnerNotificationMail({
    name,
    email,
    subject,
    message,
  });
  const autoReply = buildAutoReplyMail(
    { name, email, subject, message },
    ownerName,
  );

  try {
    const transporter = getTransporter();

    await Promise.all([
      transporter.sendMail({
        from: fromLabel,
        to: ownerEmail,
        replyTo: email,
        subject: `[Portfolio] ${subject.trim()}`,
        html: notifyMail.html,
        text: notifyMail.text,
      }),
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
      message:
        "Your message has been sent successfully! I'll get back to you soon.",
    });
  } catch (err: any) {
    res.status(503).json({
      success: false,
      message:
        "Failed to send your message due to a mail server error. Please try again later.",
    });
  }
};
