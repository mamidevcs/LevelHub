import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = parseInt(searchParams.get("userId"));

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

  const contactIds = new Set();

  messages.forEach((m) => {
    if (m.senderId !== userId) contactIds.add(m.senderId);
    if (m.receiverId !== userId) contactIds.add(m.receiverId);
  });

  const contacts = await prisma.user.findMany({
    where: { id: { in: Array.from(contactIds) } },
    select: { id: true, username: true },
  });

  return NextResponse.json({ contacts });
}
