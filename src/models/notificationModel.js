import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const Notification = sequelize.define("Notification", {
  farmerId: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.ENUM("benefit", "alert"), defaultValue: "alert" },
  readStatus: { type: DataTypes.BOOLEAN, defaultValue: false }
});
