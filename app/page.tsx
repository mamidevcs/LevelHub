"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaFire, FaComments, FaArrowUp, FaClock } from "react-icons/fa";
import Navbar from "@/components/Navbar";

type Topic = {
  id: number;
  title: string;
  author: { username: string };
  createdAt: string;
  _count: { upvotes: number; comments: number };
};

function TopicList({ type, title, icon, color }: { type: "latest" | "popular" | "controversial"; title: string; icon: JSX.Element; color: string }) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [skip, setSkip] = useState(0);
  const take = 5;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

 // Konuları API'den sayfalı (pagination) olarak çekme fonksiyonu
async function loadTopics(reset = false) {
  setLoading(true);

  // Eğer reset true ise skip 0, yoksa mevcut skip değeri kullanılır
  const res = await fetch(`/api/topics?type=${type}&skip=${reset ? 0 : skip}&take=${take}`);
  const data: Topic[] = await res.json();

  if (reset) {

    setTopics(data);
    setSkip(take);
  } else {

    setTopics((prev) => [...prev, ...data]);
    setSkip(skip + take);
  }

  setHasMore(data.length === take);
  setLoading(false);
}


  // type değişince listeyi yenile
  useEffect(() => {
    loadTopics(true);
  }, [type]);

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <span className="w-2 h-6 mr-2 rounded" style={{ backgroundColor: color }}></span>
        {icon}
        {title}
      </h2>
      <ul className="space-y-3">
        {topics.map((topic) => (
          <li key={topic.id} className="group">
            <Link href={`/topics/${topic.id}`} className="flex items-center py-3 px-4 hover:bg-white/10 rounded-lg border border-transparent hover:border-white transition-all duration-400">
              <span className="flex-1 font-bold transition-colors" style={{ color }}>{topic.title}</span>
              <span className="text-sm text-gray-400 group-hover:text-opacity-80 transition-colors">@{topic.author.username}</span>
              <span className="ml-4 italic flex items-center gap-1" style={{ color }}>
                {/* Tipine göre ikon ve bilgi göster */}
                {type === "popular" && <FaArrowUp size={16} />}
                {type === "controversial" && <FaComments size={16} />}
                {type === "latest" && <FaClock size={16} />}
                {type === "popular" && topic._count.upvotes}
                {type === "controversial" && topic._count.comments}
                {type === "latest" && new Date(topic.createdAt).toLocaleDateString()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {/* Daha fazla veri butonu */}
      {hasMore && !loading && (
        <div className="flex justify-center">
          <button onClick={() => loadTopics()} className="mt-4 px-40 py-2 rounded text-black font-semibold hover:brightness-90" style={{ backgroundColor: color }}>
            Daha fazla göster
          </button>
        </div>
      )}
      {loading && <p className="flex justify-center">Yükleniyor...</p>}
      {!hasMore && !loading && <p className="flex justify-center">Gösterilecek daha fazla konu yok.</p>}
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <TopicList
          type="popular"
          title="POPÜLER KONULAR (Son 7 Gün)"
          icon={<FaFire className="mr-2 text-yellow-500" size={20} />}
          color="#facc15"
        />
        <TopicList
          type="controversial"
          title="TARTIŞMALI KONULAR (Son 7 Gün)"
          icon={<FaComments className="mr-2 text-purple-500" size={20} />}
          color="#a855f7"
        />
        <TopicList
          type="latest"
          title="YENİ KONULAR"
          icon={<FaClock className="mr-2 text-red-500" size={20} />}
          color="#ef4444"
        />
      </main>
    </div>
  );
}
