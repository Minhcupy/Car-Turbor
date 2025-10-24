'use client'

import React from 'react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { ThemeProvider } from '@/components/theme-provider'
import './globals1.css'

export default function AdminLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AdminLayout>{children}</AdminLayout>
    </ThemeProvider>
  )
}
