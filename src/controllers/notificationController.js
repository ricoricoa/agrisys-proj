import { FarmerProfile } from "../models/farmerProfileModel.js";
import { Notification } from "../models/notificationModel.js";

export async function notificationsPage(req, res) {
  if (!req.session.userId) return res.redirect("/login");
  const profile = await FarmerProfile.findOne({ where: { userId: req.session.userId }, raw: true });
  const notifications = profile ? await Notification.findAll({ where: { farmerId: profile.id }, order: [["createdAt", "DESC"]], raw: true }) : [];
  res.render("notifications", { title: "My Notifications", notifications });
}
