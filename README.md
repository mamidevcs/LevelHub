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
- **Shadcn/UI** – Arayüz bileşenleri (isteğe bağlı)
- **Zustand / Context API** – State yönetimi (kullandıysan belirt)

---

## ⚙️ Kurulum Talimatları

1. Bu repoyu klonla:
   ```bash
   git clone https://github.com/kullaniciadi/LevelHub.git
   cd LevelHub
Gerekli paketleri yükle:

bash
Kopyala
Düzenle
npm install
.env dosyasını oluştur ve şu veritabanı bağlantısını ekle:

ini
Kopyala
Düzenle
DATABASE_URL="file:./dev.db"
Veritabanı migrasyonlarını çalıştır:

bash
Kopyala
Düzenle
npx prisma migrate dev --name init
Uygulamayı başlat:

bash
Kopyala
Düzenle
npm run dev
Tarayıcında aç:

arduino
Kopyala
Düzenle
http://localhost:3000
🔐 Admin Giriş Bilgileri
txt
Kopyala
Düzenle
E-posta: admin@example.com  
Şifre: admin123
Bu hesap sadece test amaçlıdır. Gerçek uygulamalarda güçlü parola ve güvenlik önlemleri eklenmelidir.

📎 Notlar
admin rolüne sahip kullanıcılar admin paneline erişebilir.

Admin panelinden kullanıcılar silinebilir, roller düzenlenebilir ve konu etiketleri eklenebilir/silinebilir.

Upvote/downvote sistemi kullanıcı saygınlık puanını etkiler.
