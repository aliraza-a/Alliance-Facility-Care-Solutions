import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import { CMSProvider } from "@/lib/CMSContext";
import ScrollToTop from "./components/shared/ScrollToTop";

import PageLayout from "./components/layout/PageLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import BookService from "./pages/BookService";
import GetQuote from "./pages/GetQuote";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/Login";
import AdminBookings from "./pages/admin/Bookings";
import AdminQuotes from "./pages/admin/Quotes";
import AdminMessages from "./pages/admin/Messages";
import AdminServicesManager from "./pages/admin/ServicesManager";
import AdminSettings from "./pages/admin/Settings";
import AdminPages from "./pages/admin/Pages";
import AdminMenuBuilder from "./pages/admin/MenuBuilder";
import AdminTestimonials from "./pages/admin/Testimonials";
import AdminHeroSections from "./pages/admin/HeroSections";
import AdminFAQs from "./pages/admin/FAQs";
import AdminBeforeAfterManager from "./pages/admin/BeforeAfterManager";

const AppRoutes = () => {
  const { isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#020807]">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PageLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book" element={<BookService />} />
        <Route path="/quote" element={<GetQuote />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="pages" element={<AdminPages />} />
        <Route path="menu" element={<AdminMenuBuilder />} />
        <Route path="hero-sections" element={<AdminHeroSections />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="faqs" element={<AdminFAQs />} />
        <Route path="before-after" element={<AdminBeforeAfterManager />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="quotes" element={<AdminQuotes />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="services" element={<AdminServicesManager />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <CMSProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AppRoutes />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </CMSProvider>
    </AuthProvider>
  );
}

export default App;
