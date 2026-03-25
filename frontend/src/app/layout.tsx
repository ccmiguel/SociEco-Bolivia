import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SOCIECO - Transforma tus residuos en impacto positivo",
  description: "Únete a la economía circular y cuida nuestro planeta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} pb-24`}>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
