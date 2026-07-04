import { describe, it, expect } from "vitest";
import { windowsForSlug } from "@/data/applicationWindows";
import { applyUrgency } from "@/lib/applyUrgency";

// Fixed "now" so legacy fallback behavior is deterministic.
const NOW = new Date("2026-06-24T00:00:00Z");

describe("application windows data", () => {
  it("does not keep stale sample windows for removed startup-support programs", () => {
    for (const slug of [
      "y-combinator",
      "entrepreneur-first-ef",
      "startup-wise-guys",
      "south-park-commons",
      "founders-inc-f-inc",
    ]) {
      expect(windowsForSlug(slug)).toBeUndefined();
    }
  });
});

describe("applyUrgency — missing window data fallback", () => {
  it('maps closing-soon to an urgent "Closing soon"', () => {
    expect(applyUrgency("no-window-slug", "closing-soon", NOW)).toEqual({
      label: "Closing soon",
      tone: "urgent",
    });
  });

  it('maps coming-soon (and the opening-soon alias) to "Coming soon"', () => {
    expect(applyUrgency("no-window-slug", "coming-soon", NOW)).toEqual({
      label: "Coming soon",
      tone: "upcoming",
    });
    expect(applyUrgency("no-window-slug", "opening-soon", NOW)).toEqual({
      label: "Coming soon",
      tone: "upcoming",
    });
  });

  it('maps open/rolling to "Applications open"', () => {
    expect(applyUrgency("no-window-slug", "open", NOW)?.label).toBe(
      "Applications open",
    );
    expect(applyUrgency("no-window-slug", "rolling", NOW)?.label).toBe(
      "Applications open",
    );
  });

  it("shows nothing for closed/running/unknown", () => {
    expect(applyUrgency("no-window-slug", "closed", NOW)).toBeNull();
    expect(applyUrgency("no-window-slug", "running", NOW)).toBeNull();
    expect(applyUrgency("no-window-slug", undefined, NOW)).toBeNull();
  });
});
