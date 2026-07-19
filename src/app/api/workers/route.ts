import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const region = searchParams.get("region")
    const city = searchParams.get("city")
    const availability = searchParams.get("availability")
    const minExperience = searchParams.get("minExperience")
    const verified = searchParams.get("verified")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "trustScore"
    const onlineOnly = searchParams.get("onlineOnly") === "true"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = 12
    const skip = (page - 1) * limit

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      verificationStatus: "approved",
    }

    if (category) where.serviceCategory = category
    if (region) where.region = region
    if (city) where.location = city
    if (availability) where.availability = availability
    if (minExperience) where.yearsExperience = { gte: parseInt(minExperience) }
    if (verified === "true") where.verificationStatus = "approved"
    if (onlineOnly) where.isOnline = true
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { serviceCategory: { contains: search } },
        { skills: { contains: search } },
        { location: { contains: search } },
      ]
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { trustScore: "desc" }
    if (sort === "rating") orderBy = { rating: "desc" }
    if (sort === "experience") orderBy = { yearsExperience: "desc" }
    if (sort === "newest") orderBy = { createdAt: "desc" }
    if (sort === "price") orderBy = { expectedMinPay: "asc" }

    const [workers, total] = await Promise.all([
      prisma.worker.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.worker.count({ where }),
    ])

    return NextResponse.json({
      workers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Search error:", error)
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

    const existing = await prisma.worker.findUnique({ where: { userId: payload.userId } })
    if (existing) {
      return NextResponse.json({ error: "You already have a worker profile" }, { status: 409 })
    }

    const worker = await prisma.worker.create({
      data: {
        userId: payload.userId,
        fullName: body.fullName,
        phone: body.phone,
        whatsapp: body.whatsapp || "",
        age: body.age ? parseInt(body.age) : null,
        gender: body.gender || "",
        location: body.location,
        region: body.region || "Greater Accra",
        languages: body.languages || "English",
        serviceCategory: body.serviceCategory,
        subServices: body.subServices || "",
        yearsExperience: body.yearsExperience ? parseInt(body.yearsExperience) : 0,
        skills: body.skills || "",
        availability: body.availability || "full-time",
        expectedMinPay: body.expectedMinPay ? parseInt(body.expectedMinPay) : null,
        expectedMaxPay: body.expectedMaxPay ? parseInt(body.expectedMaxPay) : null,
        bio: body.bio || "",
        references: body.references || "",
        ghanaCardUrl: body.ghanaCardUrl || "",
        passportUrl: body.passportUrl || "",
        proofAddressUrl: body.proofAddressUrl || "",
        certificatesUrl: body.certificatesUrl || "",
      },
    })

    await prisma.user.update({
      where: { id: payload.userId },
      data: { role: "worker" },
    })

    return NextResponse.json(worker, { status: 201 })
  } catch (error) {
    console.error("Worker registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
