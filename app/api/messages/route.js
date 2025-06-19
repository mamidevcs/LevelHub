// app/api/messages/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Mesajları getir
export async function GET(request) {
  // URL'den sorgu parametrelerini al
  const { searchParams } = new URL(request.url);
  const userId1 = parseInt(searchParams.get("userId1"));
  const userId2 = parseInt(searchParams.get("userId2"));

  // İki kullanıcı arasındaki tüm mesajları getir (gönderen ve alıcı olarak her iki yönde)
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    },
    orderBy: { id: "asc" }, // Mesajları ID'ye göre sıralı getir (eski mesajlar önce)
  });

  // Mesajları JSON olarak döndür
  return NextResponse.json({ messages });
}

// Mesaj gönder
export async function POST(request) {
  // İstek gövdesinden mesaj içeriği ve kullanıcı ID'lerini al
  const { content, senderId, receiverId } = await request.json();

  // Yeni mesajı veritabanına kaydet
  const message = await prisma.message.create({
    data: { content, senderId, receiverId },
  });

  // Oluşturulan mesajı JSON olarak döndür
  return NextResponse.json({ message });
}
