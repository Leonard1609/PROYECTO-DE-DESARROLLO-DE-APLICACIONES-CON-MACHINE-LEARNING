const express = require('express');
const cors = require('cors');
const citaRoutes = require('./routes/citaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', citaRoutes);

module.exports = app;