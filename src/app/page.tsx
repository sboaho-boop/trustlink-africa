import Link from "next/link"

const SERVICES = [
  { name: "Domestic Cleaner", icon: "🏠", color: "from-emerald-400 to-emerald-600" },
  { name: "Plumber", icon: "🔧", color: "from-blue-400 to-blue-600" },
  { name: "Electrician", icon: "⚡", color: "from-amber-400 to-amber-600" },
  { name: "Gardener", icon: "🌿", color: "from-green-400 to-green-600" },
  { name: "Carpenter", icon: "🪚", color: "from-orange-400 to-orange-600" },
  { name: "Babysitter", icon: "👶", color: "from-pink-400 to-pink-600" },
  { name: "Cook", icon: "🍳", color: "from-red-400 to-red-600" },
  { name: "Driver", icon: "🚗", color: "from-indigo-400 to-indigo-600" },
  { name: "Caregiver", icon: "🤝", color: "from-teal-400 to-teal-600" },
  { name: "Painter", icon: "🎨", color: "from-purple-400 to-purple-600" },
  { name: "Laundry Worker", icon: "👕", color: "from-cyan-400 to-cyan-600" },
  { name: "Security Guard", icon: "🛡️", color: "from-slate-400 to-slate-600" },
]

const STEPS = [
  {
    step: "1",
    title: "Search",
    desc: "Tell us what you need and where. Browse verified workers in your area.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    step: "2",
    title: "Verify",
    desc: "Every worker has a Trust Score based on ID checks, references, and reviews.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    step: "3",
    title: "Book",
    desc: "Request a worker, agree on terms, and get the job done with confidence.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
]

const STATS = [
  { number: "500+", label: "Verified Workers", icon: "👥" },
  { number: "2,000+", label: "Jobs Completed", icon: "✅" },
  { number: "4.7", label: "Average Rating", icon: "⭐" },
  { number: "16", label: "Regions Covered", icon: "📍" },
]

const TRUST_FACTORS = [
  { label: "ID Verified (Ghana Card)", points: 20, color: "bg-emerald-500" },
  { label: "References Checked", points: 20, color: "bg-blue-500" },
  { label: "Previous Employer Confirmed", points: 20, color: "bg-purple-500" },
  { label: "Customer Reviews", points: 20, color: "bg-amber-500" },
  { label: "Completed Jobs", points: 20, color: "bg-rose-500" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTR2Mkg0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Trusted by thousands across Ghana
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Find Verified Workers
                <br />
                <span className="text-emerald-200">You Can Trust</span>
              </h1>
              <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-lg">
                Every cleaner, plumber, electrician, and caregiver on TrustLink is
                background-checked, reference-verified, and rated by real customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center bg-white text-emerald-700 font-semibold px-8 py-4 rounded-xl hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl text-base"
                >
                  Find a Worker
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200 text-base"
                >
                  Become a Worker
                </Link>
              </div>
            </div>
            
            {/* Hero visual */}
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 p-6 rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="bg-white rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">👷</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">Kwame Asante</div>
                        <div className="text-sm text-gray-500">Electrician</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-amber-400">
                        {"★★★★★".split("").map((star, i) => (
                          <span key={i}>{star}</span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">(128 reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Trust Score: 94
                      </div>
                      <div className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                        ✓ Verified
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-emerald-400 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                  🔧
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-primary group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-sm text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Simple, Safe, Trusted</h2>
            <p className="text-muted mt-3 max-w-2xl mx-auto">
              Finding a reliable worker should not be stressful. We make it simple and safe.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((item, index) => (
              <div key={item.step} className="relative bg-white rounded-2xl p-8 text-center shadow-sm border border-border hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-gray-300">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 bg-primary-light text-primary-dark rounded-full text-sm font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Services Available</h2>
            <p className="text-muted mt-3">
              From home cleaning to electrical repairs, find the right professional.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {SERVICES.map((service) => (
              <Link
                key={service.name}
                href={`/search?category=${encodeURIComponent(service.name)}`}
                className="bg-white border border-border rounded-xl p-5 text-center hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {service.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Score Explainer */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Trust Score</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">The Trust Score Advantage</h2>
              <p className="text-muted mt-3">
                Every worker earns a Trust Score out of 100 based on verifiable factors.
              </p>
            </div>
            <div className="bg-white rounded-3xl border border-border shadow-xl p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-5">
                  {TRUST_FACTORS.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-foreground">{item.label}</span>
                        <span className="text-primary font-semibold">+{item.points}</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${item.points * 5}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl">
                      <div className="w-36 h-36 rounded-full bg-white flex items-center justify-center">
                        <span className="text-5xl font-bold text-emerald-600">92</span>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mt-6">Trust Score Example</h3>
                  <p className="text-sm text-muted mt-2 max-w-xs">
                    A worker with ID verified, references checked, and positive reviews earns a high Trust Score.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">What Our Users Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ama Mensah",
                role: "Customer",
                text: "TrustLink made it so easy to find a reliable cleaner. The Trust Score gave me confidence before booking.",
                rating: 5,
              },
              {
                name: "Kofi Appiah",
                role: "Worker",
                text: "My business has grown since joining TrustLink. Customers trust me because of my verified profile.",
                rating: 5,
              },
              {
                name: "Akosua Boateng",
                role: "Customer",
                text: "I love how I can see reviews and verification status. It takes the stress out of hiring someone.",
                rating: 5,
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-gray-50 rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow">
                <div className="flex text-amber-400 mb-4">
                  {"★★★★★".split("").map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
                <p className="text-muted text-sm leading-relaxed mb-4">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary-dark font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-300 rounded-full mix-blend-overlay filter blur-3xl opacity-10" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Trusted Help?
          </h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Ghanaians who trust TrustLink to connect them with verified, reliable workers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/search"
              className="inline-flex items-center justify-center bg-white text-emerald-700 font-semibold px-8 py-4 rounded-xl hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Search Workers
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              Register as Worker
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
