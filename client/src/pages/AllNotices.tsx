import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { WarnNotice } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WarnNoticeCard from "@/components/WarnNoticeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FileText, SlidersHorizontal } from "lucide-react";

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

export default function AllNotices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");

  const { data: notices = [], isLoading } = useQuery<WarnNotice[]>({
    queryKey: ["/api/notices"],
  });

  const filteredNotices = notices
    .filter((notice) => {
      const matchesSearch =
        searchQuery === "" ||
        notice.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesState =
        selectedState === "all" || notice.state === selectedState;

      return matchesSearch && matchesState;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.filingDate).getTime() - new Date(a.filingDate).getTime();
        case "date-asc":
          return new Date(a.filingDate).getTime() - new Date(b.filingDate).getTime();
        case "workers-desc":
          return b.workersAffected - a.workersAffected;
        case "workers-asc":
          return a.workersAffected - b.workersAffected;
        case "company":
          return a.companyName.localeCompare(b.companyName);
        default:
          return 0;
      }
    });

  const uniqueStates = Array.from(new Set(notices.map(n => n.state))).sort();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="py-8 border-b bg-muted/30">
          <div className="container px-4 mx-auto md:px-6 lg:px-8">
            <h1 className="mb-2 text-3xl font-bold md:text-4xl" data-testid="heading-all-notices">All WARN Notices</h1>
            <p className="text-lg text-muted-foreground" data-testid="text-all-notices-description">
              Search and filter through all employment layoff notifications
            </p>
          </div>
        </div>

        <div className="container px-4 py-8 mx-auto md:px-6 lg:px-8">
          <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by company or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>

            <div className="flex gap-2">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-[180px]" data-testid="select-state">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {uniqueStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {stateNames[state] || state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="workers-desc">Most Workers</SelectItem>
                  <SelectItem value="workers-asc">Fewest Workers</SelectItem>
                  <SelectItem value="company">Company A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-4 text-sm text-muted-foreground" data-testid="text-results-count">
            Showing {filteredNotices.length} of {notices.length} notices
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="py-16 text-center" data-testid="empty-state-search">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold" data-testid="text-no-results">No notices found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedState !== "all"
                  ? "Try adjusting your search or filters"
                  : "WARN notices will appear here once they're added to the database."}
              </p>
              {(searchQuery || selectedState !== "all") && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedState("all");
                  }}
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotices.map((notice) => (
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
