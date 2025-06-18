import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


import { UserProvider } from "./context/UserContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LevelHub",
  description: "Oyun geliştirici forumu",
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
