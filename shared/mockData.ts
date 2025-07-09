import { Product, Review, User, Order, DashboardStats } from "./types";

export const mockReviews: Review[] = [
  {
    id: 1,
    user: "Carlos M.",
    comment: "Excelente proteína, muy buen sabor y se disuelve perfectamente.",
    rating: 5,
    date: "2024-01-15",
  },
  {
    id: 2,
    user: "María S.",
    comment: "Me ha ayudado mucho en mi recuperación post-entrenamiento.",
    rating: 4,
    date: "2024-01-10",
  },
  {
    id: 3,
    user: "Juan P.",
    comment: "Buena calidad precio, recomendado.",
    rating: 4,
    date: "2024-01-08",
  },
];

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Whey Protein Gold Standard",
    description:
      "Proteína de suero de alta calidad con 24g de proteína por porción. Ideal para el crecimiento muscular y recuperación post-entrenamiento. Disponible en múltiples sabores deliciosos.",
    price: 189.5,
    image:
      "https://via.placeholder.com/300x300/FFBF00/000000?text=Whey+Protein",
    category: "protein",
    stock: 25,
    rating: 4.8,
    reviews: mockReviews,
    brand: "Optimum Nutrition",
    featured: true,
    bestSeller: true,
  },
  {
    id: 2,
    name: "Creatina Monohidrato Micronizada",
    description:
      "Creatina monohidrato pura al 99.9%, micronizada para mejor absorción. Aumenta la fuerza, potencia y masa muscular. Sin sabor, fácil de mezclar.",
    price: 85.9,
    image: "https://via.placeholder.com/300x300/FF6B35/FFFFFF?text=Creatina",
    category: "creatine",
    stock: 30,
    rating: 4.7,
    reviews: [],
    brand: "Universal Nutrition",
    featured: true,
  },
  {
    id: 3,
    name: "Hydroxycut Hardcore Elite",
    description:
      "Quemador de grasa termogénico avanzado con cafeína y extractos naturales. Ayuda a acelerar el metabolismo y aumentar la energía durante los entrenamientos.",
    price: 125.75,
    image: "https://via.placeholder.com/300x300/FF0000/FFFFFF?text=Fat+Burner",
    category: "fat-burner",
    stock: 15,
    rating: 4.3,
    reviews: [],
    brand: "MuscleTech",
    bestSeller: true,
  },
  {
    id: 4,
    name: "Multivitamínico Animal Pak",
    description:
      "Complejo vitamínico completo diseñado para atletas. Contiene vitaminas, minerales, aminoácidos y antioxidantes esenciales para el rendimiento deportivo.",
    price: 145.2,
    image: "https://via.placeholder.com/300x300/00AA44/FFFFFF?text=Vitaminas",
    category: "vitamins",
    stock: 20,
    rating: 4.6,
    reviews: [],
    brand: "Universal Animal",
  },
  {
    id: 5,
    name: "Whey Protein Isolate Zero",
    description:
      "Proteína aislada de suero sin lactosa, carbohidratos ni grasas. Perfecta para dietas de definición. Absorción rápida y excelente sabor.",
    price: 195.0,
    image:
      "https://via.placeholder.com/300x300/FFBF00/000000?text=Protein+Zero",
    category: "protein",
    stock: 18,
    rating: 4.9,
    reviews: [],
    brand: "Dymatize",
    featured: true,
  },
];

export const categories = [
  { id: "protein", name: "Proteínas", icon: "💪" },
  { id: "creatine", name: "Creatina", icon: "⚡" },
  { id: "fat-burner", name: "Quemadores", icon: "🔥" },
  { id: "vitamins", name: "Vitaminas", icon: "🌟" },
];

export const gymLocations = [
  {
    id: "main-gym",
    name: "Stylo Fitness - Sede Principal",
    address: "Av. Revolución 1234, Col. Centro, Ciudad",
    phone: "+52 55 1234-5678",
  },
  {
    id: "branch-gym",
    name: "Stylo Fitness - Sucursal Norte",
    address: "Blvd. Norte 567, Col. Moderna, Ciudad",
    phone: "+52 55 8765-4321",
  },
];
