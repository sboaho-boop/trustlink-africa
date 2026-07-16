import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service - TrustLink Africa",
  description: "Terms and conditions for using the TrustLink Africa platform.",
}

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-primary hover:underline mb-4 inline-block">
          &larr; Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
        <p className="text-muted mt-2">Last updated: July 16, 2026</p>
      </div>

      <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted">
            Welcome to TrustLink Africa. These Terms of Service (&quot;Terms&quot;) govern your use of the TrustLink
            platform, including our website at trustlink.africa, mobile application, and all related services
            (collectively, the &quot;Platform&quot;). The Platform is operated by TrustLink Africa (&quot;we,&quot;
            &quot;us,&quot; or &quot;our&quot;).
          </p>
          <p className="text-muted mt-2">
            By creating an account, accessing, or using the Platform, you agree to be bound by these Terms. If you do
            not agree to these Terms, you must not use the Platform.
          </p>
          <p className="text-muted mt-2">
            You must be at least 18 years old to use TrustLink Africa. By using the Platform, you represent and warrant
            that you meet this age requirement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
          <p className="text-muted">
            TrustLink Africa is a verified service marketplace that connects customers with trusted service providers
            across Ghana. Our Platform enables:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li><strong>Customers</strong> to search for, review, and request services from verified workers</li>
            <li><strong>Workers</strong> to create profiles, get verified, receive service requests, and grow their reputation</li>
            <li><strong>Verification</strong> of worker identities, references, and background through our Trust Score system</li>
          </ul>
          <p className="text-muted mt-2">
            TrustLink Africa acts as a platform to facilitate connections. We are <strong>not</strong> a party to any
            agreement or transaction between customers and workers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">3. Account Registration</h2>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">3.1 Creating an Account</h3>
          <p className="text-muted">
            To use TrustLink Africa, you must create an account with a valid email address and password. You may register
            as a Customer (to find workers) or a Worker (to offer services). You may not create multiple accounts.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">3.2 Account Security</h3>
          <p className="text-muted">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities
            that occur under your account. You must notify us immediately at <strong>security@trustlink.africa</strong>
            if you suspect any unauthorized access to your account.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">3.3 Account Accuracy</h3>
          <p className="text-muted">
            You agree to provide accurate, current, and complete information during registration and to keep your account
            information up to date. Providing false or misleading information is grounds for immediate account suspension.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">4. Worker Obligations</h2>
          <p className="text-muted">As a worker on TrustLink Africa, you agree to:</p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li>Provide accurate and truthful information in your profile, including your real name, skills, experience, and location</li>
            <li>Submit genuine verification documents (Ghana Card, references, certificates)</li>
            <li>Respond to service requests in a timely and professional manner</li>
            <li>Deliver services as described and agreed upon with the customer</li>
            <li>Maintain professional conduct and respect customer property and privacy</li>
            <li>Carry valid identification when performing services</li>
            <li>Report any incidents, disputes, or safety concerns to TrustLink Africa</li>
            <li>Comply with all applicable laws of Ghana while performing services</li>
            <li>Keep your availability, pricing, and contact information up to date</li>
          </ul>
          <p className="text-muted mt-2">
            Workers who provide false information, engage in misconduct, or receive multiple verified complaints
            will have their accounts suspended or permanently banned.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">5. Customer Obligations</h2>
          <p className="text-muted">As a customer on TrustLink Africa, you agree to:</p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li>Provide accurate information when requesting services</li>
            <li>Communicate clearly with workers about job requirements, expectations, and payment</li>
            <li>Treat workers with dignity and respect</li>
            <li>Pay workers the agreed-upon amount upon satisfactory completion of services</li>
            <li>Leave honest and fair reviews based on your actual experience</li>
            <li>Report any disputes or issues to TrustLink Africa rather than taking unilateral action</li>
            <li>Ensure a safe working environment for service providers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">6. Trust Score and Verification</h2>
          <p className="text-muted">
            TrustLink Africa operates a Trust Score system to help customers identify reliable workers. The Trust Score
            is calculated based on:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li>Identity verification (Ghana Card / national ID) — 20 points</li>
            <li>References checked and confirmed — 20 points</li>
            <li>Previous employer confirmation — 20 points</li>
            <li>Customer reviews and ratings — 20 points</li>
            <li>Completed jobs — 20 points</li>
          </ul>
          <p className="text-muted mt-2">
            <strong>Important:</strong> A Trust Score is an indicator, not a guarantee. TrustLink Africa does not
            warrant or guarantee the performance, reliability, or conduct of any worker. Customers are responsible
            for exercising their own judgment when hiring workers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">7. Bookings and Payments</h2>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">7.1 Service Requests</h3>
          <p className="text-muted">
            Customers may submit service requests through the Platform. Workers may accept or reject these requests.
            A booking is only confirmed when the worker accepts the request. Until then, no obligation exists on
            either party.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">7.2 Payments</h3>
          <p className="text-muted">
            Payment for services is currently arranged directly between the customer and worker. TrustLink Africa does
            not process payments at this time. When we introduce payment processing in the future, additional terms
            will apply and you will be notified.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">7.3 Cancellations</h3>
          <p className="text-muted">
            Either party may cancel a confirmed booking. We encourage both parties to communicate promptly if a
            cancellation is necessary. Repeated cancellations may affect your Trust Score or account standing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">8. Reviews and Ratings</h2>
          <p className="text-muted">
            Customers may leave reviews and ratings after interacting with a worker. You agree to:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li>Leave only honest reviews based on real experiences</li>
            <li>Not leave fake, defamatory, or malicious reviews</li>
            <li>Not offer or accept payment in exchange for reviews</li>
            <li>Understand that reviews are public and permanent once submitted</li>
          </ul>
          <p className="text-muted mt-2">
            TrustLink Africa reserves the right to remove reviews that violate these terms, including reviews
            that are fraudulent, hateful, or contain inappropriate content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">9. Prohibited Conduct</h2>
          <p className="text-muted">You must NOT:</p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li>Use the Platform for any illegal purpose under Ghanaian law</li>
            <li>Create fake accounts or impersonate another person</li>
            <li>Submit false verification documents</li>
            <li>Harass, threaten, or abuse other users</li>
            <li>Attempt to circumvent the Trust Score system</li>
            <li>Use automated tools or bots to access the Platform</li>
            <li>Collect other users&apos; personal information without their consent</li>
            <li>Transmit spam, viruses, or harmful code</li>
            <li>Interfere with or disrupt the Platform&apos;s infrastructure</li>
            <li>Use the Platform to solicit business outside of TrustLink&apos;s system</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">10. Disclaimers and Limitation of Liability</h2>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">10.1 Platform &quot;As Is&quot;</h3>
          <p className="text-muted">
            TrustLink Africa is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
            whether express or implied, including but not limited to implied warranties of merchantability, fitness
            for a particular purpose, and non-infringement.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">10.2 No Liability for Worker Performance</h3>
          <p className="text-muted">
            TrustLink Africa does not employ workers listed on the Platform. We do not control, supervise, or
            direct the work performed by workers. Each worker is an independent service provider. TrustLink Africa
            is <strong>not liable</strong> for:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li>The quality, safety, or legality of services provided by workers</li>
            <li>Any damage, loss, or injury caused by workers</li>
            <li>Disputes between customers and workers regarding payment, quality, or other matters</li>
            <li>The truth or accuracy of worker profiles or reviews</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">10.3 Limitation of Damages</h3>
          <p className="text-muted">
            To the maximum extent permitted by Ghanaian law, TrustLink Africa shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether
            incurred directly or indirectly, arising from your use of the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">11. Indemnification</h2>
          <p className="text-muted">
            You agree to indemnify, defend, and hold harmless TrustLink Africa, its officers, directors, employees,
            and agents from and against any claims, liabilities, damages, losses, and expenses (including legal fees)
            arising from your use of the Platform, your violation of these Terms, or your violation of any rights
            of another party.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">12. Account Suspension and Termination</h2>
          <p className="text-muted">
            We reserve the right to suspend or terminate your account at any time, with or without notice, for
            conduct that we determine, in our sole discretion, violates these Terms or is harmful to other users,
            the Platform, or our business. Grounds for termination include:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li>Providing false or misleading information</li>
            <li>Engaging in fraudulent, abusive, or illegal behavior</li>
            <li>Receiving multiple verified complaints from other users</li>
            <li>Attempting to manipulate the Trust Score system</li>
            <li>Violating any provision of these Terms</li>
          </ul>
          <p className="text-muted mt-2">
            You may also deactivate your account at any time by contacting us at <strong>support@trustlink.africa</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">13. Dispute Resolution</h2>
          <p className="text-muted">
            Any disputes arising from or relating to these Terms or your use of the Platform shall first be
            addressed through our internal dispute resolution process. Contact <strong>support@trustlink.africa</strong>
            to initiate a dispute.
          </p>
          <p className="text-muted mt-2">
            If a resolution cannot be reached internally, disputes shall be resolved in accordance with the laws of the
            Republic of Ghana, and you consent to the exclusive jurisdiction of the courts of Ghana.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">14. Intellectual Property</h2>
          <p className="text-muted">
            All content, trademarks, logos, and intellectual property on the Platform are owned by or licensed to
            TrustLink Africa. You may not copy, modify, distribute, sell, or lease any part of our Platform or
            its content without our written permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">15. Modifications to These Terms</h2>
          <p className="text-muted">
            We may modify these Terms at any time. We will notify you of material changes by posting the updated
            Terms on this page and, where appropriate, by email. Your continued use of the Platform after changes
            are posted constitutes acceptance of the modified Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">16. Governing Law</h2>
          <p className="text-muted">
            These Terms are governed by and construed in accordance with the laws of the Republic of Ghana, without
            regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">17. Contact Information</h2>
          <p className="text-muted">
            For questions about these Terms of Service, contact us at:
          </p>
          <div className="bg-gray-50 border border-border rounded-lg p-4 mt-3">
            <p className="text-muted"><strong>TrustLink Africa</strong></p>
            <p className="text-muted">Email: support@trustlink.africa</p>
            <p className="text-muted">Legal: legal@trustlink.africa</p>
            <p className="text-muted">Website: trustlink.africa</p>
          </div>
        </section>
      </div>
    </div>
  )
}
