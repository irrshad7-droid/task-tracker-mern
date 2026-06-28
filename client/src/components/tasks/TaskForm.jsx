import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { toInputDate } from '../../utils/formatDate';

/**
 * TaskForm.jsx — Reusable form for creating and editing tasks.
 *
 * ONE component handles both modes:
 *   - Create mode: initialData is undefined/null → all fields empty, title "Add Task"
 *   - Edit mode:   initialData is a task object  → fields pre-filled, title "Edit Task"
 *
 * This avoids duplication of the form layout and validation logic.
 * The parent (Home.jsx) determines the mode by what it passes as initialData.
 *
 * Validation is client-side only in Milestone 4.
 * Server-side validation errors (from express-validator) will be surfaced
 * as field-level errors in Milestone 5 via the API error response.
 *
 * Props:
 *   initialData — Task|null — pre-fills the form when editing
 *   onSubmit    — fn(data)  — called with the form data on valid submit
 *                             TODO M5: connect this to createTask/updateTask in useTasks
 *   onCancel    — fn()      — closes the modal
 *   isLoading   — bool      — shows spinner on submit button while API call is in-flight
 */
const INITIAL_FIELDS = {
  title:       '',
  description: '',
  status:      'Pending',
  priority:    'Medium',
  dueDate:     '',
};

const TaskForm = ({ initialData = null, onSubmit, onCancel, isLoading = false }) => {
  // Derive initial form values from initialData (edit) or defaults (create)
  const [fields, setFields] = useState(() => ({
    title:       initialData?.title       ?? INITIAL_FIELDS.title,
    description: initialData?.description ?? INITIAL_FIELDS.description,
    status:      initialData?.status      ?? INITIAL_FIELDS.status,
    priority:    initialData?.priority    ?? INITIAL_FIELDS.priority,
    dueDate:     toInputDate(initialData?.dueDate) ?? INITIAL_FIELDS.dueDate,
  }));

  // Tracks which fields have been touched (to show validation errors only after interaction)
  const [touched, setTouched] = useState({});
  const [errors, setErrors]   = useState({});

  const isEditMode = !!initialData;

  // ── Field update helper ───────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as the user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  // ── Client-side validation ────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!fields.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (fields.title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }
    if (fields.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }
    return newErrors;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched so errors become visible
    setTouched({ title: true, description: true });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Build the payload — convert dueDate to null if empty
    const payload = {
      title:       fields.title.trim(),
      description: fields.description.trim(),
      status:      fields.status,
      priority:    fields.priority,
      dueDate:     fields.dueDate || null,
    };

    // TODO M5: onSubmit will call createTask(payload) or updateTask(id, payload)
    onSubmit(payload);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>

      {/* ── Title ──────────────────────────────────────────────── */}
      <Input
        id="title"
        label="Title"
        required
        type="text"
        placeholder="What needs to be done?"
        value={fields.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.title ? errors.title : null}
        maxLength={100}
      />

      {/* ── Description ────────────────────────────────────────── */}
      <Input
        id="description"
        label="Description"
        as="textarea"
        placeholder="Add some details (optional)…"
        value={fields.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.description ? errors.description : null}
        maxLength={500}
        help={`${fields.description.length}/500`}
        rows={3}
      />

      {/* ── Status & Priority (side by side on wider screens) ──── */}
      <div className="task-form__row">
        <Input
          id="status"
          label="Status"
          as="select"
          value={fields.status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </Input>

        <Input
          id="priority"
          label="Priority"
          as="select"
          value={fields.priority}
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </Input>
      </div>

      {/* ── Due Date ───────────────────────────────────────────── */}
      <Input
        id="dueDate"
        label="Due Date"
        type="date"
        value={fields.dueDate}
        onChange={handleChange}
        help="Leave blank if there's no deadline"
      />

      {/* ── Actions ────────────────────────────────────────────── */}
      {/*
        These are rendered inside Modal's footer slot (passed as the `footer` prop).
        But we include them here as a fallback if the form is used outside a Modal.
        TODO M5: Review if footer should live in Home.jsx for cleaner separation
      */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isLoading}>
          {isEditMode ? 'Save Changes' : 'Add Task'}
        </Button>
      </div>

    </form>
  );
};

export default TaskForm;
