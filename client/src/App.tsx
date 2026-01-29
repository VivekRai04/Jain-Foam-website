import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import About from "@/pages/About";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminEnquiries from "@/pages/AdminEnquiries";
import AdminGallery from "@/pages/AdminGallery";
import AdminProductsServices from "@/pages/AdminProductsServices";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/about" component={About} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/contact" component={Contact} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/dashboard">
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/enquiries">
          <ProtectedRoute>
            <AdminEnquiries />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/gallery">
          <ProtectedRoute>
            <AdminGallery />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/products">
          <ProtectedRoute>
            <AdminProductsServices />
          </ProtectedRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
