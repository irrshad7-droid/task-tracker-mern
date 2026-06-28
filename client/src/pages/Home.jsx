import { useState, useEffect, useRef, useCallback } from 'react';
import useTasks from '../hooks/useTasks';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import SearchBar from '../components/tasks/SearchBar';
import FilterBar from '../components/tasks/FilterBar';
import SortDropdown from '../components/tasks/SortDropdown';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

/**
 * Home.jsx — The main page. Orchestrates all task UI.
 *
 * Responsibilities:
 *   - Owns modal open/close state (pure UI, not shared → local useState)
 *   - Wires useTasks hook to every child component
 *   - Re-fetches whenever search/filter/sort change
 *   - Search is debounced (400ms) so we don't hit the API on every keystroke
 *
 * Why is modal state local and not in Context?
 *   - Only Home.jsx reads it — putting it in Context would cause TaskCard and
 *     SearchBar to re-render on every modal toggle. That's wasted work.
 *   - Rule of thumb: state that only one component needs stays local.
 *
 * Why debounce search?
 *   - Without debouncing, typing "meeting" fires 7 API requests.
 *   - With a 400ms debounce, only one request fires after the user stops typing.
 *   - We use useRef to hold the timeout ID across renders without causing re-renders.
 */
const SEARCH_DEBOUNCE_MS = 400;

const Home = () => {
  const {
    tasks,
    loading,
    search,
    filter,
    sort,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setSearch,
    setFilter,
    setSort,
  } = useTasks();

  // ── Local UI state ─────────────────────────────────────────────────────────
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [editingTask,  setEditingTask]  = useState(null);   // null=create, obj=edit
  const [formLoading,  setFormLoading]  = useState(false);  // separate from list loading

  // Ref holds the debounce timer — a ref because changing it must not trigger re-renders
  const searchTimerRef = useRef(null);

  // ── Derived values ─────────────────────────────────────────────────────────
  const hasFilters = !!(search || filter.status || filter.priority);

  // ── Initial fetch on mount ─────────────────────────────────────────────────
  useEffect(() => {
    fetchTasks();
    // fetchTasks is stable (useCallback with deps) — including it would cause
    // an infinite loop here because it changes when search/filter/sort change.
    // Those changes are handled by the dedicated effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Re-fetch when filter or sort changes (immediate) ──────────────────────
  // Filter and sort changes should feel instant — no debounce needed.
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.status, filter.priority, sort]);

  // ── Re-fetch when search changes (debounced) ───────────────────────────────
  useEffect(() => {
    // Clear any pending timer from the last keystroke
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    // Schedule a new fetch 400ms after the user stops typing
    searchTimerRef.current = setTimeout(() => {
      fetchTasks();
    }, SEARCH_DEBOUNCE_MS);

    // Cleanup: cancel the timer if the component unmounts or search changes again
    return () => clearTimeout(searchTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openAddModal = useCallback(() => {
    setEditingTask(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  // ── Form submit ────────────────────────────────────────────────────────────
  // createTask / updateTask return true on success so we close the modal only
  // when the API call actually succeeded — not on validation errors.
  const handleFormSubmit = useCallback(async (data) => {
    setFormLoading(true);
    try {
      let ok;
      if (editingTask) {
        ok = await updateTask(editingTask._id, data);
      } else {
        ok = await createTask(data);
      }
      if (ok) closeModal();
    } finally {
      setFormLoading(false);
    }
  }, [editingTask, createTask, updateTask, closeModal]);

  // ── Delete with confirmation ───────────────────────────────────────────────
  // window.confirm is intentionally used here — it's simple, accessible,
  // and appropriate for an internship-level project. A custom confirm dialog
  // could be added as a future enhancement.
  const handleDelete = useCallback((id) => {
    if (!window.confirm('Delete this task? This action cannot be undone.')) return;
    deleteTask(id);
  }, [deleteTask]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="page-header">
        <div className="page-header__text">
          <h1>My Tasks</h1>
          <p>
            {loading
              ? 'Loading…'
              : tasks.length > 0
                ? `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} found`
                : 'Nothing here yet — add your first task!'}
          </p>
        </div>

        <Button
          id="add-task-btn"
          variant="primary"
          onClick={openAddModal}
          disabled={formLoading}
        >
          + Add Task
        </Button>
      </div>

      {/* ── Controls Bar: search + filters + sort ─────────────────── */}
      <div className="controls-bar">
        <SearchBar
          value={search}
          onChange={setSearch}
        />
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
        />
        <SortDropdown
          value={sort}
          onChange={setSort}
        />
      </div>

      {/* ── Task List / Loader / Empty State ──────────────────────── */}
      <TaskList
        tasks={tasks}
        loading={loading}
        hasFilters={hasFilters}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onAddTask={openAddModal}
      />

      {/* ── Create / Edit Modal ────────────────────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      >
        {/*
          key={editingTask?._id ?? 'new'} resets the form's internal useState
          each time a different task is opened for editing. Without this, React
          reuses the existing TaskForm instance and its state stays from the
          previous task.
        */}
        <TaskForm
          key={editingTask?._id ?? 'new'}
          initialData={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          isLoading={formLoading}
        />
      </Modal>
    </>
  );
};

export default Home;
