import { RequestHandler } from "express";
import { ProductsResponse } from "../../shared/api";
import { getProducts } from "../data/products";

export const handleGetProducts: RequestHandler = (req, res) => {
  try {
    const response: ProductsResponse = {
      products: getProducts(),
    };

    res.json(response);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetProduct: RequestHandler = (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = getProducts().find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
