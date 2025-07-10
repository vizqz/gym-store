import { RequestHandler } from "express";
import { OrdersResponse } from "../../shared/api";
import { getOrders, updateOrder } from "./orders-extended";

export const handleGetOrders: RequestHandler = (req, res) => {
  try {
    const response: OrdersResponse = {
      orders: getOrders(),
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

    const updatedOrder = updateOrder(orderId, { status });

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ order: updatedOrder });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
