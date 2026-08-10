export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  basePrice: number;
  sizes?: Size[];
  extras?: Extra[];
  tag?: "bestseller" | "new" | "spicy" | "deal";
  ingredients?: string[];
}
export interface Size {
  id: string | null;
  label: string;
  price: number;
  serves: string;
}
export interface Extra { id: string; label: string; price: number; }
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;

  sizeId: string | null;
  size: string;
  sizePrice: number;

  extras: {
    id: string;
    label: string;
    price: number;
  }[];

  quantity: number;
  totalPrice: number;
}
export interface Category { id: string; name: string; icon: string; description: string; image: string; }
export interface Deal {
  id: string; title: string; description: string;
  originalPrice: number; salePrice: number; image: string; badge: string; items: string[];
}
export type OrderStatus = "confirmed" | "preparing" | "ontheway" | "delivered";
export interface Order {
  id: string; items: CartItem[]; total: number; address: string;
  phone: string; paymentMethod: string; status: OrderStatus; createdAt: string; estimatedTime: string;
}
