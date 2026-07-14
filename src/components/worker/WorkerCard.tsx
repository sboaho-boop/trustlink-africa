"use client"

import Link from "next/link"
import TrustScoreBadge, { StarRating } from "@/components/ui/Badges"
import type { WorkerProfile } from "@/types"

interface WorkerCardProps {
  worker: WorkerProfile
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  const initials = worker.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Link href={`/workers/${worker.id}`}>
      <div className="bg-white border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-200 cursor-pointer group">
        <div className="flex items-start gap-4">
          {worker.profilePicture ? (
            <img
              src={worker.profilePicture}
              alt={worker.fullName}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center ring-2 ring-primary/20">
              <span className="text-primary-dark font-bold text-lg">{initials}</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {worker.fullName}
                </h3>
                <p className="text-sm text-muted">{worker.serviceCategory}</p>
              </div>
              {worker.verificationStatus === "approved" && (
                <div className="flex-shrink-0 bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2 text-xs text-muted">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {worker.location}, {worker.region}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {worker.yearsExperience}yr exp
              </span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <StarRating rating={worker.rating} />
                {worker.reviewCount > 0 && (
                  <span className="text-xs text-muted">({worker.reviewCount})</span>
                )}
              </div>
              <TrustScoreBadge score={worker.trustScore} size="sm" showLabel={false} />
            </div>

            {worker.expectedMinPay && worker.expectedMaxPay && (
              <div className="mt-2 text-xs text-muted">
                GH₵{worker.expectedMinPay} - GH₵{worker.expectedMaxPay}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
