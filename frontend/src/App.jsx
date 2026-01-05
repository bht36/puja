import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-password-otp" element={<ForgotPasswordOTP />} />
          <Route path="/reset-password-new" element={<ResetPasswordNew />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CatalogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bundle/:id"
            element={
              <ProtectedRoute>
                <BundleDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scrap"
            element={
              <ProtectedRoute>
                <ScrapSubmissionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
