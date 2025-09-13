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

export const description = 'An area chart with a legend for expenses';

const chartConfig = {
  salary_cost: {
    label: 'Salary Cost',
    color: 'var(--chart-1)',
  },
  expenses_cost: {
    label: 'Expenses Cost',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function YearlyExpensesChart({
  chartData,
}: {
  chartData: {
    month: string;
    salary_cost: number;
    expenses_cost: number;
  }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Expenses Chart</CardTitle>
        <CardDescription>
          Showing yearly expenses breakdown for the selected year
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
              dataKey="expenses_cost"
              type="natural"
              fill="var(--color-expenses_cost)"
              fillOpacity={0.4}
              stroke="var(--color-expenses_cost)"
              stackId="a"
            />
            <Area
              dataKey="salary_cost"
              type="natural"
              fill="var(--color-salary_cost)"
              fillOpacity={0.4}
              stroke="var(--color-salary_cost)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
