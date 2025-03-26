// backend/src/controllers/matchController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getMatches = async (req, res) => {
  try {
    const matches = await prisma.match.findMany();
    res.status(200).json(matches);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
