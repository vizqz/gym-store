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
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const newUser: User = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      name,
      email,
      password, // In production, this should be hashed
      role: role || "customer",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

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

    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    // If password is provided, update it (in production, hash it)
    if (updateData.password) {
      users[userIndex].password = updateData.password;
    }

    // Update other fields
    if (updateData.name) users[userIndex].name = updateData.name;
    if (updateData.email) users[userIndex].email = updateData.email;
    if (updateData.role) users[userIndex].role = updateData.role;

    // Return user without password
    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const handleDeleteUser: RequestHandler = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    users.splice(userIndex, 1);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const handleGetUsers: RequestHandler = (req, res) => {
  try {
    // Return users without passwords
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json({ users: usersWithoutPasswords });
  } catch (error) {
    res.status(500).json({ error: "Failed to get users" });
  }
};
