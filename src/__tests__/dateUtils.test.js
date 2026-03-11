import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { calcDday, formatDday, getDdayColor, buildCalendarDays } from '../utils/dateUtils';

// 오늘 날짜를 고정 (2026-03-11)
const FIXED_TODAY = new Date(2026, 2, 11).getTime(); // 2026-03-11 00:00:00

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_TODAY);
});
afterAll(() => {
  vi.useRealTimers();
});

// ─── T-01: D-Day 계산 — 오늘 ────────────────────────────────
describe('T-01: calcDday — 오늘', () => {
  it('오늘 날짜이면 0을 반환한다', () => {
    const today = new Date(2026, 2, 11).getTime();
    expect(calcDday(today)).toBe(0);
  });

  it('formatDday(0) → "D-Day"', () => {
    expect(formatDday(0)).toBe('D-Day');
  });
});

// ─── T-02: D-Day 계산 — 내일 ────────────────────────────────
describe('T-02: calcDday — 내일', () => {
  it('내일 날짜이면 1을 반환한다', () => {
    const tomorrow = new Date(2026, 2, 12).getTime();
    expect(calcDday(tomorrow)).toBe(1);
  });

  it('formatDday(1) → "D-1"', () => {
    expect(formatDday(1)).toBe('D-1');
  });
});

// ─── T-03: D-Day 계산 — 어제 (초과) ────────────────────────
describe('T-03: calcDday — 어제 (초과)', () => {
  it('어제 날짜이면 -1을 반환한다', () => {
    const yesterday = new Date(2026, 2, 10).getTime();
    expect(calcDday(yesterday)).toBe(-1);
  });

  it('formatDday(-1) → "D+1"', () => {
    expect(formatDday(-1)).toBe('D+1');
  });

  it('getDdayColor(-1) → 빨간 색상', () => {
    const color = getDdayColor(-1);
    expect(color.text).toBe('#DC2626');
  });
});

// ─── T-추가: getDdayColor 범위 ───────────────────────────────
describe('getDdayColor — 범위별 색상', () => {
  it('D-3 이하 → 빨간 배지', () => {
    expect(getDdayColor(3).text).toBe('#DC2626');
  });
  it('D-7 이하 → 주황 배지', () => {
    expect(getDdayColor(5).text).toBe('#D97706');
  });
  it('D-8 이상 → 회색 배지', () => {
    expect(getDdayColor(10).text).toBe('#64748B');
  });
});

// ─── buildCalendarDays ───────────────────────────────────────
describe('buildCalendarDays', () => {
  it('2026년 3월: 첫 날은 일요일(0), 31일까지', () => {
    const days = buildCalendarDays(2026, 2); // month=2 → March
    expect(days.length).toBe(42);
    expect(days[0]).toBe(1);    // 3월 1일은 일요일
    expect(days[30]).toBe(31);  // 3월 31일
    expect(days[31]).toBeNull();
  });
});
