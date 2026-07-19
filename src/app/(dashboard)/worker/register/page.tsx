"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/ui/Button"
import Input, { Select, Textarea } from "@/components/ui/FormElements"
import { useAuthStore } from "@/lib/store"
import { SERVICE_CATEGORIES, REGIONS, GHANA_CITIES, AVAILABILITY_OPTIONS, DAYS_OF_WEEK, LANGUAGES } from "@/types"

export default function WorkerRegisterPage() {
  const router = useRouter()
  const { user, token } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
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
    availableDays: "mon,tue,wed,thu,fri",
    availableHours: "08:00-17:00",
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Photo must be less than 5MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleDay = (day: string) => {
    const days = form.availableDays.split(",")
    if (days.includes(day)) {
      update("availableDays", days.filter((d) => d !== day).join(","))
    } else {
      update("availableDays", [...days, day].join(","))
    }
  }

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
        body: JSON.stringify({
          ...form,
          profilePicture: photoPreview || "",
        }),
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

        {/* Photo Upload */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
            Profile Photo
          </h2>
          <div className="flex items-center gap-6">
            <div
              className="w-24 h-24 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <svg className="w-8 h-8 text-muted mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-muted mt-1 block">Upload</span>
                </div>
              )}
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                Choose Photo
              </Button>
              <p className="text-xs text-muted mt-2">JPG, PNG. Max 5MB.</p>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
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
            <Select
              label="Languages"
              value={form.languages}
              onChange={(e) => update("languages", e.target.value)}
              options={LANGUAGES.map((l) => ({ value: l, label: l }))}
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
            Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Region"
              required
              value={form.region}
              onChange={(e) => {
                update("region", e.target.value)
                update("location", "")
              }}
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
            <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
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
                label="Min Pay (GH\u20B5)"
                type="number"
                placeholder="100"
                value={form.expectedMinPay}
                onChange={(e) => update("expectedMinPay", e.target.value)}
              />
              <Input
                label="Max Pay (GH\u20B5)"
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

        {/* Availability Calendar */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
            Availability Schedule
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Available Days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      form.availableDays.includes(day.value)
                        ? "bg-primary text-white shadow-md"
                        : "bg-gray-100 text-muted hover:bg-gray-200"
                    }`}
                  >
                    {day.label.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Time"
                type="time"
                value={form.availableHours.split("-")[0] || "08:00"}
                onChange={(e) => update("availableHours", `${e.target.value}-${form.availableHours.split("-")[1] || "17:00"}`)}
              />
              <Input
                label="End Time"
                type="time"
                value={form.availableHours.split("-")[1] || "17:00"}
                onChange={(e) => update("availableHours", `${form.availableHours.split("-")[0] || "08:00"}-${e.target.value}`)}
              />
            </div>
          </div>
        </div>

        {/* References */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">6</span>
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
            <p className="text-xs text-muted">
              Include employer name, how long you worked for them, and their phone number
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
              <p className="font-medium mb-1">Verification Documents</p>
              <p>
                After submitting your profile, an admin will verify your identity (Ghana Card),
                references, and background. You&apos;ll receive a verification badge once approved.
              </p>
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
