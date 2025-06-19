"use client";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../app/context/UserContext";
import { useParams, useSearchParams } from "next/navigation";

export default function ChatForm() {
  const { user } = useContext(UserContext);
  const [contacts, setContacts] = useState([]); // Kullanıcı ile mesajlaştığı kişiler
  const [selectedChat, setSelectedChat] = useState(null); // Seçilen sohbet
  const [content, setContent] = useState(""); // Mesaj içeriği
  const [messages, setMessages] = useState([]); // Seçilen sohbetin mesajları

  const params = useParams();
  const searchParams = useSearchParams();

  // URL'den seçili sohbetin id'si ve kullanıcı adı
  const receiverId = parseInt(params.id as string, 10);
  const receiverUsername = searchParams.get("username");

  // Kullanıcı ve URL parametreleri değiştiğinde kişi listesini çek ve sohbeti ayarla
  useEffect(() => {
    if (!user) return;

    async function fetchContactsAndSelectChat() {
      const res = await fetch(`/api/chat-contacts?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts);

        // URL'den gelen id ile kişi listesinde arama
        const foundContact = data.contacts.find(c => c.id === receiverId);

        if (foundContact) {
          setSelectedChat(foundContact); // Bulduysa seç
        } else if (receiverId && receiverUsername) {
          // Kişi listede yoksa ama URL'de varsa oradan ayarla
          setSelectedChat({ id: receiverId, username: receiverUsername });
        } else if (data.contacts.length > 0) {
          // Hiçbir şey yoksa ilk kişiyi seç
          setSelectedChat(data.contacts[0]);
        } else {
          // Hiç kişi yoksa null
          setSelectedChat(null);
        }
      }
    }
    fetchContactsAndSelectChat();
  }, [user, receiverId, receiverUsername]);

  // Seçilen sohbet değiştiğinde mesajları yükle
  useEffect(() => {
    if (!user || !selectedChat) return;

    async function loadMessages() {
      const res = await fetch(
        `/api/messages?userId1=${user.id}&userId2=${selectedChat.id}`
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    }
    loadMessages();
  }, [user, selectedChat]);

  // Mesaj gönderme işlemi
  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: content.trim(),
        receiverId: selectedChat.id,
        senderId: user.id,
      }),
    });

    if (res.ok) {
      setContent(""); // Mesaj kutusunu temizle

      // Yeni mesajları tekrar yükle
      const res2 = await fetch(
        `/api/messages?userId1=${user.id}&userId2=${selectedChat.id}`
      );
      if (res2.ok) {
        const data = await res2.json();
        setMessages(data.messages || []);
      }
    }
  }

  if (!user) return <p>Giriş yapmanız gerekiyor.</p>;

  return (
    <div className="flex gap-4">
      {/* Mesajlaştığın kullanıcı listesi */}
      <div className="w-1/3 border rounded p-4 h-96 overflow-y-auto bg-black">
        <h2 className="font-bold mb-2 text-white">Mesajlaştıkların</h2>
        {contacts.length === 0 ? (
          <p className="text-gray-400">Henüz kimseyle mesajlaşmadınız.</p>
        ) : (
          contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedChat(c)}
              className={`block w-full text-left p-2 rounded text-white ${
                selectedChat?.id === c.id
                  ? "bg-red-800"
                  : "hover:bg-white hover:text-red-600 hover:font-bold"
              }`}
            >
              {c.username}
            </button>
          ))
        )}
      </div>

      {/* Sohbet ve mesaj gönderme kısmı */}
      <div className="flex-1">
        {selectedChat ? (
          <div>
            {/* Mesajların listesi */}
            <div className="border rounded p-4 h-96 overflow-y-auto mb-4 bg-white">
              {messages.length === 0 ? (
                <p className="text-gray-500">
                  Henüz mesaj yok. İlk mesajı siz gönderin!
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-3 p-2 rounded ${
                      message.senderId === user.id
                        ? "bg-red-800 text-white ml-auto max-w-xs"
                        : "bg-black text-white max-w-xs"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {message.senderId === user.id ? "Sen" : selectedChat.username}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Mesaj gönderme formu */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`${selectedChat.username}'e mesaj yazın...`}
                className="flex-1 p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="bg-black font-bold border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-white hover:text-black hover:border-black"
              >
                Gönder
              </button>
            </form>
          </div>
        ) : (
          <p className="text-gray-500">Sohbet etmek için birini seçin.</p>
        )}
      </div>
    </div>
  );
}
