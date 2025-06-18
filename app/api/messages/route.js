// app/api/messages/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Mesajları getir
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId1 = parseInt(searchParams.get("userId1"));
  const userId2 = parseInt(searchParams.get("userId2"));

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    },
    orderBy: { id: "asc" },
  });

  return NextResponse.json({ messages });
}

// Mesaj gönder
export async function POST(request) {
  const { content, senderId, receiverId } = await request.json();

  const message = await prisma.message.create({
    data: { content, senderId, receiverId },
  });

  return NextResponse.json({ message });
}