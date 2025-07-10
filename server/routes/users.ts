import { RequestHandler } from "express";
import { User } from "@shared/types";
import {
  getUsers,
  getUserByEmail,
  addUser,
  updateUser,
  deleteUser,
} from "../data/users";

export const handleRegisterUser: RequestHandler = (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const users = getUsers();
    const newUser: User = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      name,
      email,
      password, // In production, this should be hashed
      role: role || "customer",
      createdAt: new Date().toISOString(),
    };

    addUser(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      user: userWithoutPassword,
      token: "fake-jwt-token-for-demo",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const handleUpdateUser: RequestHandler = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const updateData = req.body;

    const updatedUser = updateUser(userId, updateData);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const handleDeleteUser: RequestHandler = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const deleted = deleteUser(userId);

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const handleGetUsers: RequestHandler = (req, res) => {
  try {
    const users = getUsers();
    // Return users without passwords
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json({ users: usersWithoutPasswords });
  } catch (error) {
    res.status(500).json({ error: "Failed to get users" });
  }
};
