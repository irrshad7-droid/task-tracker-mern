/**
 * FilterBar.jsx — Status and Priority filter dropdowns.
 *
 * Each <select> is a controlled input whose value comes from context.
 * Selecting a value calls onFilterChange, which dispatches SET_FILTER.
 * Milestone 5 will make SET_FILTER trigger a re-fetch with the new params.
 *
 * Selecting '' (empty string) means "All" — no filter is applied.
 *
 * Props:
 *   filter         — { status: string, priority: string } from context
 *   onFilterChange — fn({ status?, priority? }) — partial update
 */
const FilterBar = ({ filter, onFilterChange }) => {
  return (
    <div className="controls-bar__filters">
      {/* ── Status filter ──────────────────────────────────────── */}
      <select
        id="filter-status"
        className="form-control"
        value={filter.status}
        onChange={(e) => onFilterChange({ status: e.target.value })}
        aria-label="Filter by status"
        style={{ minWidth: '130px' }}
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>

      {/* ── Priority filter ─────────────────────────────────────── */}
      <select
        id="filter-priority"
        className="form-control"
        value={filter.priority}
        onChange={(e) => onFilterChange({ priority: e.target.value })}
        aria-label="Filter by priority"
        style={{ minWidth: '140px' }}
      >
        <option value="">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>
  );
};

export default FilterBar;
