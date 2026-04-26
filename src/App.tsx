import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { useEffect } from "react";
import { initializeProducts } from "@/data/products";
import { initializeCategories } from "@/data/categories";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import CategoryPage from "@/pages/CategoryPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import DashboardPage from "@/pages/DashboardPage";
import WishlistPage from "@/pages/WishlistPage";
import OrderHistoryPage from "@/pages/OrderHistoryPage";
import DealsPage from "@/pages/DealsPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import SearchPage from "@/pages/SearchPage";
import SavedAddressesPage from "@/pages/SavedAddressesPage";
import NotificationSettingsPage from "@/pages/NotificationSettingsPage";
import AppSettingsPage from "@/pages/AppSettingsPage";
import MyReviewsPage from "@/pages/MyReviewsPage";
import QuestionsAnswersPage from "@/pages/QuestionsAnswersPage";
import CouponsPage from "@/pages/CouponsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize MongoDB data on app load
    const loadData = async () => {
      try {
        await Promise.all([
          initializeProducts(),
          initializeCategories()
        ]);
      } catch (error) {
        console.error("[v0] Error initializing app data:", error);
      }
    };
    loadData();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/category/:slug/:subcategorySlug" element={<CategoryPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/orders" element={<OrderHistoryPage />} />
                  <Route path="/deals" element={<DealsPage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/saved-addresses" element={<SavedAddressesPage />} />
                  <Route path="/notification-settings" element={<NotificationSettingsPage />} />
                  <Route path="/app-settings" element={<AppSettingsPage />} />
                  <Route path="/my-reviews" element={<MyReviewsPage />} />
                  <Route path="/questions-answers" element={<QuestionsAnswersPage />} />
                  <Route path="/coupons" element={<CouponsPage />} />
                </Route>
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
