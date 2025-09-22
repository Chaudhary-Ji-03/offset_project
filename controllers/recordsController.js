const pool = require('../db');
const { getRecordById, insertRecord } = require('../models/recordModel');
const { getEventsByRecordId, insertEvent } = require('../models/eventModel');
const generateDeterministicId = require('../utils/generateDeterministicId');

async function createRecord(req, res) {
  const { project_name, registry, vintage, quantity, serial_number } = req.body;
  if (!project_name || !registry || !vintage || !quantity)
    return res.status(400).json({ error: 'Missing required fields' });

  const deterministic_id = generateDeterministicId(req.body);

  try {
    const existing = await getRecordById(deterministic_id);
    if (existing.rows.length > 0) return res.status(200).json(existing.rows[0]);

    const result = await insertRecord({
      id: deterministic_id,
      project_name,
      registry,
      vintage,
      quantity,
      serial_number: serial_number || null
    });

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function getRecord(req, res) {
  const id = req.params.id;
  try {
    const recordRes = await getRecordById(id);
    if (recordRes.rows.length === 0)
      return res.status(404).json({ error: 'Record not found' });

    const eventsRes = await getEventsByRecordId(id);
    res.json({ record: recordRes.rows[0], events: eventsRes.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function addEvent(req, res) {
  const id = req.params.id;
  const eventType = req.params.event;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const recordRes = await client.query(
      'SELECT * FROM records WHERE deterministic_id = $1 FOR UPDATE',
      [id]
    );
    if (recordRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Record not found' });
    }

    const retiredCheck = await client.query(
      'SELECT * FROM events WHERE record_id = $1 AND event_type = $2 LIMIT 1',
      [id, eventType]
    );
    if (retiredCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Already retired' });
    }

    const evRes = await insertEvent(client, id, eventType);

    await client.query('COMMIT');
    res.status(201).json({ message: `record ${eventType}`, event: evRes.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}

module.exports = { createRecord, getRecord, addEvent };
