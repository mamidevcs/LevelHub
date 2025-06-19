// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        username: `user${i}`,
        email: `user${i}@m.c`,
        password: "123",
      },
    });

    for (let j = 1; j <= 2; j++) {
      const topic = await prisma.topic.create({
        data: {
          title: `Konu ${j} - ${user.username}`,
          content: "Bu bir test konusudur.",
          authorId: user.id,
        },
      });

      // 2 yorum ekle
      for (let k = 1; k <= 2; k++) {
        const commenter = await prisma.user.findFirst({ where: { id: { not: user.id } } });
        if (commenter) {
          await prisma.comment.create({
            data: {
              content: "Test yorumu",
              topicId: topic.id,
              authorId: commenter.id,
            },
          });

          // upvote
          await prisma.user.update({
            where: { id: commenter.id },
            data: {
              upvotedTopics: { connect: { id: topic.id } },
            },
          });
        }
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
