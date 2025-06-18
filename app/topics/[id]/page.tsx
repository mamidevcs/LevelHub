// app/topics/[id]/page.tsx
import prisma from "@/lib/prisma";
import CommentForm from "@/components/CommentForm";
import { cookies } from "next/headers";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Linkify from 'linkify-react';
import DeleteTopicButton from "@/components/DeleteTopicButton";
import VoteButtons from "@/components/VoteButtons";

const linkifyOptions = {
  target: '_blank',
  rel: 'noopener noreferrer',
  className: 'text-blue-400 underline hover:text-blue-300',
};

type Params = {
  params: { id: string };
};

export default async function TopicPage({ params }: Params) {
  const topicId = parseInt(params.id);

  const cookieStore = cookies();
  const userId = parseInt(cookieStore.get("id")?.value || "0");
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      author: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: "asc" },
      },
      upvotes: true,
      downvotes: true,
      tags: true, // Etiketleri de include ediyoruz
    },
  });

  if (!topic) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <p>Konu bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <section className="mb-8 p-6 border border-gray-800 rounded-lg bg-gray-900/50 hover:border-red-600 transition-colors">
          <h1 className="text-2xl font-bold mb-4 text-red-500">
            {topic.title}
          </h1>
          <div className="flex items-center mb-4 text-sm text-gray-400">
            <span className="mr-4">
              Yazar:{" "}
              <Link
                href={`/profile/${topic.author.id}`}
                className="hover:text-red-400 transition-colors"
              >
                @{topic.author.username}
              </Link>
            </span>
            <span>
              {topic.createdAt.toLocaleString("tr-TR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Etiketler Bölümü */}
          {topic.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {topic.tags.map(tag => (
                <Link 
                  key={tag.id}
                  href={`/search?query=${tag.name}`}
                  className="px-3 py-1 rounded-full bg-gray-800 text-gray-200 text-sm hover:bg-gray-700 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          <p className="mb-6 text-gray-200">
            <Linkify options={linkifyOptions}>{topic.content}</Linkify>
          </p>

          <div className="flex items-center gap-4">
            <span className="mr-4">
              {currentUser?.id === topic.authorId && (
                <Link
                  href={`/topics/${topic.id}/edit`}
                  className="inline-block font-bold text-white bg-yellow-500 hover:bg-white hover:text-yellow-500 text-sm px-4 py-2 rounded transition-colors"
                >
                  Konuyu Düzenle
                </Link>
              )}
            </span>
            {(currentUser?.role === "admin" || currentUser?.id === topic.authorId) && (
              <DeleteTopicButton topicId={topic.id} />
            )}
          </div>

          <VoteButtons
            topicId={topic.id}
            initialUpvotes={topic.upvotes}
            initialDownvotes={topic.downvotes}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <span className="w-2 h-6 bg-purple-500 mr-2 rounded"></span>
            YORUMLAR ({topic.comments.length})
          </h2>

          <CommentForm topicId={topicId} />

          {topic.comments.length === 0 ? (
            <p className="text-gray-400 italic">Henüz yorum yok.</p>
          ) : (
            <ul className="space-y-4">
              {topic.comments.slice().reverse().map((comment) => (
                <li
                  key={comment.id}
                  className="p-4 border border-gray-800 rounded-lg hover:border-purple-600 transition-colors"
                >
                  <p className="text-gray-200 mb-2">
                    <Linkify options={linkifyOptions}>{comment.content}</Linkify>
                  </p>

                  <div className="flex justify-between text-sm text-gray-400">
                    <Link
                      href={`/profile/${comment.author.id}`}
                      className="hover:text-purple-400 transition-colors"
                    >
                      @{comment.author.username}
                    </Link>
                    <span>
                      {comment.createdAt.toLocaleString("tr-TR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}