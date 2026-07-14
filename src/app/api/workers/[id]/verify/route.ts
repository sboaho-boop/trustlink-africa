import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, calculateTrustScore } from "@/lib/auth"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { action, rejectionReason } = body

    const worker = await prisma.worker.findUnique({ where: { id } })
    if (!worker) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 })
    }

    let updateData: Record<string, unknown> = {}

    if (action === "approve") {
      const trustScore = calculateTrustScore({
        idVerified: true,
        referencesChecked: true,
        employerConfirmed: false,
        rating: worker.rating,
        reviewCount: worker.reviewCount,
        totalJobs: worker.totalJobs,
      })

      updateData = {
        verificationStatus: "approved",
        verifiedAt: new Date(),
        verifiedBy: payload.userId,
        idVerified: true,
        referencesChecked: true,
        trustScore,
      }
    } else if (action === "reject") {
      updateData = {
        verificationStatus: "rejected",
        rejectionReason: rejectionReason || "Application did not meet requirements",
      }
    } else if (action === "updateTrustScore") {
      updateData = {
        idVerified: body.idVerified ?? worker.idVerified,
        referencesChecked: body.referencesChecked ?? worker.referencesChecked,
        employerConfirmed: body.employerConfirmed ?? worker.employerConfirmed,
      }
      updateData.trustScore = calculateTrustScore({
        idVerified: updateData.idVerified as boolean,
        referencesChecked: updateData.referencesChecked as boolean,
        employerConfirmed: updateData.employerConfirmed as boolean,
        rating: worker.rating,
        reviewCount: worker.reviewCount,
        totalJobs: worker.totalJobs,
      })
    }

    const updated = await prisma.worker.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Verify error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
