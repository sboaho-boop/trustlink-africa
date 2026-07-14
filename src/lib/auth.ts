import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "trustlink-secret-key-change-in-production"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(payload: { userId: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string }
  } catch {
    return null
  }
}

export function calculateTrustScore(worker: {
  idVerified: boolean
  referencesChecked: boolean
  employerConfirmed: boolean
  rating: number
  reviewCount: number
  totalJobs: number
}): number {
  let score = 0
  if (worker.idVerified) score += 20
  if (worker.referencesChecked) score += 20
  if (worker.employerConfirmed) score += 20
  if (worker.reviewCount > 0) {
    score += Math.round((worker.rating / 5) * 20)
  }
  if (worker.totalJobs > 0) {
    score += Math.min(20, worker.totalJobs * 2)
  }
  return Math.min(100, score)
}
