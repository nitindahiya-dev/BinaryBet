// backend/src/controllers/userController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.upsertUser = async (req, res) => {
  const { wallet, username, avatarUrl } = req.body;
  if (!wallet) {
    return res.status(400).json({ error: 'Wallet public key is required' });
  }
  try {
    const user = await prisma.user.upsert({
      where: { wallet },
      update: { username, avatarUrl }, // Do not update balance if user already exists.
      create: { wallet, username, avatarUrl, balance: 10.5 }, // Set starting balance here.
    });
    res.json(user);
  } catch (error) {
    console.error('Error upserting user:', error);
    res.status(500).json({ error: 'Error upserting user' });
  }
};

