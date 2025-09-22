Offset Backend Exercise – Ritik Kumar Choudhary

Reflection Questions & Answers

Q). How did you design the ID so it’s always the same for the same input?

=> The motive was to design the ID such that it wil remain same on giving the same input the most appropriate thing that comes in my mind is using hashing algorithm since the one thing about the hashing is depends upon the input and will create the same fix length hash on giving the same input.
To use this functionality i have used crypto(core module) and used the algoritm 'sha256' and digest is 'hex'.That's how i implemented this feature.

Q). Why did you use an event log instead of updating the record directly?

=> There are the few reasons to use the event log insetead of updating the record directly, some of them are as:

1. Having the event log makes the record more maintainable and easy to interpret.
2. One record can have multiple events associated with it so it could be messier if we update the record directly instead of using event log.
3. Event log enables handling the event seperately insetead of trying to update the record hence more modular and seperation of concern design.

Q). If two people tried to retire the same credit at the same time, what would break?
How would you fix it?

=> If two people tried to retire the same credit at the same time, it would give you the error like that record has already retired because it should be unique per the record_id so that would break the normal flow of the application to fix that i have created the event record in which i refrenced the user id such that each event is marked per user rather than event itself its fixes the issue of the two people trying to retire the same credit since now each user can do that seperately without breaking the application.

1️⃣ Overview

This project is a small REST API ledger for carbon credits. It allows:

Creating carbon credit records with deterministic IDs.

Tracking events (like “created” and “retired”) in an append-only log.

Retrieving a record along with its full event history.

Built using Node.js + Express + PostgreSQL.

2️⃣ Tech Stack

Backend: Node.js, Express.js

Database: PostgreSQL (via pg pool)

Hashing: Node.js crypto module (sha256) for deterministic IDs

3️⃣ API Endpoints
Method Endpoint Description
POST /records Create a record
GET /records/:id Fetch record + events
POST /records/:id/:event Add an event (e.g., retire a record)
Example: Create a Record
curl -X POST http://localhost:5000/records \
-H "Content-Type: application/json" \
-d '{
"project_name": "Acme Reforestation",
"registry": "VCS",
"vintage": 2021,
"quantity": 10
}'

Example: Retire a Record
curl -X POST http://localhost:5000/records/<deterministic_id>/retired

Example: Get Record with Events
curl http://localhost:5000/records/<deterministic_id>

4️⃣ Database Design

records table:

deterministic_id (primary key, sha256 hash)

project_name, registry, vintage, quantity

serial_number (optional)

events table:

event_id (primary key)

record_id (references records.deterministic_id)

event_type (e.g., created, retired)

event_timestamp (timestamp)

5️⃣ How the Deterministic ID Works

The deterministic ID is generated using SHA-256 hashing of the key record fields:

`${project_name}-${registry}-${vintage}-${quantity}-${serial_number?}`

- Same input → same deterministic ID

- Different input → different ID

- The id column (primary key) is set to the deterministic ID, ensuring uniqueness.

Why both id and deterministic_id?

- id is the primary key required by the database.

- deterministic_id is used consistently in the code for lookups and event tracking.

This setup guarantees the primary key is never violated, even if the same input is submitted multiple times — the controller returns the existing record instead of inserting a duplicat
