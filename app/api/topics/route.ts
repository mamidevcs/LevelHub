import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Konu oluşturma

export async function POST(req: Request) {
  const { title, content, tagIds } = await req.json();
  const cookieStore = cookies();
  const userIdStr = cookieStore.get("id")?.value;
  const userId = userIdStr ? Number(userIdStr) : null;

  if (!title || !content) {
    return NextResponse.json({ error: "Başlık ve içerik gerekli" }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ error: "Giriş yapılmamış" }, { status: 401 });
  }

  try {
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

  let orderBy: any = { createdAt: "desc" };
  let where = {};

  if (type === "popular") {
    orderBy = {
      upvotes: { _count: "desc" },
    };
    where = {
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    };
  } else if (type === "controversial") {
    orderBy = {
      comments: { _count: "desc" },
    };
    where = {
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    };
  }

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

  if (!userId) {
    return NextResponse.json({ error: "Giriş yapılmamış" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = Number(body.id);

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
    }

    // First check if the topic exists and user is the author
    const topic = await prisma.topic.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!topic) {
      return NextResponse.json({ error: "Konu bulunamadı" }, { status: 404 });
    }


    // Delete related records first if needed (comments, upvotes)
    await prisma.comment.deleteMany({ where: { topicId: id } });

    // Then delete the topic
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