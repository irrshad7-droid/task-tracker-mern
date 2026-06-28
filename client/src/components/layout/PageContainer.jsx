/**
 * PageContainer.jsx — Max-width centred layout wrapper.
 *
 * Every page sits inside this component so:
 *   - The max-width is enforced consistently
 *   - Horizontal padding is consistent on all screen sizes
 *   - Adding a sidebar in a future version only requires changing this file
 *
 * Props:
 *   children — ReactNode
 */
const PageContainer = ({ children }) => {
  return (
    <main className="page-wrapper">
      <div className="container section">
        {children}
      </div>
    </main>
  );
};

export default PageContainer;
