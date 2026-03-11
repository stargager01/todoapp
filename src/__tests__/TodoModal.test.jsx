import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TodoModal } from '../components/TodoModal';

// ─── T-11: 날짜 미입력 시 dueDate = null ────────────────────
describe('T-11: TodoModal — 날짜 미입력 시 dueDate null', () => {
  it('날짜 없이 추가 → onAdd(text, null) 호출', () => {
    const onAdd = vi.fn();
    render(<TodoModal initialDate={null} onAdd={onAdd} onClose={vi.fn()} />);

    fireEvent.change(screen.getByTestId('modal-text-input'), {
      target: { value: '날짜 없는 할 일' }
    });
    fireEvent.click(screen.getByTestId('modal-submit-btn'));

    expect(onAdd).toHaveBeenCalledWith('날짜 없는 할 일', null);
  });

  it('날짜 입력 시 → onAdd(text, timestamp) 호출', () => {
    const onAdd = vi.fn();
    render(<TodoModal initialDate={null} onAdd={onAdd} onClose={vi.fn()} />);

    fireEvent.change(screen.getByTestId('modal-text-input'), {
      target: { value: '마감 있는 할 일' }
    });
    fireEvent.change(screen.getByTestId('modal-date-input'), {
      target: { value: '2026-03-20' }
    });
    fireEvent.click(screen.getByTestId('modal-submit-btn'));

    expect(onAdd).toHaveBeenCalledWith('마감 있는 할 일', expect.any(Number));
    const [, dueDate] = onAdd.mock.calls[0];
    expect(new Date(dueDate).getDate()).toBe(20);
  });

  it('initialDate 있으면 날짜 자동 입력', () => {
    const date = new Date(2026, 2, 15).getTime();
    render(<TodoModal initialDate={date} onAdd={vi.fn()} onClose={vi.fn()} />);
    const input = screen.getByTestId('modal-date-input');
    expect(input.value).toBe('2026-03-15');
  });

  it('빈 텍스트는 추가되지 않음', () => {
    const onAdd = vi.fn();
    render(<TodoModal onAdd={onAdd} onClose={vi.fn()} />);
    fireEvent.click(screen.getByTestId('modal-submit-btn'));
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('취소 버튼 → onClose 호출', () => {
    const onClose = vi.fn();
    render(<TodoModal onAdd={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByText('취소'));
    expect(onClose).toHaveBeenCalled();
  });
});
