"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import TrustScoreBadge from "@/components/ui/Badges"
import Button from "@/components/ui/Button"
import { Textarea } from "@/components/ui/FormElements"
import { useAuthStore } from "@/lib/store"

interface Worker {
  id: string
  userId: string
  fullName: string
  phone: string
  location: string
  region: string
  serviceCategory: string
  yearsExperience: number
  verificationStatus: string
  trustScore: number
  idVerified: boolean
  referencesChecked: boolean
  employerConfirmed: boolean
  rating: number
  reviewCount: number
  totalJobs: number
  createdAt: string
  rejectionReason?: string
}

export default function AdminWorkersPage() {
  const router = useRouter()
  const { user, token } = useAuthStore()
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [rejectModal, setRejectModal] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const fetchWorkers = useCallback(async () => {
    try {
      const allRes = await fetch("/api/workers?page=1&limit=100")
      const allData = await allRes.json()
      let allWorkers = allData.workers || []

      if (filter !== "all") {
        allWorkers = allWorkers.filter((w: Worker) => w.verificationStatus === filter)
      }

      setWorkers(allWorkers)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWorkers()
  }, [user, router, fetchWorkers])

  const handleVerify = async (workerId: string, action: "approve" | "reject") => {
    try {
      await fetch(`/api/workers/${workerId}/verify`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action,
          rejectionReason: action === "reject" ? rejectReason : undefined,
        }),
      })
      setRejectModal(null)
      setRejectReason("")
      fetchWorkers()
    } catch (err) {
      console.error(err)
    }
  }

  const handleTrustUpdate = async (workerId: string, field: string, value: boolean) => {
    try {
      await fetch(`/api/workers/${workerId}/verify`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "updateTrustScore",
          [field]: value,
        }),
      })
      fetchWorkers()
    } catch (err) {
      console.error(err)
    }
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  }

  const stats = {
    total: workers.length,
    pending: workers.filter((w) => w.verificationStatus === "pending").length,
    approved: workers.filter((w) => w.verificationStatus === "approved").length,
    rejected: workers.filter((w) => w.verificationStatus === "rejected").length,
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-48 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted mt-1">Manage worker verification and trust scores</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Workers", value: stats.total, color: "text-foreground" },
          { label: "Pending Review", value: stats.pending, color: "text-amber-600" },
          { label: "Approved", value: stats.approved, color: "text-emerald-600" },
          { label: "Rejected", value: stats.rejected, color: "text-red-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-muted mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === tab
                ? "bg-primary text-white"
                : "bg-white border border-border text-muted hover:bg-gray-50"
            }`}
          >
            {tab} {tab !== "all" && `(${stats[tab]})`}
          </button>
        ))}
      </div>

      {/* Workers Table */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="text-left px-5 py-3 font-medium text-muted">Worker</th>
                <th className="text-left px-5 py-3 font-medium text-muted">Service</th>
                <th className="text-left px-5 py-3 font-medium text-muted">Location</th>
                <th className="text-left px-5 py-3 font-medium text-muted">Status</th>
                <th className="text-left px-5 py-3 font-medium text-muted">Trust</th>
                <th className="text-left px-5 py-3 font-medium text-muted">Verifications</th>
                <th className="text-right px-5 py-3 font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w.id} className="border-b border-border last:border-0 hover:bg-gray-50/50">
                  <td className="px-5 py-4">
                    <div>
                      <div className="font-medium text-foreground">{w.fullName}</div>
                      <div className="text-xs text-muted">{w.phone}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted">{w.serviceCategory}</td>
                  <td className="px-5 py-4 text-muted">{w.location}, {w.region}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[w.verificationStatus] || ""}`}>
                      {w.verificationStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <TrustScoreBadge score={w.trustScore} size="sm" showLabel={false} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <label className="flex items-center gap-1.5 text-xs">
                        <input
                          type="checkbox"
                          checked={w.idVerified}
                          onChange={(e) => handleTrustUpdate(w.id, "idVerified", e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        ID
                      </label>
                      <label className="flex items-center gap-1.5 text-xs">
                        <input
                          type="checkbox"
                          checked={w.referencesChecked}
                          onChange={(e) => handleTrustUpdate(w.id, "referencesChecked", e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        References
                      </label>
                      <label className="flex items-center gap-1.5 text-xs">
                        <input
                          type="checkbox"
                          checked={w.employerConfirmed}
                          onChange={(e) => handleTrustUpdate(w.id, "employerConfirmed", e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        Employer
                      </label>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {w.verificationStatus === "pending" && (
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" onClick={() => handleVerify(w.id, "approve")}>
                          Approve
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setRejectModal(w.id)}>
                          Reject
                        </Button>
                      </div>
                    )}
                    {w.verificationStatus === "approved" && (
                      <span className="text-xs text-emerald-600 font-medium">Verified</span>
                    )}
                    {w.verificationStatus === "rejected" && (
                      <span className="text-xs text-red-600 font-medium">Rejected</span>
                    )}
                  </td>
                </tr>
              ))}
              {workers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-muted">
                    No workers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setRejectModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-foreground mb-4">Reject Worker</h2>
            <Textarea
              label="Reason for rejection"
              placeholder="Explain why this application is being rejected..."
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <Button variant="danger" onClick={() => handleVerify(rejectModal, "reject")}>
                Confirm Rejection
              </Button>
              <Button variant="outline" onClick={() => setRejectModal(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
