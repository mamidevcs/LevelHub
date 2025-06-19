import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";

export async function POST(req) {
  // İstek gövdesinden username, email ve password'u al
  const { username, email, password } = await req.json();

  // Eğer eksik bilgi varsa hata döndür
  if (!username || !email || !password) {
    return new Response(JSON.stringify({ error: "Eksik bilgi var" }), { status: 400 });
  }

  try {
    // Aynı email veya kullanıcı adı ile kayıtlı kullanıcı var mı kontrol et
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    // Kullanıcı varsa hata döndür
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Kullanıcı zaten var" }), { status: 400 });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur ve veritabanına kaydet
    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "user",
      },
    });

    // Başarılı yanıt döndür
    return new Response(JSON.stringify({ message: "Kayıt başarılı" }), { status: 201 });
  } catch {
    // Hata varsa sunucu hatası döndür
    return new Response(JSON.stringify({ error: "Sunucu hatası" }), { status: 500 });
  }
}
