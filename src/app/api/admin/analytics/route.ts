import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const [
      totalWorkers,
      pendingWorkers,
      approvedWorkers,
      rejectedWorkers,
      totalBookings,
      completedBookings,
      totalReviews,
      reviews,
      workers,
      recentBookings,
      recentReviews,
      recentWorkers,
    ] = await Promise.all([
      prisma.worker.count(),
      prisma.worker.count({ where: { verificationStatus: "pending" } }),
      prisma.worker.count({ where: { verificationStatus: "approved" } }),
      prisma.worker.count({ where: { verificationStatus: "rejected" } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "completed" } }),
      prisma.review.count(),
      prisma.review.findMany({ select: { rating: true } }),
      prisma.worker.findMany({ select: { serviceCategory: true } }),
      prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { serviceType: true, status: true, createdAt: true },
      }),
      prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { rating: true, comment: true, createdAt: true },
      }),
      prisma.worker.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { fullName: true, verificationStatus: true, createdAt: true },
      }),
    ])

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

    const categoryCounts = new Map<string, number>()
    for (const w of workers) {
      categoryCounts.set(w.serviceCategory, (categoryCounts.get(w.serviceCategory) || 0) + 1)
    }
    const topCategories = Array.from(categoryCounts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)

    const recentActivity = [
      ...recentBookings.map((b) => ({
        type: "booking",
        description: `New ${b.serviceType} booking - ${b.status}`,
        date: b.createdAt.toISOString(),
      })),
      ...recentReviews.map((r) => ({
        type: "review",
        description: `New ${r.rating}-star review${r.comment ? `: "${r.comment.slice(0, 50)}..."` : ""}`,
        date: r.createdAt.toISOString(),
      })),
      ...recentWorkers.map((w) => ({
        type: "worker",
        description: `${w.fullName} registered - ${w.verificationStatus}`,
        date: w.createdAt.toISOString(),
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json({
      totalWorkers,
      pendingWorkers,
      approvedWorkers,
      rejectedWorkers,
      totalBookings,
      completedBookings,
      totalReviews,
      averageRating,
      topCategories,
      recentActivity,
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
