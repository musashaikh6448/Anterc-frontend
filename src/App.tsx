import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import NavigationLoader from './components/NavigationLoader';
import ScrollToTop from './components/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import CategoryDetailsPage from './pages/CategoryDetailsPage';
import EnquiryPage from './pages/EnquiryPage';
import SuccessPage from './pages/SuccessPage';
import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import AuthPage from './pages/AuthPage';
import MyEnquiriesPage from './pages/MyEnquiriesPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition-enter w-full">
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:id" element={<CategoryDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/my-enquiries" element={<MyEnquiriesPage />} />
        <Route path="/enquiry/:categoryId/:serviceId" element={<EnquiryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
};

const AppLayoutContent = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen relative bg-[#fcfdfe] max-w-[100vw] overflow-x-hidden">
      <NavigationLoader />
      {!isAdminPath && <Header />}

      <main className={`flex-grow flex flex-col items-center ${!isAdminPath ? 'pt-16 sm:pt-24' : ''}`}>
        <div className="w-full max-w-[2000px] mx-auto">
          <AnimatedRoutes />
        </div>
      </main>

      {!isAdminPath && <Footer />}

      {/* Mobile Floating Action Button - Only for users, not admin */}
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={
          <div className="fixed bottom-6 right-6 2xl:hidden z-40">
            <a
              href="tel:+917385650510"
              className="text-white w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all border border-white/10"
              style={{ backgroundColor: theme?.colors?.dark || '#0f172a' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme?.colors?.darkHover || theme?.colors?.primary || '#1e293b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme?.colors?.dark || '#0f172a';
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>
          </div>
        } />
      </Routes>
    </div>
  );
};

const AppLayout = () => {
  return <AppLayoutContent />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <Toaster position="top-center" richColors />
            <AppLayout />
          </Router>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
