// app/chat/[userId]/page.js
import prisma from "@/lib/prisma";
import ChatForm from "@/components/ChatForm";
import Navbar from "@/components/Navbar";
type Params = {
  params: { id: string };
};

export default async function ChatPage({ params }: Params) {
  
  const { id } = await params;
  const receiverId = parseInt(id);

  // Alıcı kullanıcı bilgilerini getir
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });

  if (!receiver) return <p>Kullanıcı bulunamadı.</p>;

  // Mesajları getir 
  return (
    <div>
      <Navbar/>
      <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Chat
      </h1>
      
      <ChatForm />
    </main>
    </div>
    
  );
}