const mongoose = require('mongoose');

/**
 * Task Schema
 *
 * Defines the shape of every document in the "tasks" MongoDB collection.
 * Mongoose uses this schema to:
 *   1. Validate data before saving (type checks, required fields, enums)
 *   2. Cast values to the correct type (e.g., string → Date)
 *   3. Apply defaults when a field is not provided
 */
const taskSchema = new mongoose.Schema(
  {
    // ─── title ───────────────────────────────────────────────────────────────
    // The main identifier of a task. Required so every task has a name.
    // trim removes accidental leading/trailing whitespace before saving.
    // maxlength prevents absurdly long strings from hitting the database.
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    // ─── description ─────────────────────────────────────────────────────────
    // Optional extra detail about the task.
    // default: '' means the field is always present in the document (never undefined),
    // which makes frontend rendering predictable — no null checks needed.
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },

    // ─── status ──────────────────────────────────────────────────────────────
    // Represents the lifecycle stage of a task.
    // We use an enum to enforce that only these two exact strings are ever stored.
    // If the frontend sends 'complete' (typo), Mongoose rejects it with a clear error.
    // default: 'Pending' — a new task always starts as pending.
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Completed'],
        message: 'Status must be either "Pending" or "Completed"',
      },
      default: 'Pending',
    },

    // ─── priority ─────────────────────────────────────────────────────────────
    // How urgent the task is. Three levels is the industry-standard sweet spot —
    // more levels (e.g. Critical/Blocker) add complexity without much value at this scale.
    // default: 'Medium' — a reasonable assumption when the user hasn't decided yet.
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be "Low", "Medium", or "High"',
      },
      default: 'Medium',
    },

    // ─── dueDate ─────────────────────────────────────────────────────────────
    // Optional deadline for the task.
    // Type: Date — Mongoose will automatically cast an ISO string like
    // "2024-12-31" into a proper JavaScript Date object.
    // null means no due date was set — we check for this in the frontend
    // before rendering any due date UI.
    dueDate: {
      type: Date,
      default: null,
    },

    // NOTE: createdAt and updatedAt are NOT defined here manually.
    // The { timestamps: true } option below tells Mongoose to add and manage
    // them automatically. This is a best practice — less code, no bugs.
  },
  {
    // timestamps: true automatically adds:
    //   - createdAt: set once when the document is first created
    //   - updatedAt: updated automatically every time the document is saved
    // You never need to set these manually anywhere in the codebase.
    timestamps: true,
  }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────
// Indexes speed up database queries at the cost of a small amount of
// storage and write overhead. We index the fields we'll query most often.

// status index: supports GET /api/tasks?status=Pending efficiently
taskSchema.index({ status: 1 });

// priority index: supports GET /api/tasks?priority=High efficiently
taskSchema.index({ priority: 1 });

// createdAt index: supports sorting by newest/oldest — the default sort order
taskSchema.index({ createdAt: -1 });

// Text index on title + description: enables full-text search via $text operator.
// This powers the search bar — GET /api/tasks?search=meeting
// MongoDB's text index tokenises the strings and matches whole words.
taskSchema.index({ title: 'text', description: 'text' });

// ─── Model ───────────────────────────────────────────────────────────────────
// mongoose.model() compiles the schema into a Model.
// The first argument 'Task' becomes the collection name 'tasks' (lowercased + pluralised).
// We export the Model — controllers will import it to run queries.
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
