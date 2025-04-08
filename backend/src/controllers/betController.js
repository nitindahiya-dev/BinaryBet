import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function resolveBet(betId, matchOutcome) {
  // Fetch the bet
  const bet = await prisma.bet.findUnique({ where: { id: betId } });
  if (!bet) {
    throw new Error('Bet not found');
  }

  // Check if bet is still pending
  if (bet.status !== 'PENDING') {
    throw new Error('Bet already resolved');
  }

  // Determine if the user won
  const userWon = bet.betChoice === matchOutcome;
  if (userWon) {
    const winnings = bet.amount * 1.95; // Win 1.95 times the bet amount
    await prisma.user.update({
      where: { id: bet.userId },
      data: { balance: { increment: winnings } },
    });
    await prisma.bet.update({
      where: { id: betId },
      data: {
        status: 'WON',
        outcome: matchOutcome,
        result: winnings,
      },
    });
  } else {
    // For a loss, we don't update the balance as it was already deducted when the bet was placed
    await prisma.bet.update({
      where: { id: betId },
      data: {
        status: 'LOST',
        outcome: matchOutcome,
        result: 0,
      },
    });
  }
}

module.exports = { resolveBet };