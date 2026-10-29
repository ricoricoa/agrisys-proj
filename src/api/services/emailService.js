import nodemailer from "nodemailer";

export function isEmailConfigured() { return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD); }

function mailer() {
  return nodemailer.createTransport({ service: "gmail", auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD } });
}

async function sendMail({ to, subject, text }) {
  if (!isEmailConfigured()) return { status: "not_configured" };
  await mailer().sendMail({ from: `AgriSystem MAO <${process.env.GMAIL_USER}>`, to, subject, text });
  return { status: "sent" };
}

export async function sendPasswordResetEmail(email, code) {
  return sendMail({ to: email, subject: "AgriSystem MAO password reset code", text: `Your AgriSystem MAO password reset code is ${code}. It expires in 10 minutes. Do not share this code with anyone.` });
}

export async function sendFarmerNotificationEmails(farmers, message, type) {
  if (!isEmailConfigured()) return { status: "not_configured", recipients: 0 };
  const recipients = [...new Set(farmers.map(farmer => String(farmer.email || "").trim().toLowerCase()).filter(Boolean))];
  if (!recipients.length) return { status: "no_email", recipients: 0 };
  const subject = type === "alert" ? "AgriSystem MAO alert" : "AgriSystem MAO farmer update";
  const result = await Promise.allSettled(recipients.map(to => sendMail({ to, subject, text: `AgriSystem MAO\n\n${message}` })));
  const sent = result.filter(item => item.status === "fulfilled" && item.value.status === "sent").length;
  return { status: sent === recipients.length ? "sent" : sent ? "partially_sent" : "failed", recipients: sent };
}
