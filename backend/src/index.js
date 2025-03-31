// backend/src/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/user');
const betRoutes = require('./routes/bet');
const withdrawalRoutes = require('./routes/withdrawal'); // Ensure this is the correct filename

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/withdrawals', withdrawalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
