// backend/src/routes/bet.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { wallet, matchId, betChoice, amount, outcome, result } = req.body;
  if (!wallet || !matchId || !betChoice || !amount || !outcome) {
    return res.status(400).json({ error: "Missing required bet fields" });
  }
  try {
    // Find the user by wallet
    const user = await prisma.user.findUnique({ where: { wallet } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the match exists; if not, create it.
    let match = await prisma.match.findUnique({
      where: { id: parseInt(matchId) },
    });
    if (!match) {
      match = await prisma.match.create({
        data: {
          id: parseInt(matchId),
          title: `Match ${matchId}`,
          description: "Auto-created match",
          startTime: new Date(),
          status: "upcoming",
        },
      });
    }

    // Create the new bet record
    const newBet = await prisma.bet.create({
      data: {
        userId: user.id,
        matchId: match.id,
        betChoice,
        amount: parseFloat(amount),
        outcome,
        result: parseFloat(result),
      },
    });

    // If the bet outcome is a win, update the user's balance by adding the winnings.
    if (outcome === "Win") {
      await prisma.user.update({
        where: { id: user.id },
        data: { balance: { increment: parseFloat(result) } },
      });
    }

    res.status(201).json(newBet);
  } catch (error) {
    console.error("Error creating bet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  const { wallet } = req.query;
  if (!wallet) return res.status(400).json({ error: "Wallet is required" });
  try {
    const user = await prisma.user.findUnique({ where: { wallet } });
    if (!user) return res.status(404).json({ error: "User not found" });
    const bets = await prisma.bet.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: "desc" },
    });
    res.json({ bets });
  } catch (error) {
    console.error("Error fetching bet history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
