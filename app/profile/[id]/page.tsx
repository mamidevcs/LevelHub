import prisma from "@/lib/prisma";
import Link from "next/link";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import { FaEnvelope, FaUser, FaCalendarAlt, FaStar, FaQuoteLeft, FaPaperPlane } from "react-icons/fa";

type Params = {
  params: { id: string };
};

export default async function PublicProfile({ params }: Params) {
  const userId = parseInt(params.id);

  // Cookie'den mevcut kullanıcı id'sini al
  const cookieStore = cookies();
  const currentUserId = parseInt(cookieStore.get("id")?.value || "-1");
  const isOwnProfile = currentUserId === userId; // Profil kendi profilimiz mi?

  // Kullanıcıyı veritabanından detaylı çek (son 10 konu ve yorum dahil)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
      role: true,
      createdAt: true, // Kayıt tarihi
      topics: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { // konuların temel bilgileri ve oylar
          id: true,
          title: true,
          createdAt: true,
          upvotes: { select: { id: true } },
          downvotes: { select: { id: true } },
        },
      },
      comments: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { // yorumların temel bilgileri ve konu başlığı
          id: true,
          content: true,
          createdAt: true,
          topic: {
            select: {
              id: true,
              title: true,
            }
          },
        },
      },
    },
  });

  if (!user) {
    // Kullanıcı yoksa mesaj göster
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <p>Kullanıcı bulunamadı.</p>
      </div>
    );
  }

  // Kullanıcının karma puanını hesapla (upvote - downvote toplamı)
  const karma = user.topics.reduce(
    (total, topic) => total + topic.upvotes.length - topic.downvotes.length,
    0
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Ana içerik */}
      <main className="max-w-4xl mx-auto p-6">

        {/* Profil üst bölümü */}
        <div className="relative mb-8 p-6 border border-gray-800 rounded-lg bg-gray-900/50 hover:border-red-600 transition-all duration-300 group overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Sol taraf: kullanıcı bilgileri */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xl font-bold text-red-400">
                  <FaUser />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-red-600">
                    @{user.username}
                  </h1>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-900/50 text-purple-400 border border-purple-800'
                      : 'bg-gray-800 text-gray-400 border border-gray-700'
                  }`}>
                    {user.role === 'admin' ? 'Yönetici' : 'Üye'}
                  </span>
                </div>
              </div>

              {/* E-posta, karma ve biyografi */}
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                <div className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
                  <FaEnvelope />
                  <p>{user.email}</p>
                </div>

                <div className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors">
                  <FaStar />
                  <p>
                    Saygınlık: <span className="font-bold">{karma}</span>
                  </p>
                </div>

                {user.bio && (
                  <div className="flex items-start gap-2 text-gray-300 hover:text-blue-400 transition-colors italic col-span-2">
                    <FaQuoteLeft className="mt-0.5" />
                    <p>"{user.bio}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sağ taraf: kayıt tarihi ve profil düzenleme / mesaj gönderme butonu */}
            <div className="flex flex-col justify-between items-end space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-300 transition-colors">
                <FaCalendarAlt />
                <span>
                  {new Date(user.createdAt).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              {isOwnProfile ? (
                <Link
                  href="/profile"
                  className="px-4 py-2 font-bold bg-red-600 rounded-md hover:bg-white hover:text-red-600 transition-all duration-300 flex items-center gap-2"
                >
                  <FaUser />
                  Profili Düzenle
                </Link>
              ) : (
                <Link
                  href={`/chat/${user.id}?username=${user.username}`}
                  className="px-4 py-2 font-bold bg-red-600 rounded-md hover:bg-white hover:text-red-600 transition-all duration-300 flex items-center gap-2"
                >
                  <FaPaperPlane />
                  Mesaj Gönder
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Kullanıcının konuları */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <span className="w-2 h-6 bg-yellow-500 mr-2 rounded"></span>
            KONULAR ({user.topics.length})
          </h2>

          {user.topics.length === 0 ? (
            <p className="text-gray-400 italic">Henüz konu oluşturmamış.</p>
          ) : (
            <ul className="space-y-3">
              {user.topics.map((topic) => (
                <li key={topic.id} className="group">
                  <Link
                    href={`/topics/${topic.id}`}
                    className="flex items-center py-3 px-4 hover:bg-white-400 rounded-lg border border-gray-800 hover:border-yellow-600 transition-all duration-400"
                  >
                    <span className="flex-1 group-hover:text-yellow-500 font-bold transition-colors">
                      {topic.title}
                    </span>
                    <span className="group-hover:text-yellow-200 italic transition-colors">
                      {topic.createdAt.toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Kullanıcının yorumları */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <span className="w-2 h-6 bg-purple-500 mr-2 rounded"></span>
            YORUMLAR ({user.comments.length})
          </h2>

          {user.comments.length === 0 ? (
            <p className="text-gray-400 italic">Henüz yorum yapmamış.</p>
          ) : (
            <ul className="space-y-4">
              {user.comments.map((comment) => (
                <li key={comment.id} className="group">
                  <Link
                    href={`/topics/${comment.topic.id}#comment-${comment.id}`}
                    className="block p-4 border border-gray-800 rounded-lg hover:border-purple-600 transition-colors"
                  >
                    <p className="text-gray-200 mb-2 group-hover:text-purple-400 transition-colors">
                      {comment.content}
                    </p>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span className="group-hover:text-purple-200 transition-colors">
                        Konu: {comment.topic.title}
                      </span>
                      <span className="group-hover:text-purple-200 transition-colors">
                        {comment.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
