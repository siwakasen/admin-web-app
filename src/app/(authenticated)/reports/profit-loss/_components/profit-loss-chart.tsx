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

export const description = 'A bar chart';

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
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function ProfitLossChart({ chartData }: ProfitLossChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit/Loss Chart</CardTitle>
        <CardDescription>
          Showing monthly profit/loss for the selected year
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
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="profit_loss"
              fill="var(--color-profit_loss)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Profit/Loss overview <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing monthly profit/loss for the selected year
        </div>
      </CardFooter>
    </Card>
  );
}
