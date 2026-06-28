/**
 * Navbar.jsx — Application top navigation bar.
 *
 * Fixed to the top of the viewport (position: fixed in CSS).
 * The page-wrapper in index.css adds padding-top: var(--navbar-h)
 * so content starts below it — no overlap.
 *
 * Kept intentionally simple — no routing, no authentication UI.
 * A future iteration could add a user avatar or a "settings" link here.
 *
 * Props: none — the Navbar doesn't need any external data in this version.
 */
const Navbar = () => {
  return (
    <nav className="navbar" role="banner">
      <div className="navbar__inner">

        {/* ── Brand ──────────────────────────────────────────────── */}
        <div className="navbar__brand">
          <div className="navbar__icon" aria-hidden="true">✓</div>
          <span className="navbar__title">TaskTracker</span>
        </div>

        {/* ── Right side ─────────────────────────────────────────── */}
        <div className="navbar__meta">
          <span className="navbar__tagline">
            Stay organised. Get things done.
          </span>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
