/**
 * Button.jsx — Reusable button component.
 *
 * Why a component instead of a plain <button>?
 *   - One place to change hover styles, sizes, or add analytics tracking
 *   - Enforces consistent padding, font-size, and transition across the app
 *   - The loading state with an inline spinner is defined once here
 *
 * Props:
 *   variant   — 'primary'|'secondary'|'danger'|'ghost'  (default: 'primary')
 *   size      — 'sm'|'md'|'lg'|'icon'                   (default: 'md')
 *   loading   — bool — replaces children with a spinner, disables button
 *   className — additional CSS classes (for one-off overrides)
 *   ...rest   — all standard <button> attributes (onClick, type, disabled, etc.)
 */
const Button = ({
  children,
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  className = '',
  ...rest
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'md' && `btn-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      disabled={loading || rest.disabled}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        // Inline spinner — CSS-only, no library needed
        <span className="loader-inline" aria-hidden="true" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
