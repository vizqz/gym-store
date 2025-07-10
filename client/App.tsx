import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import WorkerPanel from "./pages/WorkerPanel";
import OrderManagement from "./pages/OrderManagement";
import ProductDetail from "./pages/ProductDetail";
import MyOrders from "./pages/MyOrders";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/worker"
                element={
                  <ProtectedRoute adminOrWorker>
                    <WorkerPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:orderId"
                element={
                  <ProtectedRoute adminOrWorker>
                    <OrderManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute requiredRole="customer">
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-confirmation"
                element={<OrderConfirmation />}
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
