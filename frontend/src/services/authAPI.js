import { apiRequest, BASE } from './base';

export const authAPI = {
  register: (data) => apiRequest('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),
  verifyOTP: (data) => apiRequest('/auth/verify-otp/', { method: 'POST', body: JSON.stringify(data) }),
  resendOTP: (email) => apiRequest('/auth/resend-otp/', { method: 'POST', body: JSON.stringify({ email }) }),
  login: (data) => apiRequest('/auth/login/', { method: 'POST', body: JSON.stringify(data) }),
  logout: (refresh) => apiRequest('/auth/logout/', { method: 'POST', body: JSON.stringify({ refresh }) }),
  getProfile: () => apiRequest('/auth/profile/', { method: 'GET' }),
  updateProfile: (data) => {
    const token = localStorage.getItem('access_token');
    return fetch(`${BASE}/auth/profile/update/`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: data, // FormData — no Content-Type header
    }).then(async res => {
      const d = await res.json();
      if (!res.ok) throw new Error(d.detail || d.error || JSON.stringify(d));
      return d;
    });
  },
  forgotPassword: (email) => apiRequest('/auth/forgot-password/', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyResetOTP: (data) => apiRequest('/auth/verify-reset-otp/', { method: 'POST', body: JSON.stringify(data) }),
  resetPassword: (data) => apiRequest('/auth/reset-password/', { method: 'POST', body: JSON.stringify(data) }),
};
