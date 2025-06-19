import prisma from "@/lib/prisma";
import { debug } from "console";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // İstekten topicId ve yorum içeriğini al
  const { topicId, content } = await req.json();

  // Cookie'den kullanıcı id'sini al
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get("id")?.value;
  const userId = userIdStr ? Number(userIdStr) : null;

  // Kullanıcı giriş yapmamışsa hata dön
  if (!userId) {
    return NextResponse.json({ error: "Giriş yapmalısınız."+ userId }, { status: 401 });
  }

  // Gerekli bilgiler eksikse hata dön
  if (!content || !topicId) {
    return NextResponse.json({ error: "Eksik bilgi." }, { status: 400 });
  }

  try {
    // Yeni yorumu veritabanına kaydet
    const newComment = await prisma.comment.create({
      data: {
        content,
        topicId,
        authorId: userId,
      },
    });

    // Başarılıysa yeni yorumu JSON olarak döndür
    return NextResponse.json(newComment);
  } catch (err) {
    // Hata durumunda mesaj dön
    return NextResponse.json({ error: "Hata oluştu" }, { status: 500 });
  }
}
