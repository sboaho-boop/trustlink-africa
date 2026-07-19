export interface WorkerProfile {
  id: string
  userId: string
  fullName: string
  phone: string
  whatsapp?: string
  profilePicture?: string
  age?: number
  gender?: string
  location: string
  region: string
  languages: string
  serviceCategory: string
  subServices: string
  yearsExperience: number
  skills: string
  availability: string
  availableDays: string
  availableHours: string
  expectedMinPay?: number
  expectedMaxPay?: number
  bio?: string
  ghanaCardUrl?: string
  passportUrl?: string
  proofAddressUrl?: string
  certificatesUrl: string
  references: string
  verificationStatus: "pending" | "approved" | "rejected"
  verifiedAt?: string
  verifiedBy?: string
  rejectionReason?: string
  trustScore: number
  idVerified: boolean
  referencesChecked: boolean
  employerConfirmed: boolean
  totalJobs: number
  rating: number
  reviewCount: number
  ratingPunctuality: number
  ratingQuality: number
  ratingCommunication: number
  ratingValue: number
  isOnline: boolean
  lastSeenAt?: string
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  workerId: string
  customerId: string
  serviceType: string
  description?: string
  date: string
  duration: string
  location: string
  budget: number
  notes?: string
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled"
  reminderSent: boolean
  createdAt: string
}

export interface Review {
  id: string
  workerId: string
  authorId: string
  rating: number
  ratingPunctuality: number
  ratingQuality: number
  ratingCommunication: number
  comment?: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  role: "customer" | "worker" | "admin"
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  createdAt: string
}

export const SERVICE_CATEGORIES = [
  "Domestic Cleaner",
  "Laundry Worker",
  "Gardener",
  "Plumber",
  "Electrician",
  "Carpenter",
  "Painter",
  "Driver",
  "Security Guard",
  "Babysitter",
  "Cook",
  "Hairdresser",
  "Handyman",
  "Caregiver",
  "Tutor",
  "Other",
] as const

export const REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Central",
  "Eastern",
  "Northern",
  "Volta",
  "Upper East",
  "Upper West",
  "Brong Ahafo",
  "Western North",
  "Ahafo",
  "Bono East",
  "Oti",
  "Savannah",
  "North East",
] as const

export const AVAILABILITY_OPTIONS = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "weekend", label: "Weekend only" },
  { value: "casual", label: "Casual/On-demand" },
] as const

export const DAYS_OF_WEEK = [
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
] as const

export const GHANA_CITIES: Record<string, string[]> = {
  "Greater Accra": ["Accra", "Tema", "Kpone", "Dodowa", "Adenta", "East Legon", "Spintex", "Teshie", "Nungua", "Kasoa", "Tarkwa Nsuaem"],
  Ashanti: ["Kumasi", "Ejisu", "Obuasi", "Tamale", "Konongo", "Mampong"],
  Western: ["Sekondi", "Takoradi", "Tarkwa", "Axim"],
  Central: ["Cape Coast", "Winneba", "Saltpond", "Mankessim"],
  Eastern: ["Koforidua", "Nkawkaw", "Nsawam", "Suhum"],
  Northern: ["Tamale", "Yendi", "Buipe", "Damongo"],
  Volta: ["Ho", "Hohoe", "Keta", "Denu"],
}

export const LANGUAGES = [
  "English",
  "Twi",
  "Ga",
  "Ewe",
  "Dagbani",
  "Hausa",
  "Fante",
  "Kusaal",
  "Mampruli",
  "Other",
] as const
