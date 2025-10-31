import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { WarnNotice } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WarnNoticeCard from "@/components/WarnNoticeCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, MapPin, FileText, Calendar, ArrowLeft, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CompanyDetail() {
  const [, params] = useRoute("/company/:companyName");
  const companyName = params?.companyName ? decodeURIComponent(params.companyName) : "";

  const { data: notices = [], isLoading } = useQuery<WarnNotice[]>({
    queryKey: ["/api/companies", companyName],
    queryFn: async () => {
      const res = await fetch(`/api/companies/${encodeURIComponent(companyName)}`);
      if (!res.ok) throw new Error("Failed to fetch company notices");
      return res.json();
    },
    enabled: !!companyName,
  });

  const totalWorkers = notices.reduce((sum, n) => sum + n.workersAffected, 0);
  const states = Array.from(new Set(notices.map(n => n.state)));
  const industries = Array.from(new Set(notices.map(n => n.industry).filter(Boolean)));

  // Prepare timeline data for chart
  const timelineData = notices
    .map(n => ({
      date: new Date(n.filingDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      workers: n.workersAffected,
      filingDate: n.filingDate,
    }))
    .sort((a, b) => new Date(a.filingDate).getTime() - new Date(b.filingDate).getTime());

  if (!companyName) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Company not specified</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="py-8 border-b bg-muted/30">
          <div className="container px-4 mx-auto md:px-6 lg:px-8">
            <Link href="/notices">
              <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Notices
              </Button>
            </Link>

            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold md:text-4xl" data-testid="heading-company-name">
                {companyName}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground" data-testid="text-company-description">
              Complete WARN notice history and workforce impact statistics
            </p>
          </div>
        </div>

        <div className="container px-4 py-8 mx-auto space-y-8 md:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
              <div className="h-64 rounded-lg bg-muted animate-pulse" />
            </div>
          ) : notices.length === 0 ? (
            <div className="py-16 text-center" data-testid="empty-state-company">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No WARN notices found</h3>
              <p className="text-muted-foreground">
                There are no WARN notices on record for {companyName}.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-3">
                <Card data-testid="card-total-notices">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total WARN Notices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold font-mono" data-testid="text-total-notices">
                        {notices.length}
                      </div>
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-total-workers">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Workers Affected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold font-mono" data-testid="text-total-workers">
                        {totalWorkers.toLocaleString()}
                      </div>
                      <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-states-affected">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      States Affected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold font-mono" data-testid="text-states-count">
                        {states.length}
                      </div>
                      <MapPin className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {states.slice(0, 5).map(state => (
                        <span
                          key={state}
                          className="px-2 py-0.5 text-xs rounded bg-muted"
                          data-testid={`badge-state-${state}`}
                        >
                          {state}
                        </span>
                      ))}
                      {states.length > 5 && (
                        <span className="px-2 py-0.5 text-xs rounded bg-muted">
                          +{states.length - 5} more
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {timelineData.length > 0 && (
                <Card data-testid="card-timeline-chart">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <CardTitle>Workers Affected Timeline</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={timelineData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                          dataKey="date"
                          className="text-xs text-muted-foreground"
                        />
                        <YAxis className="text-xs text-muted-foreground" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "6px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="workers"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.6}
                          name="Workers Affected"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              <div>
                <h2 className="mb-4 text-2xl font-bold" data-testid="heading-notice-history">
                  Notice History
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {notices.map((notice) => (
                    <WarnNoticeCard key={notice.id} notice={notice} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
