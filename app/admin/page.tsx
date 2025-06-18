"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [tagMessage, setTagMessage] = useState("");
  const [tagList, setTagList] = useState([]);

  async function fetchUsers() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  }

  async function fetchTags() {
    const res = await fetch("/api/tags");
    const data = await res.json();
    setTagList(data);
  }

  async function changeRole(userId, newRole) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, newRole }),
    });
    res.ok ? fetchUsers() : alert("Rol güncellenirken hata oluştu");
  }

  async function deleteUser(userId) {
    if (!confirm("Kullanıcıyı silmek istediğine emin misin?")) return;
    const res = await fetch(`/api/admin/users?userId=${userId}`, { method: "DELETE" });
    res.ok ? fetchUsers() : alert("Silme işlemi başarısız.");
  }

  async function addTag() {
    if (!newTag.trim()) return;
    setTagMessage("");
    const res = await fetch("/api/admin/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTag }),
    });
    const data = await res.json();
    if (res.ok) {
      setNewTag("");
      setTagMessage("Etiket eklendi!");
      fetchTags();
    } else {
      setTagMessage(data.error || "Bir hata oluştu.");
    }
  }

  async function deleteTag(id) {
    if (!confirm("Bu etiketi silmek istediğine emin misin?")) return;
    const res = await fetch("/api/admin/tags", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    res.ok ? fetchTags() : alert(data.error || "Etiket silinirken hata oluştu");
  }

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "tags") fetchTags();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          {["users", "tags"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded transition-colors ${
                activeTab === tab
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tab === "users" ? "Kullanıcılar" : "Etiketler"}
            </button>
          ))}
        </div>

        {/* Kullanıcılar */}
        {activeTab === "users" && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center">
              <span className="w-2 h-6 bg-red-500 mr-2"></span>Kullanıcı Yönetimi
            </h1>
            {loading ? (
              <p className="text-center text-gray-400 py-8">Yükleniyor...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="p-3 text-left">ID</th>
                      <th className="p-3 text-left">Kullanıcı Adı</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Rol</th>
                      <th className="p-3 text-left">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="p-3">{u.id}</td>
                        <td className="p-3">@{u.username}</td>
                        <td className="p-3 text-gray-400">{u.email}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              u.role === "admin"
                                ? "bg-red-900/50 text-red-400"
                                : "bg-blue-900/50 text-blue-400"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 space-x-2">
                          <button
                            className={`${
                              u.role === "user"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-yellow-600 hover:bg-yellow-700"
                            } text-white px-3 py-1 rounded text-sm`}
                            onClick={() =>
                              changeRole(u.id, u.role === "user" ? "admin" : "user")
                            }
                          >
                            {u.role === "user" ? "Admin Yap" : "Kullanıcı Yap"}
                          </button>
                          <button
                            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                            onClick={() => deleteUser(u.id)}
                            disabled={u.role === "admin"}
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Etiketler */}
        {activeTab === "tags" && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center">
              <span className="w-2 h-6 bg-red-500 mr-2"></span>Etiket Yönetimi
            </h1>

            {/* Yeni Etiket Ekle */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Yeni Etiket Ekle</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Yeni etiket adı"
                />
                <button
                  onClick={addTag}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded"
                >
                  Ekle
                </button>
              </div>
              {tagMessage && (
                <p
                  className={`mt-2 ${
                    tagMessage.includes("hata") ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {tagMessage}
                </p>
              )}
            </div>

            {/* Etiket Listesi */}
            {tagList.length > 0 && (
              <>
                <h2 className="text-lg font-semibold mb-4">Mevcut Etiketler ({tagList.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tagList.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex justify-between items-center bg-gray-800/50 border border-gray-700 rounded p-3 hover:bg-gray-800"
                    >
                      <span>{tag.name}</span>
                      <button
                        onClick={() => deleteTag(tag.id)}
                        className="text-sm text-red-400 hover:text-red-600"
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
