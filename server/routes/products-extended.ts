import { RequestHandler } from "express";
import { Product } from "@shared/types";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../data/products";

export const handleCreateProduct: RequestHandler = (req, res) => {
  try {
    const productData = req.body;
    const newProduct: Product = {
      id: Math.max(...products.map((p) => p.id)) + 1,
      ...productData,
      rating: productData.rating || 0,
      reviews: productData.reviews || [],
    };

    products.push(newProduct);
    res.status(201).json({ product: newProduct });
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const handleUpdateProduct: RequestHandler = (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const updateData = req.body;

    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    products[productIndex] = { ...products[productIndex], ...updateData };
    res.json({ product: products[productIndex] });
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const handleDeleteProduct: RequestHandler = (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    products.splice(productIndex, 1);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};

export const handleUpdateStock: RequestHandler = (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { quantity } = req.body;

    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    products[productIndex].stock += quantity;
    res.json({ product: products[productIndex] });
  } catch (error) {
    res.status(500).json({ error: "Failed to update stock" });
  }
};
