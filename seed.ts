import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./src/generated/prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const FIRST_NAMES_F = [
  "Ama", "Akosua", "Adwoa", "Aba", "Efua", "Akua", "Esi", "Adina", "Afia", "Afi",
  "Nana", "Yaa", "Eunice", "Grace", "Priscilla", "Ruth", "Esther", "Joyce", "Mary", "Juliet",
  "Linda", "Patricia", "Dorothy", "Agnes", "Martha", "Rose", "Vera", "Gladys", "Comfort", "Abena",
  "Afriyie", "Asantewaa", "Oforiwaa", "Sika", "Adom", "Dufie", "Korkor", "Baaba", "Serwaa", "Fifi",
  "Nketia", "Mensah", "Darko", "Boateng", "Osei", "Appiah", "Kumah", "Takyi", "Ankrah", "Quarshie",
  "Owusu", "Antwi", "Mensah", "Sarpong", "Agyemang", "Asare", "Bonsu", "Frimpong", "Yeboah", "Nkrumah",
  "Adjei", "Amoah", "Awuah", "Danquah", "Mensah", "Opoku", "Poku", "Quaye", "Sackey", "Tetteh",
  "Aidoo", "Annan", "Arthur", "Baidoo", "Coleman", "Donkor", "Effah", "Fosu", "Gyamfi", "Hagan",
  "Ibrahim", "Jordan", "Koomson", "Lamptey", "Mankata", "Norvor", "Obed", "Quartey", "Reindorf", "Safo",
  "Tekyi", "Vanderpuye", "Wilson", "Xatse", "Yirenkyi", "Zigah",
];

const FIRST_NAMES_M = [
  "Kwame", "Kwesi", "Kofi", "Kwabena", "Kwaku", "Yaw", "Kojo", "Kweku", "Kwadwo", "Mensah",
  "Kwame", "Nana", "Yaw", "Daniel", "Samuel", "Emmanuel", "Michael", "Joseph", "David", "John",
  "Peter", "Paul", "James", "Stephen", "Isaac", "Benjamin", "Solomon", "Alexander", "Richard", "Charles",
  "Thomas", "Robert", "Patrick", "Frederick", "Albert", "Edward", "Francis", "Henry", "Martin", "Victor",
  "Prince", "Christian", "George", "Henry", "Ibrahim", "Joseph", "Kenneth", "Lawrence", "Matthew", "Nicholas",
  "Oscar", "Philip", "Raymond", "Simon", "Timothy", "Victor", "William", "Zack", "Felix", "Gabriel",
  "Harry", "Ike", "Joel", "Kevin", "Leonard", "Marcus", "Nathan", "Oliver", "Patrick", "Reginald",
  "Samuel", "Tony", "Umar", "Vincent", "Wesley", "Yaw", "Abel", "Bernard", "Caleb", "Dennis",
  "Eric", "Frank", "Godfred", "Howard", "Isaac", "Jerry", "Kofi", "Luke", "Mark", "Noel",
  "Oscar", "Peter", "Richard", "Seth", "Thomas", "Umar", "Victor", "Winston", "Yaw", "Zack",
];

const LAST_NAMES = [
  "Mensah", "Osei", "Appiah", "Kumah", "Takyi", "Ankrah", "Quarshie", "Owusu", "Antwi", "Sarpong",
  "Agyemang", "Asare", "Bonsu", "Frimpong", "Yeboah", "Nkrumah", "Adjei", "Amoah", "Awuah", "Danquah",
  "Opoku", "Poku", "Quaye", "Sackey", "Tetteh", "Aidoo", "Annan", "Arthur", "Baidoo", "Donkor",
  "Effah", "Fosu", "Gyamfi", "Hagan", "Koomson", "Lamptey", "Mankata", "Norvor", "Obed", "Quartey",
  "Reindorf", "Safo", "Tekyi", "Vanderpuye", "Wilson", "Yirenkyi", "Zigah", "Boateng", "Darko", "Asante",
  "Boakye", "Adu", "Gyan", "Badu", "Atsu", "Acheampong", "Ansong", "Basoah", "BEDIAKO", "Boahene",
  "Brekuno", "Brobbey", "Dartey", "Dwamena", "Ekuban", "Fobih", "Gockel", "Gyamera", "Kusi", "Kyei",
];

