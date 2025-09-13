'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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

export const description = 'A stacked bar chart comparing revenue across years';

interface ChartData {
  year: string;
  gross_revenue: number;
  net_revenue: number;
}

interface ChartBarStackedProps {
  data: ChartData[];
}

const chartConfig = {
  net_revenue: {
    label: 'Net Revenue',
    color: 'var(--chart-2)',
  },
  gross_revenue: {
    label: 'Gross Revenue',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function ChartBarStacked({ data }: ChartBarStackedProps) {
  return (
    <div className="w-full">
      <ChartContainer config={chartConfig} className="h-[500px] w-full">
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
          barCategoryGap="20%"
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="#f0f0f0"
          />
          <XAxis
            dataKey="year"
            tickLine={false}
            tickMargin={15}
            axisLine={false}
            fontSize={12}
            fontWeight={500}
            tick={{ fill: '#666' }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            fontSize={12}
            tick={{ fill: '#666' }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value: any, name: any, item: any) => {
                  return (
                    <div className="flex w-full flex-wrap items-stretch gap-2">
                      <div
                        className="shrink-0 rounded-[2px] h-2.5 w-2.5"
                        style={{
                          backgroundColor: item.color || item.payload?.fill,
                        }}
                      />
                      <div className="flex flex-1 justify-between leading-none items-center">
                        <span className="text-muted-foreground">
                          {name === 'net_revenue' ? 'Net' : 'Gross'}
                        </span>
                        <span className="text-foreground font-mono font-medium tabular-nums pl-2">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(value)}
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="gross_revenue"
            stackId="a"
            fill="var(--color-gross_revenue)"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="net_revenue"
            stackId="a"
            fill="var(--color-net_revenue)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
