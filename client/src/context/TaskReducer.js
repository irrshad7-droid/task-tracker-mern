/**
 * TaskReducer.js — State shape and pure reducer function.
 *
 * A reducer is a pure function: (state, action) => newState.
 * Pure means:
 *   - Same inputs ALWAYS produce the same output
 *   - No side effects (no API calls, no console.log, no mutation)
 *   - We always return a NEW object (spread syntax), never mutate state directly
 *
 * Why a separate file from TaskContext?
 *   - Keeps the context file focused on React wiring
 *   - The reducer can be tested in pure Node.js without any React dependency
 *   - Mirrors how real codebases (Redux) structure state logic
 */

// ─── Action Type Constants ────────────────────────────────────────────────────
//
// We export these as a frozen object so:
//   1. You get autocomplete when dispatching actions
//   2. A typo (e.g. 'SET_TAKS') throws an error at development time instead of
//      silently falling through to the `default` case in the reducer
export const ACTIONS = Object.freeze({
  // Task CRUD
  SET_TASKS:   'SET_TASKS',    // replace the entire task list (after fetch)
  ADD_TASK:    'ADD_TASK',     // prepend a single newly created task
  UPDATE_TASK: 'UPDATE_TASK',  // replace one task by _id (after edit)
  DELETE_TASK: 'DELETE_TASK',  // remove one task by _id

  // Async state
  SET_LOADING: 'SET_LOADING',  // true while an API call is in-flight
  SET_ERROR:   'SET_ERROR',    // set the last error message
  CLEAR_ERROR: 'CLEAR_ERROR',  // dismiss the error (e.g. after toast shown)

  // UI filters (these trigger a re-fetch with new params in Milestone 5)
  SET_SEARCH:  'SET_SEARCH',   // update the search query string
  SET_FILTER:  'SET_FILTER',   // update one or both filter keys
  SET_SORT:    'SET_SORT',     // update the sort order
});

// ─── Initial State ────────────────────────────────────────────────────────────
//
// This is the exact shape of state every component can expect.
// Defining it explicitly here documents the contract for every consumer.
export const initialState = {
  tasks:   [],         // Task[] — the current list (empty until first fetch)
  loading: false,      // bool  — true while any API request is pending
  error:   null,       // string|null — last error message, null if none

  // Filter state — these are sent as query params to GET /api/tasks
  // Filtering is handled server-side for correctness and scalability
  search:  '',                       // keyword search string
  filter:  { status: '', priority: '' }, // '' means "all" (no filter applied)
  sort:    'newest',                 // 'newest'|'oldest'|'priority'|'dueDate'
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
const taskReducer = (state, action) => {
  switch (action.type) {

    case ACTIONS.SET_TASKS:
      // Replace the entire task list. Also clears loading and error because
      // a successful fetch means both are resolved.
      return { ...state, tasks: action.payload, loading: false, error: null };

    case ACTIONS.ADD_TASK:
      // Prepend so the newest task appears at the top of the list immediately.
      return { ...state, tasks: [action.payload, ...state.tasks] };

    case ACTIONS.UPDATE_TASK:
      // Map over tasks and swap out the one with the matching _id.
      // This keeps all other tasks exactly where they are in the list.
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t._id === action.payload._id ? action.payload : t
        ),
      };

    case ACTIONS.DELETE_TASK:
      // payload is the _id string of the task to remove
      return {
        ...state,
        tasks: state.tasks.filter((t) => t._id !== action.payload),
      };

    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTIONS.SET_ERROR:
      // Setting an error also clears loading — the request has resolved (badly)
      return { ...state, error: action.payload, loading: false };

    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case ACTIONS.SET_SEARCH:
      return { ...state, search: action.payload };

    case ACTIONS.SET_FILTER:
      // Merge the incoming filter fields into the existing filter object.
      // e.g. dispatching { status: 'Completed' } keeps priority unchanged.
      return { ...state, filter: { ...state.filter, ...action.payload } };

    case ACTIONS.SET_SORT:
      return { ...state, sort: action.payload };

    default:
      // In development, warn about unrecognised actions instead of silently
      // returning stale state — makes debugging much easier.
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[TaskReducer] Unknown action type: "${action.type}"`);
      }
      return state;
  }
};

export default taskReducer;
