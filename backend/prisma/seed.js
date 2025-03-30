// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.match.createMany({
    data: [
      {
        id: 1, // you can explicitly set IDs if your schema allows
        title: 'Match 1',
        description: 'Live match event',
        startTime: new Date('2023-10-05T15:00:00Z'),
        status: 'live',
      },
      {
        id: 2,
        title: 'Match 2',
        description: 'Upcoming match event',
        startTime: new Date('2023-10-05T15:30:00Z'),
        status: 'upcoming',
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
