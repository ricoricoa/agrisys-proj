import { DamageReport } from "../models/damageReportModel.js";
import { FarmerProfile } from "../models/farmerProfileModel.js";
import { Land } from "../models/landModel.js";

export async function reportDamagePage(req, res) {
  if (!req.session.userId) return res.redirect("/login");
  const profile = await FarmerProfile.findOne({ where: { userId: req.session.userId }, raw: true });
  const lands = profile ? await Land.findAll({ where: { farmerId: profile.id }, raw: true }) : [];
  res.render("damage-report", { title: "Report Farm Damage", profile, lands });
}

export async function submitDamageReport(req, res) {
  if (!req.session.userId) return res.redirect("/login");
  const profile = await FarmerProfile.findOne({ where: { userId: req.session.userId }, raw: true });
  if (!profile || profile.registrationStatus !== "approved") return res.redirect("/farmer/profile");
  await DamageReport.create({ farmerId: profile.id, ...req.body, status: "pending" });
  res.redirect("/farmer/reports");
}

export async function myReportsPage(req, res) {
  if (!req.session.userId) return res.redirect("/login");
  const profile = await FarmerProfile.findOne({ where: { userId: req.session.userId }, raw: true });
  const reports = profile ? await DamageReport.findAll({ where: { farmerId: profile.id }, order: [["createdAt", "DESC"]], raw: true }) : [];
  res.render("my-reports", { title: "My Damage Reports", reports });
}
