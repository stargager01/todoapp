import { useState } from 'react';
import { fromInputDate, toInputDate } from '../utils/dateUtils';

export function TodoModal({ initialDate = null, onAdd, onClose }) {
  const [text, setText] = useState('');
  const [dateStr, setDateStr] = useState(initialDate ? toInputDate(initialDate) : '');

  const handleSubmit = () => {
    if (!text.trim()) return;
    const dueDate = dateStr ? fromInputDate(dateStr) : null;
    onAdd(text.trim(), dueDate);
    onClose();
  };

  return (
    <div
      data-testid="todo-modal-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 16, padding: '28px 24px',
        width: 360, boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
      }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 17, color: '#1e293b' }}>
          📝 할 일 추가
          {dateStr && <span style={{ fontSize: 13, color: '#6366f1', marginLeft: 8 }}>{dateStr}</span>}
        </h3>

        <input
          data-testid="modal-text-input"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="할 일을 입력하세요"
          autoFocus
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '10px 14px', borderRadius: 8,
            border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
            marginBottom: 12,
          }}
        />

        <label style={{ fontSize: 12, color: '#64748b', marginBottom: 6, display: 'block' }}>
          마감일 (선택)
        </label>
        <input
          data-testid="modal-date-input"
          type="date"
          value={dateStr}
          onChange={e => setDateStr(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '8px 12px', borderRadius: 8,
            border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
            marginBottom: 20, color: '#334155',
          }}
        />

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '10px', borderRadius: 8,
              border: '1px solid #e2e8f0', background: '#f8fafc',
              cursor: 'pointer', fontSize: 14, color: '#64748b',
            }}
          >취소</button>
          <button
            data-testid="modal-submit-btn"
            onClick={handleSubmit}
            style={{
              flex: 2, padding: '10px', borderRadius: 8,
              border: 'none', background: '#6366f1',
              cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#fff',
            }}
          >추가</button>
        </div>
      </div>
    </div>
  );
}
