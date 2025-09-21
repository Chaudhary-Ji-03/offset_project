require('dotenv').config();
const fs = require('fs');
const pool = require('./db');
const { generateDeterministicId } = require('./utils');

async function seed() {
  const data = JSON.parse(fs.readFileSync('sample_data.json', 'utf8'));

  for (const rec of data) {
    const deterministic_id = generateDeterministicId(rec);
    const id = deterministic_id; 

    try {
      const existing = await pool.query(
        'SELECT * FROM records WHERE deterministic_id = $1',
        [deterministic_id]
      );
      if (existing.rows.length > 0) {
        console.log(`Skipped (exists): ${rec.project_name}`);
        continue;
      }

      const q = `INSERT INTO records (id, deterministic_id, project_name, registry, vintage, quantity, serial_number)
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

      const result = await pool.query(q, [
        id,
        deterministic_id,
        rec.project_name,
        rec.registry,
        rec.vintage,
        rec.quantity,
        rec.serial_number || null
      ]);

      console.log('Inserted:', result.rows[0].project_name);
    } catch (err) {
      console.error('Error seeding', rec.project_name, err.message);
    }
  }

  await pool.end();
  console.log('Seeding done');
}

seed();
