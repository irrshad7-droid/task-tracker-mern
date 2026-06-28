import { createContext, useContext, useReducer } from 'react';
import taskReducer, { initialState } from './TaskReducer';

/**
 * TaskContext.jsx — React Context + useReducer wiring.
 *
 * This file does exactly two things:
 *   1. Creates the context object (TaskContext)
 *   2. Provides the TaskProvider component that wraps the app
 *
 * We export a custom hook (useTaskContext) rather than the raw context
 * object for two reasons:
 *   a) Components don't need to import both `useContext` and `TaskContext`
 *   b) The hook throws a clear error if used outside the provider,
 *      instead of silently returning undefined — much easier to debug
 *
 * Why Context + useReducer instead of useState?
 *   - useState is fine for isolated component state (e.g. modal open/close)
 *   - When many components (TaskList, TaskCard, SearchBar, FilterBar) all
 *     need to READ the same state and WRITE to it, lifting state up through
 *     props creates "prop drilling" — passing the same props 3–4 levels deep.
 *   - Context eliminates prop drilling. useReducer adds predictable,
 *     documented state transitions instead of scattered setState calls.
 *
 * Why not Redux/Zustand?
 *   - Redux adds significant boilerplate for a single-entity app.
 *   - Context + useReducer is the idiomatic React solution at this scale.
 *   - It demonstrates understanding of React primitives — valuable in interviews.
 */

// The context object — null default so useTaskContext can detect misuse
const TaskContext = createContext(null);

// ─── Provider ──────────────────────────────────────────────────────────────────
export const TaskProvider = ({ children }) => {
  // useReducer(reducer, initialState) returns [currentState, dispatch]
  // dispatch(action) calls the reducer to compute the next state
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // We pass both state AND dispatch so consumers can read AND write
  const value = { state, dispatch };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

// ─── Custom Hook ───────────────────────────────────────────────────────────────
export const useTaskContext = () => {
  const context = useContext(TaskContext);

  if (!context) {
    // This only happens if a component uses the hook outside <TaskProvider>
    throw new Error(
      'useTaskContext must be used inside a <TaskProvider>. ' +
      'Wrap your app (or the relevant subtree) with <TaskProvider>.'
    );
  }

  return context;
};
