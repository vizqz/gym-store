import { RequestHandler } from "express";
import { mockOrders } from "../../shared/mockData";
import { Order } from "../../shared/types";

// Global orders array (in production, this would be a database)
let orders: Order[] = [...mockOrders];

export const handleGetOrder: RequestHandler = (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = orders.find((o) => o.id === orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrders = () => orders;
export const setOrders = (newOrders: Order[]) => {
  orders = newOrders;
};
export const updateOrder = (id: number, updates: Partial<Order>) => {
  const index = orders.findIndex((o) => o.id === id);
  if (index !== -1) {
    orders[index] = { ...orders[index], ...updates };
    return orders[index];
  }
  return null;
};
