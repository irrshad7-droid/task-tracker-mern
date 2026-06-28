/**
 * SearchBar.jsx — Controlled text input for task search.
 *
 * "Controlled" means the input's value is owned by React state,
 * not the DOM. Every keystroke calls onChange, which dispatches
 * SET_SEARCH, which triggers a re-fetch in Milestone 5.
 *
 * Props:
 *   value     — string — current search string from context
 *   onChange  — fn(value: string) — called on every keystroke
 */
const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-wrap controls-bar__search">
      {/* Search icon */}
      <span className="search-wrap__icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>

      <input
        id="task-search"
        type="search"
        className="form-control"
        placeholder="Search tasks…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search tasks"
        autoComplete="off"
      />
    </div>
  );
};

export default SearchBar;
