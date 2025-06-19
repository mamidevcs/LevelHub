"use client";
import { useState, useContext } from "react";
import { UserContext } from "../app/context/UserContext";

export default function CommentForm({ topicId }) {
  const { user } = useContext(UserContext); // Giriş yapmış kullanıcı bilgisi
  const [content, setContent] = useState(""); // Yorum içeriği state'i

  if (!user) return <p>Yorum yapmak için giriş yapın.</p>; // Giriş yoksa mesaj göster

  async function handleSubmit(e) {
    e.preventDefault();

    // API'ye yorum gönder
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId, content, userId: user.id }),
    });

    if (res.ok) {
      setContent(""); // Başarılıysa textarea'yı temizle
      window.location.reload(); // Sayfayı yenile, yeni yorum görünsün
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)} // Yazılanı state'e kaydet
        placeholder="Yorumunuzu yazın..."
        rows={3}
        className="w-full p-2 border rounded mb-2"
        required
      />
      <button
        type="submit"
        className="bg-purple-500 font-bold text-white px-4 py-2 rounded hover:bg-white hover:text-purple-500 transition-colors"
      >
        Yorum Ekle
      </button>
    </form>
  );
}
