"use client";
import { createContext, useState, useEffect } from "react";

// Kullanıcı bilgisini tutmak için context
export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Sayfa yüklendiğinde localStorage'dan kullanıcıyı alıp state'e koy
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Çıkış yapınca kullanıcıyı temizle ve localStorage'ı sıfırla
  function logout() {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.clear();
  }

  // Context sağlayıcısı, alt bileşenlere user, setUser ve logout fonksiyonlarını verir
  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
