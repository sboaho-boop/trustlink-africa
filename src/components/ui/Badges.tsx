"use client"

import { useState } from "react"

interface TrustScoreBadgeProps {
  score: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export default function TrustScoreBadge({ score, size = "md", showLabel = true }: TrustScoreBadgeProps) {
  const getColor = () => {
    if (score >= 80) return { bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-emerald-500" }
    if (score >= 60) return { bg: "bg-blue-100", text: "text-blue-700", ring: "ring-blue-500" }
    if (score >= 40) return { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-500" }
    return { bg: "bg-red-100", text: "text-red-700", ring: "ring-red-500" }
  }

  const colors = getColor()
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizes[size]} ${colors.bg} ${colors.text} rounded-full flex items-center justify-center font-bold ring-2 ${colors.ring} ring-offset-1`}
      >
        {score}
      </div>
      {showLabel && (
        <div className="text-xs">
          <div className={`font-semibold ${colors.text}`}>Trust Score</div>
          <div className="text-muted">out of 100</div>
        </div>
      )}
    </div>
  )
}

interface VerifiedBadgeProps {
  type: "identity" | "references" | "employer" | "overall"
  verified?: boolean
}

export function VerifiedBadge({ type, verified = false }: VerifiedBadgeProps) {
  const labels = {
    identity: "Identity Verified",
    references: "References Checked",
    employer: "Employer Confirmed",
    overall: "Verified Worker",
  }

  return (
    <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
      verified
        ? "bg-emerald-100 text-emerald-700"
        : "bg-gray-100 text-gray-500"
    }`}>
      {verified ? (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeWidth="2" d="M12 8v4M12 16h.01" />
        </svg>
      )}
      {labels[type]}
    </div>
  )
}

interface StarRatingProps {
  rating: number
  count?: number
  interactive?: boolean
  onChange?: (rating: number) => void
}

export function StarRating({ rating, count, interactive = false, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={`${interactive ? "cursor-pointer" : "cursor-default"} transition-colors`}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onChange?.(star)}
        >
          <svg
            className={`w-4 h-4 ${
              star <= (hovered || rating) ? "text-accent" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      {count !== undefined && (
        <span className="text-sm text-muted ml-1">
          {rating.toFixed(1)} ({count} {count === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  )
}
