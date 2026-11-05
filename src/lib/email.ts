
import "server-only";

import nodemailer, { type Transporter } from "nodemailer";
import { site } from "@/config/site";
import { theme } from "@/config/theme";
import type { ContactInput } from "@/lib/validation";

const c = theme.colors;

/* -------------------------------------------------------
   SMTP CONFIGURATION
------------------------------------------------------- */

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.CONTACT_RECEIVER,
  );
}

let cached: Transporter | null = null;

function getTransporter(): Transporter {
  if (cached) return cached;

  const port = Number(process.env.SMTP_PORT ?? 465);

  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE.toLowerCase() === "true"
    : port === 465;

  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  return cached;
}

/* -------------------------------------------------------
   EMAIL HELPERS
------------------------------------------------------- */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const headingStack = "'DM Serif Display', Georgia, 'Times New Roman', serif";
const bodyStack = "'DM Sans', Arial, Helvetica, sans-serif";

function layout(title: string, inner: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${c.mint};">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${c.mint};padding:24px 12px;">
<tr><td align="center">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid ${c.line};border-radius:16px;overflow:hidden;">
    <tr><td style="background:${c.forest};padding:28px 32px;">
      <div style="font-family:${headingStack};font-size:26px;color:${c.mint};line-height:1.1;">Rusham</div>
      <div style="font-family:${bodyStack};font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${c.amber};margin-top:6px;">Investment</div>
    </td></tr>
    <tr><td style="padding:32px;font-family:${bodyStack};font-size:16px;line-height:1.65;color:${c.forest};">
      ${inner}
    </td></tr>
    <tr><td style="background:${c.mist};padding:20px 32px;font-family:${bodyStack};font-size:12px;line-height:1.6;color:${c.sageDeep};">
      ${escapeHtml(site.riskDisclaimer)}
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

function row(label: string, value: string): string {
  return `<tr>
<td style="padding:10px 0;border-bottom:1px solid ${c.line};font-family:${bodyStack};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${c.sageDeep};width:130px;vertical-align:top;">${escapeHtml(label)}</td>
<td style="padding:10px 0;border-bottom:1px solid ${c.line};font-family:${bodyStack};font-size:15px;color:${c.forest};">${value}</td>
</tr>`;
}

function timestamp(): string {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "long",
    timeStyle: "short",
  });
}

function formatAppointmentDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatAppointmentTime(value: string): string {
  const [hours, minutes] = value.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/* -------------------------------------------------------
   APPOINTMENT NOTIFICATION EMAIL
   Sent to Rusham Investment
------------------------------------------------------- */

export function buildNotification(
  data: ContactInput,
  submittedAt = timestamp(),
) {
  const subject = "New Appointment Request — Rusham Investment";

  const message = escapeHtml(data.message).replace(/\n/g, "<br>");

  const appointmentDate = escapeHtml(
    formatAppointmentDate(data.appointmentDate),
  );

  const appointmentTime = escapeHtml(
    formatAppointmentTime(data.appointmentTime),
  );

  const html = layout(
    subject,
    `<h1 style="font-family:${headingStack};font-weight:400;font-size:28px;line-height:1.2;margin:0 0 20px;">New appointment request</h1>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
${row("Name", escapeHtml(data.name))}
${row("Email", `<a href="mailto:${escapeHtml(data.email)}" style="color:${c.forest};">${escapeHtml(data.email)}</a>`)}
${row("Phone", escapeHtml(data.phone))}
${row("Preferred Date", appointmentDate)}
${row("Preferred Time", appointmentTime)}
${row("Submitted", escapeHtml(submittedAt) + " (IST)")}
</table>

<p style="font-family:${bodyStack};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${c.sageDeep};margin:24px 0 8px;">Message</p>

<div style="background:${c.mint};border-left:3px solid ${c.amber};padding:16px 18px;font-size:15px;">
${message}
</div>

<p style="font-size:13px;color:${c.sageDeep};margin:24px 0 0;">
Reply to this email to contact the visitor and confirm the appointment.
</p>`,
  );

  const text = [
    "New appointment request — Rusham Investment",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Preferred Date: ${formatAppointmentDate(data.appointmentDate)}`,
    `Preferred Time: ${formatAppointmentTime(data.appointmentTime)}`,
    `Submitted: ${submittedAt} (IST)`,
    "",
    "Message:",
    data.message,
  ].join("\n");

  return { subject, html, text };
}

/* -------------------------------------------------------
   CUSTOMER ACKNOWLEDGEMENT EMAIL
   Sent to the visitor
------------------------------------------------------- */

export function buildAcknowledgement(data: ContactInput) {
  const subject = "Appointment Request Received — Rusham Investment";

  const name = escapeHtml(data.name);

  const appointmentDate = escapeHtml(
    formatAppointmentDate(data.appointmentDate),
  );

  const appointmentTime = escapeHtml(
    formatAppointmentTime(data.appointmentTime),
  );

  const html = layout(
    subject,
    `<h1 style="font-family:${headingStack};font-weight:400;font-size:28px;line-height:1.2;margin:0 0 20px;">
Hello ${name},
</h1>

<p style="margin:0 0 16px;">
Thank you for choosing Rusham Investment.
</p>

<p style="margin:0 0 16px;">
We have received your appointment request with the following preferred schedule:
</p>

<div style="background:${c.mint};border-left:3px solid ${c.amber};padding:16px 18px;font-size:15px;margin:20px 0;">
<strong>Preferred Date:</strong> ${appointmentDate}<br>
<strong>Preferred Time:</strong> ${appointmentTime}
</div>

<p style="margin:0 0 16px;">
Our team will review your request and contact you to confirm your appointment.
</p>

<p style="margin:0 0 16px;">
<strong>Office Hours</strong><br>
Tuesday – Sunday: 10:00 AM – 6:00 PM<br>
Monday: Closed
</p>

<p style="margin:28px 0 0;">
Regards,<br>
<strong>Rusham Investment</strong>
</p>`,
  );

  const text = `Hello ${data.name},

Thank you for choosing Rusham Investment.

We have received your appointment request.

Preferred Date: ${formatAppointmentDate(data.appointmentDate)}
Preferred Time: ${formatAppointmentTime(data.appointmentTime)}

Our team will review your request and contact you to confirm your appointment.

Office Hours:
Tuesday – Sunday: 10:00 AM – 6:00 PM
Monday: Closed

Regards,
Rusham Investment

${site.riskDisclaimer}`;

  return { subject, html, text };
}

/* -------------------------------------------------------
   SEND EMAILS
------------------------------------------------------- */

export interface SendResult {
  notified: boolean;
  acknowledged: boolean;
}

export async function sendEnquiryEmails(
  data: ContactInput,
): Promise<SendResult> {
  const result: SendResult = {
    notified: false,
    acknowledged: false,
  };

  if (!isEmailConfigured()) {
    return result;
  }

  const transporter = getTransporter();

  const from = `"${site.name}" <${
    process.env.CONTACT_FROM || process.env.SMTP_USER
  }>`;

  const receiver = process.env.CONTACT_RECEIVER as string;

  // 1. Send appointment notification to business inbox
  const notification = buildNotification(data);

  await transporter.sendMail({
    from,
    to: receiver,
    replyTo: `"${data.name.replace(/"/g, "")}" <${data.email}>`,
    subject: notification.subject,
    text: notification.text,
    html: notification.html,
  });

  result.notified = true;

  // 2. Send acknowledgement to visitor
  try {
    const acknowledgement = buildAcknowledgement(data);

    await transporter.sendMail({
      from,
      to: data.email,
      replyTo: receiver,
      subject: acknowledgement.subject,
      text: acknowledgement.text,
      html: acknowledgement.html,
    });

    result.acknowledged = true;
  } catch (error) {
    console.error(
      "[contact] acknowledgement email failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
  }

  return result;
}
