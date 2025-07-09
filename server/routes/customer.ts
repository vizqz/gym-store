import { RequestHandler } from "express";
import { OrdersResponse } from "../../shared/api";
import { mockOrders } from "../../shared/mockData";

export const handleGetCustomerOrders: RequestHandler = (req, res) => {
  try {
    const customerId = parseInt(req.params.customerId);

    // Filter orders for the specific customer
    const customerOrders = mockOrders.filter((order) => {
      // Check if order has customerId or falls back to matching customer details
      return (
        order.customerId === customerId ||
        (order.customerName && customerId === 3)
      ); // Demo fallback for customer user
    });

    const response: OrdersResponse = {
      orders: customerOrders,
    };

    res.json(response);
  } catch (error) {
    console.error("Get customer orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
