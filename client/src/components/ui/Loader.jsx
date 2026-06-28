/**
 * Loader.jsx — Centered loading spinner.
 *
 * Shown while API requests are in flight (loading: true in state).
 * The spinner animation is defined in index.css (@keyframes spin).
 *
 * Props:
 *   size  — 'sm'|'md'|'lg'  (default: 'md')
 *   text  — optional label below the spinner (e.g. "Loading tasks...")
 */
const Loader = ({ size = 'md', text = null }) => {
  const sizeClass = size === 'sm' ? 'loader--sm' : size === 'lg' ? 'loader--lg' : '';

  return (
    <div className="loader-wrap" role="status" aria-live="polite">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div className={['loader', sizeClass].filter(Boolean).join(' ')} />
        {text && (
          <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>
            {text}
          </p>
        )}
        {/* Screen reader announcement */}
        <span className="sr-only">Loading, please wait…</span>
      </div>
    </div>
  );
};

export default Loader;
