import { RequestHandler } from "express";
import { LoginRequest, AuthResponse } from "../../shared/api";
import { getUsers } from "../data/users";

export const handleLogin: RequestHandler = (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Find user by email and password
    const user = getUsers().find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate mock token (in real app, use JWT)
    const token = `mock-token-${user.id}-${Date.now()}`;

    const response: AuthResponse = {
      user: userWithoutPassword,
      token,
    };

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
