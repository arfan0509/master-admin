import pool from "../database/db.js";
import { decryptMessage, encryptMessage } from "../utils/encryptionUtils.js";

// Fungsi untuk membuat profil mesin
export const createMachineProfile = async (req, res) => {
  const {
    objecttype_id,
    objectgroup_id,
    objectid_id,
    objectcode_id,
    objectstatus,
    objectname,
    description,
    registereddate,
    registeredno,
    registeredby,
    countryoforigin,
    dob,
    sex,
    documentno,
    vendor_id, // Ubah kolom 'vendor' menjadi 'vendor_id'
    notes,
    photogalery_1,
    photogalery_2,
    photogalery_3,
    photogalery_4,
    photogalery_5,
    video,
    active,
  } = req.body;

  try {
    const insertQuery = `
      INSERT INTO machine.machineprofile (
        objecttype_id, objectgroup_id, objectid_id, objectcode_id, objectstatus, objectname,
        description, registereddate, registeredno, registeredby, countryoforigin, dob,
        sex, documentno, vendor_id, notes, photogalery_1, photogalery_2, photogalery_3,
        photogalery_4, photogalery_5, video, active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      RETURNING *
    `;
    const result = await pool.query(insertQuery, [
      objecttype_id,
      objectgroup_id,
      objectid_id,
      objectcode_id,
      objectstatus,
      objectname,
      description,
      registereddate,
      registeredno,
      registeredby,
      countryoforigin,
      dob,
      sex,
      documentno,
      vendor_id, // Ubah kolom 'vendor' menjadi 'vendor_id'
      notes,
      photogalery_1,
      photogalery_2,
      photogalery_3,
      photogalery_4,
      photogalery_5,
      video,
      active,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err.message);
    res
      .status(500)
      .json({ error: "An error occurred while creating the machine profile" });
  }
};

// Fungsi untuk mendapatkan semua profil mesin
export const getMachineProfiles = async (req, res) => {
  try {
    const query = `
      SELECT 
        mp.id, 
        mp.objecttype_id, 
        mt.objecttype AS objecttype_name, -- Nama dari objecttype
        mp.objectgroup_id, 
        mg.objectgroup AS objectgroup_name, -- Nama dari objectgroup
        mp.objectid_id, 
        mi.objectid AS objectid_name, -- Nama dari objectid
        mp.objectcode_id, 
        md.objectcode AS objectcode_name, -- Nama dari objectcode
        mp.objectstatus, 
        mp.objectname, 
        mp.description, 
        mp.registereddate, 
        mp.registeredno, 
        mp.registeredby, 
        mp.countryoforigin, 
        mp.dob, 
        mp.sex, 
        mp.documentno, 
        v.name AS vendor_name, -- Nama vendor
        mp.notes, 
        mp.photogalery_1, 
        mp.photogalery_2, 
        mp.photogalery_3, 
        mp.photogalery_4, 
        mp.photogalery_5, 
        mp.video, 
        mp.active
      FROM machine.machineprofile mp
      LEFT JOIN machine.vendor v ON mp.vendor_id = v.id
      LEFT JOIN machine.machinetype mt ON mp.objecttype_id = mt.id
      LEFT JOIN machine.machinegroup mg ON mp.objectgroup_id = mg.id
      LEFT JOIN machine.machineid mi ON mp.objectid_id = mi.id
      LEFT JOIN machine.machinedetail md ON mp.objectcode_id = md.id;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching machine profiles" });
  }
};

// Fungsi untuk mendapatkan profil mesin berdasarkan ID
export const getMachineProfileById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM machine.machineprofile WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Machine profile not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the machine profile" });
  }
};

// Update an existing machine profile
export const updateMachineProfile = async (req, res) => {
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
      objectcode_id,
      objectstatus,
      objectname,
      description,
      registereddate,
      registeredno,
      registeredby,
      countryoforigin,
      dob,
      sex,
      documentno,
      vendor_id,
      notes,
      photogalery_1,
      photogalery_2,
      photogalery_3,
      photogalery_4,
      photogalery_5,
      video,
      active,
    } = record;
    const { id } = condition; // Mengambil ID dari condition

    // Update data ke database berdasarkan ID
    const updateQuery = `
      UPDATE machine.machineprofile SET
        objecttype_id = $1, objectgroup_id = $2, objectid_id = $3, objectcode_id = $4,
        objectstatus = $5, objectname = $6, description = $7, registereddate = $8,
        registeredno = $9, registeredby = $10, countryoforigin = $11, dob = $12,
        sex = $13, documentno = $14, vendor_id = $15, notes = $16, photogalery_1 = $17,
        photogalery_2 = $18, photogalery_3 = $19, photogalery_4 = $20, photogalery_5 = $21,
        video = $22, active = $23
      WHERE id = $24 RETURNING *
    `;
    const result = await pool.query(updateQuery, [
      objecttype_id,
      objectgroup_id,
      objectid_id,
      objectcode_id,
      objectstatus,
      objectname,
      description,
      registereddate,
      registeredno,
      registeredby,
      countryoforigin,
      dob,
      sex,
      documentno,
      vendor_id,
      notes,
      photogalery_1,
      photogalery_2,
      photogalery_3,
      photogalery_4,
      photogalery_5,
      video,
      active,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Machine profile not found" });
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
  } catch (err) {
    console.error("Error updating machine profile:", err);
    res.status(500).json({ error: "Failed to update machine profile" });
  }
};
