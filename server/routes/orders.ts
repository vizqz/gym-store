import { RequestHandler } from "express";
import { OrdersResponse } from "@shared/api";
import { mockOrders } from "@shared/mockData";

export const handleGetOrders: RequestHandler = (req, res) => {
  try {
    const response: OrdersResponse = {
      orders: mockOrders,
    };

    res.json(response);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleUpdateOrder: RequestHandler = (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    const orderIndex = mockOrders.findIndex((o) => o.id === orderId);

    if (orderIndex === -1) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update order status (in a real app, this would update the database)
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      status,
    };

    res.json({ order: mockOrders[orderIndex] });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
