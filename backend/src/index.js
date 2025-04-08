import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import authRoutes       from './routes/auth.js';
import matchesRoutes    from './routes/matches.js';
import betRoutes        from './routes/bet.js';
import userRoutes       from './routes/user.js';
import withdrawalRoutes from './routes/withdrawal.js';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Test DB connection
(async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
})();

const allowedOrigins = [
  'https://binary-bettting.vercel.app', 
  'http://localhost:3000',   
];

app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.options('*', cors()); // Handle preflight requests

// Parse JSON bodies
app.use(bodyParser.json());

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/', (req, res) => res.send('BinaryBet Backend is running!'));

// Mount routes
app.use('/api/auth',        authRoutes);
app.use('/api/matches',     matchesRoutes);
app.use('/api/bets',        betRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/withdrawals', withdrawalRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});