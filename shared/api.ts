/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

import {
  User,
  Product,
  Order,
  DashboardStats,
  AuthResponse,
  LoginRequest,
} from "./types";

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Authentication API responses
 */
export interface LoginResponse extends AuthResponse {}

// Re-export from types for convenience
export type { AuthResponse, LoginRequest };

export interface UserResponse {
  user: Omit<User, "password">;
}

/**
 * Product API responses
 */
export interface ProductsResponse {
  products: Product[];
}

export interface ProductResponse {
  product: Product;
}

/**
 * Order API responses
 */
export interface OrdersResponse {
  orders: Order[];
}

export interface OrderResponse {
  order: Order;
}

/**
 * Dashboard API responses
 */
export interface DashboardResponse {
  stats: DashboardStats;
  workers: Omit<User, "password">[];
}
