import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ChatBot } from './components/ChatBot';
import ScrollToTop from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductPage } from './pages/ProductPage';
import { QuotePage } from './pages/QuotePage';
import { ContactPage } from './pages/ContactPage';
import { QuoteProvider } from './context/QuoteContext';
import { NotFoundPage } from './pages/NotFoundPage';
import { Toaster } from './components/ui/sonner';

import { ProductsPage } from './pages/ProductsPage';
import { LandingPage } from './pages/LandingPage';
import AdminPage from './pages/AdminPage';
import { useUser, useAuth } from '@clerk/clerk-react';


const GatewayGuard = () => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { isLoaded: isAuthLoaded } = useAuth();

  // const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || '';
  // const adminEmails = adminEmail.split(',').map(e => e.trim().toLowerCase());
  // const isAdmin = !!user && adminEmails.includes(user.primaryEmailAddress?.emailAddress?.toLowerCase() || '');

  /* const isUnlocked = (() => {
    const unlockTime = localStorage.getItem('nishyash_gateway_unlock');
    if (!unlockTime) return false;

    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (now - Number.parseInt(unlockTime) > twentyFourHours) {
      localStorage.removeItem('nishyash_gateway_unlock');
      return false;
    }
    return true;
  })(); */

  if (!isUserLoaded || !isAuthLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Allow admin bypass or session-unlocked users, otherwise redirect to landing page
  // if (isAdmin || isUnlocked) {
  return <Outlet />;
  // }

  // return <Navigate to="/" replace />;
};

export default function App() {
  return (
    <QuoteProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Landing Page: Full screen, no Header/Footer */}
          <Route path="/" element={<LandingPage />} />

          {/* Protected Routes: Require Gateway Completion */}
          <Route element={<GatewayGuard />}>
            <Route path="/*" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/categories/:categoryId" element={<CategoryPage />} />
                    <Route path="/products/:productId" element={<ProductPage />} />
                    <Route path="/quote" element={<QuotePage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Route>
        </Routes>
        <ChatBot />
        <Toaster position="top-center" />
      </Router>
    </QuoteProvider>
  );
}
