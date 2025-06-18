'use client';
import { use, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { FaHeading, FaAlignLeft, FaPlus } from "react-icons/fa";

export default function NewTopicPage() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
const [tags, setTags] = useState<{id: number, name: string}[]>([]);
const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

useEffect(() => {
  fetch('/api/tags')
    .then(res => res.json())
    .then(data => setTags(data));
}, []);

const toggleTag = (id: number) => {
  setSelectedTagIds(prev =>
    prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
  );
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, tagIds: selectedTagIds }),

      });

      if (res.ok) {
        setTitle('');
        setContent('');
        setMessage({text: "Konu başarıyla oluşturuldu!", type: 'success'});
      } else {
        const error = await res.json();
        throw new Error(error.message || "Bir hata oluştu");
      }
    } catch (err: any) {
      setMessage({text: err.message, type: 'error'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar/>
      <main className="max-w-4xl mx-auto p-6">
        <div className="border border-gray-800 rounded-lg bg-gray-900/50 p-8 hover:border-red-600 transition-colors duration-300">
          <h1 className="text-2xl font-bold mb-6 text-red-500 flex items-center gap-2">
            <FaPlus />
            Yeni Konu Oluştur
          </h1>
          
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
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                required
                maxLength={100}
              />
            </div>

            <div className="relative">
              <div className="absolute top-3 left-3 text-gray-400">
                <FaAlignLeft />
              </div>
              <textarea
                placeholder="İçeriğinizi buraya yazın..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent min-h-[200px]"
                required
              />
            </div>
<div className="mb-6">
  <h3 className="text-sm font-bold text-white mb-4">Etiketler</h3>
  <div className="flex flex-wrap gap-2">
    {tags.map(tag => (
      <button
        key={tag.id}
        type="button" // Bu satırı ekliyoruz
        onClick={(e) => {
          e.preventDefault(); // Form submit'ini engelliyoruz
          toggleTag(tag.id);
        }}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${
          selectedTagIds.includes(tag.id)
            ? 'bg-red-500 text-white shadow-md hover:bg-red-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
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

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 rounded-md font-bold transition-colors duration-300 hover:bg-white hover:text-red-600 flex items-center gap-2 ${
                  isLoading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isLoading ? 'Oluşturuluyor...' : (
                  <>
                    <FaPlus /> Konu Oluştur
                  </>
                )}
              </button>
            </div>
          </form>

          {message && (
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