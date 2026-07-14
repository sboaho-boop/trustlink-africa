import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, calculateTrustScore } from "@/lib/auth"

export async function POST(request: Request) {
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

    const body = await request.json()
    const { workerId, rating, comment } = body

    if (!workerId || !rating) {
      return NextResponse.json({ error: "workerId and rating are required" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const worker = await prisma.worker.findUnique({ where: { id: workerId } })
    if (!worker) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 })
    }

    const review = await prisma.review.create({
      data: {
        workerId,
        authorId: payload.userId,
        rating: parseInt(rating),
        comment: comment || "",
      },
    })

    const reviews = await prisma.review.findMany({
      where: { workerId },
      select: { rating: true },
    })

    const avgRating = reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
    const trustScore = calculateTrustScore({
      idVerified: worker.idVerified,
      referencesChecked: worker.referencesChecked,
      employerConfirmed: worker.employerConfirmed,
      rating: avgRating,
      reviewCount: reviews.length,
      totalJobs: worker.totalJobs,
    })

    await prisma.worker.update({
      where: { id: workerId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
        trustScore,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Review error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
