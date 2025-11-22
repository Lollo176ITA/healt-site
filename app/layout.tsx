import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { UserBadge } from "./components/UserBadge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Regia AI Visite di Controllo",
  description:
    "Profilazione paziente, agenda proattiva e richiesta dati all'ente salute orchestrati da AI multi-layer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0d131c] text-white`}
      >
        <div className="min-h-screen">
          <header className="sticky top-0 z-40 bg-[#0d131c]/80 backdrop-blur border-b border-white/10">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="text-lg font-semibold tracking-tight">
                Regia AI Salute
              </div>
              <div className="flex items-center gap-4">
                <nav className="flex items-center gap-4 text-sm text-slate-200">
                  <Link className="hover:text-white" href="/">
                    Home
                  </Link>
                  <Link className="hover:text-white" href="/profilo">
                    Inserimento dati
                  </Link>
                  <Link className="hover:text-white" href="/dashboard">
                    Dashboard
                  </Link>
                  <Link className="hover:text-white" href="/login">
                    Login
                  </Link>
                </nav>
                <UserBadge />
              </div>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
