import { pool } from "../../config/db.js";

const sources = {
  reports: { itemType: "report", table: "damage_reports", statusColumn: "status", pendingValue: "pending" },
  registrations: { itemType: "registration", table: "farmer_profiles", statusColumn: "registration_status", pendingValue: "pending" },
};

export async function getNewReviewCounts(staffUserId) {
  const [[reportRows], [registrationRows]] = await Promise.all([
    pool.query("SELECT COUNT(*) AS total FROM damage_reports item LEFT JOIN staff_review_seen_items seen ON seen.item_type = 'report' AND seen.item_id = item.id AND seen.staff_user_id = ? WHERE item.status = 'pending' AND seen.id IS NULL", [staffUserId]),
    pool.query("SELECT COUNT(*) AS total FROM farmer_profiles item LEFT JOIN staff_review_seen_items seen ON seen.item_type = 'registration' AND seen.item_id = item.id AND seen.staff_user_id = ? WHERE item.registration_status = 'pending' AND seen.id IS NULL", [staffUserId]),
  ]);
  return { reports: Number(reportRows[0]?.total || 0), registrations: Number(registrationRows[0]?.total || 0) };
}

export async function markReviewItemsSeen(staffUserId, type) {
  const source = sources[type];
  if (!source) return null;
  await pool.query(`INSERT IGNORE INTO staff_review_seen_items (staff_user_id, item_type, item_id) SELECT ?, ?, item.id FROM ${source.table} item WHERE item.${source.statusColumn} = ?`, [staffUserId, source.itemType, source.pendingValue]);
  return getNewReviewCounts(staffUserId);
}
