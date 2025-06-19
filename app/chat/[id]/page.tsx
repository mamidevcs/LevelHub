// app/chat/[userId]/page.js
import prisma from "@/lib/prisma";
import ChatForm from "@/components/ChatForm";
import Navbar from "@/components/Navbar";
type Params = {
  params: { id: string };
};

export default async function ChatPage({ params }: Params) {
  
  const { id } = await params; // URL'den gelen parametreleri alıyoruz (id burada userId)
  const receiverId = parseInt(id); // string olan id'yi integer'a çeviriyoruz

  // Alıcı kullanıcı bilgilerini getir
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });

  // Eğer kullanıcı bulunamazsa hata mesajı göster
  if (!receiver) return <p>Kullanıcı bulunamadı.</p>;

  // Mesajları getir (şimdilik yok, ChatForm bileşeni bunu yapabilir)
  return (
    <div>
      <Navbar/>
      <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Chat
      </h1>
      
      <ChatForm /> {/* Mesaj gönderme ve listeleme formu */}
    </main>
    </div>
    
  );
}
