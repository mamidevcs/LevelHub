// api/admin/tags/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Tag adı boş olamaz" }, { status: 400 });
    }

    // Aynı isimde tag varsa hata dönebilir veya yoksa oluşturabiliriz
    const existing = await prisma.tag.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json({ error: "Bu tag zaten var" }, { status: 400 });
    }

    const newTag = await prisma.tag.create({
      data: { name: name.trim() },
    });

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error("Tag oluşturma hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Tag ID gerekli" }, { status: 400 });
    }

    await prisma.tag.delete({ where: { id } });

    return NextResponse.json({ message: "Etiket silindi" });
  } catch (error) {
    console.error("Etiket silme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}