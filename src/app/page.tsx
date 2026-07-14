import Link from "next/link"

const SERVICES = [
  { name: "Domestic Cleaner", icon: "🏠" },
  { name: "Plumber", icon: "🔧" },
  { name: "Electrician", icon: "⚡" },
  { name: "Gardener", icon: "🌿" },
  { name: "Carpenter", icon: "🪚" },
  { name: "Babysitter", icon: "👶" },
  { name: "Cook", icon: "🍳" },
  { name: "Driver", icon: "🚗" },
  { name: "Caregiver", icon: "🤝" },
  { name: "Painter", icon: "🎨" },
  { name: "Laundry Worker", icon: "👕" },
  { name: "Security Guard", icon: "🛡️" },
]

const STEPS = [
  {
    step: "1",
    title: "Search",
    desc: "Tell us what you need and where. Browse verified workers in your area.",
  },
  {
    step: "2",
    title: "Verify",
    desc: "Every worker has a Trust Score based on ID checks, references, and reviews.",
  },
  {
    step: "3",
    title: "Book",
    desc: "Request a worker, agree on terms, and get the job done with confidence.",
  },
]

const STATS = [
  { number: "500+", label: "Verified Workers" },
  { number: "2,000+", label: "Jobs Completed" },
  { number: "4.7", label: "Average Rating" },
  { number: "16", label: "Regions Covered" },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTR2Mkg0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Trusted by thousands across Ghana
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Find Verified Workers
              <br />
              <span className="text-emerald-200">You Can Trust</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-2xl">
              Every cleaner, plumber, electrician, and caregiver on TrustLink is
              background-checked, reference-verified, and rated by real customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/search"
                className="inline-flex items-center justify-center bg-white text-emerald-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition-colors text-base"
              >
                Find a Worker
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center border-2 border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-base"
              >
                Become a Worker
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.number}</div>
                <div className="text-sm text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">How TrustLink Works</h2>
            <p className="text-muted mt-3 max-w-2xl mx-auto">
              Finding a reliable worker should not be stressful. We make it simple and safe.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-8 text-center shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary-light text-primary-dark rounded-xl flex items-center justify-center text-lg font-bold mx-auto mb-5">
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Services Available</h2>
            <p className="text-muted mt-3">
              From home cleaning to electrical repairs, find the right professional.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {SERVICES.map((service) => (
              <Link
                key={service.name}
                href={`/search?category=${encodeURIComponent(service.name)}`}
                className="bg-gray-50 border border-border rounded-xl p-5 text-center hover:border-primary hover:bg-primary-light/50 transition-all duration-200 group"
              >
                <div className="text-3xl mb-3">{service.icon}</div>
                <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {service.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Score Explainer */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">The Trust Score Advantage</h2>
              <p className="text-muted mt-3">
                Every worker earns a Trust Score out of 100 based on verifiable factors.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-border shadow-sm p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  {[
                    { label: "ID Verified (Ghana Card)", points: 20, color: "bg-emerald-500" },
                    { label: "References Checked", points: 20, color: "bg-blue-500" },
                    { label: "Previous Employer Confirmed", points: 20, color: "bg-purple-500" },
                    { label: "Customer Reviews", points: 20, color: "bg-amber-500" },
                    { label: "Completed Jobs", points: 20, color: "bg-rose-500" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-foreground">{item.label}</span>
                        <span className="text-muted">+{item.points}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${item.points * 5}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center ring-4 ring-emerald-500 ring-offset-4 mb-4">
                    <span className="text-4xl font-bold text-emerald-700">92</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Trust Score Example</h3>
                  <p className="text-sm text-muted mt-2 max-w-xs">
                    A worker with ID verified, references checked, and positive reviews earns a high Trust Score.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Trusted Help?
          </h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Ghanaians who trust TrustLink to connect them with verified, reliable workers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/search"
              className="inline-flex items-center justify-center bg-white text-emerald-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition-colors"
            >
              Search Workers
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center border-2 border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              Register as Worker
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
