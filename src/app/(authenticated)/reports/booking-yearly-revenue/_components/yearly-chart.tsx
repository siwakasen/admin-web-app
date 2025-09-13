'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export const description = 'An area chart with a legend';

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
        <CardTitle>Yearly Chart</CardTitle>
        <CardDescription>
          Showing yearly revenue for the last 5 years
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="net_revenue"
              type="natural"
              fill="var(--color-net_revenue)"
              fillOpacity={0.4}
              stroke="var(--color-net_revenue)"
              stackId="a"
            />
            <Area
              dataKey="gross_revenue"
              type="natural"
              fill="var(--color-gross_revenue)"
              fillOpacity={0.4}
              stroke="var(--color-gross_revenue)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
