import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Building2 } from "lucide-react";
import { WarnNotice } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface WarnNoticeCardProps {
  notice: WarnNotice;
}

export default function WarnNoticeCard({ notice }: WarnNoticeCardProps) {
  const filingDate = new Date(notice.filingDate);
  const timeAgo = formatDistanceToNow(filingDate, { addSuffix: true });

  return (
    <Card className="transition-all hover-elevate" data-testid={`card-notice-${notice.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate text-card-foreground" data-testid={`text-company-${notice.id}`}>
              {notice.companyName}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate" data-testid={`text-location-${notice.id}`}>
                {notice.city}, {notice.state}
              </span>
            </div>
          </div>
          <Badge variant="secondary" className="flex-shrink-0" data-testid={`badge-state-${notice.id}`}>
            {notice.state}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-2xl font-semibold font-mono text-foreground" data-testid={`text-workers-${notice.id}`}>
                {notice.workersAffected.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">workers affected</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-3 text-sm border-t">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span data-testid={`text-date-${notice.id}`}>{timeAgo}</span>
          </div>

          {notice.industry && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Building2 className="w-3.5 h-3.5" />
              <span className="truncate" data-testid={`text-industry-${notice.id}`}>{notice.industry}</span>
            </div>
          )}

          {notice.layoffType && (
            <Badge variant="outline" className="text-xs" data-testid={`badge-type-${notice.id}`}>
              {notice.layoffType}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
