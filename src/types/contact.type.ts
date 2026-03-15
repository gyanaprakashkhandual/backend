export interface ContactFormBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface MailOptions {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
}
