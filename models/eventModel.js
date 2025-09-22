const pool = require('../db');

async function getEventsByRecordId(id) {
  return pool.query(
    `SELECT event_id, event_type, event_timestamp
     FROM events WHERE record_id = $1 ORDER BY event_timestamp ASC`,
    [id]
  );
}

async function insertEvent(client, recordId, eventType) {
  return client.query(
    'INSERT INTO events (record_id, event_type) VALUES ($1, $2) RETURNING *',
    [recordId, eventType]
  );
}

module.exports = { getEventsByRecordId, insertEvent };
