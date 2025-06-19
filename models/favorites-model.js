const pool = require("../database/")

// Add a favorite vehicle for a user
async function addFavorite(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO favorites (account_id, inv_id)
      VALUES ($1, $2)
      ON CONFLICT (account_id, inv_id) DO NOTHING
      RETURNING *
    `
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0]
  } catch (error) {
    console.error("addFavorite error:", error)
    throw error
  }
}

// Get all favorite vehicles for a user (with vehicle details)
async function getFavoritesByAccount(account_id) {
  try {
    const sql = `
      SELECT i.*
      FROM inventory i
      JOIN favorites f ON i.inv_id = f.inv_id
      WHERE f.account_id = $1
      ORDER BY i.inv_make, i.inv_model
    `
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error("getFavoritesByAccount error:", error)
    throw error
  }
}

// Check if favorite exists
async function isFavoriteAlreadyAdded(account_id, inv_id) {
  try {
    const sql = `SELECT * FROM favorites WHERE account_id = $1 AND inv_id = $2`;
    const result = await pool.query(sql, [account_id, inv_id]);
    return result.rowCount > 0; // true if found
  } catch (error) {
    throw new Error("Database error checking favorite: " + error.message);
  }
}

module.exports = {
  addFavorite,
  getFavoritesByAccount,
  isFavoriteAlreadyAdded
}