// components/VoteButtons.tsx
"use client"; // This directive marks it as a Client Component

import { useState, useContext, useTransition } from "react";
import { UserContext } from "@/app/context/UserContext";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Define the User type
type User = {
  id: number;
  username: string;
};

// Props that this client component will receive
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
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);

  const currentUserId = user?.id;
  const hasUpvoted = upvotes.some((u) => u.id === currentUserId);
  const hasDownvoted = downvotes.some((u) => u.id === currentUserId);

  async function handleVote(newVoteType: "UPVOTE" | "DOWNVOTE") {
    if (!user) {
      alert("Oy vermek için giriş yapmalısınız.");
      return;
    }

    // Determine the actual action to send to the API
    let apiVoteType: "UPVOTE" | "DOWNVOTE" | "NONE" = newVoteType; // 'NONE' signals un-voting

    // Optimistic UI Update & Determine API action
    if (newVoteType === "UPVOTE") {
      if (hasUpvoted) {
        // User is clicking to UN-UPVOTE
        setUpvotes((prev) => prev.filter((u) => u.id !== currentUserId));
        apiVoteType = "NONE"; // Signal to API to remove existing vote
      } else {
        // User is clicking to UPVOTE
        setUpvotes((prev) => [...prev, user]);
        if (hasDownvoted) {
          setDownvotes((prev) => prev.filter((u) => u.id !== currentUserId));
        }
        apiVoteType = "UPVOTE"; // Signal to API to add upvote
      }
    } else {
      // newVoteType === "DOWNVOTE"
      if (hasDownvoted) {
        // User is clicking to UN-DOWNVOTE
        setDownvotes((prev) => prev.filter((u) => u.id !== currentUserId));
        apiVoteType = "NONE"; // Signal to API to remove existing vote
      } else {
        // User is clicking to DOWNVOTE
        setDownvotes((prev) => [...prev, user]);
        if (hasUpvoted) {
          setUpvotes((prev) => prev.filter((u) => u.id !== currentUserId));
        }
        apiVoteType = "DOWNVOTE"; // Signal to API to add downvote
      }
    }

    try {
      console.log("Gönderilen:", { topicId, voteType: apiVoteType }); // Log the actual type sent
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topicId, voteType: apiVoteType }), // Use apiVoteType here
        credentials: "include",
      });

      if (res.ok) {
        startTransition(() => {
          router.refresh();
        });
      } else {
        alert("Oy işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (error) {
      console.error("Oy işlemi sırasında hata oluştu:", error);
      alert("Oy işlemi sırasında bir hata oluştu.");
      startTransition(() => {
        router.refresh();
      });
    }
  }

  return (
    <div className="flex items-center space-x-4 mt-4">
      {/* Upvote Button */}
      <button
        onClick={() => handleVote("UPVOTE")}
        disabled={isPending || !user} // Disable only if pending or no user
        className={`flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
          hasUpvoted
            ? "bg-purple-600 text-white" // Style if upvoted
            : "bg-gray-700 text-gray-300 hover:bg-purple-500 hover:text-white" // Default style
        } ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <FaArrowUp className="mr-1" />
        <span>{upvotes.length}</span>
      </button>

      {/* Downvote Button */}
      <button
        onClick={() => handleVote("DOWNVOTE")}
        disabled={isPending || !user} // Disable only if pending or no user
        className={`flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
          hasDownvoted
            ? "bg-yellow-600 text-white" // Style if downvoted
            : "bg-gray-700 text-gray-300 hover:bg-yellow-500 hover:text-white" // Default style
        } ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <FaArrowDown className="mr-1" />
        <span>{downvotes.length}</span>
      </button>

      {/* Display net score */}
      <span className="ml-4 text-xl text-red-500 font-bold">
        {upvotes.length - downvotes.length}
      </span>
    </div>
  );
}