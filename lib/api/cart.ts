import { getToken } from "@/lib/auth/auth-storage";

export async function getCart() {
  const token = getToken();

  const res = await fetch("/api/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to load cart");
  }

  return json.data;
}