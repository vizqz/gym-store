import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleLogin } from "./routes/auth";
import { handleGetProducts, handleGetProduct } from "./routes/products";
import { handleGetOrders, handleUpdateOrder } from "./routes/orders";
import { handleGetDashboard } from "./routes/dashboard";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", handleLogin);

  // Product routes
  app.get("/api/products", handleGetProducts);
  app.get("/api/products/:id", handleGetProduct);

  // Order routes
  app.get("/api/orders", handleGetOrders);
  app.patch("/api/orders/:id", handleUpdateOrder);

  // Dashboard routes
  app.get("/api/dashboard", handleGetDashboard);

  return app;
}
