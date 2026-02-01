"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Clock, LayoutDashboard, LogOut } from 'lucide-react'
import { TopBar } from '@/components/dashboard/top-bar'
import { useGetProfileQuery } from '@/services/doctor'

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: user, isLoading } = useGetProfileQuery()
  
  const navItems = [
    { href: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/doctor/appointments', label: 'Upcoming Appointments', icon: Calendar },
    { href: '/doctor/availability', label: 'Add Availability', icon: Clock },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="flex h-16 items-center border-b border-border px-6">
          <h2 className="text-lg font-semibold text-foreground">Doctor Portal</h2>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-border p-4">
          <button 
            onClick={() => {
              localStorage.removeItem('accessToken')
              window.location.href = '/doctor/login'
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <TopBar user={user} isLoading={isLoading} />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
