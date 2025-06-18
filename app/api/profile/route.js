import prisma from "@/lib/prisma";

export async function PUT(req) {
  try {
    const { id, username, email, bio } = await req.json();

    if (!id || !username || !email || !bio) {
      return new Response(JSON.stringify({ error: "Eksik bilgi" }), { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
        NOT: { id },
      },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email veya kullanıcı adı zaten kullanılıyor." }), { status: 409 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { username, email, bio },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        role: true,
        createdAt: true,
      },
    });

    return new Response(JSON.stringify({ message: "Profil güncellendi", user: updatedUser }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Sunucu hatası" }), { status: 500 });
  }
}
