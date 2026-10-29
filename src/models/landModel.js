import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const Land = sequelize.define("Land", {
  farmerId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING },
  address: { type: DataTypes.TEXT },
  barangay: { type: DataTypes.STRING },
  latitude: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
  longitude: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
  sizeHectares: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  cropTypes: { type: DataTypes.STRING, defaultValue: "" },
  ownershipProofFile: { type: DataTypes.STRING }
});
