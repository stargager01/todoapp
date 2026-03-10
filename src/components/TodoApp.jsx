import { useState } from 'react';
import { useTodos } from '../hooks/useTodos';

export function TodoApp({ user, onLogOut }) {
  const [input, setInput] = useState('');
  const { todos, addTodo, toggle, remove } = useTodos(user.uid);

  const handleAdd = () => {
    addTodo(input);
    setInput('');
  };

  return (
    <div style={{
      maxWidth: 480, margin: '40px auto', padding: '0 16px',
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 24
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

      <h2 style={{ margin: '0 0 16px', color: '#1e293b' }}>📝 내 할 일</h2>

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
        {todos.map(todo => (
          <li key={todo.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 14px', borderRadius: 8, marginBottom: 8,
            background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
          }}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggle(todo.id, todo.done)}
              style={{ width: 18, height: 18, cursor: 'pointer' }}
            />
            <span style={{
              flex: 1, fontSize: 14, color: todo.done ? '#94a3b8' : '#1e293b',
              textDecoration: todo.done ? 'line-through' : 'none'
            }}>
              {todo.text}
            </span>
            <button
              onClick={() => remove(todo.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 16, opacity: 0.5
              }}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: 40 }}>
          할 일을 추가해보세요!
        </p>
      )}
    </div>
  );
}
