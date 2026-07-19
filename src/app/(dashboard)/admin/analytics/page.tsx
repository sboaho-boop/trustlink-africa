"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"

interface Analytics {
  totalWorkers: number
  pendingWorkers: number
  approvedWorkers: number
  rejectedWorkers: number
  totalBookings: number
  completedBookings: number
  totalReviews: number
  averageRating: number
  topCategories: { category: string; count: number }[]
  recentActivity: { type: string; description: string; date: string }[]
}

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const { user, token } = useAuthStore()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setAnalytics(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
      return
    }
    fetchAnalytics()
  }, [user, router, fetchAnalytics])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted mt-1">Overview of platform performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Workers", value: analytics.totalWorkers, icon: "👷", color: "bg-blue-500" },
          { label: "Pending Approval", value: analytics.pendingWorkers, icon: "⏳", color: "bg-amber-500" },
          { label: "Total Bookings", value: analytics.totalBookings, icon: "📋", color: "bg-emerald-500" },
          { label: "Completed Jobs", value: analytics.completedBookings, icon: "✅", color: "bg-green-500" },
          { label: "Approved Workers", value: analytics.approvedWorkers, icon: "✓", color: "bg-emerald-600" },
          { label: "Rejected Workers", value: analytics.rejectedWorkers, icon: "✗", color: "bg-red-500" },
          { label: "Total Reviews", value: analytics.totalReviews, icon: "⭐", color: "bg-amber-600" },
          { label: "Average Rating", value: analytics.averageRating.toFixed(1), icon: "📊", color: "bg-purple-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <div className={`w-3 h-3 rounded-full ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Service Categories</h3>
          <div className="space-y-3">
            {analytics.topCategories.slice(0, 5).map((cat, index) => (
              <div key={cat.category} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-primary-light text-primary-dark rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-foreground">{cat.category}</span>
                    <span className="text-muted">{cat.count} workers</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(cat.count / analytics.totalWorkers) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {analytics.recentActivity.slice(0, 8).map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${
                  activity.type === "booking" ? "bg-blue-500" :
                  activity.type === "review" ? "bg-amber-500" :
                  activity.type === "worker" ? "bg-emerald-500" : "bg-gray-500"
                }`}>
                  {activity.type === "booking" ? "📋" :
                   activity.type === "review" ? "⭐" :
                   activity.type === "worker" ? "👷" : "📌"}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.description}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {new Date(activity.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Funnel */}
      <div className="mt-6 bg-white border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Verification Funnel</h3>
        <div className="flex items-center gap-4 flex-wrap">
          {[
            { label: "Total Applications", value: analytics.totalWorkers, color: "bg-gray-500" },
            { label: "Pending Review", value: analytics.pendingWorkers, color: "bg-amber-500" },
            { label: "Approved", value: analytics.approvedWorkers, color: "bg-emerald-500" },
            { label: "Rejected", value: analytics.rejectedWorkers, color: "bg-red-500" },
          ].map((item, index) => (
            <div key={item.label} className="flex items-center gap-4">
              <div className="text-center">
                <div className={`w-16 h-16 ${item.color} rounded-xl flex items-center justify-center text-white text-xl font-bold`}>
                  {item.value}
                </div>
                <p className="text-xs text-muted mt-2 max-w-[80px]">{item.label}</p>
              </div>
              {index < 3 && (
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
