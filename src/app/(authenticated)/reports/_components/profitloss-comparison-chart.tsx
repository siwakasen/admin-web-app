'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
  Cell,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export const description =
  'A bar chart comparing profit/loss across years with zero reference line';

interface ChartData {
  year: string;
  profit_loss: number;
}

interface ProfitLossChartProps {
  data: ChartData[];
}

const chartConfig = {
  profit_loss: {
    label: 'Profit/Loss',
    color: '#3b82f6', // Blue
  },
} satisfies ChartConfig;

export function ProfitLossChart({ data }: ProfitLossChartProps) {
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
          <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value: any, name: any, item: any) => {
                  const isPositive = value >= 0;
                  return (
                    <div className="flex w-full flex-wrap items-stretch gap-2">
                      <div
                        className="shrink-0 rounded-[2px] h-2.5 w-2.5"
                        style={{
                          backgroundColor: isPositive ? '#10b981' : '#ef4444',
                        }}
                      />
                      <div className="flex flex-1 justify-between leading-none items-center">
                        <span className="text-muted-foreground flex items-center gap-1">
                          {isPositive ? (
                            <>
                              <TrendingUp className="h-3 w-3" />
                              Profit
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-3 w-3" />
                              Loss
                            </>
                          )}
                        </span>
                        <span
                          className={`text-foreground font-mono font-medium tabular-nums pl-2 ${
                            isPositive ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
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
          <Bar dataKey="profit_loss" radius={[4, 4, 4, 4]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.profit_loss >= 0 ? '#10b981' : '#ef4444'}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
