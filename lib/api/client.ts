// Typed API client for frontend consumption
const BASE = "/api";

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<{ data: T; success: boolean; message: string }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const json = await res.json();

  if (!res.ok) throw new Error(json.message ?? "Request failed");
  return json;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: any)              => request("/auth/register",        { method:"POST", body: JSON.stringify(data) }),
  login:    (data: any)              => request("/auth/login",           { method:"POST", body: JSON.stringify(data) }),
  profile:  (token: string)          => request("/auth/profile",         {}, token),
  updateProfile: (data: any, token: string) => request("/auth/profile",  { method:"PATCH", body: JSON.stringify(data) }, token),
  forgotPassword: (email: string)    => request("/auth/forgot-password", { method:"POST", body: JSON.stringify({ email }) }),
  resetPassword: (data: any)         => request("/auth/reset-password",  { method:"POST", body: JSON.stringify(data) }),
};

// ── Menu ─────────────────────────────────────────────────────────────────────
export const menuApi = {
  getCategories: ()                  => request("/menu/categories"),
  getItems: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/menu/items${qs}`);
  },
  getItem: (id: string)              => request(`/menu/items/${id}`),
};

// ── Cart ─────────────────────────────────────────────────────────────────────
export const cartApi = {
  get:         (token: string, coupon?: string) => request(`/cart${coupon ? "?coupon="+coupon : ""}`, {}, token),
  addItem:     (data: any, token: string)       => request("/cart",               { method:"POST",   body: JSON.stringify(data) }, token),
  updateItem:  (itemId: string, qty: number, token: string) => request(`/cart/items/${itemId}`, { method:"PATCH", body: JSON.stringify({ quantity: qty }) }, token),
  removeItem:  (itemId: string, token: string)  => request(`/cart/items/${itemId}`,{ method:"DELETE" }, token),
  clear:       (token: string)                  => request("/cart",               { method:"DELETE" }, token),
  validateCoupon: (code: string, token: string) => request("/cart/coupon",        { method:"POST",   body: JSON.stringify({ code }) }, token),
};

// ── Orders ───────────────────────────────────────────────────────────────────
export const ordersApi = {
  place:    (data: any, token: string)           => request("/orders",            { method:"POST",   body: JSON.stringify(data) }, token),
  list:     (token: string, page = 1)            => request(`/orders?page=${page}`,{}, token),
  get:      (id: string, token: string)          => request(`/orders/${id}`,      {}, token),
  cancel:   (id: string, token: string)          => request(`/orders/${id}/cancel`,{ method:"POST" }, token),
  timeline: (id: string, token: string)          => request(`/orders/${id}/timeline`, {}, token),
};

// ── Addresses ────────────────────────────────────────────────────────────────
export const addressApi = {
  list:   (token: string)            => request("/addresses",            {}, token),
  create: (data: any, token: string) => request("/addresses",            { method:"POST",   body: JSON.stringify(data) }, token),
  update: (id: string, data: any, token: string) => request(`/addresses/${id}`, { method:"PATCH", body: JSON.stringify(data) }, token),
  delete: (id: string, token: string) => request(`/addresses/${id}`,    { method:"DELETE" }, token),
};

// ── Reservations ─────────────────────────────────────────────────────────────
export const reservationApi = {
  list:   (token: string)            => request("/reservations",         {}, token),
  create: (data: any, token: string) => request("/reservations",         { method:"POST",   body: JSON.stringify(data) }, token),
  cancel: (id: string, token: string)=> request(`/reservations/${id}`,  { method:"DELETE" }, token),
};

// ── Reviews ──────────────────────────────────────────────────────────────────
export const reviewApi = {
  list:   (menuItemId: string)       => request(`/reviews?menuItemId=${menuItemId}`),
  submit: (data: any, token: string) => request("/reviews",             { method:"POST",   body: JSON.stringify(data) }, token),
};

// ── Contact ──────────────────────────────────────────────────────────────────
export const contactApi = {
  send: (data: any)                  => request("/contact",             { method:"POST",   body: JSON.stringify(data) }),
};
