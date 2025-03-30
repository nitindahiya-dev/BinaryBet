// backend/src/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

const betRoutes = require('./routes/bet');
app.use('/api/bets', betRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));