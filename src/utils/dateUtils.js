/**
 * D-Day 계산 유틸리티
 * dueDate: Unix timestamp (ms)
 */

// 두 날짜의 자정(00:00:00) 기준 차이를 일 단위로 반환
export function calcDday(dueDate) {
  if (!dueDate) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due  = new Date(dueDate);
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  const diff = Math.round((dueDay - today) / (1000 * 60 * 60 * 24));
  return diff; // 양수=미래, 0=오늘, 음수=초과
}

// D-Day 배지 텍스트: "D-3", "D-Day", "D+2"
export function formatDday(diff) {
  if (diff === null) return null;
  if (diff === 0) return 'D-Day';
  if (diff > 0)  return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

// D-Day 색상 결정
export function getDdayColor(diff) {
  if (diff === null) return null;
  if (diff < 0)  return { bg: '#FEE2E2', text: '#DC2626' }; // 초과 — 빨강
  if (diff <= 3) return { bg: '#FEE2E2', text: '#DC2626' }; // D-3 이하 — 빨강
  if (diff <= 7) return { bg: '#FEF3C7', text: '#D97706' }; // D-7 이하 — 주황
  return { bg: '#F1F5F9', text: '#64748B' };                 // 그 외 — 회색
}

// timestamp → "2026.03.11" 형식
export function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

// timestamp → "YYYY-MM-DD" (input[type=date] value 형식)
export function toInputDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// "YYYY-MM-DD" → 자정 timestamp (ms)
export function fromInputDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d).getTime();
}

// 주어진 year/month의 캘린더 날짜 배열 반환 (앞뒤 빈 칸 포함 42개)
export function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=일
  const lastDate = new Date(year, month + 1, 0).getDate();

  const days = [];
  // 이전 달 빈 칸
  for (let i = 0; i < firstDay; i++) days.push(null);
  // 이번 달
  for (let d = 1; d <= lastDate; d++) days.push(d);
  // 다음 달 빈 칸 (42칸 맞추기)
  while (days.length < 42) days.push(null);
  return days;
}