const LOCATIONS: Record<string, string[]> = {
  "Greater Accra": ["Accra", "Tema", "Kpone", "Dodowa", "Adenta", "East Legon", "Spintex", "Teshie", "Nungua", "Kasoa", "Osu", "Labone", "Cantonments", "Airport Residential", "Madina", "Teshie", "La", "James Town", "Chorkor", "Korle Bu"],
  "Ashanti": ["Kumasi", "Ejisu", "Obuasi", "Konongo", "Mampong", "Bantama", "Adum", "Ahodwo", "Nhyiaeso", "Ashtown"],
  "Western": ["Sekondi", "Takoradi", "Tarkwa", "Axim", "Shama", "Agona Nkwanta"],
  "Central": ["Cape Coast", "Winneba", "Saltpond", "Mankessim", "Swedru", "Elmina"],
  "Eastern": ["Koforidua", "Nkawkaw", "Nsawam", "Suhum", "Bunso", "Akropong"],
  "Northern": ["Tamale", "Yendi", "Buipe", "Damongo", "Savelugu", "Tolon"],
  "Volta": ["Ho", "Hohoe", "Keta", "Denu", "Kpando", "Sogakope"],
}

const SERVICES = [
  "Domestic Cleaner", "Laundry Worker", "Gardener", "Plumber", "Electrician",
  "Carpenter", "Painter", "Driver", "Security Guard", "Babysitter",
  "Cook", "Hairdresser", "Handyman", "Caregiver", "Tutor", "Other",
]

const SKILLS_MAP: Record<string, string[]> = {
  "Domestic Cleaner": ["Deep cleaning", "Mopping", "Dusting", "Kitchen cleaning", "Bathroom sanitization", "Window cleaning", "Laundry", "Ironing", "Organizing", "Pet care"],
  "Laundry Worker": ["Washing", "Ironing", "Stain removal", "Dry cleaning", "Folded clothes", "Fabric care", "Pressing", "Delicate handling"],
  "Gardener": ["Lawn mowing", "Pruning", "Weeding", "Planting", "Irrigation", "Landscaping", "Tree trimming", "Pest control", "Composting"],
  "Plumber": ["Pipe fitting", "Leak repair", "Drain unclogging", "Toilet repair", "Water heater installation", "Bathroom renovation", "Sewer line repair"],
  "Electrician": ["Wiring", "Socket installation", "Ceiling fan mounting", "Light fixture repair", "Generator maintenance", "Inverter setup", "Circuit breaker repair", "Electrical inspection"],
  "Carpenter": ["Furniture making", "Door installation", "Shelf building", "Window frame repair", "Wood polishing", "Kitchen cabinet installation", "Wardrobe assembly"],
  "Painter": ["Interior painting", "Exterior painting", "Wallpaper installation", "Texture painting", "Spray painting", "Color consultation", "Surface preparation"],
  "Driver": ["Local driving", "Long distance", "School runs", "Airport transfers", "Moving services", "Delivery", "Chauffeur services"],
  "Security Guard": ["Event security", " residential security", "Access control", "Surveillance monitoring", "Night patrol", "CCTV monitoring"],
  "Babysitter": ["Childcare", "Homework help", "Meal preparation", "School pickup", "Play supervision", "Infant care", "First aid"],
  "Cook": ["Ghanaian cuisine", "Continental dishes", "Baking", "Event catering", "Meal prep", "Jollof rice", "Banku", "Fufu", "Grilled tilapia"],
  "Hairdresser": ["Braiding", "Weaving", "Relaxing", "Cutting", "Styling", "Natural hair care", "Wig installation", "Loc maintenance"],
  "Handyman": ["Minor repairs", "Furniture assembly", "Hole patching", "Lock replacement", "Curtain installation", "TV mounting", "General maintenance"],
  "Caregiver": ["Elderly care", "Patient monitoring", "Medication reminders", "Mobility assistance", "Meal preparation", "Companionship", "Housekeeping"],
  "Tutor": ["Math tutoring", "English tutoring", "Science tutoring", "Homework help", "Exam preparation", "Computer skills", "French lessons"],
  "Other": ["Event setup", "Moving services", "Cleaning", "Organization", "Delivery"],
}

