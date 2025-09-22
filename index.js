// require('dotenv').config();
// const express = require('express');
// const pool = require('./db');
// const { generateDeterministicId } = require('./utils');

// const app = express();
// app.use(express.json());

// const PORT = process.env.PORT || 5000;

// app.post('/records', async (req, res) => {
//   const { project_name, registry, vintage, quantity, serial_number } = req.body;
//   if (!project_name || !registry || !vintage || !quantity) {
//     return res.status(400).json({ error: 'project_name, registry, vintage, quantity are required' });
//   }

//   const deterministic_id = generateDeterministicId(req.body);

//   try {
//     // check existing
//     const existing = await pool.query('SELECT * FROM records WHERE deterministic_id = $1', [deterministic_id]);
//     if (existing.rows.length > 0) {
//       return res.status(200).json(existing.rows[0]);
//     }

//     const insertQuery = `
//       INSERT INTO records (deterministic_id, project_name, registry, vintage, quantity, serial_number)
//       VALUES ($1, $2, $3, $4, $5, $6)
//       RETURNING *;
//     `;
//     const result = await pool.query(insertQuery, [
//       deterministic_id,
//       project_name,
//       registry,
//       vintage,
//       quantity,
//       serial_number || null
//     ]);
//     res.status(201).json(result.rows[0]);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });
// app.get('/records/:id', async (req, res) => {
//   const id = req.params.id;
//   console.log('hello');
//   try {
//     const recordRes = await pool.query('SELECT * FROM records WHERE deterministic_id = $1', [id]);
//     console.log('hello',recordRes);
//     if (recordRes.rows.length === 0) return res.status(404).json({ error: 'Record not found' });

//     const eventsRes = await pool.query(
//       'SELECT  event_id,  event_type, event_timestamp FROM events WHERE record_id = $1 ORDER BY event_timestamp ASC',
//       [id]
//     );
//     res.json({ record: recordRes.rows[0], events: eventsRes.rows });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });
// // I added the feature to add dynamically events through the parameterized routes

// app.post('/records/:id/:event', async (req, res) => {
//   const id = req.params.id;
//   const events=req.params.event;
//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');

//     const recordRes = await client.query('SELECT * FROM records WHERE deterministic_id = $1 FOR UPDATE', [id]);
//     if (recordRes.rows.length === 0) {
//       await client.query('ROLLBACK');
//       return res.status(404).json({ error: 'Record not found' });
//     }

//     const retiredCheck = await client.query(
//       'SELECT * FROM events WHERE record_id = $1 AND event_type = $2 LIMIT 1',
//       [id, events]
//     );
//     if (retiredCheck.rows.length > 0) {
//       await client.query('ROLLBACK');
//       return res.status(400).json({ error: 'Record already retired' });
//     }

//     // insert event
//     const insertEvent = `INSERT INTO events (record_id, event_type) VALUES ($1, $2) RETURNING *`;
//     const evRes = await client.query(insertEvent, [id, events]);

//     await client.query('COMMIT');
//     res.status(201).json({ message: `record ${events}`, event: evRes.rows[0] });
//   } catch (err) {
//     await client.query('ROLLBACK');
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   } finally {
//     client.release();
//   }
// });



// app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


require('dotenv').config();
const express = require('express');
const recordsRoutes = require('./routes/recordsRoutes');

const app = express();
app.use(express.json());

// Routes
app.use('/', recordsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
