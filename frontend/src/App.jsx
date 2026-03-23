import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Home from "./Home";
import {
  Login,
  Register,
  VerifyOTP,
  ForgotPassword,
  ForgotPasswordOTP,
  ResetPasswordNew,
  ProtectedRoute,
  EditProfile
} from "./components/auth";
import { ProductDetail } from "./components/product";
import { CatalogPage, BundleDetailPage } from "./components/catlog";
import { ScrapSubmissionPage } from "./components/scrap";
import { CartPage, CheckoutPage } from "./components/cart";
import { AboutPage } from "./components/about";
import EsewaSuccess from "./components/payment/EsewaSuccess";
import ReviewPage from "./components/review/ReviewPage";
import OrderSuccessPage from "./components/order/OrderSuccessPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-password-otp" element={<ForgotPasswordOTP />} />
            <Route path="/reset-password-new" element={<ResetPasswordNew />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/payment/esewa/success" element={<EsewaSuccess />} />

            {/* Home is public — protected actions redirect to login */}
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<ProtectedRoute><CatalogPage /></ProtectedRoute>} />
            <Route path="/bundle/:id" element={<ProtectedRoute><BundleDetailPage /></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/scrap" element={<ProtectedRoute><ScrapSubmissionPage /></ProtectedRoute>} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/review" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
            <Route path="/order-success/:orderId" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
