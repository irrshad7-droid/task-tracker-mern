import { isOverdue, getPriorityClass, getStatusClass } from '../../utils/helpers';
import { formatDate } from '../../utils/formatDate';
import Button from '../ui/Button';

/**
 * TaskCard.jsx — Individual task display card.
 *
 * Visual design:
 *   - Left border color = priority (High=red, Medium=amber, Low=green)
 *   - Left border overridden to red if task is overdue
 *   - Completed tasks show a strikethrough title and reduced opacity
 *   - Edit/Delete action buttons appear on hover (CSS: opacity 0 → 1)
 *
 * Props:
 *   task     — Task object from MongoDB
 *   onEdit   — fn(task) — called when Edit is clicked
 *   onDelete — fn(id)   — called when Delete is clicked
 *
 * TODO M5: Wire onEdit and onDelete to the useTasks functions
 */
const TaskCard = ({ task, onEdit, onDelete }) => {
  const overdue       = isOverdue(task);
  const priorityClass = getPriorityClass(task.priority);
  const statusClass   = getStatusClass(task.status);
  const dueDateStr    = formatDate(task.dueDate);

  // Build the modifier classes for the card root element
  const cardClasses = [
    'task-card',
    `task-card--${priorityClass}`,
    overdue               && 'task-card--overdue',
    task.status === 'Completed' && 'task-card--completed',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={cardClasses} aria-label={`Task: ${task.title}`}>

      {/* ── Header: title + action buttons ─────────────────────── */}
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>

        <div className="task-card__actions">
          {/* Edit button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            aria-label={`Edit task: ${task.title}`}
            title="Edit"
          >
            {/* Pencil icon */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </Button>

          {/* Delete button */}
          <Button
            variant="danger"
            size="icon"
            onClick={() => onDelete(task._id)}
            aria-label={`Delete task: ${task.title}`}
            title="Delete"
          >
            {/* Trash icon */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </Button>
        </div>
      </div>

      {/* ── Description (only if present) ──────────────────────── */}
      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      {/* ── Footer: meta info + badges ─────────────────────────── */}
      <div className="task-card__footer">
        <div className="task-card__meta">
          {/* Due date */}
          {dueDateStr && (
            <span className={`task-card__due ${overdue ? 'task-card__due--overdue' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8"  y1="2" x2="8"  y2="6" />
                <line x1="3"  y1="10" x2="21" y2="10" />
              </svg>
              {overdue ? `Overdue · ${dueDateStr}` : dueDateStr}
            </span>
          )}

          {/* Priority badge */}
          <span className={`badge badge-${priorityClass}`}>
            {task.priority}
          </span>
        </div>

        {/* Status badge */}
        <span className={`badge badge-${statusClass}`}>
          {task.status === 'Completed' ? '✓ ' : '○ '}
          {task.status}
        </span>
      </div>

    </article>
  );
};

export default TaskCard;
