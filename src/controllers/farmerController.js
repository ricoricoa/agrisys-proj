import { FarmerProfile } from "../models/farmerProfileModel.js";
import { Land } from "../models/landModel.js";

async function profileFor(userId) { return FarmerProfile.findOne({ where: { userId }, raw: true }); }

export async function farmerProfilePage(req, res) {
  if (!req.session.userId) return res.redirect("/login");
  const profile = await profileFor(req.session.userId);
  const lands = profile ? await Land.findAll({ where: { farmerId: profile.id }, raw: true }) : [];
  res.render("farmer-profile", { title: "My Profile & Land", profile, lands });
}

export async function saveFarmerProfile(req, res) {
  if (!req.session.userId) return res.redirect("/login");
  const { address, barangay } = req.body;
  await FarmerProfile.upsert({ userId: req.session.userId, address, barangay });
  res.redirect("/farmer/profile");
}

export async function addLand(req, res) {
  if (!req.session.userId) return res.redirect("/login");
  const profile = await profileFor(req.session.userId);
  if (!profile) return res.redirect("/farmer/profile");
  await Land.create({ farmerId: profile.id, ...req.body });
  res.redirect("/farmer/profile");
}
