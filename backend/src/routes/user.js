// backend/src/routes/user.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const userController = require('../controllers/authController'); // For POST upsert

// POST route to upsert a user
router.post('/', userController.upsertUser);

// GET route to fetch user details and computed stats
router.get('/:wallet', async (req, res) => {
  const { wallet } = req.params;
  console.log('Received request for wallet:', wallet);
  try {
    let user = await prisma.user.findUnique({
      where: { wallet },
      include: { bets: true },
    });
    
    if (!user) {
      console.log('User not found, creating new user for wallet:', wallet);
      user = await prisma.user.create({
        data: {
          wallet,
          username: null,
          avatarUrl: `https://api.dicebear.com/6.x/identicon/svg?seed=${wallet}`,
          balance: 10.5, // starting balance
        },
        include: { bets: true },
      });
    }
    
    const totalBets = user.bets.length;
    const totalWins = user.bets.filter(bet => bet.outcome === 'Win').length;
    const totalLosses = user.bets.filter(bet => bet.outcome === 'Loss').length;
    const totalWagered = user.bets.reduce((acc, bet) => acc + bet.amount, 0);
    const winRate = totalBets ? (totalWins / totalBets) * 100 : 0;
    const availableBalance = user.balance; // Real balance from the DB
  
    res.json({
      user,
      stats: { totalBets, totalWins, totalLosses, totalWagered, winRate, availableBalance },
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
