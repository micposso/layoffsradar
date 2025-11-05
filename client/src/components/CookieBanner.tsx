import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("cookie-consent", "dismissed");
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90"
      data-testid="banner-cookies"
    >
      <div className="container px-4 py-4 mx-auto md:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex-1 text-sm text-muted-foreground">
            <p>
              We use cookies and similar technologies to analyze site traffic and improve your experience.
              By using this site, you consent to our use of cookies.{" "}
              <Link href="/privacy" className="underline transition-colors hover:text-foreground" data-testid="link-cookie-privacy">
                Learn more in our Privacy Policy
              </Link>
              .
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              data-testid="button-cookie-dismiss"
            >
              <X className="w-4 h-4 mr-2" />
              Dismiss
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleAccept}
              data-testid="button-cookie-accept"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
