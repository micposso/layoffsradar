import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { WarnNotice } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import USMap from "@/components/USMap";
import EmailSignup from "@/components/EmailSignup";
import RecentCompanies from "@/components/RecentCompanies";
import NotableLayoffs from "@/components/NotableLayoffs";
import StatCard from "@/components/StatCard";
import { FileText, Users, MapPin, Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [companySearch, setCompanySearch] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("");

  const { data: notices = [] } = useQuery<WarnNotice[]>({
    queryKey: ["/api/notices"],
  });

  const { data: stats } = useQuery<{
    totalNotices: number;
    totalWorkers: number;
    activeStates: number;
    recentIncrease: number;
    trends: {
      notices: { value: number; isPositive: boolean };
      workers: { value: number; isPositive: boolean };
      states: { value: number; isPositive: boolean };
    };
  }>({
    queryKey: ["/api/stats"],
  });

  const stateData = notices.reduce((acc, notice) => {
    if (!acc[notice.state]) {
      acc[notice.state] = { notices: 0, workers: 0 };
    }
    acc[notice.state].notices += 1;
    acc[notice.state].workers += notice.workersAffected;
    return acc;
  }, {} as Record<string, { notices: number; workers: number }>);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (companySearch) {
      params.set("company", companySearch);
    }
    if (stateFilter) {
      params.set("state", stateFilter);
    }
    setLocation(`/notices?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 bg-background border-b">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-8">
              <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl" data-testid="heading-main">
                Layoffs Warnings and Tracker
              </h1>
              <p className="text-lg text-muted-foreground mb-1" data-testid="text-hero-description">
                Get notifications of layoff notices in real time - stay informed and prepared.
              </p>
              <p className="text-muted-foreground" data-testid="text-hero-tagline">
                Search by company or state and get warnings right into your inbox
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid gap-4 mb-8 md:grid-cols-3 max-w-4xl mx-auto">
              <StatCard
                title="Notices"
                value={stats?.totalNotices || notices.length}
                icon={FileText}
                trend={stats?.trends?.notices}
              />
              <StatCard
                title="Jobs Affected"
                value={stats?.totalWorkers || notices.reduce((sum, n) => sum + n.workersAffected, 0)}
                icon={Users}
                trend={stats?.trends?.workers}
              />
              <StatCard
                title="States Reporting"
                value={stats?.activeStates || Object.keys(stateData).length}
                icon={MapPin}
                trend={stats?.trends?.states}
              />
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="flex flex-col gap-3 md:flex-row">
                <Input
                  type="text"
                  placeholder="Search company or state..."
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  data-testid="input-search"
                />
                <Button
                  onClick={handleSearch}
                  className="md:w-auto"
                  data-testid="button-search"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button
                  variant="secondary"
                  asChild
                  className="md:w-auto"
                  data-testid="button-subscribe-alerts"
                >
                  <a href="#subscribe">Subscribe for Alerts</a>
                </Button>
              </div>
            </div>

            {/* Map Section */}
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground" data-testid="text-map-tooltip">
                  Click a state to explore WARN filings
                </p>
              </div>
              <USMap stateData={stateData} />
            </div>
          </div>
        </section>

        {/* Subscribe Section */}
        <section id="subscribe" className="py-12 bg-muted/30">
          <div className="container px-4 mx-auto md:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <EmailSignup />
            </div>
          </div>
        </section>

        {/* Notable Layoffs Carousel */}
        <NotableLayoffs />
      </main>

      <Footer />
    </div>
  );
}
