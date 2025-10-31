import { useQuery } from "@tanstack/react-query";
import { WarnNotice } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import USMap from "@/components/USMap";
import EmailSignup from "@/components/EmailSignup";
import WarnNoticeCard from "@/components/WarnNoticeCard";
import StatCard from "@/components/StatCard";
import { FileText, Users, MapPin, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: notices = [], isLoading } = useQuery<WarnNotice[]>({
    queryKey: ["/api/notices"],
  });

  const { data: stats } = useQuery<{
    totalNotices: number;
    totalWorkers: number;
    activeStates: number;
    recentIncrease: number;
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

  const latestNotices = [...notices]
    .sort((a, b) => new Date(b.filingDate).getTime() - new Date(a.filingDate).getTime())
    .slice(0, 9);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container px-4 mx-auto md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto mb-12 text-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" data-testid="heading-main">
                WARN Layoff Tracker
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl" data-testid="text-hero-description">
                Track employment layoff notices across the United States in real-time.
                Stay informed about workforce adjustments and company closures.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <USMap stateData={stateData} />
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container px-4 mx-auto md:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 text-center">
                <h2 className="mb-2 text-2xl font-semibold md:text-3xl" data-testid="heading-subscribe">
                  Stay Updated
                </h2>
                <p className="text-muted-foreground" data-testid="text-subscribe-description">
                  Subscribe to receive weekly email notifications about new WARN notices
                </p>
              </div>
              <EmailSignup />
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/30">
          <div className="container px-4 mx-auto md:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Notices"
                value={stats?.totalNotices || notices.length}
                icon={FileText}
              />
              <StatCard
                title="Workers Affected"
                value={stats?.totalWorkers || notices.reduce((sum, n) => sum + n.workersAffected, 0)}
                icon={Users}
              />
              <StatCard
                title="Active States"
                value={stats?.activeStates || Object.keys(stateData).length}
                icon={MapPin}
              />
              <StatCard
                title="This Month"
                value={stats?.recentIncrease || notices.filter(n => {
                  const date = new Date(n.filingDate);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
                icon={TrendingUp}
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container px-4 mx-auto md:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="mb-2 text-3xl font-bold" data-testid="heading-latest-notices">Latest WARN Notices</h2>
                <p className="text-muted-foreground" data-testid="text-latest-description">
                  Most recent employment layoff notifications filed
                </p>
              </div>
              <Link href="/notices">
                <Button variant="outline" data-testid="button-view-all-notices">
                  View All
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-48 rounded-lg bg-muted animate-pulse"
                  />
                ))}
              </div>
            ) : latestNotices.length === 0 ? (
              <div className="py-16 text-center" data-testid="empty-state-notices">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No notices yet</h3>
                <p className="text-muted-foreground">
                  WARN notices will appear here once they're added to the database.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {latestNotices.map((notice) => (
                  <WarnNoticeCard key={notice.id} notice={notice} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
