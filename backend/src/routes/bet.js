import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// — GET /api/bets?wallet=<wallet>
router.get('/', async (req, res) => {
  const prisma = new PrismaClient();
  const { wallet } = req.query;
  console.log('GET /api/bets?wallet=', wallet);

  if (!wallet) {
    await prisma.$disconnect();
    return res.status(400).json({ error: 'Wallet is required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { wallet } });
    if (!user) {
      await prisma.$disconnect();
      return res.status(404).json({ error: 'User not found' });
    }

    const bets = await prisma.bet.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: 'desc' },
    });

    return res.json({ bets });
  } catch (err) {
    console.error('Error fetching bet history:', err);
    return res.status(500).json({ error: err.message });
  } finally {
    await prisma.$disconnect();
  }
});

// — POST /api/bets
router.post('/', async (req, res) => {
  const prisma = new PrismaClient();
  const {
    wallet,
    matchId,
    betChoice,
    amount,
    outcome,
    result
  } = req.body;

  console.log('POST /api/bets body:', req.body);

  try {
    const user = await prisma.user.findUnique({ where: { wallet } });
    if (!user) {
      await prisma.$disconnect();
      return res.status(404).json({ error: 'User not found' });
    }

    const parsedAmount = parseFloat(amount);
    const parsedResult = parseFloat(result);

    const bet = await prisma.bet.create({
      data: {
        userId:     user.id,
        matchId:    parseInt(matchId, 10),
        betChoice,
        amount:     parsedAmount,
        outcome,
        result:     parsedResult,
        status:     'PENDING',
        timestamp:  new Date(),
      },
    });

    // Update balance immediately
    let newBalance = user.balance + (outcome === 'Win' ? parsedResult : -parsedAmount);
    await prisma.user.update({
      where: { id: user.id },
      data:  { balance: newBalance },
    });

    return res.status(201).json(bet);
  } catch (err) {
    console.error('Error creating bet:', err);
    return res.status(500).json({ error: err.message });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
