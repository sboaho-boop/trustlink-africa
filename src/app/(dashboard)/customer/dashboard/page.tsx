"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Button from "@/components/ui/Button"
import TrustScoreBadge from "@/components/ui/Badges"
import { useAuthStore } from "@/lib/store"

interface BookingData {
  id: string
  workerId: string
  serviceType: string
  date: string
  duration: string
  location: string
  budget: number
  status: string
  worker?: {
    fullName: string
    serviceCategory: string
    trustScore: number
    profilePicture?: string
  }
}

interface SavedWorkerData {
  id: string
  workerId: string
  worker: {
    id: string
    fullName: string
    serviceCategory: string
    trustScore: number
    location: string
    region: string
    rating: number
    profilePicture?: string
  }
}

export default function CustomerDashboard() {
  const router = useRouter()
  const { user, token } = useAuthStore()
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [savedWorkers, setSavedWorkers] = useState<SavedWorkerData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"bookings" | "saved">("bookings")

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

  const fetchSavedWorkers = useCallback(async () => {
    try {
      const res = await fetch("/api/saved-workers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setSavedWorkers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    }
  }, [token])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchBookings()
    fetchSavedWorkers()
    setLoading(false)
  }, [user, router, fetchBookings, fetchSavedWorkers])

  const cancelBooking = async (bookingId: string) => {
    try {
      await fetch("/api/bookings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, status: "cancelled" }),
      })
      fetchBookings()
    } catch (err) {
      console.error(err)
    }
  }

  const removeSavedWorker = async (savedId: string) => {
    try {
      await fetch(`/api/saved-workers?id=${savedId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchSavedWorkers()
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

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-blue-100 text-blue-700",
    completed: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-700",
  }

  const upcomingBookings = bookings.filter((b) => ["pending", "accepted"].includes(b.status))
  const pastBookings = bookings.filter((b) => ["completed", "cancelled", "rejected"].includes(b.status))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted mt-1">Manage your bookings and saved workers</p>
        </div>
        <Link href="/search">
          <Button>Find Workers</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Bookings", value: bookings.length, icon: "📋" },
          { label: "Upcoming", value: upcomingBookings.length, icon: "📅" },
          { label: "Completed", value: pastBookings.filter((b) => b.status === "completed").length, icon: "✅" },
          { label: "Saved Workers", value: savedWorkers.length, icon: "❤️" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-border rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {(["bookings", "saved"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all capitalize ${
              activeTab === tab
                ? "bg-white text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab === "saved" ? "Saved Workers" : "My Bookings"}
          </button>
        ))}
      </div>

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <div className="space-y-6">
          {upcomingBookings.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Upcoming</h3>
              <div className="space-y-3">
                {upcomingBookings.map((b) => (
                  <div key={b.id} className="bg-white border border-border rounded-xl p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary-dark font-semibold text-sm">
                          {b.worker?.fullName?.charAt(0) || "W"}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{b.serviceType}</p>
                          <p className="text-sm text-muted">{b.worker?.fullName}</p>
                          <p className="text-sm text-muted">
                            {new Date(b.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                            {" \u00B7 "}GH\u20B5{b.budget}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[b.status] || "bg-gray-100"}`}>
                          {b.status}
                        </span>
                        {b.status === "pending" && (
                          <Button size="sm" variant="danger" onClick={() => cancelBooking(b.id)}>
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pastBookings.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Past</h3>
              <div className="space-y-3">
                {pastBookings.map((b) => (
                  <div key={b.id} className="bg-white border border-border rounded-xl p-4 shadow-sm opacity-75">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">{b.serviceType}</p>
                        <p className="text-sm text-muted">
                          {new Date(b.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {" \u00B7 "}GH\u20B5{b.budget}
                        </p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[b.status] || "bg-gray-100"}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {bookings.length === 0 && (
            <div className="bg-white border border-border rounded-xl p-12 text-center shadow-sm">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Bookings Yet</h3>
              <p className="text-muted mb-4">Start by finding a worker for your needs</p>
              <Link href="/search">
                <Button>Find Workers</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Saved Workers Tab */}
      {activeTab === "saved" && (
        <div>
          {savedWorkers.length > 0 ? (
            <div className="space-y-3">
              {savedWorkers.map((sw) => (
                <Link key={sw.id} href={`/workers/${sw.workerId}`}>
                  <div className="bg-white border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {sw.worker.profilePicture ? (
                          <img src={sw.worker.profilePicture} alt="" className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary-dark font-semibold">
                            {sw.worker.fullName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">{sw.worker.fullName}</p>
                          <p className="text-sm text-muted">{sw.worker.serviceCategory}</p>
                          <p className="text-xs text-muted">{sw.worker.location}, {sw.worker.region}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <TrustScoreBadge score={sw.worker.trustScore} size="sm" />
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            removeSavedWorker(sw.id)
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-border rounded-xl p-12 text-center shadow-sm">
              <div className="text-5xl mb-4">❤️</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Saved Workers</h3>
              <p className="text-muted mb-4">Save workers you like to find them quickly later</p>
              <Link href="/search">
                <Button>Find Workers</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
