import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, description, trend }: StatCardProps) {
  const testId = title.toLowerCase().replace(/\s+/g, "-");
  const numericValue = typeof value === "number" ? value : 0;
  const animatedValue = useCountUp({ end: numericValue, duration: 2000 });
  
  const displayValue = typeof value === "number" 
    ? animatedValue.toLocaleString() 
    : value;

  // Determine arrow icon and color based on trend
  const ArrowIcon = trend 
    ? (trend.isPositive ? ArrowUp : ArrowDown)
    : Minus;
  
  const arrowBgColor = trend
    ? (trend.isPositive ? "bg-red-500" : "bg-[#16a34a]")
    : "bg-gray-400";

  return (
    <Card className="bg-[#f0f8ff]" data-testid={`card-stat-${testId}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground" data-testid={`text-stat-title-${testId}`}>
              {title}
            </p>
            <p className="mt-2 text-3xl font-semibold font-mono text-foreground" data-testid={`text-stat-value-${testId}`}>
              {displayValue}
            </p>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <span 
                  className={`text-sm font-medium ${trend.isPositive ? 'text-red-500' : 'text-green-600'}`}
                  data-testid={`text-trend-${testId}`}
                >
                  {Math.abs(trend.value)}% vs last month
                </span>
              </div>
            )}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground" data-testid={`text-stat-description-${testId}`}>
                {description}
              </p>
            )}
          </div>
          <div className={`flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-lg ${arrowBgColor}`}>
            <ArrowIcon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
