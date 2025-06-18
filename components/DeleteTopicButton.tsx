"use client";

type Props = {
  topicId: number;
};

export default function DeleteTopicButton({ topicId }: Props) {
  async function handleDelete() {
    if (!confirm("Bu konuyu silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      const res = await fetch("/api/topics", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: topicId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Silme başarısız");
      }

      window.location.href = "/";
    } catch (error) {
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