import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
    // İstekten email ve şifre bilgilerini al
    const { email, password } = await req.json();

    // Gerekli bilgiler yoksa hata döndür
    if (!email || !password) {
        return new Response(JSON.stringify({ error: "Eksik bilgi var" }), { status: 400 });
    }

    try {
        // Email ile kullanıcıyı bul
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Kullanıcı yoksa hata döndür
        if (!user) {
            return new Response(JSON.stringify({ error: "Kullanıcı bulunamadı" }), { status: 404 });
        }

        // Şifreyi karşılaştır
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return new Response(JSON.stringify({ error: "Şifre yanlış" }), { status: 401 });
        }

        // Başarılı girişte kullanıcı bilgilerini JSON olarak döndür
        const res = NextResponse.json({
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email,
            createdAt: user.createdAt
        });

        // Role, username, id ve createdAt bilgilerini cookie olarak ayarla
        res.cookies.set("role", user.role, {
            httpOnly: false,
            path: "/",
            maxAge: 60 * 60 * 24, // 1 gün
        });
        res.cookies.set("username", user.username, {
            httpOnly: false,
            path: "/",
            maxAge: 60 * 60 * 24,
        });
        res.cookies.set("id", user.id, {
            httpOnly: false,
            path: "/",
            maxAge: 60 * 60 * 24,
        });
        res.cookies.set("createdAt", user.createdAt, {
            httpOnly: false,
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        // Yanıtı döndür
        return res;

    } catch {
        // Sunucu hatası durumunda hata mesajı döndür
        return new Response(JSON.stringify({ error: "Sunucu hatası" }), { status: 500 });
    }
}
