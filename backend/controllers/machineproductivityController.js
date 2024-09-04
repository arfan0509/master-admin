import pool from "../database/db.js";

export const createMachineProductivity = async (req, res) => {
  const {
    objecttype_id,
    objectgroup_id,
    objectid_id,
    objectcode_id,
    outputcapacity,
    outputuom,
    outputtime,
    outputcost,
    startdate,
    enddate,
    objectstatus,
  } = req.body;

  try {
    const insertQuery = `
      INSERT INTO machine.machineproductivity (objecttype_id, objectgroup_id, objectid_id, objectcode_id, outputcapacity, outputuom, outputtime, outputcost, startdate, enddate, objectstatus)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
    `;
    const result = await pool.query(insertQuery, [
      objecttype_id,
      objectgroup_id,
      objectid_id,
      objectcode_id,
      outputcapacity,
      outputuom,
      outputtime,
      outputcost,
      startdate,
      enddate,
      objectstatus,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({
        error: "An error occurred while creating the machine productivity",
      });
  }
};

export const getMachineProductivity = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM machine.machineproductivity"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching machine productivity data",
      });
  }
};

export const updateMachineProductivity = async (req, res) => {
  const { id } = req.params;
  const {
    objecttype_id,
    objectgroup_id,
    objectid_id,
    objectcode_id,
    outputcapacity,
    outputuom,
    outputtime,
    outputcost,
    startdate,
    enddate,
    objectstatus,
  } = req.body;

  try {
    const updateQuery = `
      UPDATE machine.machineproductivity SET objecttype_id = $1, objectgroup_id = $2, objectid_id = $3, objectcode_id = $4, outputcapacity = $5, outputuom = $6, outputtime = $7, outputcost = $8, startdate = $9, enddate = $10, objectstatus = $11
      WHERE id = $12 RETURNING *
    `;
    const result = await pool.query(updateQuery, [
      objecttype_id,
      objectgroup_id,
      objectid_id,
      objectcode_id,
      outputcapacity,
      outputuom,
      outputtime,
      outputcost,
      startdate,
      enddate,
      objectstatus,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Machine productivity not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({
        error: "An error occurred while updating the machine productivity",
      });
  }
};
