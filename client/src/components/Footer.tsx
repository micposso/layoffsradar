import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background" data-testid="footer-main">
      <div className="container px-4 py-12 mx-auto md:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold" data-testid="heading-footer-about">About</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-foreground" data-testid="link-about-warn">
                  About WARN Act
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-foreground" data-testid="link-data-sources">
                  Data Sources
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-foreground" data-testid="link-methodology">
                  Methodology
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold" data-testid="heading-footer-resources">Resources</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/notices" className="transition-colors hover:text-foreground" data-testid="link-all-notices-footer">
                  All Notices
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-foreground" data-testid="link-state-guides">
                  State Guides
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-foreground" data-testid="link-faq">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold" data-testid="heading-footer-legal">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-foreground" data-testid="link-privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-foreground" data-testid="link-terms">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-foreground" data-testid="link-attribution">
                  Data Attribution
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold" data-testid="heading-footer-contact">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href="mailto:info@warntracker.com"
                  className="transition-colors hover:text-foreground"
                  data-testid="link-contact"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-foreground" data-testid="link-report">
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-foreground" data-testid="link-newsletter">
                  Newsletter Archive
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-12 border-t">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground" data-testid="text-copyright">
              © {currentYear} WARN Tracker. Data sourced from state workforce agencies and the U.S. Department of Labor.
            </p>
            <p className="text-sm text-muted-foreground" data-testid="text-last-updated">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
