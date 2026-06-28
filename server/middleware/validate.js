const { body, validationResult } = require('express-validator');

// ─── Validation Rule Sets ─────────────────────────────────────────────────────
//
// express-validator works in two stages:
//   1. Define rules as an array of middleware (e.g. body('title').notEmpty())
//   2. Call validationResult(req) in a separate middleware to read errors
//
// We keep those two stages separate so routes stay clean:
//   router.post('/', createTaskRules, handleValidationErrors, createTask)

// Rules applied when creating a new task (POST /api/tasks)
const createTaskRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('description')
    .optional()          // not required — field can be absent or empty
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['Pending', 'Completed'])
    .withMessage('Status must be "Pending" or "Completed"'),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be "Low", "Medium", or "High"'),

  body('dueDate')
    .optional({ nullable: true })   // allow null explicitly (user cleared the date)
    .isISO8601()
    .withMessage('Due date must be a valid date (e.g. 2024-12-31)')
    .toDate(),                       // cast the validated string into a JS Date object
];

// Rules applied when updating a task (PUT /api/tasks/:id)
// All fields are optional — the client only sends what changed.
// We still validate type/length if a field IS provided.
const updateTaskRules = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['Pending', 'Completed'])
    .withMessage('Status must be "Pending" or "Completed"'),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be "Low", "Medium", or "High"'),

  body('dueDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Due date must be a valid date (e.g. 2024-12-31)')
    .toDate(),
];

// ─── Validation Error Handler ─────────────────────────────────────────────────
//
// This middleware runs AFTER the rule arrays above.
// It reads the accumulated errors from the request and, if any exist,
// responds immediately with 422 Unprocessable Entity.
//
// 422 vs 400: 400 = "I don't understand the request".
//             422 = "I understand it, but the data is semantically wrong."
//             422 is the correct status for failed field validation.
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Map to a clean shape: [{ field: 'title', message: 'Title is required' }]
    // This makes it easy for the frontend to highlight the specific field.
    return res.status(422).json({
      success: false,
      message: 'Validation failed. Please check your input.',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  // No errors — continue to the actual route handler
  next();
};

module.exports = { createTaskRules, updateTaskRules, handleValidationErrors };
