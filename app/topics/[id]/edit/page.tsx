'use client';
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { FaHeading, FaAlignLeft, FaSave } from "react-icons/fa";

type Params = {
  params: { id: string };
};

export default function EditTopicPage({ params }: Params) {
  const { id: topicId } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [isAuthorizedToEdit, setIsAuthorizedToEdit] = useState(true);
  const [tags, setTags] = useState<{id: number, name: string}[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  // Konuyu ve etiketleri yükle
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Etiketleri yükle
        const tagsRes = await fetch('/api/tags');
        const tagsData = await tagsRes.json();
        setTags(tagsData);

        // Konuyu yükle
        const topicRes = await fetch(`/api/topics/${topicId}`);
        if (!topicRes.ok) {
          const errorData = await topicRes.json();
          throw new Error(errorData.message || "Konu alınamadı");
        }
        const topicData = await topicRes.json();
        setTitle(topicData.title);
        setContent(topicData.content);
        setSelectedTagIds(topicData.tags?.map((t: any) => t.id) || []);

        // Yetki kontrolü
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

  const toggleTag = (id: number) => {
    if (!isAuthorizedToEdit) return;
    setSelectedTagIds(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

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
        setTimeout(() => router.push(`/topics/${topicId}`), 1500);
      } else {
        const error = await res.json();
        if (res.status === 403) {
          setMessage({ text: error.error, type: 'error' });
          setIsAuthorizedToEdit(false);
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
            <FaSave />
            Konuyu Düzenle
          </h1>

          {message && message.type === 'error' && message.text === "Bu konuyu düzenleme yetkiniz yok." ? (
            <div className="mt-4 p-3 rounded-md bg-red-900/50 text-red-400">
              Bu konuyu düzenleme yetkiniz yok.
            </div>
          ) : (
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

              {/* Etiket Seçme Bölümü */}
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