import { mockProducts } from "@shared/mockData";
import { Product } from "@shared/types";

// Global products array (in production, this would be a database)
export let products: Product[] = [...mockProducts];

export const getProducts = () => products;
export const setProducts = (newProducts: Product[]) => {
  products = newProducts;
};
export const updateProduct = (id: number, updates: Partial<Product>) => {
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    return products[index];
  }
  return null;
};
export const addProduct = (product: Product) => {
  products.push(product);
  return product;
};
export const deleteProduct = (id: number) => {
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products.splice(index, 1);
    return true;
  }
  return false;
};
