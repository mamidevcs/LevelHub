import prisma from "@/lib/prisma";

export async function PUT(req) {
  try {
    // İstek gövdesinden güncellenecek bilgileri al
    const { id, username, email, bio } = await req.json();

    // Eksik bilgi varsa hata döndür
    if (!id || !username || !email || !bio) {
      return new Response(JSON.stringify({ error: "Eksik bilgi" }), { status: 400 });
    }

    // Aynı email veya kullanıcı adına sahip ama farklı id'li kullanıcı var mı kontrol et
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
        NOT: { id }, // Kendisi hariç
      },
    });

    // Böyle bir kullanıcı varsa çakışma hatası döndür
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email veya kullanıcı adı zaten kullanılıyor." }), { status: 409 });
    }

    // Kullanıcı bilgilerini güncelle ve seçilen alanları döndür
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

    // Başarılı yanıt döndür
    return new Response(JSON.stringify({ message: "Profil güncellendi", user: updatedUser }), { status: 200 });
  } catch (error) {
    // Hata varsa sunucu hatası döndür
    return new Response(JSON.stringify({ error: "Sunucu hatası" }), { status: 500 });
  }
}
