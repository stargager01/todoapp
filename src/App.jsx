import { useState, useEffect } from 'react';

// ① 상태 & 저장: localStorage에서 초기값 로드
function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');

  // todos가 바뀔 때마다 localStorage에 자동 저장
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // ② CRUD 로직: 추가 / 완료 토글 / 삭제

  const addTodo = () => {
    if (!input.trim()) return;
    // 불변성: 기존 배열을 수정하지 않고 새 배열 생성
    setTodos([...todos, { id: Date.now(), text: input, done: false }]);
    setInput('');
  };

  const toggle = (id) =>
    // 불변성: map으로 새 배열, spread로 새 객체
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const remove = (id) =>
    // 불변성: filter로 새 배열
    setTodos(todos.filter(t => t.id !== id));

  // ③ UI 렌더링
  return (
    <div>
      <h1>📝 TODO 앱</h1>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && addTodo()}
        placeholder="할 일을 입력하세요"
      />
      <button onClick={addTodo}>추가</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggle(todo.id)}
            />
            <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => remove(todo.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
