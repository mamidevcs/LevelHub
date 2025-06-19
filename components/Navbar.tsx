"use client"
import { useState, useContext, useRef, useEffect } from "react";
import Link from "next/link";
import { UserContext } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import { FaPlus, FaSearch, FaUser, FaComment } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useContext(UserContext); // Kullanıcı bilgisi ve çıkış fonksiyonu
  const [open, setOpen] = useState(false); // Profil menüsü açık/kapalı durumu
  const menuRef = useRef<HTMLDivElement>(null); // Profil menüsü DOM referansı
  const [search, setSearch] = useState(""); // Arama inputu
  const router = useRouter();

  useEffect(() => {
    // Menü dışına tıklayınca menüyü kapat
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Arama formu submit handler
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search.trim())}`); // Arama sayfasına git
      setSearch(""); // Arama inputunu temizle
    }
  }

  return (
    <nav className="border-b border-gray-800 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Sol taraf: site adı ve yeni konu butonu (desktop) */}
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-xl font-bold text-white hover:text-red-500 transition-colors"
            >
              LevelHub
            </Link>

            {/* Yeni Konu Butonu - Desktop */}
            {user && (
              <Link
                href="/topics/new"
                className="hidden md:flex items-center px-3 py-1 text-sm bg-red-500 rounded hover:bg-white hover:text-red-600 transition-colors duration-300 font-bold"
              >
                <FaPlus className="mr-1" />
                Yeni Konu
              </Link>
            )}
          </div>

          {/* Ortada: arama formu */}
          <form onSubmit={handleSearch} className="flex-1 mx-4 max-w-xl relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Konularda ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-1 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-red-500"
            />
          </form>

          {/* Sağ taraf: Giriş yapmamışsa giriş/kayıt, giriş yapmışsa profil ve menü */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <div className="flex space-x-3">
                <Link
                  href="/login"
                  className="px-3 py-1 text-sm border border-gray-700 rounded hover:bg-gray-800 transition-colors"
                >
                  Giriş
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1 text-sm bg-red-600 rounded hover:bg-white hover:text-red-600 transition-colors duration-300 font-bold"
                >
                  Kayıt
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Sohbet butonu */}
                <Link
                  href="/chat/1"
                  className="flex items-center justify-center w-8 h-8 bg-yellow-400 rounded-full hover:bg-white hover:text-yellow-400 transition-colors duration-300"
                  title="Sohbet"
                >
                  <FaComment className="text-sm" />
                </Link>

                {/* Yeni Konu Butonu - Mobile */}
                <Link
                  href="/topics/new"
                  className="md:hidden flex items-center justify-center w-8 h-8 bg-red-500 rounded-full hover:bg-white hover:text-red-600 transition-colors duration-300"
                  title="Yeni Konu"
                >
                  <FaPlus className="text-sm" />
                </Link>

                {/* Profil menüsü */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center px-3 py-1 text-sm bg-red-500 rounded hover:bg-white hover:text-red-600 transition-colors duration-300 font-bold"
                  >
                    <FaUser className="mr-1" />
                    {user.username}
                  </button>

                  {/* Menü açılmışsa göster */}
                  {open && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded shadow-lg z-50">
                      <Link
                        href={`/profile/${user.id}`}
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800"
                      >
                        <FaUser className="mr-2" />
                        Profilim
                      </Link>
                      <Link
                        href="/chat/1"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800"
                      >
                        <FaComment className="mr-2" />
                        Sohbet
                      </Link>
                      <Link
                        href="/topics/new"
                        className="md:hidden flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800"
                      >
                        <FaPlus className="mr-2" />
                        Yeni Konu
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
                      >
                        <FaUser className="mr-2" />
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
