import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";

export async function POST(req) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return new Response(JSON.stringify({ error: "Eksik bilgi var" }), { status: 400 });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: "Kullanıcı zaten var" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "user",
      },
    });

    return new Response(JSON.stringify({ message: "Kayıt başarılı" }), { status: 201 });
  } catch {
    return new Response(JSON.stringify({ error: "Sunucu hatası" }), { status: 500 });
  }
}
