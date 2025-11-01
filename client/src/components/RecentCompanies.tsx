import { useQuery } from "@tanstack/react-query";
import { WarnNotice } from "@shared/schema";
import { Card } from "@/components/ui/card";
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

interface CompanyLayoff {
  companyName: string;
  totalWorkers: number;
  latestMonth: string;
  noticeCount: number;
  logoUrl?: string | null;
}

export default function RecentCompanies() {
  const { data: notices = [] } = useQuery<WarnNoticeWithCompany[]>({
    queryKey: ["/api/notices"],
  });

  const companiesGrouped = Object.values(
    notices.reduce((acc, notice) => {
        const companyName = notice.companyName;
        if (!acc[companyName]) {
          acc[companyName] = {
            companyName,
            totalWorkers: 0,
            latestMonth: notice.filingDate,
            noticeCount: 0,
            logoUrl: notice.company?.logoUrl || null,
          };
        }
        acc[companyName].totalWorkers += notice.workersAffected;
        acc[companyName].noticeCount += 1;
        if (new Date(notice.filingDate) > new Date(acc[companyName].latestMonth)) {
          acc[companyName].latestMonth = notice.filingDate;
        }
        // Update logo if this notice has one
        if (notice.company?.logoUrl && !acc[companyName].logoUrl) {
          acc[companyName].logoUrl = notice.company.logoUrl;
        }
        return acc;
      }, {} as Record<string, CompanyLayoff>)
  );

  const recentCompanies = companiesGrouped
    .sort((a, b) => new Date(b.latestMonth).getTime() - new Date(a.latestMonth).getTime())
    .slice(0, 6);

  const getCompanyInitials = (name: string) => {
    const words = name.split(' ').filter(word => 
      word.length > 0 && !['Inc', 'LLC', 'Corp', 'Ltd', 'Co'].includes(word)
    );
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0]?.substring(0, 2).toUpperCase() || '??';
  };

  if (recentCompanies.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" data-testid="heading-recent-companies">
          Recent Layoff Announcements
        </h2>
        <p className="text-muted-foreground" data-testid="text-recent-companies-description">
          Companies with the most recent WARN notice filings
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {recentCompanies.map((company, index) => (
          <Card
            key={`${company.companyName}-${index}`}
            className="p-4 hover-elevate active-elevate-2 cursor-pointer transition-all"
            data-testid={`card-recent-company-${index}`}
            onClick={() => {
              window.location.href = `/company/${encodeURIComponent(company.companyName)}`;
            }}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-border">
                {company.logoUrl && (
                  <AvatarImage src={company.logoUrl} alt={company.companyName} />
                )}
                <AvatarFallback className="bg-muted text-foreground font-semibold text-sm">
                  {getCompanyInitials(company.companyName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0 w-full">
                <h3 
                  className="font-semibold text-sm line-clamp-2 mb-1" 
                  data-testid={`text-company-name-${index}`}
                  title={company.companyName}
                >
                  {company.companyName}
                </h3>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="font-mono font-semibold text-foreground" data-testid={`text-workers-${index}`}>
                    {company.totalWorkers.toLocaleString()}
                  </div>
                  <div data-testid={`text-month-${index}`}>
                    {format(new Date(company.latestMonth), 'MMM yyyy')}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
