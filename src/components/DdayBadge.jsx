import { calcDday, formatDday, getDdayColor } from '../utils/dateUtils';

export function DdayBadge({ dueDate }) {
  const diff = calcDday(dueDate);
  if (diff === null) return null;

  const label = formatDday(diff);
  const color = getDdayColor(diff);

  return (
    <span
      data-testid="dday-badge"
      style={{
        display: 'inline-block',
        padding: '2px 7px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 700,
        background: color.bg,
        color: color.text,
        marginLeft: 6,
        flexShrink: 0,
      }}
    >
      {label}
    </span>
  );
}
