import pool from "../database/db.js";
import { decryptMessage, encryptMessage } from "../utils/encryptionUtils.js";

export const createMachineID = async (req, res) => {
  const {
    objecttype_id,
    objectgroup_id,
    objectid,
    objectname,
    icongroup,
    iconid,
    countryid,
    stateid,
    cityid,
    regionid,
    lat,
    long,
    active,
  } = req.body;

  try {
    const insertQuery = `
      INSERT INTO machine.machineid (objecttype_id, objectgroup_id, objectid, objectname, icongroup, iconid, countryid, stateid, cityid, regionid, lat, long, active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *
    `;
    const result = await pool.query(insertQuery, [
      objecttype_id,
      objectgroup_id,
      objectid,
      objectname,
      icongroup,
      iconid,
      countryid,
      stateid,
      cityid,
      regionid,
      lat,
      long,
      active,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while creating the machine ID" });
  }
};

export const getMachineIDs = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM machine.machineid");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching machine IDs" });
  }
};

// Update an existing machine ID
export const updateMachineID = async (req, res) => {
  const { message } = req.body;

  try {
    // Dekripsi pesan yang diterima dari frontend
    const decryptedMessage = decryptMessage(message);

    // Ambil record dan condition dari pesan yang didekripsi
    const { record, condition } = JSON.parse(decryptedMessage);
    const {
      objecttype_id,
      objectgroup_id,
      objectid,
      objectname,
      icongroup,
      iconid,
      countryid,
      stateid,
      cityid,
      regionid,
      lat,
      long,
      active,
    } = record;
    const { id } = condition; // Mengambil ID dari condition

    // Update data ke database berdasarkan ID
    const updateQuery = `
      UPDATE machine.machineid
      SET objecttype_id = $1, objectgroup_id = $2, objectid = $3, objectname = $4, icongroup = $5, iconid = $6, countryid = $7, stateid = $8, cityid = $9, regionid = $10, lat = $11, long = $12, active = $13
      WHERE id = $14 RETURNING *
    `;
    const result = await pool.query(updateQuery, [
      objecttype_id,
      objectgroup_id,
      objectid,
      objectname,
      icongroup,
      iconid,
      countryid,
      stateid,
      cityid,
      regionid,
      lat,
      long,
      active,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Machine ID not found" });
    }

    const updatedData = result.rows[0];

    // Hapus ID dari data yang akan dikirim ke frontend
    const { id: removedId, ...dataWithoutId } = updatedData;

    // Enkripsi data yang berhasil di-update tanpa ID
    const encryptedMessage = encryptMessage(
      JSON.stringify(dataWithoutId, null, 2)
    );

    // Response format
    const response = {
      uniqueid: process.env.IV, // Sesuaikan dengan uniqueid
      timestamp: new Date()
        .toISOString()
        .replace(/[-:.TZ]/g, "")
        .slice(0, 14),
      code: "200",
      message: encryptedMessage,
    };

    res.json(response);
  } catch (error) {
    console.error("Error updating machine ID:", error);
    res.status(500).json({ error: "Failed to update machine ID" });
  }
};
