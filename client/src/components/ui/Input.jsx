/**
 * Input.jsx — Labelled form input wrapper.
 *
 * Combines a <label>, <input> (or <textarea>/<select>), error message,
 * and optional help text into one component.
 *
 * Why wrap native inputs?
 *   - Accessibility: the label is always properly associated via htmlFor+id
 *   - Error styling is applied consistently via a single `error` prop
 *   - No duplicate label/error markup across every form field
 *
 * Props:
 *   label     — string — visible label text
 *   id        — string — required for label association and form accessibility
 *   error     — string|null — displays below the input in red if set
 *   help      — string — muted helper text (shown when no error)
 *   required  — bool — adds a red asterisk to the label
 *   as        — 'input'|'textarea'|'select' (default: 'input')
 *   ...rest   — all standard input attributes (type, placeholder, value, onChange, etc.)
 */
const Input = ({
  label,
  id,
  error     = null,
  help      = null,
  required  = false,
  as: Tag   = 'input',
  children, // for <select> options
  className = '',
  ...rest
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
          {required && <span className="required" aria-hidden="true"> *</span>}
        </label>
      )}

      <Tag
        id={id}
        name={id}
        className={['form-control', error && 'error', className]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${id}-error` : help ? `${id}-help` : undefined
        }
        {...rest}
      >
        {children /* rendered only for <select> */}
      </Tag>

      {error && (
        <span id={`${id}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}

      {!error && help && (
        <span id={`${id}-help`} className="form-help">
          {help}
        </span>
      )}
    </div>
  );
};

export default Input;
