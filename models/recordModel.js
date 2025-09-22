const pool = require('../db');

async function getRecordById(id) {
  return pool.query('SELECT * FROM records WHERE deterministic_id = $1', [id]);
}

async function insertRecord({ id, deterministic_id, project_name, registry, vintage, quantity, serial_number }) {
  return pool.query(
    `INSERT INTO records (id, deterministic_id, project_name, registry, vintage, quantity, serial_number)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [id, deterministic_id, project_name, registry, vintage, quantity, serial_number]
  );
}

module.exports = { getRecordById, insertRecord };
