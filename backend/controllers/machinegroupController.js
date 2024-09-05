import pool from "../database/db.js";
import { decryptMessage, encryptMessage } from "../utils/encryptionUtils.js";

// Create a new machine group
export const createMachineGroup = async (req, res) => {
  const { message } = req.body;

  try {
    // Dekripsi pesan yang diterima dari frontend
    const decryptedMessage = decryptMessage(message);
    const { objecttype_id, objectgroup, description, active } =
      JSON.parse(decryptedMessage).record;

    // Insert data ke database
    const insertQuery = `
      INSERT INTO machine.machinegroup (objecttype_id, objectgroup, description, active)
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const result = await pool.query(insertQuery, [
      objecttype_id,
      objectgroup,
      description,
      active,
    ]);

    const insertedData = result.rows[0]; // Data yang berhasil di-insert

    // Membuat objek yang hanya menyertakan field selain 'id'
    const responseData = {
      objecttype_id: insertedData.objecttype_id,
      objectgroup: insertedData.objectgroup,
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
      .json({ error: "An error occurred while creating the machine group" });
  }
};

// Get all machine groups
export const getMachineGroups = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM machine.machinegroup");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching machine groups" });
  }
};

// Update an existing machine group
export const updateMachineGroup = async (req, res) => {
  const { id } = req.params;
  const { objecttype_id, objectgroup, description, active } = req.body;

  try {
    // Check if the machine group exists
    const checkQuery = "SELECT * FROM machine.machinegroup WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Machine group not found" });
    }

    // Update the machine group
    const updateQuery = `
      UPDATE machine.machinegroup SET objecttype_id = $1, objectgroup = $2, description = $3, active = $4
      WHERE id = $5 RETURNING *
    `;
    const result = await pool.query(updateQuery, [
      objecttype_id,
      objectgroup,
      description,
      active,
      id,
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while updating the machine group" });
  }
};
