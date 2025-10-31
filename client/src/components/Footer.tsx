import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12 mx-auto md:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold">About</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  About WARN Act
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  Data Sources
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  Methodology
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/notices" className="transition-colors hover:text-foreground">
                  All Notices
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  State Guides
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  Data Attribution
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href="mailto:info@warntracker.com"
                  className="transition-colors hover:text-foreground"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  Newsletter Archive
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-12 border-t">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {currentYear} WARN Tracker. Data sourced from state workforce agencies and the U.S. Department of Labor.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
