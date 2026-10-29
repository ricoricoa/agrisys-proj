import dotenv from "dotenv";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";

// Resolve from this source file, not from the command's working directory.
// This keeps the API connected to the project's real database whether it is
// started with `npm run agri:server` or directly from the project root.
const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(moduleDirectory, "../../../.env") });
export const mysqlOptions = { host: process.env.MYSQL_HOST || "localhost", port: Number(process.env.MYSQL_PORT || 3306), user: process.env.MYSQL_USER || "root", password: process.env.MYSQL_PASSWORD || "", database: process.env.MYSQL_DATABASE || "agrisystem", waitForConnections: true, connectionLimit: 10 };
export const pool = mysql.createPool(mysqlOptions);
