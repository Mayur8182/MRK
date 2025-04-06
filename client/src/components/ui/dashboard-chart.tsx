import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  name: string;
  value: number;
  previousValue?: number;
}

interface DashboardChartProps {
  title: string;
  data: DataPoint[];
  type?: "area" | "bar";
  colors?: {
    primary: string;
    secondary?: string;
  };
  height?: number;
  showLegend?: boolean;
}

export function DashboardChart({
  title,
  data,
  type = "area",
  colors = { primary: "hsl(var(--primary))", secondary: "hsl(var(--muted))" },
  height = 300,
  showLegend = false,
}: DashboardChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {type === "area" ? (
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={colors.primary}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors.primary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  {colors.secondary && (
                    <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={colors.secondary}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={colors.secondary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  )}
                </defs>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--muted))"
                  opacity={0.3}
                />
                <Tooltip />
                {showLegend && <Legend />}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={colors.primary}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  name="Value"
                />
                {data[0].previousValue !== undefined && (
                  <Area
                    type="monotone"
                    dataKey="previousValue"
                    stroke={colors.secondary}
                    fillOpacity={1}
                    fill="url(#colorPrev)"
                    name="Previous"
                  />
                )}
              </AreaChart>
            ) : (
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--muted))"
                  opacity={0.3}
                />
                <Tooltip />
                {showLegend && <Legend />}
                <Bar
                  dataKey="value"
                  fill={colors.primary}
                  radius={[4, 4, 0, 0]}
                  name="Value"
                />
                {data[0].previousValue !== undefined && (
                  <Bar
                    dataKey="previousValue"
                    fill={colors.secondary}
                    radius={[4, 4, 0, 0]}
                    name="Previous"
                  />
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
