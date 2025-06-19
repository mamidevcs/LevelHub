// app/search/page.tsx
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import Navbar from "@/components/Navbar";

type SearchParams = {
  searchParams: {
    query?: string; // Arama sorgusu parametresi
  };
};

export default async function SearchPage({ searchParams }: SearchParams) {
  const query = searchParams.query || ""; // Sorgu yoksa boş string al

  // Veritabanından başlık veya etiket adı sorgusunu içeren konuları çek
  const topics = await prisma.topic.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query, // Başlıkta arama
          }
        },
        {
          tags: {
            some: {
              name: {
                contains: query, // Etiket adında arama
              }
            }
          }
        }
      ]
    },
    orderBy: { createdAt: "desc" }, // Yeni tarihli önce
    include: {
      author: true, // Yazarı da dahil et
      _count: {
        select: { comments: true, upvotes: true }, // Yorum ve oy sayısı
      },
    },
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold mb-6 flex items-center">
          <span className="w-2 h-6 mr-2 rounded bg-blue-500"></span>
          <FaSearch className="mr-2 text-blue-400" size={20} />
          “{query}” için arama sonuçları
        </h1>

        {/* Konu yoksa mesaj göster */}
        {topics.length === 0 ? (
          <p className="text-gray-400">Hiç konu bulunamadı.</p>
        ) : (
          // Konuları listele
          <ul className="space-y-3">
            {topics.map((topic) => (
              <li key={topic.id} className="group">
                <Link
                  href={`/topics/${topic.id}`}
                  className="flex items-center py-3 px-4 hover:bg-white/10 rounded-lg border border-transparent hover:border-white transition-all duration-400"
                >
                  <span className="flex-1 font-bold text-blue-400 group-hover:text-white transition-colors">
                    {topic.title}
                  </span>
                  <span className="text-sm text-gray-400 group-hover:text-opacity-80 transition-colors">
                    @{topic.author?.username}
                  </span>
                  <span className="ml-4 italic text-sm text-gray-500">
                    {new Date(topic.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
