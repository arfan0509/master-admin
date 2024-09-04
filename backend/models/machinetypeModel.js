// import pool from '../database/db.js';

// export const insertMachinetype = async (objecttype, description, active) => {
//   const query = `
//     INSERT INTO machine.machinetype (objecttype, description, active)
//     VALUES ($1, $2, $3)
//     RETURNING *;
//   `;

//   const values = [objecttype, description, active];

//   try {
//     const result = await pool.query(query, values);
//     return result.rows[0];
//   } catch (error) {
//     throw error;
//   }
// };
