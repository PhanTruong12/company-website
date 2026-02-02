import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/header/Header';
import { Footer } from './components/Footer';
import { allRoutes } from './core/config/routes';
import { isAdminRoute } from './shared/constants';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const shouldHideHeaderFooter = isAdminRoute(location.pathname);
  
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
