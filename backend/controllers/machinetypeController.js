import pool from "../database/db.js";
import { decryptMessage, encryptMessage } from "../utils/encryptionUtils.js";

// Create a new machinetype
export const createMachinetype = async (req, res) => {
  const { message } = req.body;

  try {
    // Dekripsi pesan yang diterima dari frontend
    const decryptedMessage = decryptMessage(message);
    const { objecttype, description, active } =
      JSON.parse(decryptedMessage).record;

    // Check if the objecttype already exists
    const checkQuery =
      "SELECT * FROM machine.machinetype WHERE objecttype = $1";
    const checkResult = await pool.query(checkQuery, [objecttype]);

    if (checkResult.rows.length > 0) {
      return res.status(409).json({
        error:
          "Duplicate key value violates unique constraint 'machinetype_objecttype_key'",
      });
    }

    // Insert data ke database
    const insertQuery = `
      INSERT INTO machine.machinetype (objecttype, description, active)
      VALUES ($1, $2, $3) RETURNING *
    `;
    const result = await pool.query(insertQuery, [
      objecttype,
      description,
      active,
    ]);

    const insertedData = result.rows[0]; // Data yang berhasil di-insert

    // Membuat objek yang hanya menyertakan field selain 'id'
    const responseData = {
      objecttype: insertedData.objecttype,
      description: insertedData.description,
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
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while creating the machinetype" });
  }
};

// Get all machinetypes
export const getMachinetypes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM machine.machinetype");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching machinetypes" });
  }
};

// Update a machinetype
// Update a machinetype
export const updateMachinetype = async (req, res) => {
  const { message } = req.body;

  try {
    // Dekripsi pesan yang diterima dari frontend
    const decryptedMessage = decryptMessage(message);

    // Ambil record dan condition dari pesan yang didekripsi
    const { record, condition } = JSON.parse(decryptedMessage);
    const { description, active } = record;
    const { value: objecttype } = condition.objecttype; // Mengambil objecttype dari condition

    // Dapatkan ID dari URL (req.params.id)
    const { id } = req.params;

    // Update data ke database berdasarkan ID dan objecttype
    const updateQuery = `
      UPDATE machine.machinetype
      SET objecttype = $1, description = $2, active = $3
      WHERE id = $4 RETURNING *
    `;
    const result = await pool.query(updateQuery, [
      objecttype,
      description,
      active,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Machinetype not found",
      });
    }

    const updatedData = result.rows[0]; // Data yang berhasil di-update

    // Membuat objek yang hanya menyertakan field yang di-update
    const responseData = {
      objecttype: updatedData.objecttype,
      description: updatedData.description,
      active: updatedData.active,
    };

    // Enkripsi data yang baru di-update ke database, dalam format JSON dengan indentation
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

    res.status(200).json(response); // Mengirimkan respons
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: "An error occurred while updating the machinetype",
    });
  }
};
