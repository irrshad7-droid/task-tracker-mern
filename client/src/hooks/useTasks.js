import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useTaskContext } from '../context/TaskContext';
import { ACTIONS } from '../context/TaskReducer';
import * as taskApi from '../api/taskApi';

/**
 * useTasks.js — Custom hook that encapsulates ALL task-related logic.
 *
 * Why a custom hook instead of calling the API directly in components?
 *   - Components stay clean and focused on rendering
 *   - The API + dispatch logic is in ONE place — easy to change
 *   - Any component that needs task operations just calls useTasks()
 *
 * Why useCallback?
 *   - Functions created inside a component are re-created on every render
 *   - Wrapping them in useCallback gives them a stable reference
 *   - This prevents unnecessary re-renders in child components that receive
 *     these functions as props (e.g. TaskCard receiving onDelete)
 *
 * Data Flow:
 *   1. Home.jsx mounts → fetchTasks() → SET_LOADING → API call → SET_TASKS
 *   2. Search/filter/sort change → Home.jsx detects change → fetchTasks() again
 *   3. Create → POST → ADD_TASK prepends to list (no full re-fetch needed)
 *   4. Update → PUT → UPDATE_TASK swaps the one changed card in place
 *   5. Delete → DELETE → DELETE_TASK removes the card from the list
 */
const useTasks = () => {
  const { state, dispatch } = useTaskContext();
  const { tasks, loading, error, search, filter, sort } = state;

  // ── Fetch Tasks ─────────────────────────────────────────────────────────────
  // Builds query params from current context state and calls GET /api/tasks.
  // Called on mount and every time search / filter / sort change (via Home.jsx useEffect).
  const fetchTasks = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const params = {
        ...(search            && { search }),
        ...(filter.status     && { status: filter.status }),
        ...(filter.priority   && { priority: filter.priority }),
        sort,
      };
      const res = await taskApi.getTasks(params);
      dispatch({ type: ACTIONS.SET_TASKS, payload: res.data.tasks });
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
      toast.error(err.message);
    }
  }, [search, filter.status, filter.priority, sort, dispatch]);

  // ── Create Task ─────────────────────────────────────────────────────────────
  // Returns true on success so the caller (Home.jsx) knows to close the modal.
  // Returns false on error so the modal stays open and the user can fix the issue.
  const createTask = useCallback(async (data) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await taskApi.createTask(data);
      // Prepend the new task so it appears at the top of the list immediately —
      // no full re-fetch needed. This is the "optimistic-style" update.
      dispatch({ type: ACTIONS.ADD_TASK, payload: res.data.task });
      toast.success('Task created!');
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      // Always clear loading, whether success or failure
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, [dispatch]);

  // ── Update Task ─────────────────────────────────────────────────────────────
  const updateTask = useCallback(async (id, data) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await taskApi.updateTask(id, data);
      // Swap out only the updated task — all other tasks stay exactly where they are
      dispatch({ type: ACTIONS.UPDATE_TASK, payload: res.data.task });
      toast.success('Task updated!');
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, [dispatch]);

  // ── Delete Task ─────────────────────────────────────────────────────────────
  // Confirmation is handled in Home.jsx before this function is called,
  // keeping this function a pure async operation with no UI side effects.
  const deleteTask = useCallback(async (id) => {
    try {
      await taskApi.deleteTask(id);
      dispatch({ type: ACTIONS.DELETE_TASK, payload: id });
      toast.success('Task deleted.');
    } catch (err) {
      toast.error(err.message);
    }
  }, [dispatch]);

  // ── Dispatch helpers ────────────────────────────────────────────────────────
  // Thin wrappers so components dispatch with one function call instead of
  // needing to import dispatch and ACTIONS themselves.
  const setSearch  = useCallback((v) => dispatch({ type: ACTIONS.SET_SEARCH, payload: v }),  [dispatch]);
  const setFilter  = useCallback((v) => dispatch({ type: ACTIONS.SET_FILTER, payload: v }),  [dispatch]);
  const setSort    = useCallback((v) => dispatch({ type: ACTIONS.SET_SORT,   payload: v }),  [dispatch]);
  const clearError = useCallback(()  => dispatch({ type: ACTIONS.CLEAR_ERROR }),              [dispatch]);

  return {
    // State
    tasks,
    loading,
    error,
    search,
    filter,
    sort,
    // Actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setSearch,
    setFilter,
    setSort,
    clearError,
  };
};

export default useTasks;
