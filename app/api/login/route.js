import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return new Response(JSON.stringify({ error: "Eksik bilgi var" }), { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return new Response(JSON.stringify({ error: "Kullanıcı bulunamadı" }), { status: 404 });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return new Response(JSON.stringify({ error: "Şifre yanlış" }), { status: 401 });
        }

        const res = NextResponse.json({
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email,
            createdAt: user.createdAt
        });

        // Role bilgisini cookie olarak ekle
        res.cookies.set("role", user.role, {
            httpOnly: false,
            path: "/",
            maxAge: 60 * 60 * 24,
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

        return res;

    } catch {
        return new Response(JSON.stringify({ error: "Sunucu hatası" }), { status: 500 });
    }
}
