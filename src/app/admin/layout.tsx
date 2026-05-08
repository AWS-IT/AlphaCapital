import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const sans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Админ-панель",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`${sans.variable} font-sans`}>{children}</div>;
}
