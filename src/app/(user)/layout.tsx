import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import AuthProviders from "@/lib/AuthProvider";
import Navbar from "../components/utils/Navbar";
import ProgressBarProvider from "@/lib/ProgressBar";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ruang Belajar",
  description: "Tingkatkan Jumlah Literasi siswa bersama kami",
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
        <AuthProviders>
          <ProgressBarProvider>
            <Navbar />
            {children}
            <Toaster/>
          </ProgressBarProvider>
        </AuthProviders>
      </body>
    </html>
  );
}
