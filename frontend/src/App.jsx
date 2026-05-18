import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Component } from "react";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./components/common/Toast";
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
import OrderHistoryPage from "./components/order/OrderHistoryPage";
import PujaVidhiPage from "./components/spiritual/PujaVidhiPage";
import MantrasPage from "./components/spiritual/MantrasPage";
import CalendarPage from "./components/spiritual/CalendarPage";

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: 'monospace' }}>
          <h2 style={{ color: 'red' }}>Runtime Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#333' }}>{this.state.error.message}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#999', fontSize: 12 }}>{this.state.error.stack}</pre>
          <button onClick={() => this.setState({ error: null })} style={{ marginTop: 16, padding: '8px 16px' }}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
    <Router>
      <AuthProvider>
        <ToastProvider>
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
            <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
            <Route path="/puja-vidhi" element={<PujaVidhiPage />} />
            <Route path="/mantras" element={<MantrasPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            </Routes>
        </CartProvider>
          </ToastProvider>
      </AuthProvider>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
