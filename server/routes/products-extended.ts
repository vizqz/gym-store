import { RequestHandler } from "express";
import { Product } from "../../shared/types";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../data/products";
import { addStockMovement } from "../data/stock-movements";

export const handleCreateProduct: RequestHandler = (req, res) => {
  try {
    const productData = req.body;
    const products = getProducts();
    const newProduct: Product = {
      id: Math.max(...products.map((p) => p.id)) + 1,
      ...productData,
      rating: productData.rating || 0,
      reviews: productData.reviews || [],
    };

    addProduct(newProduct);
    res.status(201).json({ product: newProduct });
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const handleUpdateProduct: RequestHandler = (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const updateData = req.body;

    const updatedProduct = updateProduct(productId, updateData);
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const handleDeleteProduct: RequestHandler = (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const deleted = deleteProduct(productId);

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};

export const handleUpdateStock: RequestHandler = (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { quantity, workerName, reason } = req.body;

    const products = getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updatedProduct = updateProduct(productId, {
      stock: product.stock + quantity,
    });

    // Add stock movement record
    addStockMovement({
      productId,
      productName: product.name,
      quantity,
      date: new Date().toISOString(),
      workerName: workerName || "Unknown Worker",
      type: "addition",
      reason: reason || "Stock updated",
    });

    res.json({ product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: "Failed to update stock" });
  }
};
