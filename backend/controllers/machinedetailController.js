import pool from "../database/db.js";
import { decryptMessage, encryptMessage } from "../utils/encryptionUtils.js";

// Create a new machine detail
export const createMachineDetail = async (req, res) => {
  const { message } = req.body;

  try {
    // Dekripsi pesan yang diterima dari frontend
    const decryptedMessage = decryptMessage(message);
    const {
      objecttype_id,
      objectgroup_id,
      objectid_id,
      objectcode,
      objectname,
      lat,
      long,
      active,
    } = JSON.parse(decryptedMessage).record;

    // Insert data ke database
    const insertQuery = `
      INSERT INTO machine.machinedetail 
      (objecttype_id, objectgroup_id, objectid_id, objectcode, objectname, lat, long, active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `;
    const result = await pool.query(insertQuery, [
      objecttype_id,
      objectgroup_id,
      objectid_id,
      objectcode,
      objectname,
      lat,
      long,
      active,
    ]);

    const insertedData = result.rows[0]; // Data yang berhasil di-insert

    // Membuat objek yang hanya menyertakan field selain 'id'
    const responseData = {
      objecttype_id: insertedData.objecttype_id,
      objectgroup_id: insertedData.objectgroup_id,
      objectid_id: insertedData.objectid_id,
      objectcode: insertedData.objectcode,
      objectname: insertedData.objectname,
      lat: insertedData.lat,
      long: insertedData.long,
      active: insertedData.active,
    };

    // Enkripsi data yang baru dimasukkan ke database, dalam format JSON dengan indentation
    const encryptedMessage = encryptMessage(
      JSON.stringify(responseData, null, 2)
    );

    // Membuat uniqueid
    const uniqueid = process.env.IV; // Sesuai dengan yang disimpan di .env atau kunci unik lainnya

    // Mendapatkan timestamp dalam format YYYYMMDDHHMMSS
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14);

    // Format JSON response
    const response = {
      uniqueid: uniqueid,
      timestamp: timestamp,
      code: "200",
      message: encryptedMessage,
    };

    res.status(201).json(response); // Mengirimkan respons
  } catch (err) {
    console.error("Database error:", err.message); // Menambahkan pesan error yang lebih detail
    res
      .status(500)
      .json({ error: "An error occurred while creating the machine detail" });
  }
};

export const getMachineDetails = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM machine.machinedetail");
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching machine details" });
  }
};

export const getMachineDetailById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM machine.machinedetail WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Machine detail not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the machine detail" });
  }
};

// Update an existing machine detail
export const updateMachineDetail = async (req, res) => {
  const { message } = req.body;

  try {
    // Dekripsi pesan yang diterima dari frontend
    const decryptedMessage = decryptMessage(message);

    // Ambil record dan condition dari pesan yang didekripsi
    const { record, condition } = JSON.parse(decryptedMessage);
    const {
      objecttype_id,
      objectgroup_id,
      objectid_id,
      objectcode,
      objectname,
      lat,
      long,
      active,
    } = record;
    const { id } = condition; // Mengambil ID dari condition

    // Update data ke database berdasarkan ID
    const updateQuery = `
      UPDATE machine.machinedetail
      SET objecttype_id = $1, objectgroup_id = $2, objectid_id = $3, objectcode = $4, objectname = $5, lat = $6, long = $7, active = $8
      WHERE id = $9 RETURNING *
    `;
    const result = await pool.query(updateQuery, [
      objecttype_id,
      objectgroup_id,
      objectid_id,
      objectcode,
      objectname,
      lat,
      long,
      active,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Machine detail not found",
      });
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
    console.error("Error updating machine detail:", error);
    res.status(500).json({ error: "Failed to update machine detail" });
  }
};
