import { RequestHandler } from "express";
import { DashboardResponse } from "@shared/api";
import { mockStats, mockUsers } from "@shared/mockData";

export const handleGetDashboard: RequestHandler = (req, res) => {
  try {
    // Get workers (exclude customers and remove passwords)
    const workers = mockUsers
      .filter((user) => user.role === "admin" || user.role === "worker")
      .map(({ password, ...user }) => user);

    const response: DashboardResponse = {
      stats: mockStats,
      workers,
    };

    res.json(response);
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
