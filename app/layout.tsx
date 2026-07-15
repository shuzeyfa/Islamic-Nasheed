import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AudioEngine from "./components/AudioEngine";
import PlayerBar from "./components/PlayerBar";
import NavBar from "./components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Islamic Nasheed Player",
  description: "A Spotify-style nasheed player built with Next.js, featuring a global audio engine using the HTML Media API, centralized playback state, real-time visualizers, keyboard and OS media controls, and persistent user preferences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* global audio element + media session + shortcuts; playback survives navigation */}
        <AudioEngine />
        <div className="flex flex-col h-screen">
          <NavBar />
          <main className="flex-1 min-h-0 overflow-hidden">
            {children}
          </main>
          <PlayerBar />
        </div>
      </body>
    </html>
  );
}
