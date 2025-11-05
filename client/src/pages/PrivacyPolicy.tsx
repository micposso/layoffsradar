import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12">
        <div className="container px-4 mx-auto md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="mb-6 text-4xl font-bold text-foreground font-display">
              Privacy Policy
            </h1>
            
            <div className="space-y-6 text-muted-foreground">
              <p className="text-sm text-muted-foreground">
                Last Updated: November 4, 2025
              </p>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2>
                <p>
                  When you subscribe to our email alerts, we collect your email address and optional state preference. We do not collect any other personal information unless you choose to provide it when contacting us.
                </p>
                <p>
                  We may also collect non-personal information such as browser type, device information, and usage data through analytics tools to improve our service.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">2. How We Use Your Information</h2>
                <p>
                  We use your email address solely to send you notifications about new WARN layoff notices based on your subscription preferences. If you opt in to marketing communications, we may also send you updates about our service and new features.
                </p>
                <p>
                  We use analytics data to understand how visitors use our platform and to improve the user experience.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">3. Data Sharing and Disclosure</h2>
                <p>
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>With service providers who assist us in operating our platform (such as email delivery services)</li>
                  <li>When required by law or to protect our legal rights</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">4. Email Communications</h2>
                <p>
                  You can unsubscribe from our email notifications at any time by clicking the unsubscribe link in any email we send you. Even after unsubscribing, we may retain your email address to honor your unsubscribe request.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">5. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">6. Cookies and Tracking</h2>
                <p>
                  We use cookies and similar tracking technologies to analyze site traffic and usage patterns. You can control cookie settings through your browser preferences.
                </p>
                <p>
                  We use Google Tag Manager to manage analytics and tracking codes on our website.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">7. Third-Party Links</h2>
                <p>
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">8. Children's Privacy</h2>
                <p>
                  Our service is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">9. Your Rights</h2>
                <p>
                  You have the right to:
                </p>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt out of marketing communications</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">10. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify subscribers of any material changes by email or through a notice on our website.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">11. Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy or our data practices, please contact us at updates@layoffsradar.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
