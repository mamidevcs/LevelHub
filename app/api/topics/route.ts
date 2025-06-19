import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Konu oluşturma
export async function POST(req: Request) {
  const { title, content, tagIds } = await req.json();
  const cookieStore = cookies();
  const userIdStr = cookieStore.get("id")?.value;
  const userId = userIdStr ? Number(userIdStr) : null;

  // Başlık ve içerik kontrolü
  if (!title || !content) {
    return NextResponse.json({ error: "Başlık ve içerik gerekli" }, { status: 400 });
  }

  // Giriş kontrolü
  if (!userId) {
    return NextResponse.json({ error: "Giriş yapılmamış" }, { status: 401 });
  }

  try {
    // Yeni konu oluştur
    const newTopic = await prisma.topic.create({
      data: {
        title,
        content,
        authorId: userId,
        tags: {
          connect: tagIds?.map((id: number) => ({ id })) || [],
        },
      },
    });

    return NextResponse.json(newTopic);
  } catch (err) {
    console.error("Konu oluşturma hatası:", err);
    return NextResponse.json({ error: "Konu oluşturulamadı" }, { status: 500 });
  }
}

// Konu listeleme
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "latest";
  const skip = parseInt(searchParams.get("skip") || "0");
  const take = parseInt(searchParams.get("take") || "5");

  // Varsayılan sıralama ve filtreleme
  let orderBy: any = { createdAt: "desc" };
  let where = {};

  // Popüler konular son 7 gün içinde en çok upvote alanlar
  if (type === "popular") {
    orderBy = {
      upvotes: { _count: "desc" },
    };
    where = {
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    };
  }
  // Tartışmalı konular son 7 gün içinde en çok yorum alanlar
  else if (type === "controversial") {
    orderBy = {
      comments: { _count: "desc" },
    };
    where = {
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    };
  }

  // Konuları getir
  const topics = await prisma.topic.findMany({
    where,
    orderBy,
    skip,
    take,
    include: {
      author: true,
      _count: {
        select: {
          comments: true,
          upvotes: true,
        },
      },
    },
  });

  return NextResponse.json(topics);
}

// Konu silme
export async function DELETE(req: Request) {
  const cookieStore = cookies();
  const userIdStr = cookieStore.get("id")?.value;
  const userId = userIdStr ? Number(userIdStr) : null;

  // Giriş yapılmamışsa hata döndür
  if (!userId) {
    return NextResponse.json({ error: "Giriş yapılmamış" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = Number(body.id);

    // ID kontrolü
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
    }

    // Konuyu bul ve yazarını kontrol et
    const topic = await prisma.topic.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!topic) {
      return NextResponse.json({ error: "Konu bulunamadı" }, { status: 404 });
    }

    // TODO: Eğer istersen, sadece yazar kendi konusunu silebilir diye kontrol ekle
    // if (topic.authorId !== userId) {
    //   return NextResponse.json({ error: "Yetkisiz işlem" }, { status: 403 });
    // }

    // Önce yorumları sil
    await prisma.comment.deleteMany({ where: { topicId: id } });

    // Konuyu sil
    await prisma.topic.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Silme hatası:", err);
    return NextResponse.json(
      { error: "Silme işlemi sırasında hata oluştu" },
      { status: 500 }
    );
  }
}
