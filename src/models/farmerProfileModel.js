import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const FarmerProfile = sequelize.define("FarmerProfile", {
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  address: { type: DataTypes.TEXT, allowNull: false },
  barangay: { type: DataTypes.STRING },
  registrationStatus: { type: DataTypes.ENUM("pending", "approved", "rejected"), defaultValue: "pending" },
  reviewNotes: { type: DataTypes.TEXT }
});
