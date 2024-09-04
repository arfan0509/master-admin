import pool from "../database/db.js"; // Pastikan path ini sesuai dengan konfigurasi proyek Anda

// Get all vendors
export const getVendors = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM machine.vendor");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting vendors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get vendor by ID
export const getVendorById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM machine.vendor WHERE id = $1",
      [id]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Vendor not found" });
    }
  } catch (error) {
    console.error("Error getting vendor by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
