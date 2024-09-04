import pool from "../database/db.js";

export const createMachineRecord = async (req, res) => {
  const {
    objecttype_id,
    objectgroup_id,
    objectid_id,
    objectcode_id,
    recorddate,
    recordtime,
    recordtype,
    recorddetails,
    active,
  } = req.body;

  try {
    const insertQuery = `
      INSERT INTO machine.machinerecords (objecttype_id, objectgroup_id, objectid_id, objectcode_id, recorddate, recordtime, recordtype, recorddetails, active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
    `;
    const result = await pool.query(insertQuery, [
      objecttype_id,
      objectgroup_id,
      objectid_id,
      objectcode_id,
      recorddate,
      recordtime,
      recordtype,
      recorddetails,
      active,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while creating the machine record" });
  }
};

export const getMachineRecords = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM machine.machinerecords");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching machine records" });
  }
};

export const updateMachineRecord = async (req, res) => {
  const { id } = req.params;
  const {
    objecttype_id,
    objectgroup_id,
    objectid_id,
    objectcode_id,
    recorddate,
    recordtime,
    recordtype,
    recorddetails,
    active,
  } = req.body;

  try {
    const updateQuery = `
      UPDATE machine.machinerecords SET objecttype_id = $1, objectgroup_id = $2, objectid_id = $3, objectcode_id = $4, recorddate = $5, recordtime = $6, recordtype = $7, recorddetails = $8, active = $9
      WHERE id = $10 RETURNING *
    `;
    const result = await pool.query(updateQuery, [
      objecttype_id,
      objectgroup_id,
      objectid_id,
      objectcode_id,
      recorddate,
      recordtime,
      recordtype,
      recorddetails,
      active,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Machine record not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while updating the machine record" });
  }
};
