import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CalendarView } from '../components/CalendarView';
import { CalendarCell } from '../components/CalendarCell';

const BASE_PROPS = {
  year: 2026,
  month: 2, // March
  todos: [],
  onPrev: vi.fn(),
  onNext: vi.fn(),
  onToday: vi.fn(),
  onDateClick: vi.fn(),
};

// ─── T-08: 날짜 클릭 → onDateClick 콜백 ─────────────────────
describe('T-08: CalendarView — 날짜 클릭 콜백', () => {
  it('날짜 셀 클릭 시 onDateClick(day) 호출된다', () => {
    const onDateClick = vi.fn();
    render(<CalendarView {...BASE_PROPS} onDateClick={onDateClick} />);
    fireEvent.click(screen.getByTestId('calendar-cell-15'));
    expect(onDateClick).toHaveBeenCalledWith(15);
  });
});

// ─── T-09: 월 이동 버튼 ─────────────────────────────────────
describe('T-09: CalendarView — 월 이동 버튼', () => {
  it('‹ 버튼 클릭 시 onPrev 호출된다', () => {
    const onPrev = vi.fn();
    render(<CalendarView {...BASE_PROPS} onPrev={onPrev} />);
    fireEvent.click(screen.getByTestId('prev-month'));
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it('› 버튼 클릭 시 onNext 호출된다', () => {
    const onNext = vi.fn();
    render(<CalendarView {...BASE_PROPS} onNext={onNext} />);
    fireEvent.click(screen.getByTestId('next-month'));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('오늘 버튼 클릭 시 onToday 호출된다', () => {
    const onToday = vi.fn();
    render(<CalendarView {...BASE_PROPS} onToday={onToday} />);
    fireEvent.click(screen.getByTestId('today-btn'));
    expect(onToday).toHaveBeenCalledTimes(1);
  });

  it('헤더에 year/month 표시', () => {
    render(<CalendarView {...BASE_PROPS} year={2026} month={2} />);
    expect(screen.getByText('2026년 3월')).toBeTruthy();
  });
});

// ─── T-10: 3개 초과 시 "+N 더보기" ──────────────────────────
describe('T-10: CalendarCell — 3개 초과 시 더보기 배지', () => {
  it('Todo 4개 → "+1 더보기" 표시', () => {
    const todos = [
      { id: 1, text: 'Todo 1', status: 'todo' },
      { id: 2, text: 'Todo 2', status: 'todo' },
      { id: 3, text: 'Todo 3', status: 'todo' },
      { id: 4, text: 'Todo 4', status: 'todo' },
    ];
    render(<CalendarCell day={5} todos={todos} onDateClick={vi.fn()} />);
    expect(screen.getByTestId('overflow-badge').textContent).toBe('+1 더보기');
  });

  it('Todo 3개 이하 → 더보기 배지 없음', () => {
    const todos = [
      { id: 1, text: 'A', status: 'todo' },
      { id: 2, text: 'B', status: 'todo' },
    ];
    render(<CalendarCell day={5} todos={todos} onDateClick={vi.fn()} />);
    expect(screen.queryByTestId('overflow-badge')).toBeNull();
  });
});
