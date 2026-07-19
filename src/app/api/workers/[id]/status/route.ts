import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

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
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const worker = await prisma.worker.findUnique({ where: { id } })
    if (!worker || worker.userId !== payload.userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const updated = await prisma.worker.update({
      where: { id },
      data: {
        isOnline: body.isOnline,
        lastSeenAt: body.isOnline ? new Date() : worker.lastSeenAt,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Update status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
