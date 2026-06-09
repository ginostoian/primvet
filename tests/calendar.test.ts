import { describe, expect, it } from "vitest";

import { formatCalendarDate, getCalendarWindow } from "@/lib/calendar";

describe("calendar window helpers", () => {
  it("defaults to the selected day and builds previous/next day links", () => {
    const window = getCalendarWindow({
      date: "2026-06-07",
      now: new Date(2026, 5, 1, 12),
    });

    expect(window.view).toBe("day");
    expect(formatCalendarDate(window.start)).toBe("2026-06-07");
    expect(formatCalendarDate(window.end)).toBe("2026-06-08");
    expect(formatCalendarDate(window.previousDate)).toBe("2026-06-06");
    expect(formatCalendarDate(window.nextDate)).toBe("2026-06-08");
    expect(window.days.map(formatCalendarDate)).toEqual(["2026-06-07"]);
  });

  it("builds a Monday to Monday range for week view", () => {
    const window = getCalendarWindow({
      view: "week",
      date: "2026-06-07",
      now: new Date(2026, 5, 1, 12),
    });

    expect(formatCalendarDate(window.start)).toBe("2026-06-01");
    expect(formatCalendarDate(window.end)).toBe("2026-06-08");
    expect(formatCalendarDate(window.previousDate)).toBe("2026-05-25");
    expect(formatCalendarDate(window.nextDate)).toBe("2026-06-08");
    expect(window.days.map(formatCalendarDate)).toEqual([
      "2026-06-01",
      "2026-06-02",
      "2026-06-03",
      "2026-06-04",
      "2026-06-05",
      "2026-06-06",
      "2026-06-07",
    ]);
  });

  it("falls back to today for invalid dates and invalid views", () => {
    const window = getCalendarWindow({
      view: "month",
      date: "2026-02-31",
      now: new Date(2026, 5, 7, 12),
    });

    expect(window.view).toBe("day");
    expect(formatCalendarDate(window.start)).toBe("2026-06-07");
  });
});
