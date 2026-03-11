import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCalendar } from '../hooks/useCalendar';

// ─── T-12: useCalendar ───────────────────────────────────────
describe('T-12: useCalendar — 초기 상태', () => {
  it('초기 year/month가 현재 날짜와 일치한다', () => {
    const now = new Date();
    const { result } = renderHook(() => useCalendar());
    expect(result.current.year).toBe(now.getFullYear());
    expect(result.current.month).toBe(now.getMonth());
  });

  it('nextMonth() → 다음 달', () => {
    const now = new Date();
    const { result } = renderHook(() => useCalendar());
    act(() => { result.current.nextMonth(); });
    expect(result.current.month).toBe((now.getMonth() + 1) % 12);
  });

  it('prevMonth() → 이전 달', () => {
    const now = new Date();
    const { result } = renderHook(() => useCalendar());
    act(() => { result.current.prevMonth(); });
    const expected = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    expect(result.current.month).toBe(expected);
  });

  it('goToday() → 현재 달 복귀', () => {
    const now = new Date();
    const { result } = renderHook(() => useCalendar());
    act(() => { result.current.nextMonth(); result.current.nextMonth(); });
    act(() => { result.current.goToday(); });
    expect(result.current.month).toBe(now.getMonth());
    expect(result.current.year).toBe(now.getFullYear());
  });

  it('12월 → nextMonth → 1월 연도+1', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date(2026, 11, 1));
    const { result } = renderHook(() => useCalendar());
    act(() => { result.current.nextMonth(); });
    expect(result.current.month).toBe(0);
    expect(result.current.year).toBe(2027);
    vi.useRealTimers();
  });
});

// ─── T-04, T-05: useTodos dueDate ───────────────────────────
import { useTodos } from '../hooks/useTodos';

vi.mock('../firebase', () => ({ db: {} }));

const mockAddDoc = vi.fn(async () => ({ id: 'new-id' }));
const mockUpdateDoc = vi.fn(async () => {});
const mockDeleteDoc = vi.fn(async () => {});
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({})),
  addDoc: (...a) => mockAddDoc(...a),
  deleteDoc: (...a) => mockDeleteDoc(...a),
  updateDoc: (...a) => mockUpdateDoc(...a),
  onSnapshot: vi.fn(() => () => {}),
  doc: vi.fn((_db, ...path) => ({ _id: path[path.length - 1] })),
  query: vi.fn((q) => q),
  orderBy: vi.fn(),
}));

beforeEach(() => { vi.clearAllMocks(); });

describe('T-04: useTodos — addTodo with dueDate', () => {
  it('dueDate를 포함해 addDoc이 호출된다', async () => {
    const { result } = renderHook(() => useTodos('uid-test'));
    const dueDate = new Date(2026, 2, 20).getTime();
    await act(async () => { await result.current.addTodo('마감 있는 일', dueDate); });
    expect(mockAddDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ text: '마감 있는 일', dueDate })
    );
  });

  it('dueDate 없이 addTodo → null 저장', async () => {
    const { result } = renderHook(() => useTodos('uid-test'));
    await act(async () => { await result.current.addTodo('날짜 없는 일'); });
    expect(mockAddDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ dueDate: null })
    );
  });
});

describe('T-05: useTodos — updateDueDate', () => {
  it('updateDueDate 호출 시 updateDoc에 dueDate 전달', async () => {
    const { result } = renderHook(() => useTodos('uid-test'));
    const newDue = new Date(2026, 3, 1).getTime();
    await act(async () => { await result.current.updateDueDate('todo-123', newDue); });
    expect(mockUpdateDoc).toHaveBeenCalledWith(
      expect.anything(),
      { dueDate: newDue }
    );
  });
});
