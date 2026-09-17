import test from "node:test";
import assert from "node:assert/strict";

import {
  formatMoney, formatMoneyCompact, formatDateKey, formatShortDateKey,
  formatDateTime, daysBetween, initials, percent, titleCase,
} from "../lib/format.ts";

test("money formats from integer minor units", () => {
  assert.equal(formatMoney(256_250), "$2,562.50");
  assert.equal(formatMoney(0), "$0.00");
  assert.equal(formatMoney(100), "$1.00");
  assert.equal(formatMoney(-1_250), "-$12.50");
  assert.throws(() => formatMoney(12.5), TypeError);
});

test("compact money is used for headline numbers", () => {
  assert.equal(formatMoneyCompact(25_000_000), "$250k");
  assert.equal(formatMoneyCompact(2_562_500), "$26k");
  assert.equal(formatMoneyCompact(256_250), "$2,562.50");
});

test("date keys format in UTC without a timezone shift", () => {
  assert.equal(formatDateKey("2026-10-29"), "29 Oct 2026");
  assert.equal(formatShortDateKey("2026-10-01"), "1 Oct");
  assert.equal(formatDateTime("2026-10-28T09:12:00Z"), "28 Oct, 09:12");
  assert.throws(() => formatDateKey("not-a-date"), TypeError);
});

test("day differences work across month and year boundaries", () => {
  assert.equal(daysBetween("2026-10-01", "2026-10-29"), 28);
  assert.equal(daysBetween("2026-12-31", "2027-01-01"), 1);
  assert.equal(daysBetween("2026-10-29", "2026-10-01"), -28);
});

test("small display helpers behave", () => {
  assert.equal(initials("Alex Rivera"), "AR");
  assert.equal(initials("Priya"), "P");
  assert.equal(initials("  "), "");
  assert.equal(percent(6, 8), 75);
  assert.equal(percent(1, 0), 0);
  assert.equal(titleCase("overdue"), "Overdue");
});
