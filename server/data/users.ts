import { mockUsers } from "@shared/mockData";
import { User } from "@shared/types";

// Global users array (in production, this would be a database)
export let users: User[] = [...mockUsers];

export const getUsers = () => users;
export const setUsers = (newUsers: User[]) => {
  users = newUsers;
};
export const getUserById = (id: number) => {
  return users.find((u) => u.id === id);
};
export const getUserByEmail = (email: string) => {
  return users.find((u) => u.email === email);
};
export const updateUser = (id: number, updates: Partial<User>) => {
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    return users[index];
  }
  return null;
};
export const addUser = (user: User) => {
  users.push(user);
  return user;
};
export const deleteUser = (id: number) => {
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    return true;
  }
  return false;
};
