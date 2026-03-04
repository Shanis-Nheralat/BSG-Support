import nodemailer from "nodemailer";

// Create transporter with SMTP settings from environment
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions) {
  const { to, subject, text, html, replyTo } = options;

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@backsure.global",
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      text,
      html,
      replyTo,
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

// Email templates
export function getContactNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  formType: string;
}) {
  const subject = `New ${data.formType.replace(/_/g, " ")} from ${data.name}`;
  
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Form Type:</strong> ${data.formType.replace(/_/g, " ")}</p>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
    ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ""}
    <hr />
    <h3>Message:</h3>
    <p>${data.message.replace(/\n/g, "<br />")}</p>
  `;

  const text = `
New Contact Form Submission
Form Type: ${data.formType.replace(/_/g, " ")}
Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ""}
${data.company ? `Company: ${data.company}` : ""}

Message:
${data.message}
  `;

  return { subject, html, text };
}

export function getApplicationNotificationEmail(data: {
  name: string;
  email: string;
  phone: string;
  position: string;
}) {
  const subject = `New Job Application: ${data.position} - ${data.name}`;
  
  const html = `
    <h2>New Job Application</h2>
    <p><strong>Position:</strong> ${data.position}</p>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><em>Resume attached or available in admin panel.</em></p>
  `;

  const text = `
New Job Application
Position: ${data.position}
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}

Resume attached or available in admin panel.
  `;

  return { subject, html, text };
}
