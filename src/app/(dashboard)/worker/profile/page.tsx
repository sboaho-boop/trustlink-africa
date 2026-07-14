"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import TrustScoreBadge, { VerifiedBadge, StarRating } from "@/components/ui/Badges"
import Button from "@/components/ui/Button"
import { useAuthStore } from "@/lib/store"
import type { WorkerProfile } from "@/types"

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

  const fetchWorker = useCallback(async () => {
    try {
      const res = await fetch("/api/workers?page=1", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      const myWorker = data.workers?.find((w: WorkerProfile) => w.userId === user?.id)
      setWorker(myWorker || null)
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWorker()
    fetchBookings()
  }, [user, router, fetchWorker, fetchBookings])

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

  const initials = worker.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Worker Profile</h1>
        <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColors[worker.verificationStatus] || "bg-gray-100"}`}>
          {worker.verificationStatus === "approved" ? "✓ " : ""}{worker.verificationStatus}
        </span>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center ring-4 ring-primary/20">
            <span className="text-primary-dark font-bold text-2xl">{initials}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground mb-1">{worker.fullName}</h2>
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
            Your profile is under review. An admin will verify your identity, references, and background. You&apos;ll be notified once approved.
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          <VerifiedBadge type="identity" verified={worker.idVerified} />
          <VerifiedBadge type="references" verified={worker.referencesChecked} />
          <VerifiedBadge type="employer" verified={worker.employerConfirmed} />
        </div>
      </div>

      {/* Bookings */}
      <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">My Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-muted py-8 text-center">No bookings yet. Once customers request your services, they will appear here.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">{b.serviceType}</p>
                    <p className="text-sm text-muted">{b.location} &middot; {b.duration}</p>
                    <p className="text-sm text-muted">
                      {new Date(b.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      {" &middot; "}GH₵{b.budget}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[b.status] || "bg-gray-100"}`}>
                      {b.status}
                    </span>
                    {b.status === "pending" && (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => updateBookingStatus(b.id, "accepted")}>Accept</Button>
                        <Button size="sm" variant="danger" onClick={() => updateBookingStatus(b.id, "rejected")}>Reject</Button>
                      </div>
                    )}
                    {b.status === "accepted" && (
                      <Button size="sm" variant="secondary" onClick={() => updateBookingStatus(b.id, "completed")}>Complete</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
