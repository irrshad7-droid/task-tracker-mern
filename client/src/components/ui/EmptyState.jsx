import Button from './Button';

/**
 * EmptyState.jsx — Zero-data placeholder.
 *
 * Shown when the task list is empty. Two modes:
 *   1. No tasks at all     → "Create your first task" with CTA button
 *   2. No search/filter matches → "No tasks match your filters"
 *
 * Good empty states tell the user WHY it's empty and WHAT to do next.
 * This prevents a blank screen from feeling like a bug.
 *
 * Props:
 *   title      — string — main heading
 *   description — string — subtext
 *   actionLabel — string|null — CTA button text (omit to hide button)
 *   onAction   — fn|null — called when CTA is clicked
 */
const EmptyState = ({
  title       = 'No tasks yet',
  description = 'Create your first task to get started.',
  actionLabel = null,
  onAction    = null,
}) => {
  return (
    <div className="empty-state" role="status">
      {/* Icon — clipboard SVG, no external library needed */}
      <div className="empty-state__icon" aria-hidden="true">
        <svg
          width="36" height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
          <line x1="9"  y1="12" x2="15" y2="12" />
          <line x1="9"  y1="16" x2="13" y2="16" />
        </svg>
      </div>

      <h3 className="empty-state__title">{title}</h3>

      <p className="empty-state__desc">{description}</p>

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          + {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
