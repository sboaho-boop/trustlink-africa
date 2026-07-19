"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import WorkerCard from "@/components/worker/WorkerCard"
import { Select } from "@/components/ui/FormElements"
import { SERVICE_CATEGORIES, REGIONS, GHANA_CITIES, AVAILABILITY_OPTIONS } from "@/types"
import type { WorkerProfile } from "@/types"

function SearchContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || ""

  const [workers, setWorkers] = useState<WorkerProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [filters, setFilters] = useState({
    category: initialCategory,
    region: "",
    city: "",
    availability: "",
    minExperience: "",
    sort: "trustScore",
    search: "",
    onlineOnly: false,
  })

  const fetchWorkers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.category) params.set("category", filters.category)
      if (filters.region) params.set("region", filters.region)
      if (filters.city) params.set("city", filters.city)
      if (filters.availability) params.set("availability", filters.availability)
      if (filters.minExperience) params.set("minExperience", filters.minExperience)
      if (filters.sort) params.set("sort", filters.sort)
      if (filters.search) params.set("search", filters.search)
      if (filters.onlineOnly) params.set("onlineOnly", "true")
      params.set("page", page.toString())

      const res = await fetch(`/api/workers?${params}`)
      const data = await res.json()
      setWorkers(data.workers || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      console.error("Failed to fetch workers:", err)
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWorkers()
  }, [fetchWorkers])

  const cities = filters.region ? GHANA_CITIES[filters.region] || [] : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Find Trusted Workers</h1>
        <p className="text-muted mt-1">
          {total} verified {filters.category || "workers"} available
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-border rounded-xl p-5 mb-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Search</label>
            <input
              type="text"
              placeholder="Name, skill, location..."
              value={filters.search}
              onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1) }}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Select
            label="Service"
            value={filters.category}
            onChange={(e) => { setFilters({ ...filters, category: e.target.value }); setPage(1) }}
            placeholder="All services"
            options={SERVICE_CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
          <Select
            label="Region"
            value={filters.region}
            onChange={(e) => { setFilters({ ...filters, region: e.target.value, city: "" }); setPage(1) }}
            placeholder="All regions"
            options={REGIONS.map((r) => ({ value: r, label: r }))}
          />
          <Select
            label="City"
            value={filters.city}
            onChange={(e) => { setFilters({ ...filters, city: e.target.value }); setPage(1) }}
            placeholder="All cities"
            options={cities.map((c) => ({ value: c, label: c }))}
          />
          <Select
            label="Availability"
            value={filters.availability}
            onChange={(e) => { setFilters({ ...filters, availability: e.target.value }); setPage(1) }}
            placeholder="Any"
            options={[...AVAILABILITY_OPTIONS]}
          />
          <Select
            label="Experience"
            value={filters.minExperience}
            onChange={(e) => { setFilters({ ...filters, minExperience: e.target.value }); setPage(1) }}
            placeholder="Any"
            options={[
              { value: "1", label: "1+ years" },
              { value: "2", label: "2+ years" },
              { value: "3", label: "3+ years" },
              { value: "5", label: "5+ years" },
              { value: "10", label: "10+ years" },
            ]}
          />
          <Select
            label="Sort By"
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            options={[
              { value: "trustScore", label: "Trust Score" },
              { value: "rating", label: "Rating" },
              { value: "experience", label: "Experience" },
              { value: "newest", label: "Newest" },
              { value: "price", label: "Price (Low to High)" },
            ]}
          />
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-lg border border-border hover:bg-gray-50 transition-colors w-full">
              <input
                type="checkbox"
                checked={filters.onlineOnly}
                onChange={(e) => { setFilters({ ...filters, onlineOnly: e.target.checked }); setPage(1) }}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">Online Now</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-border rounded-xl p-5 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : workers.length === 0 ? (
        <div className="text-center py-20 bg-white border border-border rounded-xl">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No workers found</h3>
          <p className="text-muted max-w-md mx-auto">
            Try adjusting your filters or search terms to find available workers in your area.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {workers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-muted">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-center text-muted">Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
