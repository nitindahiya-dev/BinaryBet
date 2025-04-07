import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createWithdrawal = async (req, res) => {
  const { wallet, amount, currency } = req.body;
  if (!wallet || amount == null || !currency) {
    return res.status(400).json({ error: 'Missing required withdrawal information' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { wallet } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const withdrawalAmount = parseFloat(amount);
    if (user.balance < withdrawalAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // 1) Deduct balance
    const updatedUser = await prisma.user.update({
      where: { wallet },
      data: { balance: { decrement: withdrawalAmount } },
    });

    // 2) Create withdrawal record
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: updatedUser.id,
        amount: withdrawalAmount,
        currency,
        status: 'pending',
      },
    });

    return res.status(201).json({ withdrawal, updatedBalance: updatedUser.balance });
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
