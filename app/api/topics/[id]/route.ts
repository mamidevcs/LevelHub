// api/topics/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

// GET: Belirli bir konuyu getirir
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  const topic = await prisma.topic.findUnique({
    where: { id },
    select: { // İstenen alanları seçiyoruz
      id: true,
      title: true,
      content: true,
      tags: true,
      authorId: true,
    },
  });

  if (!topic) {
    return NextResponse.json({ message: "Konu bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(topic);
}

// PUT: Konu güncelleme işlemi
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const { title, content, tagIds } = await req.json();

  // Konuyu güncelle
  const updated = await prisma.topic.update({
    where: { id },
    data: {
      title,
      content,
      tags: {
        // Var olan etiketleri temizleyip yeni etiketleri ayarla
        set: tagIds?.map((tagId: number) => ({ id: tagId })) || [],
      },
    },
  });

  return NextResponse.json(updated);
}
