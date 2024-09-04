import pool from "../database/db.js";

export const createMachineGroup = async (req, res) => {
  const { objecttype_id, objectgroup, description, active } = req.body;

  try {
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
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while creating the machine group" });
  }
};

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

export const updateMachineGroup = async (req, res) => {
  const { id } = req.params;
  const { objecttype_id, objectgroup, description, active } = req.body;

  try {
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

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Machine group not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while updating the machine group" });
  }
};
