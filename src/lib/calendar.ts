export type CalendarView = "day" | "week";

export function isCalendarView(value: string | undefined): value is CalendarView {
  return value === "day" || value === "week";
}

export function formatCalendarDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseCalendarDate(value: string | undefined, fallback: Date) {
  if (!value) {
    return startOfDay(fallback);
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return startOfDay(fallback);
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const parsed = new Date(year, month, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month ||
    parsed.getDate() !== day
  ) {
    return startOfDay(fallback);
  }

  return parsed;
}

export function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);

  return copy;
}

export function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);

  return copy;
}

export function startOfWeek(date: Date) {
  const start = startOfDay(date);
  const day = start.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  return addDays(start, mondayOffset);
}

export function getCalendarWindow({
  view,
  date,
  now = new Date(),
}: {
  view?: string;
  date?: string;
  now?: Date;
}) {
  const selectedView: CalendarView = isCalendarView(view) ? view : "day";
  const selectedDate = parseCalendarDate(date, now);
  const start = selectedView === "week" ? startOfWeek(selectedDate) : selectedDate;
  const end = addDays(start, selectedView === "week" ? 7 : 1);
  const previousDate = addDays(start, selectedView === "week" ? -7 : -1);
  const nextDate = addDays(start, selectedView === "week" ? 7 : 1);
  const days = Array.from(
    { length: selectedView === "week" ? 7 : 1 },
    (_, index) => addDays(start, index),
  );

  return {
    view: selectedView,
    selectedDate,
    start,
    end,
    previousDate,
    nextDate,
    todayDate: startOfDay(now),
    days,
  };
}
