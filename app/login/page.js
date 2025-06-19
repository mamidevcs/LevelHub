"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FaEnvelope, FaLock, FaArrowRight, FaExclamationTriangle } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Form gönderildiğinde çalışan fonksiyon
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // API'ye giriş isteği gönder
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Hata varsa yakala
        throw new Error(data.error || "Giriş sırasında bir hata oluştu");
      }

      // Giriş başarılıysa localStorage'a kaydet ve anasayfaya yönlendir
      localStorage.setItem("user", JSON.stringify(data));
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="max-w-md mx-auto p-6 mt-8">
        {/* Giriş formu kapsayıcısı */}
        <div className="border border-gray-800 rounded-lg bg-gray-900/50 p-8 hover:border-red-600 transition-colors duration-300">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-red-500 mb-2">Giriş Yap</h1>
            <p className="text-gray-400">Hesabınıza erişmek için giriş yapın</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <FaEnvelope />
              </div>
              <input
                type="email"
                placeholder="E-posta Adresi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Şifre input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <FaLock />
              </div>
              <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Gönder butonu */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-6 py-3 rounded-md font-bold transition-colors duration-300 flex items-center justify-center gap-2 ${
                isLoading ? "bg-gray-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isLoading ? "Giriş Yapılıyor..." : <>Giriş Yap <FaArrowRight /></>}
            </button>
          </form>

          {/* Hata mesajı */}
          {error && (
            <div className="mt-6 p-3 rounded-md bg-red-900/50 text-red-400 flex items-start gap-2">
              <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Kayıt ol linki */}
          <div className="mt-6 text-center text-gray-400">
            Hesabınız yok mu?{" "}
            <Link
              href="/register"
              className="text-red-400 hover:text-red-300 hover:underline transition-colors"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
