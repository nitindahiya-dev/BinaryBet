// backend/src/controllers/matchController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getMatches = async (req, res) => {
  try {
    const matches = await prisma.match.findMany();
    res.json({ matches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};