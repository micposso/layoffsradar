import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12">
        <div className="container px-4 mx-auto md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="mb-6 text-4xl font-bold text-foreground font-display">
              Terms of Service
            </h1>
            
            <div className="space-y-6 text-muted-foreground">
              <p className="text-sm text-muted-foreground">
                Last Updated: November 4, 2025
              </p>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using LayoffsRADAR, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">2. Description of Service</h2>
                <p>
                  LayoffsRADAR is a platform that aggregates and displays publicly available Worker Adjustment and Retraining Notification (WARN) Act notices from state workforce agencies across the United States. We provide this information for informational purposes only.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">3. Data Accuracy and Disclaimer</h2>
                <p>
                  All data on this platform is sourced from official state workforce agency databases and public records. While we strive to provide accurate and up-to-date information, we make no warranties or guarantees about the accuracy, completeness, or timeliness of the data.
                </p>
                <p>
                  <strong>This service is provided "as is" without any warranties of any kind.</strong> We are not responsible for any errors, omissions, or delays in the data, or for any actions taken based on the information provided.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">4. Not Legal or Financial Advice</h2>
                <p>
                  The information provided on LayoffsRADAR is for informational purposes only and does not constitute legal, financial, or professional advice. For official information or legal questions about WARN notices, please contact your state's workforce agency or the U.S. Department of Labor.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">5. User Conduct</h2>
                <p>
                  You agree not to:
                </p>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>Use the service for any unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to our systems or data</li>
                  <li>Interfere with or disrupt the service or servers</li>
                  <li>Scrape, harvest, or collect data using automated means without permission</li>
                  <li>Misrepresent your identity or affiliation</li>
                  <li>Use the service to harass, abuse, or harm others</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">6. Email Subscriptions</h2>
                <p>
                  By subscribing to our email alerts, you consent to receive notifications about WARN layoff notices. You may unsubscribe at any time using the link provided in our emails.
                </p>
                <p>
                  We reserve the right to suspend or terminate email service to any subscriber who violates these terms or engages in abusive behavior.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">7. Intellectual Property</h2>
                <p>
                  The design, layout, and functionality of LayoffsRADAR are protected by copyright and other intellectual property laws. You may not copy, reproduce, or create derivative works without our explicit permission.
                </p>
                <p>
                  The WARN notice data itself is public information sourced from government agencies and is not subject to our copyright.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">8. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, LayoffsRADAR and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                </p>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>Your use or inability to use the service</li>
                  <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
                  <li>Any interruption or cessation of transmission to or from the service</li>
                  <li>Any errors or omissions in the content</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">9. Indemnification</h2>
                <p>
                  You agree to indemnify and hold harmless LayoffsRADAR and its operators from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the service or violation of these terms.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">10. Third-Party Services</h2>
                <p>
                  Our service may integrate with third-party services and contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party services.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">11. Modifications to Service</h2>
                <p>
                  We reserve the right to modify, suspend, or discontinue the service at any time without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">12. Changes to Terms</h2>
                <p>
                  We may revise these Terms of Service at any time. The most current version will always be available on this page. By continuing to use the service after changes are posted, you agree to be bound by the revised terms.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">13. Governing Law</h2>
                <p>
                  These Terms of Service shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">14. Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at updates@layoffsradar.com.
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
