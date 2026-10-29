import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const WeatherSnapshot = sequelize.define("WeatherSnapshot", {
  landId: { type: DataTypes.INTEGER, allowNull: false },
  conditionSummary: { type: DataTypes.STRING },
  forecastData: { type: DataTypes.JSON }
});
