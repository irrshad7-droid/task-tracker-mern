import { Toaster } from 'react-hot-toast';
import { TaskProvider } from './context/TaskContext';
import Navbar from './components/layout/Navbar';
import PageContainer from './components/layout/PageContainer';
import Home from './pages/Home';

/**
 * App.jsx — Root component. Wires the global provider and layout.
 *
 * Component tree:
 *   <TaskProvider>   — makes global state available to all children
 *     <Navbar />     — fixed top bar (outside PageContainer so it's always visible)
 *     <PageContainer>— max-width wrapper with top padding offset for navbar
 *       <Home />     — the main page
 *     </PageContainer>
 *     <Toaster />    — react-hot-toast notification portal (renders in a React portal,
 *                      position: fixed, always on top — no z-index conflicts)
 *   </TaskProvider>
 *
 * Why is <Toaster /> inside <TaskProvider> and not in main.jsx?
 *   - react-hot-toast's toast() function is called from useTasks (inside the provider).
 *   - Toaster can live anywhere in the tree — it uses a global event bus.
 *   - Keeping it in App.jsx makes App.jsx the single place for "app-level" concerns.
 */
function App() {
  return (
    <TaskProvider>
      <Navbar />
      <PageContainer>
        <Home />
      </PageContainer>

      {/* Toast notification system — no configuration needed for defaults */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: 'var(--font)',
            fontSize:   '0.875rem',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-md)',
          },
          success: { iconTheme: { primary: 'var(--clr-completed)', secondary: '#fff' } },
          error:   { iconTheme: { primary: 'var(--clr-danger)',    secondary: '#fff' } },
        }}
      />
    </TaskProvider>
  );
}

export default App;
