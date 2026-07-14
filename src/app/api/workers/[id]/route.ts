import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const worker = await prisma.worker.findUnique({
      where: { id },
      include: {
        reviews: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: { id: true, email: true },
            },
          },
        },
        bookings: {
          where: { status: "completed" },
          select: { id: true },
        },
      },
    })

    if (!worker) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 })
    }

    return NextResponse.json(worker)
  } catch (error) {
    console.error("Worker fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
