import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from './components/header/Header';
import { Footer } from './components/Footer';
import { allRoutes } from './core/config/routes';
import { isAdminRoute } from './shared/constants';
import { trackClick, trackPageView } from './features/traffic/tracker';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const shouldHideHeaderFooter = isAdminRoute(location.pathname);

  useEffect(() => {
    if (isAdminRoute(location.pathname)) return;
    const pathWithQuery = `${location.pathname}${location.search}`;
    trackPageView(pathWithQuery);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (isAdminRoute(location.pathname)) return;
    const pathWithQuery = `${location.pathname}${location.search}`;
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const clickable = target.closest('a, button, [data-track-click]') as HTMLElement | null;
      if (!clickable) return;
      const label =
        clickable.getAttribute('data-track-click') ||
        clickable.getAttribute('aria-label') ||
        clickable.textContent ||
        clickable.tagName.toLowerCase();
      trackClick(pathWithQuery, label);
    };

    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [location.pathname, location.search]);
  
  return (
    <div className="app-container">
      {!shouldHideHeaderFooter && <Header />}
      <main className="main-content-wrapper">
        <Routes>
          {allRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </main>
      {!shouldHideHeaderFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
