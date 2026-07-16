"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Button from "@/components/ui/Button"
import Input, { Select } from "@/components/ui/FormElements"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  })
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!agreed) {
      setError("You must agree to the Privacy Policy and Terms of Service")
      return
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Registration failed")
        return
      }

      router.push("/login?registered=true")
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
                <linearGradient id="register-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#22c55e'}} />
                  <stop offset="100%" style={{stopColor:'#16a34a'}} />
                </linearGradient>
              </defs>
              <path d="M60 8 L95 2 L95 55 Q95 85 60 105 Q25 85 25 55 L25 2 Z" fill="url(#register-grad)" />
              <polyline points="38,52 52,68 82,35" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-2xl font-bold text-foreground">
              Trust<span className="text-primary">Link</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create Your Account</h1>
          <p className="text-muted mt-2">Join TrustLink and connect with trusted workers</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-8 shadow-sm space-y-5">
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
            placeholder="Min. 6 characters"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            required
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />

          <Select
            label="I want to"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            options={[
              { value: "customer", label: "Find a worker" },
              { value: "worker", label: "Offer my services" },
            ]}
          />

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agree-terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="agree-terms" className="text-sm text-muted leading-snug">
              I agree to the{" "}
              <Link href="/privacy-policy" target="_blank" className="text-primary font-medium hover:underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms-of-service" target="_blank" className="text-primary font-medium hover:underline">
                Terms of Service
              </Link>
            </label>
          </div>

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Create Account
          </Button>

          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
