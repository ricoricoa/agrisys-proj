import { pool } from "../../config/db.js";

export async function recentPasswordReset(userId) {
  const [rows] = await pool.query("SELECT * FROM password_reset_codes WHERE user_id = ? ORDER BY created_at DESC LIMIT 1", [userId]);
  return rows[0] || null;
}

export async function createPasswordReset({ userId, codeHash }) {
  await pool.query("UPDATE password_reset_codes SET consumed_at = NOW() WHERE user_id = ? AND consumed_at IS NULL", [userId]);
  const [result] = await pool.query("INSERT INTO password_reset_codes (user_id, code_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))", [userId, codeHash]);
  const [rows] = await pool.query("SELECT * FROM password_reset_codes WHERE id = ?", [result.insertId]);
  return rows[0];
}

export async function latestUsablePasswordReset(userId) {
  const [rows] = await pool.query("SELECT * FROM password_reset_codes WHERE user_id = ? AND consumed_at IS NULL AND expires_at > NOW() AND attempts < 5 ORDER BY created_at DESC LIMIT 1", [userId]);
  return rows[0] || null;
}

export async function addPasswordResetAttempt(id) { await pool.query("UPDATE password_reset_codes SET attempts = attempts + 1 WHERE id = ?", [id]); }
export async function consumePasswordReset(id) { await pool.query("UPDATE password_reset_codes SET consumed_at = NOW() WHERE id = ?", [id]); }
