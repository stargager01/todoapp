const STATUS_COLOR = {
  todo:    '#f59e0b',
  done:    '#10b981',
  stopped: '#94a3b8',
};

const MAX_VISIBLE = 3;

export function CalendarCell({ day, todos = [], isToday, onDateClick }) {
  if (!day) {
    return <div style={{ minHeight: 80, background: '#fafafa', border: '1px solid #f1f5f9' }} />;
  }

  const visible = todos.slice(0, MAX_VISIBLE);
  const overflow = todos.length - MAX_VISIBLE;

  const dayNumStyle = isToday
    ? { background: '#6366F1', color: '#fff', fontWeight: 800 }
    : { background: 'transparent', color: '#334155', fontWeight: 500 };

  return (
    <div
      onClick={() => onDateClick && onDateClick(day)}
      data-testid={`calendar-cell-${day}`}
      style={{
        minHeight: 80, padding: '4px 6px',
        border: '1px solid #e2e8f0',
        background: isToday ? '#EEF2FF' : '#fff',
        cursor: 'pointer', overflow: 'hidden',
      }}
    >
      <div style={{
        fontSize: 13, marginBottom: 3,
        width: 22, height: 22,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '50%',
        ...dayNumStyle,
      }}>
        {day}
      </div>

      {visible.map(todo => (
        <div
          key={todo.id}
          title={todo.text}
          style={{
            fontSize: 10, padding: '1px 4px', borderRadius: 3, marginBottom: 2,
            background: (STATUS_COLOR[todo.status] || '#94a3b8') + '22',
            color: STATUS_COLOR[todo.status] || '#64748b',
            borderLeft: `2px solid ${STATUS_COLOR[todo.status] || '#94a3b8'}`,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}
        >
          {todo.text}
        </div>
      ))}

      {overflow > 0 && (
        <div data-testid="overflow-badge" style={{ fontSize: 10, color: '#94a3b8', padding: '1px 4px' }}>
          +{overflow} 더보기
        </div>
      )}
    </div>
  );
}
