import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  // URL'den userId parametresini al
  const { searchParams } = new URL(request.url);
  const userId = parseInt(searchParams.get("userId"));

  // Kullanıcının gönderdiği veya aldığı mesajları getir
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
    },
    select: {
      senderId: true,
      receiverId: true,
    },
  });

  // Mesajlardaki karşı taraf kullanıcı id'lerini Set'e ekle
  const contactIds = new Set();

  messages.forEach((m) => {
    if (m.senderId !== userId) contactIds.add(m.senderId);
    if (m.receiverId !== userId) contactIds.add(m.receiverId);
  });

  // Bu id'lere sahip kullanıcı bilgilerini getir
  const contacts = await prisma.user.findMany({
    where: { id: { in: Array.from(contactIds) } },
    select: { id: true, username: true },
  });

  // Bulunan kullanıcıları JSON olarak döndür
  return NextResponse.json({ contacts });
}
