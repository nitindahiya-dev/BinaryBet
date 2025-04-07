import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET /api/users/:wallet/activities?page=1&limit=5
export const getUserActivities = async (req, res) => {
  const { wallet } = req.params;
  const page  = parseInt(req.query.page,  10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const offset = (page - 1) * limit;

  try {
    const user = await prisma.user.findUnique({
      where: { wallet },
      include: {
        bets:       true,
        withdrawals:true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // map bets & withdrawals to a common shape
    const betActs = user.bets.map(bet => ({
      type:      'bet',
      title:     `Bet Placed – ${bet.betChoice} (${bet.outcome})`,
      amount:    bet.outcome === 'Win' ? `+${bet.result}` : `-${bet.amount}`,
      timestamp: bet.timestamp,
    }));
    const wdActs  = user.withdrawals.map(wd => ({
      type:      'withdrawal',
      title:     'Withdrawal Processed',
      amount:    `-${wd.amount}`,
      timestamp: wd.createdAt,
    }));

    // combine, sort descending, paginate
    const allActs = [...betActs, ...wdActs]
      .sort((a, b) => b.timestamp - a.timestamp);

    const paged   = allActs.slice(offset, offset + limit);
    const hasMore = offset + limit < allActs.length;

    return res.json({ activities: paged, hasMore });
  } catch (err) {
    console.error('Error fetching activities:', err);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};

// GET /api/users/:wallet  → returns { user, stats }
export const getUser = async (req, res) => {
  const { wallet } = req.params;

  try {
    let user = await prisma.user.findUnique({
      where:  { wallet },
      include: { bets: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          wallet,
          username:  null,
          avatarUrl: `https://api.dicebear.com/6.x/identicon/svg?seed=${wallet}`,
          balance:   10.5,
        },
        include: { bets: true },
      });
    }

    const totalBets       = user.bets.length;
    const totalWins       = user.bets.filter(b => b.outcome === 'Win').length;
    const totalLosses     = user.bets.filter(b => b.outcome === 'Loss').length;
    const totalWagered    = user.bets.reduce((sum, b) => sum + b.amount, 0);
    const winRate         = totalBets ? (totalWins / totalBets) * 100 : 0;
    const availableBalance= user.balance;

    return res.json({
      user,
      stats: { totalBets, totalWins, totalLosses, totalWagered, winRate, availableBalance }
    });
  } catch (err) {
    console.error('💥 Error in GET /api/users/:wallet →', err);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};
