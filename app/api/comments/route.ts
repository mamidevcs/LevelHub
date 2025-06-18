import prisma from "@/lib/prisma";
import { debug } from "console";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { topicId, content } = await req.json();
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get("id")?.value;
  const userId = userIdStr ? Number(userIdStr) : null;

  if (!userId) {
    return NextResponse.json({ error: "Giriş yapmalısınız."+ userId }, { status: 401 });
  }

  if (!content || !topicId) {
    return NextResponse.json({ error: "Eksik bilgi." }, { status: 400 });
  }
  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        topicId,
        authorId: userId,
      },
    });
    return NextResponse.json(newComment);
  } catch (err) {
    return NextResponse.json({ error: "Hata oluştu" }, { status: 500 });
  }
}
