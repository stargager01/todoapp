import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TodoApp } from '../components/TodoApp';

// Firebase 전체 mock — 테스트 환경에서 실제 연결 불필요
vi.mock('../firebase', () => ({
  auth: {},
  provider: {},
  db: {},
}));

// useTodos hook mock — Firestore 없이 로컬 상태로 동작
let mockTodos = [];
const mockAddTodo = vi.fn((text) => {
  mockTodos = [...mockTodos, { id: Date.now(), text, status: 'todo' }];
});
const mockCycleStatus = vi.fn((id) => {
  const next = { todo: 'done', done: 'stopped', stopped: 'todo' };
  mockTodos = mockTodos.map(t => t.id === id ? { ...t, status: next[t.status] } : t);
});
const mockRemove = vi.fn((id) => {
  mockTodos = mockTodos.filter(t => t.id !== id);
});

vi.mock('../hooks/useTodos', () => ({
  useTodos: () => ({
    todos: mockTodos,
    addTodo: mockAddTodo,
    cycleStatus: mockCycleStatus,
    remove: mockRemove,
  }),
}));

// 테스트용 가짜 유저
const mockUser = {
  uid: 'test-uid',
  displayName: '테스트유저',
  email: 'test@test.com',
  photoURL: 'https://via.placeholder.com/36',
};

beforeEach(() => {
  mockTodos = [];
  vi.clearAllMocks();
});

describe('TODO 앱 기본 기능', () => {

  it('할 일을 추가하면 addTodo가 호출된다', () => {
    render(<TodoApp user={mockUser} onLogOut={vi.fn()} />);

    const input = screen.getByPlaceholderText('할 일을 입력하세요');
    fireEvent.change(input, { target: { value: '장보기' } });
    fireEvent.click(screen.getByText('추가'));

    expect(mockAddTodo).toHaveBeenCalledWith('장보기');
  });

  it('삭제 버튼을 누르면 remove가 호출된다', () => {
    mockTodos = [{ id: 1, text: '운동하기', status: 'todo' }];
    render(<TodoApp user={mockUser} onLogOut={vi.fn()} />);

    fireEvent.click(screen.getByText('🗑️'));

    expect(mockRemove).toHaveBeenCalledWith(1);
  });

  it('이모지 클릭 시 cycleStatus가 호출된다', () => {
    mockTodos = [{ id: 1, text: '책 읽기', status: 'todo' }];
    render(<TodoApp user={mockUser} onLogOut={vi.fn()} />);

    // 👀 버튼 클릭 → 상태 순환 (배지의 👀와 구분하기 위해 role=button으로 선택)
    fireEvent.click(screen.getByRole('button', { name: '👀' }));

    expect(mockCycleStatus).toHaveBeenCalledWith(1, 'todo');
  });

});
