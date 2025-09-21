-- records: deterministic_id is PRIMARY KEY so we can use it as resource id
CREATE TABLE IF NOT EXISTS records (
  deterministic_id VARCHAR(255) PRIMARY KEY,
  project_name TEXT NOT NULL,
  registry VARCHAR(50) NOT NULL,
  vintage INT NOT NULL,
  quantity INT NOT NULL,
  serial_number VARCHAR(50)
);

-- events: log of operations for each record
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  record_deterministic_id VARCHAR(255) REFERENCES records(deterministic_id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: index on events.record_deterministic_id for faster queries
CREATE INDEX IF NOT EXISTS idx_events_record ON events(record_deterministic_id);
