export interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  date: string;
  workerName: string;
  type: "addition" | "reduction";
  reason?: string;
}

// Global stock movements array (in production, this would be a database)
let stockMovements: StockMovement[] = [
  {
    id: 1,
    productId: 1,
    productName: "Whey Protein Gold Standard",
    quantity: 50,
    date: "2024-12-01T10:00:00Z",
    workerName: "María Empleada",
    type: "addition",
    reason: "Nuevo stock recibido del proveedor",
  },
  {
    id: 2,
    productId: 6,
    productName: "Creatina Monohidrato Micronizada",
    quantity: 30,
    date: "2024-12-02T14:30:00Z",
    workerName: "Ana Supervisora",
    type: "addition",
    reason: "Reposición de inventario",
  },
  {
    id: 3,
    productId: 10,
    productName: "Hydroxycut Hardcore Elite",
    quantity: 25,
    date: "2024-12-03T09:15:00Z",
    workerName: "Diego Vendedor",
    type: "addition",
    reason: "Stock inicial",
  },
];

export const getStockMovements = () => stockMovements;
export const getStockMovementsByProduct = (productId: number) => {
  return stockMovements.filter((movement) => movement.productId === productId);
};
export const addStockMovement = (movement: Omit<StockMovement, "id">) => {
  const newMovement: StockMovement = {
    id: Math.max(...stockMovements.map((m) => m.id), 0) + 1,
    ...movement,
  };
  stockMovements.unshift(newMovement); // Add to beginning for chronological order
  return newMovement;
};
export const setStockMovements = (newMovements: StockMovement[]) => {
  stockMovements = newMovements;
};
