import { DamageReport } from "../models/damageReportModel.js";
import { FarmerProfile } from "../models/farmerProfileModel.js";
import { Notification } from "../models/notificationModel.js";
import { User } from "../models/userModel.js";

function staffOnly(req, res) { return req.session.userId && ["staff", "technician", "admin"].includes(req.session.role); }

export async function reviewReportsPage(req, res) {
  if (!staffOnly(req, res)) return res.redirect("/dashboard");
  const reports = await DamageReport.findAll({ order: [["createdAt", "DESC"]], raw: true });
  res.render("review-reports", { title: "Review Reports", reports });
}

export async function reviewReport(req, res) {
  if (!staffOnly(req, res)) return res.redirect("/dashboard");
  await DamageReport.update({ status: req.body.status, confirmedPlant: req.body.confirmedPlant || null, confirmedDamageType: req.body.confirmedDamageType || null }, { where: { id: req.params.id } });
  res.redirect("/staff/reports");
}

export async function registrationsPage(req, res) {
  if (!staffOnly(req, res)) return res.redirect("/dashboard");
  const farmers = await FarmerProfile.findAll({ where: { registrationStatus: "pending" }, raw: true });
  res.render("registrations", { title: "Farmer Registrations", farmers });
}

export async function reviewRegistration(req, res) {
  if (!staffOnly(req, res)) return res.redirect("/dashboard");
  await FarmerProfile.update({ registrationStatus: req.body.status, reviewNotes: req.body.reviewNotes || null }, { where: { id: req.params.id } });
  res.redirect("/admin/registrations");
}

export async function sendNotification(req, res) {
  if (!staffOnly(req, res)) return res.redirect("/dashboard");
  await Notification.create(req.body);
  res.redirect("/staff/reports");
}

export async function usersPage(req, res) {
  if (!req.session.userId || req.session.role !== "admin") return res.redirect("/dashboard");
  const users = await User.findAll({ attributes: ["id", "name", "email", "contactNumber", "role", "createdAt"], raw: true });
  res.render("users", { title: "User Management", users });
}
