import { useQuery } from "@tanstack/react-query";
import { WarnNotice } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Building2 } from "lucide-react";

// Extended type with company info
type WarnNoticeWithCompany = WarnNotice & {
  company?: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    headquarters: string | null;
    industry: string | null;
  } | null;
};

interface NotableLayoff {
  companyName: string;
  workersAffected: number;
  month: string;
  logoUrl?: string | null;
}

export default function NotableLayoffs() {
  const { data: notices = [] } = useQuery<WarnNoticeWithCompany[]>({
    queryKey: ["/api/notices"],
  });

  // Get the top notable layoffs (largest worker counts)
  const notableLayoffs: NotableLayoff[] = notices
    .sort((a, b) => b.workersAffected - a.workersAffected)
    .slice(0, 12) // Get top 12 for smooth looping
    .map((notice) => ({
      companyName: notice.companyName,
      workersAffected: notice.workersAffected,
      month: format(new Date(notice.filingDate), "MMM yyyy"),
      logoUrl: notice.company?.logoUrl || null,
    }));

  const getCompanyInitials = (name: string) => {
    const words = name.split(' ').filter(word => 
      word.length > 0 && !['Inc', 'LLC', 'Corp', 'Ltd', 'Co'].includes(word)
    );
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0]?.substring(0, 2).toUpperCase() || '??';
  };

  if (notableLayoffs.length === 0) {
    return null;
  }

  // Duplicate the array for seamless looping
  const duplicatedLayoffs = [...notableLayoffs, ...notableLayoffs];

  return (
    <div className="py-8 bg-muted/50 border-t overflow-hidden">
      <div className="container px-4 mx-auto md:px-6 lg:px-8 mb-6">
        <h2 className="text-2xl font-bold text-center" data-testid="heading-notable-layoffs">
          Notable Layoffs
        </h2>
        <p className="text-center text-muted-foreground mt-2" data-testid="text-notable-description">
          Major WARN notices by worker impact
        </p>
      </div>

      <div className="relative">
        {/* Animated scrolling container */}
        <div className="flex gap-6 animate-scroll">
          {duplicatedLayoffs.map((layoff, index) => (
            <div
              key={`${layoff.companyName}-${index}`}
              className="flex-shrink-0 flex items-center gap-4 bg-background border rounded-lg p-4 min-w-[280px]"
              data-testid={`card-notable-layoff-${index % notableLayoffs.length}`}
            >
              <Avatar className="w-12 h-12 border-2 border-border">
                {layoff.logoUrl && (
                  <AvatarImage src={layoff.logoUrl} alt={layoff.companyName} />
                )}
                <AvatarFallback className="bg-muted text-foreground font-semibold text-sm">
                  {getCompanyInitials(layoff.companyName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h3 
                  className="font-semibold text-sm truncate" 
                  data-testid={`text-company-${index % notableLayoffs.length}`}
                  title={layoff.companyName}
                >
                  {layoff.companyName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono font-bold text-lg text-destructive" data-testid={`text-workers-${index % notableLayoffs.length}`}>
                    {layoff.workersAffected.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground" data-testid={`text-month-${index % notableLayoffs.length}`}>
                    {layoff.month}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
