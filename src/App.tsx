import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import BusinessSolutions from "./pages/services/BusinessSolutions";
import ResearchConsulting from "./pages/services/ResearchConsulting";
import Education from "./pages/services/Education";
import Platform from "./pages/services/Platform";
import Portfolio from "./pages/Portfolio";
import PortfolioDetail from "./pages/PortfolioDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import CompanyOverview from "./pages/about/CompanyOverview";
import VisionMission from "./pages/about/VisionMission";
import History from "./pages/about/History";
import Press from "./pages/about/Press";
import Location from "./pages/about/Location";
import Contact from "./pages/support/Contact";
import FAQ from "./pages/support/FAQ";
import Announcements from "./pages/support/Announcements";
import AnnouncementDetail from "./pages/support/AnnouncementDetail";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPortfolio from "./pages/admin/Portfolio";
import AdminBlog from "./pages/admin/Blog";
import AdminAnnouncements from "./pages/admin/Announcements";
import AdminPress from "./pages/admin/Press";
import AdminInquiries from "./pages/admin/Inquiries";
import AdminNewsletter from "./pages/admin/Newsletter";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { initializeStorage } from "./lib/adminStorage";

// Initialize storage on app load
initializeStorage();

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/business-solutions" element={<BusinessSolutions />} />
          <Route path="/services/research-consulting" element={<ResearchConsulting />} />
          <Route path="/services/education" element={<Education />} />
          <Route path="/services/platform" element={<Platform />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:id" element={<PortfolioDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/about" element={<Navigate to="/about/overview" replace />} />
          <Route path="/about/overview" element={<CompanyOverview />} />
          <Route path="/about/vision" element={<VisionMission />} />
          <Route path="/about/history" element={<History />} />
          <Route path="/about/press" element={<Press />} />
          <Route path="/about/location" element={<Location />} />
          <Route path="/support" element={<Navigate to="/support/contact" replace />} />
          <Route path="/support/contact" element={<Contact />} />
          <Route path="/support/faq" element={<FAQ />} />
          <Route path="/support/announcements" element={<Announcements />} />
          <Route path="/support/announcements/:id" element={<AnnouncementDetail />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/portfolio"
            element={
              <ProtectedRoute>
                <AdminPortfolio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog"
            element={
              <ProtectedRoute>
                <AdminBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/announcements"
            element={
              <ProtectedRoute>
                <AdminAnnouncements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/press"
            element={
              <ProtectedRoute>
                <AdminPress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inquiries"
            element={
              <ProtectedRoute>
                <AdminInquiries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/newsletter"
            element={
              <ProtectedRoute>
                <AdminNewsletter />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
