import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

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
    const { workerId, serviceType, description, date, duration, location, budget, notes } = body

    if (!workerId || !serviceType || !date || !duration || !location || !budget) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const worker = await prisma.worker.findUnique({ where: { id: workerId } })
    if (!worker) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 })
    }

    const booking = await prisma.booking.create({
      data: {
        workerId,
        customerId: payload.userId,
        serviceType,
        description: description || "",
        date: new Date(date),
        duration,
        location,
        budget: parseInt(budget),
        notes: notes || "",
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    if (status) where.status = status

    // Get bookings for the user (as customer or worker)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { workerProfile: true },
    })

    if (user?.role === "worker" && user.workerProfile) {
      where.workerId = user.workerProfile.id
    } else {
      where.customerId = payload.userId
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        worker: {
          select: { fullName: true, serviceCategory: true, phone: true },
        },
        customer: {
          select: { email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Bookings fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
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
    const { bookingId, status } = body

    if (!bookingId || !status) {
      return NextResponse.json({ error: "Missing bookingId or status" }, { status: 400 })
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    })

    if (status === "completed") {
      await prisma.worker.update({
        where: { id: booking.workerId },
        data: { totalJobs: { increment: 1 } },
      })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Booking update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
