import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';
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
import { toast } from 'sonner';

import { ProductsPage } from './pages/ProductsPage';
import { LandingPage } from './pages/LandingPage';
import AdminPage from './pages/AdminPage';
import { useUser } from '@clerk/clerk-react';


const GatewayGuard = () => {
  // Bypassed for testing purposes as per user request
  return <Outlet />;
};

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const adminEmailStr = import.meta.env.VITE_ADMIN_EMAIL || '';
  const adminEmails = adminEmailStr
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(e => e.length > 0);

  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const isAdmin = !!userEmail && adminEmails.includes(userEmail);

  useEffect(() => {
    if (isLoaded && !isAdmin) {
      toast.error("Forbidden: Admin access required.");
    }
  }, [isLoaded, isAdmin]);

  if (!isLoaded) return null;

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
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
                    <Route path="/admin" element={<AdminGuard><AdminPage /></AdminGuard>} />
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
