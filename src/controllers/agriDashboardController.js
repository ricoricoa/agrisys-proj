import { DamageReport } from "../models/damageReportModel.js";
import { FarmerProfile } from "../models/farmerProfileModel.js";

export async function agriDashboardPage(req, res) {
  if (!req.session.userId) return res.redirect("/login");
  const [totalReports, pendingReports, verifiedReports, pendingFarmers] = await Promise.all([
    DamageReport.count(), DamageReport.count({ where: { status: "pending" } }),
    DamageReport.count({ where: { status: "verified" } }), FarmerProfile.count({ where: { registrationStatus: "pending" } })
  ]);
  const reports = await DamageReport.findAll({ order: [["createdAt", "DESC"]], limit: 6, raw: true });
  const role = req.session.role || "farmer";
  res.render("agri-dashboard", { title: "AgriSystem Dashboard", totalReports, pendingReports, verifiedReports, pendingFarmers, reports, role, userName: req.session.userName, canReview: ["staff", "technician", "admin"].includes(role), isAdmin: role === "admin" });
}
