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

interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
}

export async function sendEmail(options: EmailOptions) {
  const { to, subject, text, html, replyTo, attachments } = options;

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@backsure.global",
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      text,
      html,
      replyTo,
      attachments: attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      })),
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

export function getMeetingConfirmationEmail(data: {
  name: string;
  date: string;
  time: string;
  localTime: string;
  timezone: string;
}) {
  const subject = "Your Meeting is Confirmed - Backsure Global Support";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #062767; color: white; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">Meeting Confirmed</h1>
      </div>
      <div style="padding: 24px;">
        <p>Dear ${data.name},</p>
        <p>Your meeting with Backsure Global Support has been confirmed. Here are the details:</p>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date</td>
              <td style="padding: 8px 0; font-weight: 600;">${data.date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time (UAE)</td>
              <td style="padding: 8px 0; font-weight: 600;">${data.time} GST</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Your Local Time</td>
              <td style="padding: 8px 0; font-weight: 600;">${data.localTime} (${data.timezone.replace(/_/g, " ")})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Duration</td>
              <td style="padding: 8px 0; font-weight: 600;">30 minutes</td>
            </tr>
          </table>
        </div>
        <p>If you need to reschedule or cancel, please contact us at <a href="mailto:info@backsureglobalsupport.com" style="color: #062767;">info@backsureglobalsupport.com</a> or call <a href="tel:+971524419445" style="color: #062767;">+971 52-441-9445</a>.</p>
        <p>Best regards,<br>The BSG Team</p>
      </div>
      <div style="background: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #6b7280;">
        Backsure Global Support | Dubai, UAE | <a href="https://backsureglobalsupport.com" style="color: #6b7280;">www.backsureglobalsupport.com</a>
      </div>
    </div>
  `;

  const text = `Meeting Confirmed

Dear ${data.name},

Your meeting with Backsure Global Support has been confirmed.

Date: ${data.date}
Time (UAE): ${data.time} GST
Your Local Time: ${data.localTime} (${data.timezone.replace(/_/g, " ")})
Duration: 30 minutes

If you need to reschedule or cancel, please contact us at info@backsureglobalsupport.com or call +971 52-441-9445.

Best regards,
The BSG Team
`;

  return { subject, html, text };
}
