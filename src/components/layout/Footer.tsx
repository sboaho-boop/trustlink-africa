import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 120 120" className="w-8 h-8">
                <defs>
                  <linearGradient id="footer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#22c55e'}} />
                    <stop offset="100%" style={{stopColor:'#16a34a'}} />
                  </linearGradient>
                </defs>
                <path d="M60 8 L95 2 L95 55 Q95 85 60 105 Q25 85 25 55 L25 2 Z" fill="url(#footer-grad)" />
                <polyline points="38,52 52,68 82,35" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xl font-bold text-white">
                Trust<span className="text-primary">Link</span>
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Connecting you with verified hands you can trust.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/search" className="hover:text-white transition-colors">Find Workers</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Become a Worker</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-400">Cleaners</span></li>
              <li><span className="text-gray-400">Plumbers</span></li>
              <li><span className="text-gray-400">Electricians</span></li>
              <li><span className="text-gray-400">Gardeners</span></li>
              <li><span className="text-gray-400">Caregivers</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Locations</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-400">Greater Accra</span></li>
              <li><span className="text-gray-400">Ashanti Region</span></li>
              <li><span className="text-gray-400">Western Region</span></li>
              <li><span className="text-gray-400">Central Region</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TrustLink Africa. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <Link href="/privacy-policy" className="text-gray-500 hover:text-gray-300">Privacy</Link>
            <Link href="/terms-of-service" className="text-gray-500 hover:text-gray-300">Terms</Link>
            <span className="text-gray-500 hover:text-gray-300 cursor-pointer">Support</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
