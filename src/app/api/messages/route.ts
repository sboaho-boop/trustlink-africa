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

    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get("contactId")

    if (contactId) {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: payload.userId, receiverId: contactId },
            { senderId: contactId, receiverId: payload.userId },
          ],
        },
        orderBy: { createdAt: "asc" },
        take: 100,
      })

      await prisma.message.updateMany({
        where: { senderId: contactId, receiverId: payload.userId, read: false },
        data: { read: true },
      })

      return NextResponse.json(messages)
    }

    const contacts = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: payload.userId },
          { receiverId: payload.userId },
        ],
      },
      include: {
        sender: { select: { id: true, email: true, role: true } },
        receiver: { select: { id: true, email: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
      distinct: ["senderId", "receiverId"],
    })

    const contactMap = new Map<string, { user: typeof contacts[0]["sender"]; lastMessage: string; lastTime: Date; unread: number }>()

    for (const msg of contacts) {
      const contactUserId = msg.senderId === payload.userId ? msg.receiverId : msg.senderId
      const contactUser = msg.senderId === payload.userId ? msg.receiver : msg.sender

      if (!contactMap.has(contactUserId)) {
        contactMap.set(contactUserId, {
          user: contactUser,
          lastMessage: msg.content,
          lastTime: msg.createdAt,
          unread: msg.receiverId === payload.userId && !msg.read ? 1 : 0,
        })
      }
    }

    return NextResponse.json(Array.from(contactMap.values()))
  } catch (error) {
    console.error("Get messages error:", error)
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

    const message = await prisma.message.create({
      data: {
        senderId: payload.userId,
        receiverId: body.receiverId,
        content: body.content,
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
