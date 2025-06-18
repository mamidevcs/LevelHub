// api/topics/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

// api/topics/[id]/route.ts (GET fonksiyonu içinde)
export async function GET(req: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);

    const topic = await prisma.topic.findUnique({
        where: { id },
        select: { // Sadece istediğimiz alanları seçiyoruz
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

// Konu güncelleme için:
// api/topics/[id]/route.ts (PUT fonksiyonu içinde)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const { title, content, tagIds } = await req.json();

  const updated = await prisma.topic.update({
    where: { id },
    data: {
      title,
      content,
      tags: {
        set: tagIds?.map((tagId: number) => ({ id: tagId })) || [],
      },
    },
  });

  return NextResponse.json(updated);
}
