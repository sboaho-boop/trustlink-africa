import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy - TrustLink Africa",
  description: "How TrustLink Africa collects, uses, and protects your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-primary hover:underline mb-4 inline-block">
          &larr; Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        <p className="text-muted mt-2">Last updated: July 16, 2026</p>
      </div>

      <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
          <p className="text-muted">
            TrustLink Africa (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the TrustLink platform, a verified service marketplace
            connecting customers with trusted service providers (cleaners, plumbers, electricians, gardeners, caregivers,
            and other professionals) across Ghana. This Privacy Policy explains how we collect, use, store, and protect
            your personal information when you use our website, mobile application, or any related services
            (collectively, the &quot;Platform&quot;).
          </p>
          <p className="text-muted mt-2">
            By using TrustLink Africa, you agree to the collection and use of information in accordance with this policy.
            If you do not agree, please do not use our Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.1 Information You Provide Directly</h3>
          <p className="text-muted">When you create an account or use our Platform, you provide:</p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li><strong>Account Information:</strong> Email address, password (encrypted), and account role (customer, worker, or admin)</li>
            <li><strong>Worker Profile Information:</strong> Full name, profile picture, age, gender, phone number, WhatsApp contact, location (region and city), languages spoken</li>
            <li><strong>Professional Information:</strong> Service category, years of experience, skills, availability, expected payment range, bio/description, previous employers</li>
            <li><strong>Verification Documents:</strong> Ghana Card or national ID, passport photograph, proof of address, certificates, and references</li>
            <li><strong>Booking Information:</strong> Service requests, dates, locations, budgets, and communications between customers and workers</li>
            <li><strong>Reviews and Ratings:</strong> Feedback you leave for workers after completed jobs</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.2 Information Collected Automatically</h3>
          <p className="text-muted">When you access the Platform, we automatically collect:</p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li>Device information (browser type, operating system, device type)</li>
            <li>Log data (IP address, access times, pages viewed, referring URL)</li>
            <li>Usage data (features used, search queries, interaction patterns)</li>
            <li>Location data (general region based on IP address, or precise location if you grant permission)</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.3 Information from Third Parties</h3>
          <p className="text-muted">We may receive information from:</p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li>Authentication providers (if you sign up using Google or other services)</li>
            <li>Verification partners who help us confirm worker identities</li>
            <li>Public databases and references provided by workers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
          <p className="text-muted">We use the information we collect to:</p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li><strong>Provide our services:</strong> Create accounts, match workers with customers, facilitate bookings, and process reviews</li>
            <li><strong>Verify workers:</strong> Review identification documents, check references, and assign Trust Scores</li>
            <li><strong>Improve the Platform:</strong> Analyze usage patterns, fix bugs, develop new features, and optimize search results</li>
            <li><strong>Communicate with you:</strong> Send account notifications, booking updates, verification status changes, and promotional messages (with your consent)</li>
            <li><strong>Ensure safety:</strong> Detect and prevent fraud, abuse, and security incidents; enforce our Terms of Service</li>
            <li><strong>Legal compliance:</strong> Comply with applicable laws, regulations, and legal processes in Ghana</li>
            <li><strong>Payments (future):</strong> When we introduce payment processing, we will use financial information to complete transactions and comply with financial regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">4. How We Share Your Information</h2>
          <p className="text-muted">We may share your information in the following circumstances:</p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li><strong>Worker-Customer Matching:</strong> When a customer requests a service, the worker&apos;s profile information (name, service category, location, rating, Trust Score, experience, and bio) is visible to the customer. The customer&apos;s booking details are shared with the selected worker.</li>
            <li><strong>Verification Process:</strong> Admin staff review worker profiles and verification documents solely for the purpose of approving or rejecting applications.</li>
            <li><strong>Service Providers:</strong> We may share data with third-party providers who assist in operating the Platform (hosting, database, analytics), bound by confidentiality agreements.</li>
            <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or government authority in Ghana.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, user data may be transferred, with notice to affected users.</li>
          </ul>
          <p className="text-muted mt-2">
            <strong>We do NOT sell your personal information to advertisers or third parties.</strong>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Security</h2>
          <p className="text-muted">
            We implement industry-standard security measures to protect your data, including:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li>Passwords are encrypted using bcrypt with salt rounds</li>
            <li>All data transmission is encrypted using TLS/SSL</li>
            <li>Database access is restricted and monitored</li>
            <li>Regular security audits and updates</li>
            <li>Role-based access controls for admin functions</li>
          </ul>
          <p className="text-muted mt-2">
            However, no method of transmission over the Internet is 100% secure. While we strive to protect your personal
            information, we cannot guarantee its absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">6. Data Retention</h2>
          <p className="text-muted">
            We retain your personal information for as long as your account is active or as needed to provide our services.
            Specifically:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li><strong>Account data:</strong> Retained until you request deletion</li>
            <li><strong>Worker profiles:</strong> Retained while the worker is active on the platform and for 12 months after deactivation</li>
            <li><strong>Booking records:</strong> Retained for 24 months after completion for reference and dispute resolution</li>
            <li><strong>Reviews:</strong> Retained indefinitely as they form part of the Trust Score system</li>
            <li><strong>Verification documents:</strong> Retained while the worker is verified and deleted within 30 days of account closure</li>
            <li><strong>Log data:</strong> Automatically deleted after 90 days</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">7. Your Rights</h2>
          <p className="text-muted">Under the Ghana Data Protection Act, 2012 (Act 843), you have the right to:</p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal retention requirements)</li>
            <li><strong>Objection:</strong> Object to the processing of your data for specific purposes</li>
            <li><strong>Portability:</strong> Request transfer of your data in a structured, machine-readable format</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
          </ul>
          <p className="text-muted mt-2">
            To exercise these rights, contact us at <strong>privacy@trustlink.africa</strong>. We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">8. Cookies and Tracking</h2>
          <p className="text-muted">
            We use cookies and similar technologies to:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li>Maintain your login session</li>
            <li>Remember your preferences and settings</li>
            <li>Analyze platform usage and performance</li>
            <li>Detect and prevent security threats</li>
          </ul>
          <p className="text-muted mt-2">
            You can control cookies through your browser settings. Disabling cookies may affect Platform functionality.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">9. Children&apos;s Privacy</h2>
          <p className="text-muted">
            TrustLink Africa is not intended for users under the age of 18. We do not knowingly collect personal information
            from children. If you are a parent or guardian and believe your child has provided us with personal information,
            please contact us at <strong>privacy@trustlink.africa</strong> and we will delete such information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">10. Changes to This Policy</h2>
          <p className="text-muted">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the
            new policy on this page and updating the &quot;Last updated&quot; date. Continued use of the Platform after changes
            constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">11. Contact Us</h2>
          <p className="text-muted">
            If you have questions about this Privacy Policy or our data practices, contact us at:
          </p>
          <div className="bg-gray-50 border border-border rounded-lg p-4 mt-3">
            <p className="text-muted"><strong>TrustLink Africa</strong></p>
            <p className="text-muted">Email: privacy@trustlink.africa</p>
            <p className="text-muted">Website: trustlink.africa</p>
            <p className="text-muted">Data Protection Officer: dpo@trustlink.africa</p>
          </div>
        </section>
      </div>
    </div>
  )
}
