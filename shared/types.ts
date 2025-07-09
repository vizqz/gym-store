export interface Review {
  id: number;
  user: string;
  comment: string;
  rating: number; // from 1 to 5
  date: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "protein" | "creatine" | "fat-burner" | "vitamins";
  stock: number;
  rating: number; // average rating
  reviews: Review[];
  brand: string;
  featured?: boolean;
  bestSeller?: boolean;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Order {
  id: number;
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryMethod: "pickup" | "delivery";
  location: "main-gym" | "branch-gym";
  total: number;
  status: "pending" | "confirmed" | "delivered";
  date: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}
