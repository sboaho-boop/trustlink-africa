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

    const saved = await prisma.savedWorker.findMany({
      where: { userId: payload.userId },
      include: { worker: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(saved)
  } catch (error) {
    console.error("Get saved workers error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    const existing = await prisma.savedWorker.findUnique({
      where: { userId_workerId: { userId: payload.userId, workerId: body.workerId } },
    })

    if (existing) {
      return NextResponse.json({ error: "Already saved" }, { status: 409 })
    }

    const saved = await prisma.savedWorker.create({
      data: {
        userId: payload.userId,
        workerId: body.workerId,
      },
    })

    return NextResponse.json(saved, { status: 201 })
  } catch (error) {
    console.error("Save worker error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
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
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }

    await prisma.savedWorker.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete saved worker error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
