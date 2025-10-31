import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { WarnNotice } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WarnNoticeCard from "@/components/WarnNoticeCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText } from "lucide-react";

const stateNames: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

export default function StateDetail() {
  const [, params] = useRoute("/state/:state");
  const stateCode = params?.state?.toUpperCase() || "";
  const stateName = stateNames[stateCode] || stateCode;

  const { data: stateNotices = [], isLoading } = useQuery<WarnNotice[]>({
    queryKey: ["/api/notices", stateCode],
    queryFn: async () => {
      const res = await fetch(`/api/notices/${stateCode}`);
      if (!res.ok) throw new Error("Failed to fetch notices");
      return res.json();
    },
  });
  const totalWorkers = stateNotices.reduce((sum, n) => sum + n.workersAffected, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="py-8 border-b bg-muted/30">
          <div className="container px-4 mx-auto md:px-6 lg:px-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Map
              </Button>
            </Link>

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold md:text-4xl" data-testid="text-state-name">
                  {stateName}
                </h1>
                <p className="text-lg text-muted-foreground">
                  WARN layoff notices for {stateName}
                </p>
              </div>

              <div className="flex gap-6">
                <div>
                  <div className="text-sm text-muted-foreground">Total Notices</div>
                  <div className="text-2xl font-semibold font-mono" data-testid="stat-total-notices">
                    {stateNotices.length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Workers Affected</div>
                  <div className="text-2xl font-semibold font-mono" data-testid="stat-total-workers">
                    {totalWorkers.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 py-12 mx-auto md:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : stateNotices.length === 0 ? (
            <div className="py-16 text-center" data-testid="empty-state-state">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold" data-testid="text-no-state-notices">No notices found</h3>
              <p className="text-muted-foreground">
                There are currently no WARN notices for {stateName}.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stateNotices
                .sort((a, b) => new Date(b.filingDate).getTime() - new Date(a.filingDate).getTime())
                .map((notice) => (
                  <WarnNoticeCard key={notice.id} notice={notice} />
                ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
