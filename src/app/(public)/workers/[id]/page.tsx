"use client"

import { useState, useEffect, useCallback, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import TrustScoreBadge, { VerifiedBadge, StarRating } from "@/components/ui/Badges"
import Button from "@/components/ui/Button"
import { Textarea } from "@/components/ui/FormElements"
import { useAuthStore } from "@/lib/store"
import type { WorkerProfile } from "@/types"

export default function WorkerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, token } = useAuthStore()
  const [worker, setWorker] = useState<WorkerProfile & { reviews?: Array<{ id: string; rating: number; comment: string; createdAt: string; author: { email: string } }> } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBooking, setShowBooking] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    serviceType: "",
    description: "",
    date: "",
    duration: "4 hours",
    location: "",
    budget: "",
    notes: "",
  })
  const [reviewForm, setReviewForm] = useState({ rating: 5, ratingPunctuality: 5, ratingQuality: 5, ratingCommunication: 5, comment: "" })
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)

  const fetchWorker = useCallback(async () => {
    try {
      const res = await fetch(`/api/workers/${id}`)
      const data = await res.json()
      setWorker(data)
    } catch (err) {
      console.error("Failed to fetch worker:", err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchWorker()
    if (token) {
      fetch("/api/saved-workers", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setIsSaved(data.some((sw: { workerId: string }) => sw.workerId === id))
          }
        })
        .catch(console.error)
    }
  }, [fetchWorker, token, id])

  const toggleSaveWorker = async () => {
    if (!token) {
      router.push("/login")
      return
    }
    try {
      if (isSaved) {
        const res = await fetch("/api/saved-workers", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        const saved = Array.isArray(data) ? data.find((sw: { workerId: string }) => sw.workerId === id) : null
        if (saved) {
          await fetch(`/api/saved-workers?id=${saved.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
        }
        setIsSaved(false)
      } else {
        await fetch("/api/saved-workers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ workerId: id }),
        })
        setIsSaved(true)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const shareWorker = (platform: string) => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    const text = `Check out ${worker?.fullName} on TrustLink Africa - ${worker?.serviceCategory}`

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank")
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank")
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
        break
      case "copy":
        navigator.clipboard.writeText(url)
        setMessage("Link copied to clipboard!")
        break
    }
    setShareMenuOpen(false)
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      router.push("/login")
      return
    }

    setSubmitting(true)
    setMessage("")
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...bookingForm, workerId: id }),
      })

      if (res.ok) {
        setMessage("Booking request sent successfully!")
        setShowBooking(false)
        setBookingForm({ serviceType: "", description: "", date: "", duration: "4 hours", location: "", budget: "", notes: "" })
      } else {
        const data = await res.json()
        setMessage(data.error || "Failed to send booking request")
      }
    } catch {
      setMessage("Network error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      router.push("/login")
      return
    }

    setSubmitting(true)
    setMessage("")
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ workerId: id, ...reviewForm }),
      })

      if (res.ok) {
        setMessage("Review submitted successfully!")
        setShowReview(false)
        setReviewForm({ rating: 5, ratingPunctuality: 5, ratingQuality: 5, ratingCommunication: 5, comment: "" })
        fetchWorker()
      } else {
        const data = await res.json()
        setMessage(data.error || "Failed to submit review")
      }
    } catch {
      setMessage("Network error")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!worker) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Worker Not Found</h1>
        <Link href="/search" className="text-primary hover:underline">
          Back to Search
        </Link>
      </div>
    )
  }

  const initials = worker.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/search" className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Search
      </Link>

      {/* Profile Header */}
      <div className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative">
            {worker.profilePicture ? (
              <img src={worker.profilePicture} alt={worker.fullName} className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center ring-4 ring-primary/20">
                <span className="text-primary-dark font-bold text-2xl">{initials}</span>
              </div>
            )}
            {worker.isOnline && (
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
              <h1 className="text-2xl font-bold text-foreground">{worker.fullName}</h1>
              {worker.isOnline && (
                <span className="text-xs text-emerald-600 font-medium">Active now</span>
              )}
              {worker.verificationStatus === "approved" && (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full w-fit">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified Worker
                </span>
              )}
            </div>

            <p className="text-primary font-medium mb-2">{worker.serviceCategory}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-4">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {worker.location}, {worker.region}
              </span>
              <span>{worker.yearsExperience} years experience</span>
              <span className="capitalize">{worker.availability.replace("-", " ")}</span>
            </div>

            <div className="flex items-center gap-4">
              <StarRating rating={worker.rating} count={worker.reviewCount} />
              <TrustScoreBadge score={worker.trustScore} size="md" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSaveWorker}
              className={`p-2 rounded-lg transition-colors ${
                isSaved ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              title={isSaved ? "Unsave worker" : "Save worker"}
            >
              <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <div className="relative">
              <button
                onClick={() => setShareMenuOpen(!shareMenuOpen)}
                className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                title="Share profile"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              {shareMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-border rounded-xl shadow-lg p-2 z-10 min-w-[160px]">
                  <button onClick={() => shareWorker("whatsapp")} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-gray-100 rounded-lg">
                    <span className="text-green-500">💬</span> WhatsApp
                  </button>
                  <button onClick={() => shareWorker("twitter")} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-gray-100 rounded-lg">
                    <span className="text-blue-400">🐦</span> Twitter
                  </button>
                  <button onClick={() => shareWorker("facebook")} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-gray-100 rounded-lg">
                    <span className="text-blue-600">📘</span> Facebook
                  </button>
                  <button onClick={() => shareWorker("copy")} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-gray-100 rounded-lg">
                    <span>🔗</span> Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Verification Badges */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Verification Status</h2>
            <div className="flex flex-wrap gap-2">
              <VerifiedBadge type="identity" verified={worker.idVerified} />
              <VerifiedBadge type="references" verified={worker.referencesChecked} />
              <VerifiedBadge type="employer" verified={worker.employerConfirmed} />
            </div>
          </div>

          {/* About */}
          {worker.bio && (
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-3">About</h2>
              <p className="text-muted text-sm leading-relaxed">{worker.bio}</p>
            </div>
          )}

          {/* Skills */}
          {worker.skills && (
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {worker.skills.split(",").map((skill, i) => (
                  <span key={i} className="bg-gray-100 text-foreground text-xs px-3 py-1.5 rounded-full">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Reviews</h2>
              {user && (
                <Button variant="outline" size="sm" onClick={() => setShowReview(!showReview)}>
                  Write Review
                </Button>
              )}
            </div>

            {showReview && (
              <form onSubmit={handleReview} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Overall Rating</label>
                  <StarRating
                    rating={reviewForm.rating}
                    interactive
                    onChange={(r) => setReviewForm({ ...reviewForm, rating: r })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Punctuality</label>
                    <select
                      value={reviewForm.ratingPunctuality}
                      onChange={(e) => setReviewForm({ ...reviewForm, ratingPunctuality: parseInt(e.target.value) })}
                      className="w-full px-2 py-1.5 rounded border border-border text-sm"
                    >
                      {[5, 4, 3, 2, 1].map((v) => (
                        <option key={v} value={v}>{v} Star{v !== 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Quality</label>
                    <select
                      value={reviewForm.ratingQuality}
                      onChange={(e) => setReviewForm({ ...reviewForm, ratingQuality: parseInt(e.target.value) })}
                      className="w-full px-2 py-1.5 rounded border border-border text-sm"
                    >
                      {[5, 4, 3, 2, 1].map((v) => (
                        <option key={v} value={v}>{v} Star{v !== 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Communication</label>
                    <select
                      value={reviewForm.ratingCommunication}
                      onChange={(e) => setReviewForm({ ...reviewForm, ratingCommunication: parseInt(e.target.value) })}
                      className="w-full px-2 py-1.5 rounded border border-border text-sm"
                    >
                      {[5, 4, 3, 2, 1].map((v) => (
                        <option key={v} value={v}>{v} Star{v !== 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Textarea
                  label="Comment"
                  placeholder="Share your experience..."
                  rows={3}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm" loading={submitting}>Submit</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowReview(false)}>Cancel</Button>
                </div>
              </form>
            )}

            {worker.reviews && worker.reviews.length > 0 ? (
              <div className="space-y-4">
                {worker.reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {review.author.email.split("@")[0]}
                      </span>
                      <StarRating rating={review.rating} />
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted">{review.comment}</p>
                    )}
                    <p className="text-xs text-muted mt-1">
                      {new Date(review.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No reviews yet.</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Languages</span>
                <span className="text-foreground font-medium">{worker.languages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Availability</span>
                <span className="text-foreground font-medium capitalize">{worker.availability.replace("-", " ")}</span>
              </div>
              {worker.expectedMinPay && worker.expectedMaxPay && (
                <div className="flex justify-between">
                  <span className="text-muted">Expected Pay</span>
                  <span className="text-foreground font-medium">
                    GH₵{worker.expectedMinPay} - GH₵{worker.expectedMaxPay}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted">Completed Jobs</span>
                <span className="text-foreground font-medium">{worker.totalJobs}</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Contact</h2>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => setShowBooking(!showBooking)}>
                Request Service
              </Button>
              {user && user.id !== worker.userId && (
                <Link
                  href="/messages"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Send Message
                </Link>
              )}
              {worker.phone && (
                <a
                  href={`tel:${worker.phone}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call {worker.phone}
                </a>
              )}
              {worker.whatsapp && (
                <a
                  href={`https://wa.me/${worker.whatsapp.replace(/\s/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Availability</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted mb-2">Working Days</p>
                <div className="flex flex-wrap gap-1.5">
                  {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => {
                    const isAvailable = worker.availableDays?.includes(day)
                    return (
                      <span
                        key={day}
                        className={`px-2.5 py-1 rounded text-xs font-medium ${
                          isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </span>
                    )
                  })}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted mb-1">Working Hours</p>
                <p className="text-sm font-medium text-foreground">{worker.availableHours || "08:00-17:00"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowBooking(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-foreground mb-4">Request Service from {worker.fullName}</h2>

            {message && (
              <div className={`text-sm px-4 py-3 rounded-lg mb-4 ${
                message.includes("success") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Service Type *</label>
                <input
                  type="text"
                  required
                  value={bookingForm.serviceType}
                  onChange={(e) => setBookingForm({ ...bookingForm, serviceType: e.target.value })}
                  placeholder={worker.serviceCategory}
                  className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={bookingForm.description}
                  onChange={(e) => setBookingForm({ ...bookingForm, description: e.target.value })}
                  placeholder="Describe what you need..."
                  className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Duration *</label>
                  <select
                    required
                    value={bookingForm.duration}
                    onChange={(e) => setBookingForm({ ...bookingForm, duration: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>2 hours</option>
                    <option>4 hours</option>
                    <option>6 hours</option>
                    <option>8 hours (Full day)</option>
                    <option>Ongoing</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Location *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.location}
                    onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
                    placeholder="Area / Address"
                    className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Budget (GH₵) *</label>
                  <input
                    type="number"
                    required
                    value={bookingForm.budget}
                    onChange={(e) => setBookingForm({ ...bookingForm, budget: e.target.value })}
                    placeholder="150"
                    className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Notes</label>
                <textarea
                  rows={2}
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  placeholder="Any special instructions..."
                  className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" loading={submitting} className="flex-1">
                  Send Request
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowBooking(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
