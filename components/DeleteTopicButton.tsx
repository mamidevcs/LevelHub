"use client";

type Props = {
  topicId: number; // Silinecek konunun ID'si
};

export default function DeleteTopicButton({ topicId }: Props) {
  async function handleDelete() {
    // Silme onayı sor
    if (!confirm("Bu konuyu silmek istediğinize emin misiniz?")) {
      return; // Hayırsa işlemi iptal et
    }

    try {
      // API'ye DELETE isteği gönder
      const res = await fetch("/api/topics", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: topicId }), // ID'yi gönder
      });

      const data = await res.json();

      if (!res.ok) {
        // Başarısızsa hata fırlat
        throw new Error(data.error || "Silme başarısız");
      }

      // Başarılı ise anasayfaya yönlendir
      window.location.href = "/";
    } catch (error) {
      // Hata varsa konsola yaz ve kullanıcıya göster
      console.error("Silme hatası:", error);
      alert(error.message || "Silme işlemi sırasında bir hata oluştu");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="inline-block font-bold text-white bg-red-500 hover:bg-white hover:text-red-500 text-sm px-4 py-2 rounded transition-colors"
    >
      Konuyu Sil
    </button>
  );
}
