import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { DdayBadge } from '../components/DdayBadge';

const FIXED_TODAY = new Date(2026, 2, 11).getTime();
beforeAll(() => { vi.useFakeTimers(); vi.setSystemTime(FIXED_TODAY); });
afterAll(() => { vi.useRealTimers(); });

// ─── T-06: D-3 이하 → 빨간 배지 ────────────────────────────
describe('T-06: DdayBadge — D-3 이하 빨간 배지', () => {
  it('D-Day (오늘) → 빨간 배지 텍스트', () => {
    const today = new Date(2026, 2, 11).getTime();
    render(<DdayBadge dueDate={today} />);
    const badge = screen.getByTestId('dday-badge');
    expect(badge.textContent).toBe('D-Day');
    expect(badge.style.color).toBe('rgb(220, 38, 38)');
  });

  it('D-2 → 빨간 배지', () => {
    const twoDaysLater = new Date(2026, 2, 13).getTime();
    render(<DdayBadge dueDate={twoDaysLater} />);
    const badge = screen.getByTestId('dday-badge');
    expect(badge.textContent).toBe('D-2');
    expect(badge.style.color).toBe('rgb(220, 38, 38)');
  });

  it('초과(어제) → D+1 빨간 배지', () => {
    const yesterday = new Date(2026, 2, 10).getTime();
    render(<DdayBadge dueDate={yesterday} />);
    const badge = screen.getByTestId('dday-badge');
    expect(badge.textContent).toBe('D+1');
    expect(badge.style.color).toBe('rgb(220, 38, 38)');
  });
});

// ─── T-07: D-7 이하 → 주황 배지 ────────────────────────────
describe('T-07: DdayBadge — D-7 이하 주황 배지', () => {
  it('D-5 → 주황 배지', () => {
    const fiveDays = new Date(2026, 2, 16).getTime();
    render(<DdayBadge dueDate={fiveDays} />);
    const badge = screen.getByTestId('dday-badge');
    expect(badge.textContent).toBe('D-5');
    expect(badge.style.color).toBe('rgb(217, 119, 6)');
  });
});

// ─── dueDate 없으면 렌더 없음 ────────────────────────────────
describe('DdayBadge — dueDate 없음', () => {
  it('dueDate=null 이면 아무것도 렌더하지 않는다', () => {
    const { container } = render(<DdayBadge dueDate={null} />);
    expect(container.firstChild).toBeNull();
  });
});
