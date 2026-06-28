const express = require('express');
const router = express.Router();

const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const {
  createTaskRules,
  updateTaskRules,
  handleValidationErrors,
} = require('../middleware/validate');

// ─── Task Routes ──────────────────────────────────────────────────────────────
//
// Each route is a pipeline of middleware functions called left to right.
// For POST and PUT, the pipeline is:
//   1. Run validation rules (express-validator — accumulates errors on req)
//   2. handleValidationErrors (checks req for errors, returns 422 if any)
//   3. Controller (only reached if validation passed)
//
// This separation keeps the controller clean — it never has to check
// whether the request body is valid.

// GET  /api/tasks          — list all tasks (with optional search/filter/sort)
router.get('/', getAllTasks);

// GET  /api/tasks/:id      — get a single task by id
router.get('/:id', getTaskById);

// POST /api/tasks          — create a new task
router.post('/', createTaskRules, handleValidationErrors, createTask);

// PUT  /api/tasks/:id      — update a task (partial update — only provided fields change)
router.put('/:id', updateTaskRules, handleValidationErrors, updateTask);

// DELETE /api/tasks/:id   — permanently delete a task
router.delete('/:id', deleteTask);

module.exports = router;
