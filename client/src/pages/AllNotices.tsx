import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { WarnNotice } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WarnNoticeCard from "@/components/WarnNoticeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, FileText, SlidersHorizontal, Calendar, X } from "lucide-react";

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
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [filingDateFrom, setFilingDateFrom] = useState("");
  const [filingDateTo, setFilingDateTo] = useState("");
  const [effectiveDateFrom, setEffectiveDateFrom] = useState("");
  const [effectiveDateTo, setEffectiveDateTo] = useState("");
  const [workerRange, setWorkerRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: notices = [], isLoading } = useQuery<WarnNotice[]>({
    queryKey: ["/api/notices"],
  });

  // Get unique industries
  const uniqueIndustries = useMemo(() => {
    const industries = new Set(
      notices
        .map(n => n.industry)
        .filter((industry): industry is string => Boolean(industry))
    );
    return Array.from(industries).sort();
  }, [notices]);

  // Calculate min/max workers for slider
  const { minWorkers, maxWorkers } = useMemo(() => {
    if (notices.length === 0) return { minWorkers: 0, maxWorkers: 10000 };
    const workers = notices.map(n => n.workersAffected);
    return {
      minWorkers: Math.min(...workers),
      maxWorkers: Math.max(...workers),
    };
  }, [notices]);

  // Initialize worker range once data loads
  useEffect(() => {
    if (notices.length > 0 && workerRange[0] === 0 && workerRange[1] === 10000) {
      setWorkerRange([minWorkers, maxWorkers]);
    }
  }, [notices.length, minWorkers, maxWorkers]);

  const filteredNotices = notices
    .filter((notice) => {
      const matchesSearch =
        searchQuery === "" ||
        notice.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesState =
        selectedState === "all" || notice.state === selectedState;

      const matchesIndustry =
        selectedIndustries.length === 0 ||
        (notice.industry && selectedIndustries.includes(notice.industry));

      const matchesFilingDateFrom =
        !filingDateFrom || new Date(notice.filingDate) >= new Date(filingDateFrom);

      const matchesFilingDateTo =
        !filingDateTo || new Date(notice.filingDate) <= new Date(filingDateTo);

      const matchesEffectiveDateFrom =
        !effectiveDateFrom || (notice.effectiveDate && new Date(notice.effectiveDate) >= new Date(effectiveDateFrom));

      const matchesEffectiveDateTo =
        !effectiveDateTo || (notice.effectiveDate && new Date(notice.effectiveDate) <= new Date(effectiveDateTo));

      const matchesWorkers =
        notice.workersAffected >= workerRange[0] &&
        notice.workersAffected <= workerRange[1];

      return matchesSearch && matchesState && matchesIndustry && matchesFilingDateFrom && matchesFilingDateTo && matchesEffectiveDateFrom && matchesEffectiveDateTo && matchesWorkers;
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

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedState("all");
    setSelectedIndustries([]);
    setFilingDateFrom("");
    setFilingDateTo("");
    setEffectiveDateFrom("");
    setEffectiveDateTo("");
    setWorkerRange([minWorkers, maxWorkers]);
  };

  const hasActiveFilters = searchQuery || selectedState !== "all" || selectedIndustries.length > 0 || filingDateFrom || filingDateTo || effectiveDateFrom || effectiveDateTo || workerRange[0] !== minWorkers || workerRange[1] !== maxWorkers;

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
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
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

                <Button
                  variant={showFilters ? "secondary" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                  data-testid="button-toggle-filters"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="default" className="ml-2 px-1.5 py-0.5 text-xs">
                      Active
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="p-6 space-y-6 border rounded-lg bg-muted/30" data-testid="panel-advanced-filters">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Advanced Filters</h3>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      data-testid="button-clear-filters"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="filing-date-from">Filing Date From</Label>
                      <Input
                        id="filing-date-from"
                        type="date"
                        value={filingDateFrom}
                        onChange={(e) => setFilingDateFrom(e.target.value)}
                        data-testid="input-filing-date-from"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="filing-date-to">Filing Date To</Label>
                      <Input
                        id="filing-date-to"
                        type="date"
                        value={filingDateTo}
                        onChange={(e) => setFilingDateTo(e.target.value)}
                        data-testid="input-filing-date-to"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="effective-date-from">Effective Date From</Label>
                      <Input
                        id="effective-date-from"
                        type="date"
                        value={effectiveDateFrom}
                        onChange={(e) => setEffectiveDateFrom(e.target.value)}
                        data-testid="input-effective-date-from"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="effective-date-to">Effective Date To</Label>
                      <Input
                        id="effective-date-to"
                        type="date"
                        value={effectiveDateTo}
                        onChange={(e) => setEffectiveDateTo(e.target.value)}
                        data-testid="input-effective-date-to"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-1">
                  <div className="space-y-2">
                    <Label>Workers Affected Range</Label>
                    <div className="pt-2 space-y-2">
                      <Slider
                        min={minWorkers}
                        max={maxWorkers}
                        step={10}
                        value={workerRange}
                        onValueChange={(value) => setWorkerRange(value as [number, number])}
                        className="w-full"
                        data-testid="slider-workers"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span data-testid="text-workers-min">{workerRange[0].toLocaleString()}</span>
                        <span data-testid="text-workers-max">{workerRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Industry Sectors</Label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueIndustries.map((industry) => (
                      <Badge
                        key={industry}
                        variant={selectedIndustries.includes(industry) ? "default" : "outline"}
                        className="cursor-pointer hover-elevate"
                        onClick={() => toggleIndustry(industry)}
                        data-testid={`badge-industry-${industry.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {industry}
                        {selectedIndustries.includes(industry) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
                {searchQuery || selectedState !== "all" || selectedIndustries.length > 0 || filingDateFrom || filingDateTo || effectiveDateFrom || effectiveDateTo
                  ? "Try adjusting your search or filters"
                  : "WARN notices will appear here once they're added to the database."}
              </p>
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
