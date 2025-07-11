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

export interface DeliveryInfo {
  method: "pickup" | "delivery";
  location?: "main-gym" | "branch-gym";
  address?: string;
  district?: string;
  reference?: string;
}

export interface PaymentInfo {
  method: "cash" | "yape" | "whatsapp" | "card" | "bank";
  details?: string;
}

export interface Order {
  id: number;
  customerId: number;
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  delivery: DeliveryInfo;
  payment: PaymentInfo;
  total: number;
  status: "pending" | "confirmed" | "in-progress" | "delivered" | "cancelled";
  date: string;
  estimatedDelivery?: string;
  // Legacy fields for backward compatibility
  customerAddress: string;
  deliveryMethod: "pickup" | "delivery";
  location: "main-gym" | "branch-gym";
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "customer" | "worker" | "admin";
  createdAt: string;
}

export interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GymLocation {
  id: "main-gym" | "branch-gym";
  name: string;
  address: string;
  phone: string;
  hours?: string;
  description?: string;
}

export interface CustomerReview {
  id: number;
  orderId: number;
  productId: number;
  customerId: number;
  rating: number;
  comment: string;
  date: string;
}

export interface DashboardStats {
  totalSales: number;
  monthlyRevenue: number;
  totalOrders: number;
  mostSoldProducts: Array<{
    product: Product;
    totalSold: number;
  }>;
}

export interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  date: string;
  workerName: string;
  type: "addition" | "reduction";
  reason?: string;
}
