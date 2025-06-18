# 🎮 LevelHub

**LevelHub**, oyun geliştiricilerin birbiriyle tanışabileceği, soru sorabileceği ve yardım alabileceği bir forum sitesidir.  
Kullanıcılar konu açabilir, etiket ekleyebilir, yorum yapabilir ve gönderileri oylayabilir.  
Ayrıca kullanıcılar arasında özel mesajlaşma ve admin paneli gibi gelişmiş özellikler de mevcuttur.

---

## 🚀 Proje Tanımı

Bu proje, oyun geliştirme topluluğunun birbirine destek olabileceği bir ortam sunmayı amaçlar.  
**Amaç:** Yardımsever bir topluluk oluşturmak, bilgi paylaşımını kolaylaştırmak.  
**Genel İşleyiş:**
- Konu oluşturma, etiketleme, yorum yapma
- Upvote/downvote ile gönderi oylama
- Kullanıcılar arası özel mesajlaşma
- Admin paneli üzerinden kullanıcı ve etiket yönetimi

---

## 🧰 Kullanılan Teknolojiler

- **Next.js** – React tabanlı framework
- **React** – UI bileşenleri için
- **Prisma ORM** – Veritabanı işlemleri için
- **SQLite** – Hafif ve kolay veritabanı
- **TailwindCSS** – CSS stillendirme
  
---

## ⚙️ Kurulum Talimatları

1. Bu repoyu klonla:
   ```
   git clone https://github.com/kullaniciadi/LevelHub.git
   cd LevelHub
Gerekli paketleri yükle:


npm install
.env dosyasını oluştur ve şu veritabanı bağlantısını ekle:


DATABASE_URL="file:./dev.db"
Veritabanı migrasyonlarını çalıştır:


npx prisma migrate dev --name init
Uygulamayı başlat:


npm run dev
Tarayıcında aç:

http://localhost:3000
🔐 Admin Giriş Bilgileri

E-posta: admin@mail.com  
Şifre: 123
Bu hesap sadece test amaçlıdır. Gerçek uygulamalarda güçlü parola ve güvenlik önlemleri eklenmelidir.

📎 Notlar
admin rolüne sahip kullanıcılar admin paneline erişebilir.(http://localhost:3000/admin)

Admin panelinden kullanıcılar silinebilir, roller düzenlenebilir ve konu etiketleri eklenebilir/silinebilir.

Upvote/downvote sistemi kullanıcı saygınlık puanını etkiler.
