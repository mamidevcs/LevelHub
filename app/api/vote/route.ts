// app/api/vote/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  // Allow voteType to be 'NONE' for un-voting
  const { topicId, voteType }: { topicId: number; voteType: "UPVOTE" | "DOWNVOTE" | "NONE" } = body;

  const userIdCookie = cookies().get("id");

  if (!userIdCookie || !userIdCookie.value || !topicId || !voteType) {
    return NextResponse.json({ error: "Eksik bilgi (Missing Information)" }, { status: 400 });
  }

  const userId = parseInt(userIdCookie.value);

  try {
    console.log("API vote çağrıldı (API vote called)");
    console.log("Tüm cookie’ler (All cookies):", cookies().getAll());
    console.log("Alınan oy tipi (Received vote type):", voteType); // Log the received voteType

    await prisma.$transaction(async (tx) => {
      // First, always remove any existing upvote or downvote from this user for this topic
      // This is crucial for both changing votes and un-voting
      await tx.topic.update({
        where: { id: topicId },
        data: {
          upvotes: { disconnect: { id: userId } },
          downvotes: { disconnect: { id: userId } },
        },
      });

      // Then, add the new vote ONLY if voteType is not "NONE"
      if (voteType === "UPVOTE") {
        await tx.topic.update({
          where: { id: topicId },
          data: { upvotes: { connect: { id: userId } } },
        });
      } else if (voteType === "DOWNVOTE") {
        await tx.topic.update({
          where: { id: topicId },
          data: { downvotes: { connect: { id: userId } } },
        });
      }
      // If voteType is "NONE", no 'connect' operation is performed,
      // effectively leaving the vote removed by the 'disconnect' step.
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Vote error:", err);
    return NextResponse.json({ error: "Sunucu hatası (Server Error)" }, { status: 500 });
  }
}