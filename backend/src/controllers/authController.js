// backend/src/controllers/authController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Add hashing for password in production
    const user = await prisma.user.create({ data: { email, password } });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // In production, return a token or session
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