const BIOS = [
  "Hardworking and reliable professional with a strong attention to detail. I take pride in delivering quality work every time.",
  "Experienced and trustworthy worker. I treat every client's home like my own. References available upon request.",
  "Dedicated to providing excellent service. Punctual, professional, and always willing to go the extra mile.",
  "I have been working in this field for several years and have built a strong reputation for reliability and quality.",
  "Passionate about my work and committed to exceeding expectations. My clients always come back.",
  "Friendly, professional, and efficient. I ensure every job is done right the first time.",
  "I bring years of experience and a strong work ethic to every assignment. Your satisfaction is my priority.",
  "Reliable and honest worker. I value trust and always deliver on my promises.",
  "Known for my attention to detail and commitment to quality. I never cut corners.",
  "Available for both short-term and long-term engagements. Flexible schedule and competitive rates.",
]

const REVIEWS = [
  "Excellent work! Very thorough and professional. Will definitely hire again.",
  "Very reliable and punctual. The job was done perfectly.",
  "Great experience. Very respectful and hardworking.",
  "Amazing service! Exceeded my expectations.",
  "Very professional and efficient. Highly recommended.",
  "Good work overall. Arrived on time and completed the job well.",
  "Trustworthy and competent. I felt comfortable leaving them in my home.",
  "Outstanding service. Will be a repeat customer.",
  "Very satisfied with the work. Fair pricing and quality results.",
  "Reliable and skilled. Five stars!",
  "Good communication and excellent work quality.",
  "They did a fantastic job. Very pleased with the results.",
  "Professional from start to finish. Highly recommend.",
  "Exceeded all expectations. Will definitely use again.",
  "Punctual, professional, and thorough. What more could you ask for?",
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomItems<T>(arr: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function main() {
  console.log("Seeding database...")

  const password = await bcrypt.hash("password123", 12)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: "admin@trustlink.africa",
      password,
      role: "admin",
    },
  })
  console.log("Admin user created: admin@trustlink.africa / password123")

  // Create demo customers
  const customerEmails = [
    "customer1@example.com", "customer2@example.com", "customer3@example.com",
    "customer4@example.com", "customer5@example.com",
  ]
  const customers = []
  for (const email of customerEmails) {
    const user = await prisma.user.create({
      data: { email, password, role: "customer" },
    })
    customers.push(user)
  }
  console.log("5 demo customers created (password: password123)")

  // Create 1000 workers
  console.log("Creating 1000 demo workers...")
  const batchSize = 50
  const totalWorkers = 1000

  for (let batch = 0; batch < totalWorkers; batch += batchSize) {
    const currentBatch = Math.min(batchSize, totalWorkers - batch)
    const workerPromises = []

    for (let i = 0; i < currentBatch; i++) {
      const idx = batch + i
      const isMale = Math.random() > 0.5
      const firstName = isMale ? randomItem(FIRST_NAMES_M) : randomItem(FIRST_NAMES_F)
      const lastName = randomItem(LAST_NAMES)
      const fullName = `${firstName} ${lastName}`

      const region = randomItem(Object.keys(LOCATIONS))
      const cities = LOCATIONS[region]
      const location = randomItem(cities)

      const serviceCategory = randomItem(SERVICES)
      const skills = randomItems(SKILLS_MAP[serviceCategory] || SKILLS_MAP["Other"], 2, 6)

      const yearsExperience = randomInt(1, 20)
      const age = randomInt(19, 55)
      const rating = Math.round((Math.random() * 2 + 3) * 10) / 10
      const reviewCount = randomInt(0, 45)
      const totalJobs = randomInt(0, 80)

      const idVerified = Math.random() > 0.15
      const referencesChecked = Math.random() > 0.2
      const employerConfirmed = Math.random() > 0.35

      let trustScore = 0
      if (idVerified) trustScore += 20
      if (referencesChecked) trustScore += 20
      if (employerConfirmed) trustScore += 20
      if (reviewCount > 0) trustScore += Math.round((rating / 5) * 20)
      if (totalJobs > 0) trustScore += Math.min(20, totalJobs * 2)
      trustScore = Math.min(100, trustScore)

      const verificationStatus = Math.random() > 0.25 ? "approved" : "pending"
      const minPay = randomInt(50, 300)
      const maxPay = minPay + randomInt(50, 500)

      const user = await prisma.user.create({
        data: {
          email: `worker${idx + 1}@trustlink.demo`,
          password,
          role: "worker",
        },
      })

      workerPromises.push(
        prisma.worker.create({
          data: {
            userId: user.id,
            fullName,
            phone: `+233${randomInt(20, 59)}${String(randomInt(1000000, 9999999))}`,
            whatsapp: `+233${randomInt(20, 59)}${String(randomInt(1000000, 9999999))}`,
            age,
            gender: isMale ? "male" : "female",
            location,
            region,
            languages: Math.random() > 0.3 ? "English, Twi" : Math.random() > 0.5 ? "English, Ga" : "English, Twi, Ewe",
            serviceCategory,
            yearsExperience,
            skills: skills.join(", "),
            availability: randomItem(["full-time", "part-time", "weekend", "casual"]),
            expectedMinPay: minPay,
            expectedMaxPay: maxPay,
            bio: randomItem(BIOS),
            references: `${randomItem(LAST_NAMES)} family - ${randomInt(1, 5)} years reference`,
            verificationStatus,
            trustScore,
            idVerified,
            referencesChecked,
            employerConfirmed,
            rating: reviewCount > 0 ? rating : 0,
            reviewCount,
            totalJobs,
          },
        })
      )
    }

    await Promise.all(workerPromises)
    console.log(`  Workers created: ${Math.min(batch + currentBatch, totalWorkers)} / ${totalWorkers}`)
  }

  // Create some bookings
  console.log("Creating demo bookings...")
  const allWorkers = await prisma.worker.findMany({ where: { verificationStatus: "approved" }, take: 200 })
  const bookingPromises = []

  for (const worker of allWorkers.slice(0, 100)) {
    const customer = randomItem(customers)
    const statuses = ["completed", "completed", "completed", "accepted", "pending"]
    bookingPromises.push(
      prisma.booking.create({
        data: {
          workerId: worker.id,
          customerId: customer.id,
          serviceType: worker.serviceCategory,
          description: `Need ${worker.serviceCategory.toLowerCase()} services`,
          date: new Date(Date.now() + randomInt(-30, 30) * 86400000),
          duration: randomItem(["2 hours", "4 hours", "6 hours", "8 hours (Full day)"]),
          location: `${worker.location}, ${worker.region}`,
          budget: randomInt(80, 500),
          status: randomItem(statuses),
        },
      })
    )
  }
  await Promise.all(bookingPromises)
  console.log("  100 bookings created")

  // Create some reviews
  console.log("Creating demo reviews...")
  const reviewPromises = []
  for (const worker of allWorkers.slice(0, 150)) {
    const numReviews = randomInt(1, 5)
    for (let r = 0; r < numReviews; r++) {
      const customer = randomItem(customers)
      reviewPromises.push(
        prisma.review.create({
          data: {
            workerId: worker.id,
            authorId: customer.id,
            rating: randomInt(3, 5),
            comment: randomItem(REVIEWS),
          },
        })
      )
    }
  }
  await Promise.all(reviewPromises)
  console.log("  Reviews created")

  console.log("\nSeeding complete!")
  console.log("Admin login: admin@trustlink.africa / password123")
  console.log("Worker logins: worker1@trustlink.demo through worker1000@trustlink.demo / password123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
