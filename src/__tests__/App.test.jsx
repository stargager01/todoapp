import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from '../App';

// localStorage mock: 테스트마다 깨끗한 상태 보장
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; },
  };
})();

beforeEach(() => {
  vi.stubGlobal('localStorage', localStorageMock);
  localStorageMock.clear();
});

describe('TODO 앱 기본 기능', () => {

  it('할 일을 추가하면 목록에 나타난다', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('할 일을 입력하세요');
    const button = screen.getByText('추가');

    fireEvent.change(input, { target: { value: '장보기' } });
    fireEvent.click(button);

    expect(screen.getByText('장보기')).toBeInTheDocument();
  });

  it('삭제 버튼을 누르면 목록에서 사라진다', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('할 일을 입력하세요');
    fireEvent.change(input, { target: { value: '운동하기' } });
    fireEvent.click(screen.getByText('추가'));

    const deleteBtn = screen.getByText('🗑️');
    fireEvent.click(deleteBtn);

    expect(screen.queryByText('운동하기')).not.toBeInTheDocument();
  });

  it('체크박스를 누르면 완료 처리(취소선)가 된다', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('할 일을 입력하세요');
    fireEvent.change(input, { target: { value: '책 읽기' } });
    fireEvent.click(screen.getByText('추가'));

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    const span = screen.getByText('책 읽기');
    expect(span).toHaveStyle('text-decoration: line-through');
  });

});
