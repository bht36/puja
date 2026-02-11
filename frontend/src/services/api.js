const API_BASE_URL = "http://127.0.0.1:8000/api";

const getAuthToken = () => localStorage.getItem("access_token");

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      if (data.non_field_errors) throw new Error(data.non_field_errors[0]);
      if (typeof data === 'object' && data !== null) {
        const firstError = Object.values(data)[0];
        if (Array.isArray(firstError)) throw new Error(firstError[0]);
      }
      throw new Error(data.error || data.message || "Something went wrong");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const authAPI = {
  register: (userData) => apiRequest("/auth/register/", {
    method: "POST",
    body: JSON.stringify(userData),
  }),

  login: (credentials) => apiRequest("/auth/login/", {
    method: "POST",
    body: JSON.stringify(credentials),
  }),

  logout: (refreshToken) => apiRequest("/auth/logout/", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  }),

  verifyOTP: (data) => apiRequest("/auth/verify-otp/", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  forgotPassword: (email) => apiRequest("/auth/forgot-password/", {
    method: "POST",
    body: JSON.stringify({ email }),
  }),

  verifyResetOTP: (data) => apiRequest("/auth/verify-reset-otp/", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  resetPassword: (uid, token, passwords) => apiRequest(`/auth/reset-password/${uid}/${token}/`, {
    method: "POST",
    body: JSON.stringify(passwords),
  }),

  getProfile: () => apiRequest("/auth/profile/", { method: "GET" }),

  refreshToken: (refreshToken) => apiRequest("/auth/token/refresh/", {
    method: "POST",
    body: JSON.stringify({ refresh: refreshToken }),
  }),

  updateProfile: async (profileData) => {
    const formData = new FormData();
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== null && profileData[key] !== undefined && profileData[key] !== '') {
        formData.append(key, profileData[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/auth/profile/update/`, {
      method: "PUT",
      headers: { ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` }) },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      if (data.non_field_errors) throw new Error(data.non_field_errors[0]);
      if (typeof data === 'object' && data !== null) {
        const firstError = Object.values(data)[0];
        if (Array.isArray(firstError)) throw new Error(firstError[0]);
      }
      throw new Error(data.error || data.message || "Something went wrong");
    }
    return data;
  }
};
