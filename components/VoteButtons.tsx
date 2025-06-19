"use client"; // Client component olduğunu belirtir

import { useState, useContext, useTransition } from "react";
import { UserContext } from "@/app/context/UserContext";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  username: string;
};

type VoteButtonsProps = {
  topicId: number;
  initialUpvotes: User[];
  initialDownvotes: User[];
};

export default function VoteButtons({
  topicId,
  initialUpvotes,
  initialDownvotes,
}: VoteButtonsProps) {
  const { user } = useContext(UserContext); // Giriş yapmış kullanıcı
  const router = useRouter();
  const [isPending, startTransition] = useTransition(); // Transition durumu

  const [upvotes, setUpvotes] = useState(initialUpvotes); // Oy verenler (artı)
  const [downvotes, setDownvotes] = useState(initialDownvotes); // Oy verenler (eksi)

  const currentUserId = user?.id;
  const hasUpvoted = upvotes.some((u) => u.id === currentUserId); // Kullanıcı upvote yapmış mı?
  const hasDownvoted = downvotes.some((u) => u.id === currentUserId); // Kullanıcı downvote yapmış mı?

  // Oy butonuna basılınca çalışır
  async function handleVote(newVoteType: "UPVOTE" | "DOWNVOTE") {
    if (!user) {
      alert("Oy vermek için giriş yapmalısınız.");
      return;
    }

    // API'ye gönderilecek gerçek oy türü
    let apiVoteType: "UPVOTE" | "DOWNVOTE" | "NONE" = newVoteType;

    // UI optimist güncelleme ve hangi API isteği yapılacak karar verme
    if (newVoteType === "UPVOTE") {
      if (hasUpvoted) {
        // Oy kaldırma (un-upvote)
        setUpvotes((prev) => prev.filter((u) => u.id !== currentUserId));
        apiVoteType = "NONE";
      } else {
        // Oy verme (upvote)
        setUpvotes((prev) => [...prev, user]);
        if (hasDownvoted) {
          setDownvotes((prev) => prev.filter((u) => u.id !== currentUserId));
        }
        apiVoteType = "UPVOTE";
      }
    } else {
      // DOWNVOTE durumları aynı mantık
      if (hasDownvoted) {
        setDownvotes((prev) => prev.filter((u) => u.id !== currentUserId));
        apiVoteType = "NONE";
      } else {
        setDownvotes((prev) => [...prev, user]);
        if (hasUpvoted) {
          setUpvotes((prev) => prev.filter((u) => u.id !== currentUserId));
        }
        apiVoteType = "DOWNVOTE";
      }
    }

    try {
      // API isteği gönderiliyor
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId, voteType: apiVoteType }),
        credentials: "include",
      });

      // Başarılı veya başarısız durumda sayfa yenileniyor (optimizasyon için transition ile)
      startTransition(() => router.refresh());

      if (!res.ok) alert("Oy işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } catch (error) {
      console.error("Oy işlemi sırasında hata oluştu:", error);
      alert("Oy işlemi sırasında bir hata oluştu.");
      startTransition(() => router.refresh());
    }
  }

  return (
    <div className="flex items-center space-x-4 mt-4">
      {/* Upvote butonu */}
      <button
        onClick={() => handleVote("UPVOTE")}
        disabled={isPending || !user} // İstek devam ediyorsa veya kullanıcı yoksa devre dışı
        className={`flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
          hasUpvoted
            ? "bg-purple-600 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-purple-500 hover:text-white"
        } ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <FaArrowUp className="mr-1" />
        <span>{upvotes.length}</span>
      </button>

      {/* Downvote butonu */}
      <button
        onClick={() => handleVote("DOWNVOTE")}
        disabled={isPending || !user}
        className={`flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
          hasDownvoted
            ? "bg-yellow-600 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-yellow-500 hover:text-white"
        } ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <FaArrowDown className="mr-1" />
        <span>{downvotes.length}</span>
      </button>

      {/* Net oy farkı */}
      <span className="ml-4 text-xl text-red-500 font-bold">
        {upvotes.length - downvotes.length}
      </span>
    </div>
  );
}
