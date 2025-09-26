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
              dataKey="salary_cost"
              fill="var(--color-salary_cost)"
              radius={4}
            />
            <Bar
              dataKey="expenses_cost"
              fill="var(--color-expenses_cost)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Expenses overview <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total expenses for the selected year
        </div>
      </CardFooter>
    </Card>
  );
}
