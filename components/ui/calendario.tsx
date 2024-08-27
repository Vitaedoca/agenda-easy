"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

interface CalendarDemoProps {
  onSelect: (date: Date | undefined) => void;
}

export function CalendarDemo({ onSelect }: CalendarDemoProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  React.useEffect(() => {
    onSelect(date);
  }, [date, onSelect]);

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  );
}
