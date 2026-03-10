import { useState } from 'react';
import { useTodos } from '../hooks/useTodos';

// 상태별 스타일 정의
const STATUS = {
  todo:    { emoji: '👀', label: '할일',    color: '#f59e0b', bg: '#fffbeb', text: '#1e293b', decoration: 'none' },
  done:    { emoji: '😊', label: '해결',    color: '#10b981', bg: '#f0fdf4', text: '#94a3b8', decoration: 'line-through' },
  stopped: { emoji: '😑', label: '중단',    color: '#94a3b8', bg: '#f8fafc', text: '#94a3b8', decoration: 'line-through' },
};

export function TodoApp({ user, onLogOut }) {
  const [input, setInput] = useState('');
  const { todos, addTodo, cycleStatus, remove } = useTodos(user.uid);

  const handleAdd = () => {
    addTodo(input);
    setInput('');
  };

  // 상태별 개수 집계
  const counts = todos.reduce(
    (acc, t) => ({ ...acc, [t.status]: (acc[t.status] ?? 0) + 1 }),
    { todo: 0, done: 0, stopped: 0 }
  );

  return (
    <div style={{
      maxWidth: 480, margin: '40px auto', padding: '0 16px',
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src={user.photoURL}
            alt={user.displayName}
            width={36} height={36}
            style={{ borderRadius: '50%' }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>
              {user.displayName}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{user.email}</div>
          </div>
        </div>
        <button
          onClick={onLogOut}
          style={{
            padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0',
            background: '#fff', cursor: 'pointer', fontSize: 13, color: '#64748b'
          }}
        >
          로그아웃
        </button>
      </div>

      {/* 상태 요약 배지 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {Object.entries(STATUS).map(([key, s]) => (
          <div key={key} style={{
            flex: 1, textAlign: 'center', padding: '10px 0',
            borderRadius: 10, background: s.bg,
            border: `1px solid ${s.color}22`
          }}>
            <div style={{ fontSize: 20 }}>{s.emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{counts[key]}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 입력 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="할 일을 입력하세요"
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 8,
            border: '1px solid #e2e8f0', fontSize: 14, outline: 'none'
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            padding: '10px 18px', borderRadius: 8, border: 'none',
            background: '#6366f1', color: '#fff', cursor: 'pointer',
            fontWeight: 600, fontSize: 14
          }}
        >
          추가
        </button>
      </div>

      {/* 목록 */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {todos.map(todo => {
          const s = STATUS[todo.status] ?? STATUS.todo;
          return (
            <li key={todo.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px', borderRadius: 8, marginBottom: 8,
              background: s.bg, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              borderLeft: `3px solid ${s.color}`
            }}>
              {/* 상태 버튼 — 클릭 시 todo→done→stopped→todo 순환 */}
              <button
                onClick={() => cycleStatus(todo.id, todo.status ?? 'todo')}
                title="클릭해서 상태 변경"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 22, lineHeight: 1, padding: 0, flexShrink: 0
                }}
              >
                {s.emoji}
              </button>
              <span style={{
                flex: 1, fontSize: 14,
                color: s.text,
                textDecoration: s.decoration
              }}>
                {todo.text}
              </span>
              <button
                onClick={() => remove(todo.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 15, opacity: 0.4, flexShrink: 0
                }}
              >
                🗑️
              </button>
            </li>
          );
        })}
      </ul>

      {todos.length === 0 && (
        <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: 40 }}>
          할 일을 추가해보세요!
        </p>
      )}

      {/* 안내 */}
      {todos.length > 0 && (
        <p style={{ textAlign: 'center', color: '#cbd5e1', fontSize: 12, marginTop: 20 }}>
          이모지를 클릭하면 상태가 바뀌어요 👀 → 😊 → 😑
        </p>
      )}
    </div>
  );
}
