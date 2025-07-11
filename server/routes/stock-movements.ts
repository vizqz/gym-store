import { RequestHandler } from "express";
import {
  getStockMovements,
  getStockMovementsByProduct,
  addStockMovement,
  StockMovement,
} from "../data/stock-movements";

export const handleGetStockMovements: RequestHandler = (req, res) => {
  try {
    const { productId } = req.query;

    let movements: StockMovement[];
    if (productId) {
      movements = getStockMovementsByProduct(parseInt(productId as string));
    } else {
      movements = getStockMovements();
    }

    res.json({ movements });
  } catch (error) {
    console.error("Get stock movements error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleAddStockMovement: RequestHandler = (req, res) => {
  try {
    const { productId, productName, quantity, workerName, reason } = req.body;

    const movement = addStockMovement({
      productId,
      productName,
      quantity,
      date: new Date().toISOString(),
      workerName,
      type: "addition",
      reason,
    });

    res.status(201).json({ movement });
  } catch (error) {
    console.error("Add stock movement error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
