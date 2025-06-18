"use client";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const { user, logout, setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <Navbar />
        <main className="max-w-4xl mx-auto p-6">
          <div className="p-6 border border-gray-800 rounded-lg bg-gray-900/50 text-center">
            <p className="text-xl mb-4">Önce giriş yapmalısın.</p>
            <Link
              href="/login"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Giriş Yap
            </Link>
          </div>
        </main>
      </div>
    );
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, username, email, bio }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Bir hata oluştu");
      }

      setMessage(data.message);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <section className="mb-8 p-6 border border-gray-800 rounded-lg bg-gray-900/50">
          <h1 className="text-2xl font-bold mb-6 text-red-500">Profilim</h1>
          
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm text-gray-400 mb-1">
                Kullanıcı Adı
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm text-gray-400 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm text-gray-400 mb-1">
                Biyografi
              </label>
              <input
                id="bio"
                type="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 rounded-md transition-colors ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {isLoading ? 'Güncelleniyor...' : 'Güncelle'}
            </button>
            
            {message && (
              <p className={`mt-2 text-sm ${message.includes('Başarı') ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}
          </form>
          
          <button
            onClick={logout}
            className="mt-6 px-6 py-2 border border-gray-700 hover:border-red-500 rounded-md transition-colors"
          >
            Çıkış Yap
          </button>
        </section>
        
        <section className="p-6 border border-gray-800 rounded-lg bg-gray-900/50">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="w-2 h-6 bg-purple-500 mr-2 rounded"></span>
            Hesap Bilgileri
          </h2>
          
          <div className="space-y-3 text-gray-300">
            <p><span className="text-gray-400">Kullanıcı ID:</span> {user.id}</p>
            <p><span className="text-gray-400">Kayıt Tarihi:</span> {new Date(user.createdAt).toLocaleString("tr-TR")}</p>
          </div>
        </section>
      </main>
    </div>
  );
}