"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import TrustScoreBadge, { VerifiedBadge, StarRating } from "@/components/ui/Badges"
import Button from "@/components/ui/Button"
import { useAuthStore } from "@/lib/store"
import type { WorkerProfile } from "@/types"
import { DAYS_OF_WEEK } from "@/types"

interface BookingData {
  id: string
  workerId: string
  customerId: string
  serviceType: string
  description: string
  date: string
  duration: string
  location: string
  budget: number
  notes: string
  status: string
}

export default function WorkerProfilePage() {
  const router = useRouter()
  const { user, token } = useAuthStore()
  const [worker, setWorker] = useState<WorkerProfile | null>(null)
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "schedule">("overview")

  const fetchWorker = useCallback(async () => {
    try {
      const res = await fetch("/api/workers?page=1", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      const myWorker = data.workers?.find((w: WorkerProfile) => w.userId === user?.id)
      setWorker(myWorker || null)
      if (myWorker) setIsOnline(myWorker.isOnline)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [token, user])

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setBookings(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    }
  }, [token])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchWorker()
    fetchBookings()
  }, [user, router, fetchWorker, fetchBookings])

  const toggleOnlineStatus = async () => {
    try {
      await fetch(`/api/workers/${worker?.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isOnline: !isOnline }),
      })
      setIsOnline(!isOnline)
    } catch (err) {
      console.error(err)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      await fetch("/api/bookings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, status }),
      })
      fetchBookings()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-48 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!worker) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">👷</div>
        <h1 className="text-2xl font-bold text-foreground mb-3">No Worker Profile Found</h1>
        <p className="text-muted mb-6">Create your worker profile to start receiving job requests.</p>
        <Link href="/worker/register">
          <Button>Register as Worker</Button>
        </Link>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    accepted: "bg-blue-100 text-blue-700",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-gray-100 text-gray-700",
  }

  const availableDays = worker.availableDays?.split(",") || []
  const availableHours = worker.availableHours || "08:00-17:00"

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Worker Profile</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleOnlineStatus}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isOnline
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
            {isOnline ? "Online" : "Offline"}
          </button>
          <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColors[worker.verificationStatus] || "bg-gray-100"}`}>
            {worker.verificationStatus === "approved" ? "\u2713 " : ""}
            {worker.verificationStatus}
          </span>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {worker.profilePicture ? (
            <img
              src={worker.profilePicture}
              alt={worker.fullName}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center ring-4 ring-primary/20">
              <span className="text-primary-dark font-bold text-3xl">
                {worker.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </span>
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-foreground">{worker.fullName}</h2>
              {worker.isOnline && (
                <span className="flex items-center gap-1 text-xs text-emerald-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  Active now
                </span>
              )}
            </div>
            <p className="text-primary font-medium mb-2">{worker.serviceCategory}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-3">
              <span>{worker.location}, {worker.region}</span>
              <span>{worker.yearsExperience} years experience</span>
              <span className="capitalize">{worker.availability.replace("-", " ")}</span>
            </div>
            <div className="flex items-center gap-4">
              <StarRating rating={worker.rating} count={worker.reviewCount} />
              <TrustScoreBadge score={worker.trustScore} size="md" />
            </div>
          </div>
        </div>

        {worker.verificationStatus === "rejected" && worker.rejectionReason && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
            <p className="font-medium">Rejection Reason:</p>
            <p>{worker.rejectionReason}</p>
          </div>
        )}

        {worker.verificationStatus === "pending" && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700">
            Your profile is under review. An admin will verify your identity, references, and
            background. You&apos;ll be notified once approved.
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          <VerifiedBadge type="identity" verified={worker.idVerified} />
          <VerifiedBadge type="references" verified={worker.referencesChecked} />
          <VerifiedBadge type="employer" verified={worker.employerConfirmed} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {(["overview", "bookings", "schedule"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all capitalize ${
              activeTab === tab
                ? "bg-white text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Ratings Breakdown */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Rating Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: "Punctuality", rating: worker.ratingPunctuality, color: "bg-emerald-500" },
                { label: "Quality", rating: worker.ratingQuality, color: "bg-blue-500" },
                { label: "Communication", rating: worker.ratingCommunication, color: "bg-purple-500" },
                { label: "Value for Money", rating: worker.ratingValue, color: "bg-amber-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted">{item.label}</span>
                    <span className="font-medium text-foreground">{item.rating.toFixed(1)}/5</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${(item.rating / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Jobs", value: worker.totalJobs, icon: "📋" },
              { label: "Trust Score", value: worker.trustScore, icon: "🛡️" },
              { label: "Reviews", value: worker.reviewCount, icon: "⭐" },
              { label: "Rating", value: worker.rating.toFixed(1), icon: "📊" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-border rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">My Bookings</h3>
          {bookings.length === 0 ? (
            <p className="text-sm text-muted py-8 text-center">
              No bookings yet. Once customers request your services, they will appear here.
            </p>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">{b.serviceType}</p>
                      <p className="text-sm text-muted">
                        {b.location} &middot; {b.duration}
                      </p>
                      <p className="text-sm text-muted">
                        {new Date(b.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        {" \u00B7 "}GH\u20B5{b.budget}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                          statusColors[b.status] || "bg-gray-100"
                        }`}
                      >
                        {b.status}
                      </span>
                      {b.status === "pending" && (
                        <div className="flex gap-1">
                          <Button size="sm" onClick={() => updateBookingStatus(b.id, "accepted")}>
                            Accept
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => updateBookingStatus(b.id, "rejected")}>
                            Reject
                          </Button>
                        </div>
                      )}
                      {b.status === "accepted" && (
                        <Button size="sm" variant="secondary" onClick={() => updateBookingStatus(b.id, "completed")}>
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === "schedule" && (
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Availability Schedule</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Available Days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <span
                    key={day.value}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      availableDays.includes(day.value)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-muted"
                    }`}
                  >
                    {day.label}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Working Hours</label>
              <div className="flex items-center gap-2 text-foreground">
                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{availableHours}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
