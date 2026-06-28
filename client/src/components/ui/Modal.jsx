import { useEffect } from 'react';

/**
 * Modal.jsx — Accessible overlay dialog.
 *
 * Design decisions:
 *   - Pressing Escape closes the modal (keyboard accessibility)
 *   - Clicking the backdrop (overlay) also closes it
 *   - Body scroll is locked while the modal is open (prevents background scroll)
 *   - Animations are CSS-only (fadeIn + slideUp defined in index.css)
 *
 * We don't use a React Portal here for simplicity, but the z-index (200)
 * and fixed positioning on the overlay ensure it renders above everything.
 *
 * Props:
 *   isOpen   — bool — controls visibility
 *   onClose  — fn   — called when user closes (Escape / backdrop / X button)
 *   title    — string — header text
 *   children — the modal body content (typically a form)
 *   footer   — ReactNode — buttons rendered in the footer area
 */
const Modal = ({ isOpen, onClose, title, children, footer }) => {
  // ── Keyboard & scroll effects ─────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll so the background page can't scroll behind the modal
    document.body.style.overflow = 'hidden';

    // Close on Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup: restore scroll and remove listener when modal closes
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Don't render anything to the DOM when closed
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      // Clicking the overlay (not the modal box) closes it
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="modal__header">
          <h2 className="modal__title" id="modal-title">{title}</h2>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────── */}
        <div className="modal__body">
          {children}
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        {footer && (
          <div className="modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
