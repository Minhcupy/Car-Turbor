"use client"

import type React from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import "./globals2.css"
import { AuthProvider } from "@/src/context/AuthContext"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="relative min-h-screen bg-gray-50">
        {children}
      </main>
      <Footer />
    </AuthProvider>
  )
}

