/**
 * helpers.js — Shared business logic utilities
 *
 * Pure functions with no side effects — easy to unit-test and
 * safe to import anywhere without circular dependency risks.
 */

/**
 * Determines if a task is overdue.
 * A task is overdue when:
 *   1. It has a dueDate
 *   2. That date is in the past
 *   3. It is NOT already Completed
 *
 * @param {Object} task
 * @returns {boolean}
 */
export const isOverdue = (task) => {
  if (!task.dueDate) return false;
  if (task.status === 'Completed') return false;
  // Compare with midnight today so a task due "today" isn't immediately overdue
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.dueDate) < today;
};

/**
 * Returns the CSS modifier suffix for a given priority.
 * Maps to the .task-card--{priority} and .badge-{priority} classes in index.css.
 *
 * @param {'High'|'Medium'|'Low'} priority
 * @returns {'high'|'medium'|'low'}
 */
export const getPriorityClass = (priority) => {
  const map = { High: 'high', Medium: 'medium', Low: 'low' };
  return map[priority] ?? 'medium';
};

/**
 * Returns the CSS class suffix for a given status.
 *
 * @param {'Pending'|'Completed'} status
 * @returns {'pending'|'completed'}
 */
export const getStatusClass = (status) => {
  return status === 'Completed' ? 'completed' : 'pending';
};
