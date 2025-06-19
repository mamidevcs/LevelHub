import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  // Oy türü 'UPVOTE', 'DOWNVOTE' veya 'NONE' olabilir (NONE oy kaldırmak için)
  const { topicId, voteType }: { topicId: number; voteType: "UPVOTE" | "DOWNVOTE" | "NONE" } = body;

  // Kullanıcı ID'sini cookie'den alıyoruz
  const userIdCookie = cookies().get("id");

  // Gerekli bilgilerden biri eksikse hata dön
  if (!userIdCookie || !userIdCookie.value || !topicId || !voteType) {
    return NextResponse.json({ error: "Eksik bilgi (Missing Information)" }, { status: 400 });
  }

  const userId = parseInt(userIdCookie.value);

  try {
    console.log("API vote çağrıldı (API vote called)");
    console.log("Tüm cookie’ler (All cookies):", cookies().getAll());
    console.log("Alınan oy tipi (Received vote type):", voteType); // Oy türünü logluyoruz

    await prisma.$transaction(async (tx) => {
      // Önce var olan oyları kaldır (hem upvote hem downvote)
      await tx.topic.update({
        where: { id: topicId },
        data: {
          upvotes: { disconnect: { id: userId } },
          downvotes: { disconnect: { id: userId } },
        },
      });

      // Eğer oy türü NONE değilse yeni oyu ekle
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
      // NONE ise oy kaldırılmış olur, yeni bağlantı yapılmaz
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Vote error:", err);
    return NextResponse.json({ error: "Sunucu hatası (Server Error)" }, { status: 500 });
  }
}
