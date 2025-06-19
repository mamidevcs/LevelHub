'use client';
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { FaHeading, FaAlignLeft, FaSave } from "react-icons/fa";

type Params = {
  params: { id: string }; // Route param tipi
};

export default function EditTopicPage({ params }: Params) {
  const { id: topicId } = use(params); // Parametreden konu ID'si alınıyor
  const router = useRouter(); // Sayfa yönlendirme için
  const [title, setTitle] = useState(''); // Başlık state
  const [content, setContent] = useState(''); // İçerik state
  const [isLoading, setIsLoading] = useState(false); // Yükleniyor durumu
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null); // Mesaj durumu
  const [isAuthorizedToEdit, setIsAuthorizedToEdit] = useState(true); // Düzenleme yetkisi
  const [tags, setTags] = useState<{id: number, name: string}[]>([]); // Etiket listesi
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]); // Seçili etiketler

  // Konu ve etiketleri yükle, yetki kontrolü yap
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tagsRes = await fetch('/api/tags'); // Etiketleri çek
        const tagsData = await tagsRes.json();
        setTags(tagsData);

        const topicRes = await fetch(`/api/topics/${topicId}`); // Konuyu çek
        if (!topicRes.ok) {
          const errorData = await topicRes.json();
          throw new Error(errorData.message || "Konu alınamadı");
        }
        const topicData = await topicRes.json();
        setTitle(topicData.title);
        setContent(topicData.content);
        setSelectedTagIds(topicData.tags?.map((t: any) => t.id) || []);

        // Yetki kontrolü (cookie'den user id alınıyor)
        const currentUserId = Number(document.cookie.match(/id=(\d+)/)?.[1]);
        if (topicData.authorId !== currentUserId) {
          setIsAuthorizedToEdit(false);
          setMessage({ text: "Bu konuyu düzenleme yetkiniz yok.", type: 'error' });
        }
      } catch (err: any) {
        setMessage({ text: err.message, type: 'error' });
        setIsAuthorizedToEdit(false);
      }
    };
    fetchData();
  }, [topicId]);

  // Etiket seçimini aç/kapa (yetki yoksa işlem yapmaz)
  const toggleTag = (id: number) => {
    if (!isAuthorizedToEdit) return;
    setSelectedTagIds(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  // Form gönderildiğinde güncelleme isteği atılır
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (!isAuthorizedToEdit) {
      setMessage({ text: "Bu konuyu düzenleme yetkiniz yok.", type: 'error' });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/topics/${topicId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, tagIds: selectedTagIds }),
      });

      if (res.ok) {
        setMessage({ text: "Konu başarıyla güncellendi!", type: 'success' });
        setTimeout(() => router.push(`/topics/${topicId}`), 1500); // Başarı sonrası konuya yönlendir
      } else {
        const error = await res.json();
        if (res.status === 403) {
          setMessage({ text: error.error, type: 'error' });
          setIsAuthorizedToEdit(false); // Yetki yoksa disable et
        } else {
          throw new Error(error.message || "Bir hata oluştu");
        }
      }
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <div className="border border-gray-800 rounded-lg bg-gray-900/50 p-8 hover:border-yellow-600 transition-colors duration-300">
          <h1 className="text-2xl font-bold mb-6 text-yellow-400 flex items-center gap-2">
            <FaSave /> Konuyu Düzenle
          </h1>

          {/* Yetkisiz kullanıcı için mesaj */}
          {message && message.type === 'error' && message.text === "Bu konuyu düzenleme yetkiniz yok." ? (
            <div className="mt-4 p-3 rounded-md bg-red-900/50 text-red-400">
              Bu konuyu düzenleme yetkiniz yok.
            </div>
          ) : (
            // Düzenleme formu
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaHeading />
                </div>
                <input
                  type="text"
                  placeholder="Başlık"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                  maxLength={100}
                  disabled={!isAuthorizedToEdit || isLoading}
                />
              </div>

              <div className="relative">
                <div className="absolute top-3 left-3 text-gray-400">
                  <FaAlignLeft />
                </div>
                <textarea
                  placeholder="İçeriği güncelleyin..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 min-h-[200px]"
                  required
                  disabled={!isAuthorizedToEdit || isLoading}
                />
              </div>

              {/* Etiket seçimi, sadece yetkili ise aktif */}
              {isAuthorizedToEdit && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-white mb-4">Etiketler</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        disabled={!isAuthorizedToEdit || isLoading}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${
                          selectedTagIds.includes(tag.id)
                            ? 'bg-yellow-500 text-black shadow-md hover:bg-yellow-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${(!isAuthorizedToEdit || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {selectedTagIds.includes(tag.id) && (
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Kaydet butonu */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !isAuthorizedToEdit}
                  className={`px-6 py-3 rounded-md font-bold transition-colors duration-300 flex items-center gap-2 ${
                    isLoading || !isAuthorizedToEdit
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                  }`}
                >
                  {isLoading ? 'Kaydediliyor...' : (
                    <>
                      <FaSave /> Kaydet
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Başarı veya diğer mesajlar */}
          {message && message.type !== 'error' && (
            <div className={`mt-4 p-3 rounded-md ${
              message.type === 'success'
                ? 'bg-green-900/50 text-green-400'
                : 'bg-red-900/50 text-red-400'
            }`}>
              {message.text}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
