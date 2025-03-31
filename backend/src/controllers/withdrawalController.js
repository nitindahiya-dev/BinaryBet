// backend/src/controllers/withdrawalController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createWithdrawal = async (req, res) => {
  const { wallet, amount, currency } = req.body;

  // Validate required fields
  if (!wallet || !amount || !currency) {
    return res.status(400).json({ error: 'Missing required withdrawal information' });
  }

  try {
    // Find the user by wallet
    const user = await prisma.user.findUnique({ where: { wallet } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has sufficient balance (make sure user.balance exists and is updated)
    const withdrawalAmount = parseFloat(amount);
    if (user.balance < withdrawalAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct the withdrawal amount from the user's balance
    await prisma.user.update({
      where: { wallet },
      data: { balance: { decrement: withdrawalAmount } },
    });

    // Create the withdrawal record
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: user.id,
        amount: withdrawalAmount,
        currency,
        status: 'pending', // or "completed" if you update it later
      },
    });

    // Optionally, return the updated balance (if your front end needs it)
    // For example: const updatedUser = await prisma.user.findUnique({ where: { wallet } });
    // Then include updatedUser.balance in your response.
    res.status(201).json(withdrawal);
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
