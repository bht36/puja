import { apiRequest } from './base';

export const orderAPI = {
  create: (data) => apiRequest("/orders/", { method: "POST", body: JSON.stringify(data) }),
  myOrders: () => apiRequest("/orders/my/", { method: "GET" }),
  detail: (id) => apiRequest(`/orders/${id}/`, { method: "GET" }),
  cancel: (id) => apiRequest(`/orders/${id}/cancel/`, { method: "PUT" }),
};

export const paymentAPI = {
  esewaInitiate: (order_id) => apiRequest("/payment/esewa/initiate/", { method: "POST", body: JSON.stringify({ order_id }) }),
  esewaVerify: (data) => apiRequest("/payment/esewa/verify/", { method: "POST", body: JSON.stringify(data) }),
};

export const reviewAPI = {
  getAll: () => apiRequest("/reviews/", { method: "GET" }),
  submit: (data) => apiRequest("/reviews/submit/", { method: "POST", body: JSON.stringify(data) }),
};
