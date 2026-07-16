"use client"

import Link from "next/link"
import { useAuthStore } from "@/lib/store"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted] = useState(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("trustlink_token")
      return !!token
    }
    return false
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const isActive = (path: string) => pathname === path

  if (!mounted) return null

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <svg viewBox="0 0 120 120" className="w-8 h-8">
                <defs>
                  <linearGradient id="nav-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#22c55e'}} />
                    <stop offset="100%" style={{stopColor:'#16a34a'}} />
                  </linearGradient>
                </defs>
                <path d="M60 8 L95 2 L95 55 Q95 85 60 105 Q25 85 25 55 L25 2 Z" fill="url(#nav-grad)" />
                <polyline points="38,52 52,68 82,35" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xl font-bold text-foreground">
                Trust<span className="text-primary">Link</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/search"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/search")
                    ? "bg-primary-light text-primary-dark"
                    : "text-muted hover:text-foreground hover:bg-gray-100"
                }`}
              >
                Find Workers
              </Link>
              {user?.role === "worker" && (
                <Link
                  href="/worker/profile"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/worker/profile")
                      ? "bg-primary-light text-primary-dark"
                      : "text-muted hover:text-foreground hover:bg-gray-100"
                  }`}
                >
                  My Profile
                </Link>
              )}
              {user?.role === "admin" && (
                <Link
                  href="/admin/workers"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname.startsWith("/admin")
                      ? "bg-primary-light text-primary-dark"
                      : "text-muted hover:text-foreground hover:bg-gray-100"
                  }`}
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-muted">
                  {user.email}
                  <span className="ml-1 text-xs bg-primary-light text-primary-dark px-2 py-0.5 rounded-full capitalize">
                    {user.role}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-muted hover:text-danger px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-1">
              <Link href="/search" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm text-muted hover:bg-gray-100">
                Find Workers
              </Link>
              {!user && (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm text-muted hover:bg-gray-100">
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm bg-primary text-white text-center mx-3">
                    Get Started
                  </Link>
                </>
              )}
              {user && (
                <button onClick={handleLogout} className="px-3 py-2 rounded-lg text-sm text-danger text-left hover:bg-red-50">
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
