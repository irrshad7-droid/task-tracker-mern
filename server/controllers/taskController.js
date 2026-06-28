const Task = require('../models/Task');

// ─── asyncHandler ─────────────────────────────────────────────────────────────
//
// A tiny wrapper that eliminates try/catch from every controller function.
// It wraps an async function and catches any rejected promise, forwarding
// the error to Express's next() — which routes it to our global errorHandler.
//
// Without this, every controller would need:
//   try { ... } catch (err) { next(err); }
//
// With this, every controller is a clean async function with no error boilerplate.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ─── GET /api/tasks ───────────────────────────────────────────────────────────
//
// Returns all tasks, with optional filtering, searching, and sorting.
//
// Query parameters:
//   ?search=keyword    — case-insensitive partial match on title or description
//   ?status=Pending    — filter by status ('Pending' | 'Completed')
//   ?priority=High     — filter by priority ('Low' | 'Medium' | 'High')
//   ?sort=newest       — sort order ('newest' | 'oldest' | 'dueDate' | 'priority')
//
// Design note on priority sort:
//   MongoDB sorts strings lexicographically, so 'High' < 'Low' < 'Medium' —
//   which is NOT the correct priority order. To sort High→Medium→Low, we use
//   an aggregation pipeline with $addFields to assign a numeric rank to each
//   priority value, then sort on that number.
//   We always run the aggregation pipeline for consistency — it handles
//   all sort types in a single code path.
const getAllTasks = asyncHandler(async (req, res) => {
  const { search, status, priority, sort = 'newest' } = req.query;

  // ── Build match filter ──────────────────────────────────────────────────────
  const matchQuery = {};

  // Exact match filters — only added if the query param was provided
  if (status) matchQuery.status = status;
  if (priority) matchQuery.priority = priority;

  // Search — $regex with 'i' flag gives case-insensitive partial matching.
  // $or means "match tasks where the title OR description contains the keyword".
  if (search) {
    const regex = new RegExp(search, 'i');
    matchQuery.$or = [
      { title: { $regex: regex } },
      { description: { $regex: regex } },
    ];
  }

  // ── Build sort object ───────────────────────────────────────────────────────
  // 'priorityNum' is a synthetic field we add in the $addFields stage below.
  const sortMap = {
    newest:   { createdAt: -1 },
    oldest:   { createdAt: 1 },
    dueDate:  { dueDate: 1, createdAt: -1 },  // secondary sort by createdAt for tasks with no dueDate
    priority: { priorityNum: -1, createdAt: -1 }, // High(3) first, then Medium(2), then Low(1)
  };
  const sortObj = sortMap[sort] || sortMap.newest;

  // ── Aggregation pipeline ────────────────────────────────────────────────────
  const tasks = await Task.aggregate([
    // Stage 1: filter documents — equivalent to Task.find(matchQuery)
    { $match: matchQuery },

    // Stage 2: add a numeric priority rank field for sorting.
    // $switch is MongoDB's equivalent of a switch/case statement.
    // This field only exists inside the pipeline — it's removed in Stage 4.
    {
      $addFields: {
        priorityNum: {
          $switch: {
            branches: [
              { case: { $eq: ['$priority', 'High'] },   then: 3 },
              { case: { $eq: ['$priority', 'Medium'] }, then: 2 },
              { case: { $eq: ['$priority', 'Low'] },    then: 1 },
            ],
            default: 0,
          },
        },
      },
    },

    // Stage 3: sort using the chosen sort object
    { $sort: sortObj },

    // Stage 4: remove the helper field — callers should never see priorityNum
    { $project: { priorityNum: 0 } },
  ]);

  res.status(200).json({
    success: true,
    message: 'Tasks fetched successfully',
    data: { tasks, count: tasks.length },
  });
});

// ─── GET /api/tasks/:id ───────────────────────────────────────────────────────
//
// Returns a single task by its MongoDB _id.
// If the id is not a valid ObjectId format, Mongoose throws a CastError —
// we handle that by checking the error name in the global errorHandler.
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  // findById returns null (not an error) when no document matches.
  // We convert that into a proper 404 response.
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Task fetched successfully',
    data: { task },
  });
});

// ─── POST /api/tasks ──────────────────────────────────────────────────────────
//
// Creates a new task. Validation runs BEFORE this function via middleware,
// so by the time we reach here, req.body is guaranteed to be valid.
//
// We only pass the fields we explicitly expect — never spread req.body
// directly into Task.create(). This prevents mass assignment vulnerabilities
// where a client could inject unexpected fields (e.g. _id, __v).
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
  });

  // 201 Created — semantically correct for a successful resource creation
  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: { task },
  });
});

// ─── PUT /api/tasks/:id ───────────────────────────────────────────────────────
//
// Updates an existing task. Only the fields present in req.body are updated —
// omitted fields keep their current values (this is a partial update, not a
// full replacement, even though we use PUT for simplicity).
//
// { new: true }      — return the updated document, not the old one
// { runValidators: true } — run Mongoose schema validators on the update
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  // Build the update object — only include fields that were actually sent.
  // This prevents accidentally overwriting fields with undefined.
  const updateData = {};
  if (title !== undefined)       updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (status !== undefined)      updateData.status = status;
  if (priority !== undefined)    updateData.priority = priority;
  if (dueDate !== undefined)     updateData.dueDate = dueDate;

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    updateData,
    { returnDocument: 'after', runValidators: true }
  );

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: { task },
  });
});

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────
//
// Deletes a task permanently. We use findByIdAndDelete so we can check
// if the document existed before attempting deletion.
// If we used deleteOne() directly, it would return { deletedCount: 0 }
// for a missing id — making it harder to return a proper 404.
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
  });
});

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
