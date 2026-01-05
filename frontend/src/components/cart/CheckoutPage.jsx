import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../homepage";
import { CreditCard, Wallet, Building2, CheckCircle } from "lucide-react";
import { Button } from "../common/Button";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod"
  });

  const cartItems = [
    { id: 1, name: "Brass Diya Set", price: 850, quantity: 2 },
    { id: 2, name: "Copper Kalash", price: 1200, quantity: 1 },
    { id: 3, name: "Sandalwood Incense", price: 250, quantity: 3 }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal > 5000 ? 0 : 100;
  const total = subtotal + delivery;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order placed:", formData);
    // Navigate to success page or process payment
  };

  return (
    <div className="min-h-screen bg-[#F0EDE5]" style={{fontFamily: 'Inter, Noto Sans, sans-serif'}}>
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#1E1C25] mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Information */}
              <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none"
                        placeholder="98XXXXXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                    <textarea
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none"
                      placeholder="Street address, apartment, etc."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none"
                        placeholder="Kathmandu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none"
                        placeholder="44600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleChange}
                      className="w-5 h-5 text-purple-600"
                    />
                    <Wallet className="w-6 h-6 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay when you receive</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="esewa"
                      checked={formData.paymentMethod === "esewa"}
                      onChange={handleChange}
                      className="w-5 h-5 text-purple-600"
                    />
                    <CreditCard className="w-6 h-6 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">eSewa</p>
                      <p className="text-sm text-gray-600">Digital wallet payment</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="khalti"
                      checked={formData.paymentMethod === "khalti"}
                      onChange={handleChange}
                      className="w-5 h-5 text-purple-600"
                    />
                    <CreditCard className="w-6 h-6 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Khalti</p>
                      <p className="text-sm text-gray-600">Digital wallet payment</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === "bank"}
                      onChange={handleChange}
                      className="w-5 h-5 text-purple-600"
                    />
                    <Building2 className="w-6 h-6 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Bank Transfer</p>
                      <p className="text-sm text-gray-600">Direct bank payment</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900">
                        NPR {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>NPR {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span>{delivery === 0 ? 'Free' : `NPR ${delivery}`}</span>
                  </div>
                  {delivery === 0 && (
                    <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                      🎉 Free delivery applied!
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>NPR {total}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-all mb-3"
                >
                  Place Order
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  Back to Cart
                </button>

                <div className="mt-6 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Free delivery above NPR 5,000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Easy returns within 7 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
