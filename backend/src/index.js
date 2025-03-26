// backend/src/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const matchRoutes = require('./routes/matches');

const app = express();

app.use(cors());
app.use(express.json());

// API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
