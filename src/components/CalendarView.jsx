import { buildCalendarDays } from '../utils/dateUtils';
import { CalendarCell } from './CalendarCell';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTH_NAMES = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

export function CalendarView({ year, month, todos = [], onPrev, onNext, onToday, onDateClick }) {
  const days = buildCalendarDays(year, month);
  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth();
  const todayD = today.getDate();

  // dueDate 기준으로 날짜별 Todo 분류
  const todosByDay = {};
  todos.forEach(todo => {
    if (!todo.dueDate) return;
    const d = new Date(todo.dueDate);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!todosByDay[day]) todosByDay[day] = [];
      todosByDay[day].push(todo);
    }
  });

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12, padding: '0 4px'
      }}>
        <button
          data-testid="prev-month"
          onClick={onPrev}
          style={navBtn}
        >‹</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 17, color: '#1e293b' }}>
            {year}년 {MONTH_NAMES[month]}
          </span>
          <button
            data-testid="today-btn"
            onClick={onToday}
            style={{ ...navBtn, fontSize: 12, padding: '4px 10px' }}
          >오늘</button>
        </div>

        <button
          data-testid="next-month"
          onClick={onNext}
          style={navBtn}
        >›</button>
      </div>

      {/* 요일 헤더 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 2 }}>
        {WEEKDAYS.map(w => (
          <div key={w} style={{
            textAlign: 'center', fontSize: 12, fontWeight: 600,
            color: w === '일' ? '#ef4444' : w === '토' ? '#3b82f6' : '#64748b',
            padding: '4px 0'
          }}>{w}</div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {days.map((day, idx) => (
          <CalendarCell
            key={idx}
            day={day}
            todos={day ? (todosByDay[day] || []) : []}
            isToday={day !== null && year === todayY && month === todayM && day === todayD}
            onDateClick={onDateClick}
          />
        ))}
      </div>
    </div>
  );
}

const navBtn = {
  background: 'none',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 20,
  color: '#64748b',
  padding: '4px 12px',
  lineHeight: 1.2,
};
