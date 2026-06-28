/**
 * SortDropdown.jsx — Sort order selector.
 *
 * The sort value is sent as a query param to the backend:
 *   'newest'   → sort by createdAt desc (default)
 *   'oldest'   → sort by createdAt asc
 *   'priority' → sort High → Medium → Low (server uses aggregation)
 *   'dueDate'  → sort by dueDate asc (earliest first)
 *
 * Props:
 *   value    — string — current sort value from context
 *   onChange — fn(value: string) — dispatches SET_SORT
 */
const SortDropdown = ({ value, onChange }) => {
  return (
    <select
      id="task-sort"
      className="form-control"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Sort tasks"
      style={{ minWidth: '150px' }}
    >
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
      <option value="priority">By Priority</option>
      <option value="dueDate">By Due Date</option>
    </select>
  );
};

export default SortDropdown;
