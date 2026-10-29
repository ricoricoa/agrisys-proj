import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const DamageReport = sequelize.define("DamageReport", {
  landId: { type: DataTypes.INTEGER, allowNull: false },
  farmerId: { type: DataTypes.INTEGER, allowNull: false },
  photoUrls: { type: DataTypes.TEXT },
  aiDetectedPlant: { type: DataTypes.STRING },
  aiDetectedDamageType: { type: DataTypes.STRING },
  aiConfidenceNotes: { type: DataTypes.TEXT },
  confirmedPlant: { type: DataTypes.STRING },
  confirmedDamageType: { type: DataTypes.STRING },
  farmerNotes: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM("pending", "verified", "rejected"), defaultValue: "pending" }
});
