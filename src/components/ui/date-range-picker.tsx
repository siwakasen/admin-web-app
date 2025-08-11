"use client";

import * as React from "react";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onDateRangeChange: (startDate: string | undefined, endDate: string | undefined) => void;
  onApply: () => void;
  onClear: () => void;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateRangeChange,
  onApply,
  onClear,
  className,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    if (startDate || endDate) {
      return {
        from: startDate ? new Date(startDate) : undefined,
        to: endDate ? new Date(endDate) : undefined,
      };
    }
    return undefined;
  });

  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    
    const start = selectedDate?.from ? format(selectedDate.from, "yyyy-MM-dd") : undefined;
    const end = selectedDate?.to ? format(selectedDate.to, "yyyy-MM-dd") : undefined;
    
    onDateRangeChange(start, end);
  };

  const handleClear = () => {
    setDate(undefined);
    onDateRangeChange(undefined, undefined);
    onClear();
    setIsOpen(false);
  };

  const handleApply = () => {
    onApply();
    setIsOpen(false);
  };

  const formatDateRange = () => {
    if (!date?.from) {
      return "Pick a date range";
    }

    if (date.from && !date.to) {
      return format(date.from, "LLL dd, y");
    }

    if (date.from && date.to) {
      return `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`;
    }

    return "Pick a date range";
  };

  return (
    <div className={cn("flex flex-col gap-4 p-4 border rounded-lg bg-background", className)}>
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4" />
        <Label className="text-sm font-medium">Filter by Date Range</Label>
      </div>

      <div className="grid gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={2}
              
            />
            <div className="flex gap-2 p-3 border-t">
              <Button
                size="sm"
                onClick={handleApply}
                className="flex items-center gap-1 flex-1"
              >
                <CalendarIcon className="h-3 w-3" />
                Apply Filter
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {date && (date.from || date.to) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Selected range:</span>
          <span className="font-medium">
            {formatDateRange()}
          </span>
        </div>
      )}
  {/* add button below here but not w-full */}
  <Button
    size="sm"
    onClick={handleClear}
    disabled={!date}
    className="flex items-center gap-1 px-4 py-2 text-base w-fit"
  >
    <X className="h-4 w-4" />
    <span className="text-sm">Clear Filter</span>
  </Button>
    </div>
  );
}
