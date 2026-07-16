"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/FormElements"
import { useAuthStore } from "@/lib/store"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuth } = useAuthStore()
  const registered = searchParams.get("registered")

  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const success = registered === "true" ? "Account created successfully! Please sign in." : ""
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login failed")
        return
      }

      setAuth(data.user, data.token)

      if (data.user.role === "admin") {
        router.push("/admin/workers")
      } else if (data.user.role === "worker") {
        router.push("/worker/profile")
      } else {
        router.push("/search")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <svg viewBox="0 0 120 120" className="w-10 h-10">
              <defs>
                <linearGradient id="login-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#22c55e'}} />
                  <stop offset="100%" style={{stopColor:'#16a34a'}} />
                </linearGradient>
              </defs>
              <path d="M60 8 L95 2 L95 55 Q95 85 60 105 Q25 85 25 55 L25 2 Z" fill="url(#login-grad)" />
              <polyline points="38,52 52,68 82,35" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-2xl font-bold text-foreground">
              Trust<span className="text-primary">Link</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted mt-2">Sign in to your TrustLink account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-8 shadow-sm space-y-5">
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-lg">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Sign In
          </Button>

          <p className="text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-muted">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
