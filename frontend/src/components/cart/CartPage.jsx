import React, { useState } from "react";
import { Button } from "../common/Button";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../homepage";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Brass Diya Set",
      price: 850,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1549388604-817d15aa0110?w=150&h=150&fit=crop"
    },
    {
      id: 2,
      name: "Copper Kalash",
      price: 1200,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop"
    },
    {
      id: 3,
      name: "Sandalwood Incense",
      price: 250,
      quantity: 3,
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=150&h=150&fit=crop"
    }
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const delivery = subtotal > 5000 ? 0 : 100;
    return subtotal + delivery;
  };

  return (
    <div className="min-h-screen bg-[#F0EDE5]" style={{fontFamily: 'Inter, Noto Sans, sans-serif'}}>
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#1E1C25] mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add items to get started</p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-lg font-bold text-purple-600">NPR {item.price}</p>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded bg-white hover:bg-gray-100 flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>NPR {getSubtotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span>{getSubtotal() > 5000 ? 'Free' : 'NPR 100'}</span>
                  </div>
                  {getSubtotal() > 5000 && (
                    <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                      🎉 You got free delivery!
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>NPR {getTotal()}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-all mb-3"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  Continue Shopping
                </button>

                <div className="mt-6 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Free delivery above NPR 5,000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Easy returns within 7 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
