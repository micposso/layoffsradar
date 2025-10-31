import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export default function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  const testId = title.toLowerCase().replace(/\s+/g, "-");
  return (
    <Card data-testid={`card-stat-${testId}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground" data-testid={`text-stat-title-${testId}`}>{title}</p>
            <p className="mt-2 text-3xl font-semibold font-mono text-foreground" data-testid={`text-stat-value-${testId}`}>
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground" data-testid={`text-stat-description-${testId}`}>{description}</p>
            )}
          </div>
          <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
