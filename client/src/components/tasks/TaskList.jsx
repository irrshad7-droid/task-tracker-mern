import TaskCard from './TaskCard';
import Loader from '../ui/Loader';
import EmptyState from '../ui/EmptyState';

/**
 * TaskList.jsx — Renders the list of tasks or appropriate placeholder states.
 *
 * This component decides WHAT to show based on the combination of props:
 *   loading = true         → show Loader
 *   tasks is empty, no filters → show "no tasks" EmptyState with Add CTA
 *   tasks is empty, filters set → show "no matches" EmptyState without CTA
 *   tasks has items        → render a TaskCard for each
 *
 * Why does TaskList not call the API directly?
 *   - Single responsibility: it only renders, never fetches
 *   - The parent (Home.jsx) owns the data and passes it down
 *   - This makes TaskList completely independent and trivially testable
 *
 * Props:
 *   tasks      — Task[] from context
 *   loading    — bool from context
 *   hasFilters — bool — true if any search/filter is active (changes empty state message)
 *   onEdit     — fn(task) — forwarded to each TaskCard
 *   onDelete   — fn(id)   — forwarded to each TaskCard
 *   onAddTask  — fn()     — opens the add-task modal (passed to empty state CTA)
 */
const TaskList = ({ tasks, loading, hasFilters, onEdit, onDelete, onAddTask }) => {
  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return <Loader text="Loading tasks…" />;
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (tasks.length === 0) {
    return hasFilters ? (
      // Filters are active — help the user understand why it's empty
      <EmptyState
        title="No tasks match your filters"
        description="Try adjusting your search, status, or priority filters."
      />
    ) : (
      // No filters — this is a fresh account/board
      <EmptyState
        title="No tasks yet"
        description="You're all clear! Create your first task to get started."
        actionLabel="Add Task"
        onAction={onAddTask}
      />
    );
  }

  // ── Task list ─────────────────────────────────────────────────────────────
  return (
    <section aria-label="Task list">
      <p className="task-list__count">
        {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} found
      </p>

      <div className="task-list" role="list">
        {tasks.map((task) => (
          <div key={task._id} role="listitem">
            <TaskCard
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TaskList;
