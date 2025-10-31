import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, BarChart3, PieChart, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type AnalyticsData = {
  timeline: Array<{ month: string; notices: number; workers: number }>;
  byState: Array<{ state: string; notices: number; workers: number }>;
  byIndustry: Array<{ industry: string; count: number; workers: number }>;
};

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088fe",
  "#00c49f",
  "#ffbb28",
];

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <div className="container px-4 py-16 mx-auto md:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-64 rounded-lg bg-muted animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { timeline = [], byState = [], byIndustry = [] } = analytics || {};

  // Format month labels for better readability
  const timelineFormatted = timeline.map(d => ({
    ...d,
    monthLabel: new Date(d.month + "-01").toLocaleDateString("en-US", { 
      month: "short", 
      year: "2-digit" 
    }),
  }));

  // Prepare data for pie chart (top 6 industries)
  const topIndustries = byIndustry.slice(0, 6);
  const pieData = topIndustries.map(d => ({
    name: d.industry,
    value: d.workers,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="py-8 border-b bg-muted/30">
          <div className="container px-4 mx-auto md:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold md:text-4xl" data-testid="heading-analytics">
                Analytics Dashboard
              </h1>
            </div>
            <p className="text-lg text-muted-foreground" data-testid="text-analytics-description">
              Visualize trends, patterns, and insights from WARN layoff data
            </p>
          </div>
        </div>

        <div className="container px-4 py-8 mx-auto space-y-8 md:px-6 lg:px-8">
          <Card data-testid="card-timeline-chart">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <CardTitle>Layoff Trends Over Time</CardTitle>
              </div>
              <CardDescription>
                Monthly timeline showing WARN notices and workers affected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timelineFormatted}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="monthLabel" 
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
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="notices" 
                    stackId="1"
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                    name="Notices"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="workers" 
                    stackId="2"
                    stroke="hsl(var(--secondary))" 
                    fill="hsl(var(--secondary))"
                    fillOpacity={0.6}
                    name="Workers Affected"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card data-testid="card-states-chart">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <CardTitle>Top 10 States by Workers Affected</CardTitle>
                </div>
                <CardDescription>
                  States with the highest number of affected workers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={byState} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs text-muted-foreground" />
                    <YAxis 
                      dataKey="state" 
                      type="category" 
                      className="text-xs text-muted-foreground"
                      width={40}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Bar 
                      dataKey="workers" 
                      fill="hsl(var(--primary))" 
                      name="Workers Affected"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card data-testid="card-industry-chart">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  <CardTitle>Layoffs by Industry</CardTitle>
                </div>
                <CardDescription>
                  Distribution of affected workers across industries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsPie>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={120}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card data-testid="card-industry-table">
            <CardHeader>
              <CardTitle>Industry Breakdown</CardTitle>
              <CardDescription>
                Detailed statistics by industry sector
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-sm font-medium text-left text-muted-foreground">
                        Industry
                      </th>
                      <th className="px-4 py-3 text-sm font-medium text-right text-muted-foreground">
                        Notices
                      </th>
                      <th className="px-4 py-3 text-sm font-medium text-right text-muted-foreground">
                        Workers Affected
                      </th>
                      <th className="px-4 py-3 text-sm font-medium text-right text-muted-foreground">
                        Avg per Notice
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {byIndustry.map((industry, idx) => (
                      <tr 
                        key={industry.industry} 
                        className="border-b last:border-0"
                        data-testid={`row-industry-${idx}`}
                      >
                        <td className="px-4 py-3 font-medium" data-testid={`text-industry-name-${idx}`}>
                          {industry.industry}
                        </td>
                        <td className="px-4 py-3 text-right font-mono" data-testid={`text-industry-count-${idx}`}>
                          {industry.count}
                        </td>
                        <td className="px-4 py-3 text-right font-mono" data-testid={`text-industry-workers-${idx}`}>
                          {industry.workers.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                          {Math.round(industry.workers / industry.count).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
