// api/admin/tags/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // İstekten tag adını al
    const { name } = await req.json();

    // Boş veya sadece boşluk içeren tag adı kontrolü
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Tag adı boş olamaz" }, { status: 400 });
    }

    // Aynı isimde tag var mı kontrol et
    const existing = await prisma.tag.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json({ error: "Bu tag zaten var" }, { status: 400 });
    }

    // Yeni tag oluştur
    const newTag = await prisma.tag.create({
      data: { name: name.trim() },
    });

    // Başarıyla oluşturuldu bilgisi ve 201 döndür
    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error("Tag oluşturma hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // İstekten silinecek tag id'sini al
    const { id } = await req.json();

    // id kontrolü
    if (!id) {
      return NextResponse.json({ error: "Tag ID gerekli" }, { status: 400 });
    }

    // Tag'ı sil
    await prisma.tag.delete({ where: { id } });

    // Silme işlemi başarılı mesajı
    return NextResponse.json({ message: "Etiket silindi" });
  } catch (error) {
    console.error("Etiket silme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
