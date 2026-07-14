"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/ui/Button"
import Input, { Select, Textarea } from "@/components/ui/FormElements"
import { useAuthStore } from "@/lib/store"
import { SERVICE_CATEGORIES, REGIONS, GHANA_CITIES, AVAILABILITY_OPTIONS } from "@/types"

export default function WorkerRegisterPage() {
  const router = useRouter()
  const { user, token } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    whatsapp: "",
    age: "",
    gender: "",
    region: "Greater Accra",
    location: "",
    languages: "English",
    serviceCategory: "",
    yearsExperience: "",
    skills: "",
    availability: "full-time",
    expectedMinPay: "",
    expectedMaxPay: "",
    bio: "",
    references: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const cities = GHANA_CITIES[form.region] || []

  const update = (field: string, value: string) => setForm({ ...form, [field]: value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!form.fullName || !form.phone || !form.location || !form.serviceCategory) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/workers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create profile")
        return
      }

      router.push("/worker/profile")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Register as a Worker</h1>
        <p className="text-muted mt-2">
          Complete your profile to get verified and start receiving job requests.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Personal Info */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              placeholder="Ama Mensah"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />
            <Input
              label="Phone Number"
              required
              placeholder="+233 XX XXX XXXX"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
            <Input
              label="WhatsApp Number"
              placeholder="+233 XX XXX XXXX"
              value={form.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
            />
            <Input
              label="Age"
              type="number"
              placeholder="25"
              value={form.age}
              onChange={(e) => update("age", e.target.value)}
            />
            <Select
              label="Gender"
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
              placeholder="Select"
              options={[
                { value: "female", label: "Female" },
                { value: "male", label: "Male" },
                { value: "other", label: "Other" },
              ]}
            />
            <Input
              label="Languages"
              placeholder="English, Twi, Ga"
              value={form.languages}
              onChange={(e) => update("languages", e.target.value)}
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
            Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Region"
              required
              value={form.region}
              onChange={(e) => { update("region", e.target.value); update("location", "") }}
              options={REGIONS.map((r) => ({ value: r, label: r }))}
            />
            <Select
              label="City / Area"
              required
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Select city"
              options={cities.map((c) => ({ value: c, label: c }))}
            />
          </div>
        </div>

        {/* Professional Info */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
            Professional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Service Category"
              required
              value={form.serviceCategory}
              onChange={(e) => update("serviceCategory", e.target.value)}
              placeholder="Select your main service"
              options={SERVICE_CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
            <Input
              label="Years of Experience"
              type="number"
              placeholder="3"
              value={form.yearsExperience}
              onChange={(e) => update("yearsExperience", e.target.value)}
            />
            <Select
              label="Availability"
              value={form.availability}
              onChange={(e) => update("availability", e.target.value)}
              options={[...AVAILABILITY_OPTIONS]}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Min Pay (GH₵)"
                type="number"
                placeholder="100"
                value={form.expectedMinPay}
                onChange={(e) => update("expectedMinPay", e.target.value)}
              />
              <Input
                label="Max Pay (GH₵)"
                type="number"
                placeholder="300"
                value={form.expectedMaxPay}
                onChange={(e) => update("expectedMaxPay", e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <Input
              label="Skills"
              placeholder="Ironing, Deep cleaning, Organizing (comma-separated)"
              value={form.skills}
              onChange={(e) => update("skills", e.target.value)}
              helperText="Separate skills with commas"

            />
            <Textarea
              label="Bio"
              placeholder="Tell customers about yourself, your experience, and what makes you reliable..."
              rows={4}
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
            />
          </div>
        </div>

        {/* References */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
            References & Documents
          </h2>
          <div className="space-y-4">
            <Textarea
              label="References"
              placeholder="Previous employer name, relationship, phone number..."
              rows={4}
              value={form.references}
              onChange={(e) => update("references", e.target.value)}
            />
            <p className="text-xs text-muted">Include employer name, how long you worked for them, and their phone number</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
              <p className="font-medium mb-1">Verification Documents</p>
              <p>After submitting your profile, an admin will verify your identity (Ghana Card), references, and background. You&apos;ll receive a verification badge once approved.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" loading={loading} size="lg">
            Submit Profile for Verification
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
