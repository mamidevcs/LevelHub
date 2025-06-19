"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

export default function RegisterPage() {
  const [username, setUsername] = useState(""); // Kullanıcı adı state'i
  const [email, setEmail] = useState(""); // Email state'i
  const [password, setPassword] = useState(""); // Şifre state'i
  const [message, setMessage] = useState(""); // Başarı/hata mesajı
  const [isLoading, setIsLoading] = useState(false); // Yüklenme durumu

  // Form gönderimi
  async function handleSubmit(e) {
    e.preventDefault(); // Sayfa yenilenmesini engelle
    setIsLoading(true); // Yükleniyor durumuna geç
    setMessage(""); // Mesajı temizle

    try {
      // API'ye kayıt isteği gönder
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Kayıt başarılıysa formu temizle ve mesaj göster
        setMessage("Kayıt başarılı! Giriş yapabilirsiniz.");
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        // Başarısızsa hata fırlat
        throw new Error(data.error || "Kayıt sırasında bir hata oluştu");
      }
    } catch (error) {
      setMessage(error.message); // Hata mesajını göster
    } finally {
      setIsLoading(false); // Yüklenmeyi bitir
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="max-w-md mx-auto p-6 mt-8">
        <div className="border border-gray-800 rounded-lg bg-gray-900/50 p-8 hover:border-red-600 transition-colors duration-300">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-red-500 mb-2">Kayıt Ol</h1>
            <p className="text-gray-400">Forum topluluğuna katılın</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kullanıcı adı inputu */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <FaUser />
              </div>
              <input
                type="text"
                placeholder="Kullanıcı Adı"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Email inputu */}
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

            {/* Şifre inputu */}
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
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isLoading ? (
                "Kayıt Olunuyor..."
              ) : (
                <>
                  Kayıt Ol <FaArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Başarı/hata mesajı */}
          {message && (
            <div
              className={`mt-6 p-3 rounded-md text-center ${
                message.includes("başarılı")
                  ? "bg-green-900/50 text-green-400"
                  : "bg-red-900/50 text-red-400"
              }`}
            >
              {message}
            </div>
          )}

          {/* Giriş sayfasına link */}
          <div className="mt-6 text-center text-gray-400">
            Zaten hesabınız var mı?{" "}
            <Link
              href="/login"
              className="text-red-400 hover:text-red-300 hover:underline transition-colors"
            >
              Giriş Yap
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
