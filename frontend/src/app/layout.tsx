import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DClaw Backup",
  description: "AI-native immutable backup platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen`}>
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50/50 p-6">{children}</main>
      </body>
    </html>
  )
}
