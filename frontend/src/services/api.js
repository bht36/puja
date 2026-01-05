// API configuration and helper functions
const API_BASE_URL = "http://127.0.0.1:8000/api";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

// Helper function to make API requests
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

  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle validation errors from DRF
      if (data.non_field_errors) {
        throw new Error(data.non_field_errors[0]);
      }
      // Handle field-specific errors
      if (typeof data === 'object' && data !== null) {
        const firstError = Object.values(data)[0];
        if (Array.isArray(firstError)) {
          throw new Error(firstError[0]);
        }
      }
      throw new Error(data.error || data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  register: async (userData) => {
    return apiRequest("/auth/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return apiRequest("/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  logout: async (refreshToken) => {
    return apiRequest("/auth/logout/", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },

  forgotPassword: async (email) => {
    return apiRequest("/auth/forgot-password/", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (uid, token, passwords) => {
    return apiRequest(`/auth/reset-password/${uid}/${token}/`, {
      method: "POST",
      body: JSON.stringify(passwords),
    });
  },

  getProfile: async () => {
    return apiRequest("/auth/profile/", {
      method: "GET",
    });
  },

  refreshToken: async (refreshToken) => {
    return apiRequest("/auth/token/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    });
  },
};

// Add verifyOTP to authAPI
authAPI.verifyOTP = async (data) => {
  return apiRequest("/auth/verify-otp/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

authAPI.forgotPassword = async (email) => {
  return apiRequest("/auth/forgot-password/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

authAPI.verifyResetOTP = async (data) => {
  return apiRequest("/auth/verify-reset-otp/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Add updateProfile to authAPI
authAPI.updateProfile = async (profileData) => {
  console.log('API updateProfile called with:', profileData);
  
  const formData = new FormData();
  
  // Append all profile data to FormData
  Object.keys(profileData).forEach(key => {
    if (profileData[key] !== null && profileData[key] !== undefined && profileData[key] !== '') {
      console.log(`Appending ${key}:`, profileData[key]);
      formData.append(key, profileData[key]);
    }
  });

  const url = `${API_BASE_URL}/auth/profile/update/`;
  const token = getAuthToken();

  console.log('Making request to:', url);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  console.log('Response status:', response.status);
  const data = await response.json();
  console.log('Response data:', data);

  if (!response.ok) {
    if (data.non_field_errors) {
      throw new Error(data.non_field_errors[0]);
    }
    if (typeof data === 'object' && data !== null) {
      const firstError = Object.values(data)[0];
      if (Array.isArray(firstError)) {
        throw new Error(firstError[0]);
      }
    }
    throw new Error(data.error || data.message || "Something went wrong");
  }

  return data;
};
