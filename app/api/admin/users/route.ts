import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });
  return NextResponse.json(users, { status: 200 });
}

export async function PATCH(req: Request) {
  try {
    const { userId, newRole } = await req.json();
    const id = Number(userId);

    if (!id) {
      return NextResponse.json({ error: "Geçersiz kullanıcı ID" }, { status: 400 });
    }

    if (!["admin", "user"].includes(newRole)) {
      return NextResponse.json({ error: "Geçersiz rol" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    if (user.role === "admin") {
      return NextResponse.json({ error: "Admin rolündeki kullanıcıların rolü değiştirilemez" }, { status: 403 });
    }

    await prisma.user.update({
      where: { id },
      data: { role: newRole },
    });

    return NextResponse.json({ message: "Rol güncellendi" }, { status: 200 });
  } catch (error) {
    console.error("PATCH kullanıcı hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}


// DELETE fonksiyonunu, URL'den userId'yi alacak şekilde değiştiriyoruz
// Örneğin: DELETE /api/admin/users?userId=123
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId parametresi eksik" }, { status: 400 });
    }

    const id = Number(userId);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: "Geçersiz kullanıcı ID" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    if (user.role === "admin") {
      return NextResponse.json({ error: "Admin kullanıcılar silinemez" }, { status: 403 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "Kullanıcı silindi" }, { status: 200 });
  } catch (error) {
    console.error("DELETE kullanıcı hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası: " + (error.message || error) }, { status: 500 });
  }
}
