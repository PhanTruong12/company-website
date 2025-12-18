import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import CollectionRedirect from './pages/CollectionRedirect';
import Showroom from './pages/Showroom';
import { ShowroomDetail } from './pages/ShowroomDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminImages from './pages/admin/AdminImages';
import { AdminGuard } from './components/admin/AdminGuard';
import CollectionSection from './components/CollectionSection';
import GallerySection from './components/GallerySection';
import UsageSection from './components/UsageSection';
import { Header } from './components/header/Header';
import { Footer } from './components/Footer';
import './App.css';

const HomeWithCollection = () => (
  <>
    <Home />
    <div className="collection-heading">
      <h2>Bộ Sưu Tập Đá</h2>
      <div className="collection-heading-line" />
    </div>
    <CollectionSection />
    <GallerySection />
    <UsageSection />
  </>
);

// Component để điều kiện hiển thị Header
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/internal/admin') || 
                       location.pathname.startsWith('/admin/');
  
  return (
    <div className="app-container">
      {!isAdminRoute && <Header />}
      <main className="main-content-wrapper">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeWithCollection />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          {/* Collection route redirects to showroom with filter */}
          <Route path="/collection/:collectionId" element={<CollectionRedirect />} />
          <Route path="/showroom" element={<Showroom />} />
          <Route path="/showroom/:slug" element={<ShowroomDetail />} />
          
          {/* Old admin route - Redirect to new route with authentication */}
          <Route
            path="/admin/interior-images"
            element={
              <AdminGuard>
                <AdminImages />
              </AdminGuard>
            }
          />
          
          {/* Admin Routes (Internal) */}
          <Route path="/internal/admin/login" element={<AdminLogin />} />
          <Route
            path="/internal/admin/images"
            element={
              <AdminGuard>
                <AdminImages />
              </AdminGuard>
            }
          />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
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
