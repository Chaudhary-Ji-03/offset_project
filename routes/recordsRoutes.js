const express = require('express');
const router = express.Router();
const { createRecord, getRecord, addEvent } = require('../controllers/recordsController');

router.post('/records', createRecord);
router.get('/records/:id', getRecord);
router.post('/records/:id/:event', addEvent);

module.exports = router;
