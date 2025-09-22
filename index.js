
require('dotenv').config();
const express = require('express');
const recordsRoutes = require('./routes/recordsRoutes');

const app = express();
app.use(express.json());

// Routes
app.use('/', recordsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
