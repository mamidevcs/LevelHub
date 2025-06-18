LevelHub
LevelHub, oyun geliştiricilerin birbirleriyle tanışabileceği, soru sorabileceği ve yardım alabileceği bir forum sitesidir.
Kullanıcılar konu açabilir, gönderilerine etiket ekleyebilir, yorum yapabilir ve gönderileri oylayabilir.
Ayrıca kullanıcılar özel mesajlaşma sistemi ile birbirleriyle iletişim kurabilir. Admin paneli sayesinde kullanıcı ve etiket yönetimi yapılabilir.

Proje Tanımı
Bu proje, oyun geliştiricilerin birbirleriyle bilgi paylaşımında bulunabileceği bir ortam oluşturmak amacıyla geliştirilmiştir.
Sorunlarını, projelerini ya da sorularını paylaşabilecekleri bir topluluk platformudur.

Genel özellikler:

Konu oluşturma ve düzenleme

Etiket ekleme

Gönderilere yorum yapma

Upvote ve downvote ile oylama

Kullanıcılar arası özel mesajlaşma

Admin paneli ile kullanıcı ve etiket yönetimi

Kullanılan Teknolojiler
Next.js

React

Prisma ORM

SQLite

TailwindCSS

Shadcn (UI bileşenleri için)

Kurulum Talimatları
Projeyi klonla:

bash
Kopyala
Düzenle
git clone https://github.com/kullaniciadi/LevelHub.git
cd LevelHub
Gerekli bağımlılıkları yükle:

nginx
Kopyala
Düzenle
npm install
.env dosyası oluştur ve içine şu satırı ekle:

ini
Kopyala
Düzenle
DATABASE_URL="file:./dev.db"
Veritabanı kur:

csharp
Kopyala
Düzenle
npx prisma migrate dev --name init
Uygulamayı çalıştır:

arduino
Kopyala
Düzenle
npm run dev
Tarayıcıdan şu adrese git:

arduino
Kopyala
Düzenle
http://localhost:3000
Admin Giriş Bilgileri
Test için kullanabileceğiniz admin hesabı:

E-posta: admin@example.com
Şifre: admin123

Not: Bu bilgiler sadece test amaçlıdır.

Notlar
Sadece "admin" rolüne sahip kullanıcılar admin paneline erişebilir.

Admin panelinde kullanıcı listesi görüntülenebilir, silinebilir veya yetkileri değiştirilebilir.

Admin, yeni etiketler ekleyebilir ve gönderileri silebilir.

Upvote ve downvote sistemi kullanıcıların saygınlık puanını etkiler.

Arama çubuğu ile konular arasında filtreleme yapılabilir.
