'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export const description = 'A multiple bar chart';

const chartConfig = {
  gross_revenue: {
    label: 'Gross Revenue',
    color: 'var(--chart-1)',
  },
  net_revenue: {
    label: 'Net Revenue',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function YearlyChart({
  chartData,
}: {
  chartData: { month: string; gross_revenue: number; net_revenue: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Revenue Chart</CardTitle>
        <CardDescription>
          Showing yearly revenue for the last 5 years
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="gross_revenue"
              fill="var(--color-gross_revenue)"
              radius={4}
            />
            <Bar
              dataKey="net_revenue"
              fill="var(--color-net_revenue)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Revenue overview <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total revenue for the last 5 years
        </div>
      </CardFooter>
    </Card>
  );
}
