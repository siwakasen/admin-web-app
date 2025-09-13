'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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

export const description = 'An area chart showing profit/loss trends';

interface ChartData {
  month: string;
  profit_loss: number;
}

interface ProfitLossChartProps {
  chartData: ChartData[];
}

const chartConfig = {
  profit_loss: {
    label: 'Profit/Loss',
    color: '#3b82f6', // Blue
  },
} satisfies ChartConfig;

export function ProfitLossChart({ chartData }: ProfitLossChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit/Loss Trend Chart</CardTitle>
        <CardDescription>
          Showing monthly profit/loss trends for the selected year
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
              dataKey="profit_loss"
              type="natural"
              fill="var(--color-profit_loss)"
              fillOpacity={0.6}
              stroke="var(--color-profit_loss)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
