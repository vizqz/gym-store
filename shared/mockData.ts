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
  {
    id: 4,
    user: "Ana L.",
    comment:
      "La mejor creatina que he probado, resultados desde la primera semana.",
    rating: 5,
    date: "2024-01-20",
  },
  {
    id: 5,
    user: "Roberto V.",
    comment: "Perfecto para aumentar energía, muy recomendable.",
    rating: 4,
    date: "2024-01-18",
  },
  {
    id: 6,
    user: "Carmen R.",
    comment: "Excelente quemador, he visto resultados en 3 semanas.",
    rating: 5,
    date: "2024-01-25",
  },
  {
    id: 7,
    user: "Diego F.",
    comment: "Las vitaminas más completas, me siento con más energía.",
    rating: 4,
    date: "2024-01-22",
  },
  {
    id: 8,
    user: "Lucía M.",
    comment: "Proteína sin lactosa perfecta para mi dieta, sabor increíble.",
    rating: 5,
    date: "2024-01-30",
  },
];

export const mockProducts: Product[] = [
  // PROTEINS
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
    reviews: [mockReviews[0], mockReviews[1]],
    brand: "Optimum Nutrition",
    featured: true,
    bestSeller: true,
  },
  {
    id: 2,
    name: "Whey Protein Isolate Zero",
    description:
      "Proteína aislada de suero sin lactosa, carbohidratos ni grasas. Perfecta para dietas de definición. Absorción rápida y excelente sabor.",
    price: 195.0,
    image:
      "https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Isolate+Zero",
    category: "protein",
    stock: 18,
    rating: 4.9,
    reviews: [mockReviews[7]],
    brand: "Dymatize",
    featured: true,
  },
  {
    id: 3,
    name: "Casein Protein Nocturna",
    description:
      "Proteína de caseína de absorción lenta, ideal para tomar antes de dormir. Proporciona aminoácidos durante toda la noche para la recuperación muscular.",
    price: 175.9,
    image:
      "https://via.placeholder.com/300x300/8E44AD/FFFFFF?text=Casein+Protein",
    category: "protein",
    stock: 22,
    rating: 4.6,
    reviews: [mockReviews[2]],
    brand: "MuscleTech",
  },
  {
    id: 4,
    name: "Plant Protein Vegana",
    description:
      "Proteína vegetal a base de guisantes y arroz. Perfecta para veganos y vegetarianos. Rico en aminoácidos esenciales y fácil digestión.",
    price: 165.0,
    image:
      "https://via.placeholder.com/300x300/2ECC71/FFFFFF?text=Plant+Protein",
    category: "protein",
    stock: 16,
    rating: 4.4,
    reviews: [],
    brand: "Vega Sport",
  },
  {
    id: 5,
    name: "Mass Gainer Extreme",
    description:
      "Ganador de peso con 50g de proteína y carbohidratos complejos. Ideal para aumentar masa muscular y peso corporal de forma saludable.",
    price: 225.0,
    image: "https://via.placeholder.com/300x300/E74C3C/FFFFFF?text=Mass+Gainer",
    category: "protein",
    stock: 12,
    rating: 4.7,
    reviews: [],
    brand: "BSN",
    bestSeller: true,
  },

  // CREATINE
  {
    id: 6,
    name: "Creatina Monohidrato Micronizada",
    description:
      "Creatina monohidrato pura al 99.9%, micronizada para mejor absorción. Aumenta la fuerza, potencia y masa muscular. Sin sabor, fácil de mezclar.",
    price: 85.9,
    image:
      "https://via.placeholder.com/300x300/FF6B35/FFFFFF?text=Creatina+Mono",
    category: "creatine",
    stock: 30,
    rating: 4.7,
    reviews: [mockReviews[3], mockReviews[4]],
    brand: "Universal Nutrition",
    featured: true,
  },
  {
    id: 7,
    name: "Creatina HCL Ultra",
    description:
      "Creatina HCL de nueva generación con mejor solubilidad y absorción. No requiere fase de carga y reduce la retención de agua.",
    price: 125.75,
    image:
      "https://via.placeholder.com/300x300/9B59B6/FFFFFF?text=Creatina+HCL",
    category: "creatine",
    stock: 18,
    rating: 4.6,
    reviews: [],
    brand: "Kaged Muscle",
  },
  {
    id: 8,
    name: "Creatina Alkalyn Buffered",
    description:
      "Creatina con pH balanceado que no se convierte en creatinina en el estómago. Máxima absorción y eficacia sin efectos secundarios.",
    price: 110.5,
    image: "https://via.placeholder.com/300x300/1ABC9C/FFFFFF?text=Alkalyn",
    category: "creatine",
    stock: 24,
    rating: 4.5,
    reviews: [],
    brand: "EFX Sports",
  },
  {
    id: 9,
    name: "Creatina Magna Power",
    description:
      "Creatina quelada con magnesio para mejor absorción celular. Aumenta la fuerza y resistencia muscular de forma más eficiente.",
    price: 135.0,
    image: "https://via.placeholder.com/300x300/F39C12/000000?text=Magna+Power",
    category: "creatine",
    stock: 15,
    rating: 4.8,
    reviews: [],
    brand: "Albion Minerals",
    featured: true,
  },

  // FAT-BURNERS
  {
    id: 10,
    name: "Hydroxycut Hardcore Elite",
    description:
      "Quemador de grasa termogénico avanzado con cafeína y extractos naturales. Ayuda a acelerar el metabolismo y aumentar la energía durante los entrenamientos.",
    price: 145.75,
    image: "https://via.placeholder.com/300x300/E74C3C/FFFFFF?text=Hydroxycut",
    category: "fat-burner",
    stock: 15,
    rating: 4.3,
    reviews: [mockReviews[5]],
    brand: "MuscleTech",
    bestSeller: true,
  },
  {
    id: 11,
    name: "L-Carnitina Líquida",
    description:
      "L-Carnitina en forma líquida para mejor absorción. Ayuda en la utilización de grasas como fuente de energía y mejora el rendimiento cardiovascular.",
    price: 89.9,
    image: "https://via.placeholder.com/300x300/3498DB/FFFFFF?text=L-Carnitina",
    category: "fat-burner",
    stock: 28,
    rating: 4.4,
    reviews: [],
    brand: "Applied Nutrition",
  },
  {
    id: 12,
    name: "CLA Softgels",
    description:
      "Ácido linoleico conjugado en cápsulas blandas. Ayuda a reducir la grasa corporal mientras mantiene la masa muscular magra.",
    price: 75.5,
    image:
      "https://via.placeholder.com/300x300/27AE60/FFFFFF?text=CLA+Softgels",
    category: "fat-burner",
    stock: 35,
    rating: 4.2,
    reviews: [],
    brand: "Dymatize",
  },
  {
    id: 13,
    name: "Lipo-6 Black Intense",
    description:
      "Quemador de grasa ultra concentrado con fórmula avanzada. Proporciona energía extrema y acelera la pérdida de grasa de forma intensa.",
    price: 165.0,
    image:
      "https://via.placeholder.com/300x300/2C3E50/FFFFFF?text=Lipo-6+Black",
    category: "fat-burner",
    stock: 12,
    rating: 4.6,
    reviews: [],
    brand: "Nutrex Research",
    featured: true,
  },

  // VITAMINS
  {
    id: 14,
    name: "Multivitam��nico Animal Pak",
    description:
      "Complejo vitamínico completo diseñado para atletas. Contiene vitaminas, minerales, aminoácidos y antioxidantes esenciales para el rendimiento deportivo.",
    price: 145.2,
    image: "https://via.placeholder.com/300x300/F39C12/000000?text=Animal+Pak",
    category: "vitamins",
    stock: 20,
    rating: 4.6,
    reviews: [mockReviews[6]],
    brand: "Universal Animal",
  },
  {
    id: 15,
    name: "Vitamina D3 + K2",
    description:
      "Combinación sinérgica de Vitamina D3 y K2 para la salud ósea, sistema inmunológico y absorción de calcio. Esencial para atletas.",
    price: 65.9,
    image: "https://via.placeholder.com/300x300/F1C40F/000000?text=D3+K2",
    category: "vitamins",
    stock: 35,
    rating: 4.5,
    reviews: [],
    brand: "Life Extension",
  },
  {
    id: 16,
    name: "Omega-3 Fish Oil",
    description:
      "Aceite de pescado rico en EPA y DHA. Apoya la salud cardiovascular, cerebral y reduce la inflamación post-entrenamiento.",
    price: 89.75,
    image: "https://via.placeholder.com/300x300/3498DB/FFFFFF?text=Omega-3",
    category: "vitamins",
    stock: 25,
    rating: 4.7,
    reviews: [],
    brand: "Nordic Naturals",
    featured: true,
  },
  {
    id: 17,
    name: "Vitamina C + Zinc",
    description:
      "Combinación poderosa para fortalecer el sistema inmunológico. Esencial para la recuperación muscular y protección antioxidante.",
    price: 45.5,
    image: "https://via.placeholder.com/300x300/E67E22/FFFFFF?text=Vit+C+Zinc",
    category: "vitamins",
    stock: 40,
    rating: 4.4,
    reviews: [],
    brand: "NOW Foods",
  },
  {
    id: 18,
    name: "Complejo B + Energía",
    description:
      "Vitaminas del complejo B con cofactores energéticos. Mejora el metabolismo energético y reduce la fatiga durante entrenamientos intensos.",
    price: 55.9,
    image: "https://via.placeholder.com/300x300/9B59B6/FFFFFF?text=Complejo+B",
    category: "vitamins",
    stock: 30,
    rating: 4.3,
    reviews: [],
    brand: "Solgar",
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

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Roberto Administrador",
    email: "admin@stylofit.com",
    password: "admin123",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "María Empleada",
    email: "worker@stylofit.com",
    password: "worker123",
    role: "worker",
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: 3,
    name: "Carlos Cliente",
    email: "customer@stylofit.com",
    password: "customer123",
    role: "customer",
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: 4,
    name: "Ana Supervisora",
    email: "supervisor@stylofit.com",
    password: "super123",
    role: "worker",
    createdAt: "2024-01-20T00:00:00Z",
  },
  {
    id: 5,
    name: "Diego Vendedor",
    email: "vendedor@stylofit.com",
    password: "vendedor123",
    role: "worker",
    createdAt: "2024-02-10T00:00:00Z",
  },
];

export const mockOrders: Order[] = [
  {
    id: 1,
    items: [
      { productId: 1, quantity: 2 },
      { productId: 10, quantity: 1 },
    ],
    customerName: "Juan Pérez",
    customerPhone: "+51 987 654 321",
    customerAddress: "Av. Lima 123, San Isidro",
    deliveryMethod: "delivery",
    location: "main-gym",
    total: 524.75,
    status: "delivered",
    date: "2024-12-01T10:30:00Z",
  },
  {
    id: 2,
    items: [
      { productId: 6, quantity: 1 },
      { productId: 14, quantity: 1 },
    ],
    customerName: "María García",
    customerPhone: "+51 987 123 456",
    customerAddress: "Jr. Cusco 456, Miraflores",
    deliveryMethod: "pickup",
    location: "branch-gym",
    total: 231.1,
    status: "confirmed",
    date: "2024-12-02T14:15:00Z",
  },
  {
    id: 3,
    items: [{ productId: 2, quantity: 1 }],
    customerName: "Carlos López",
    customerPhone: "+51 987 789 012",
    customerAddress: "Av. Arequipa 789, San Borja",
    deliveryMethod: "delivery",
    location: "main-gym",
    total: 195.0,
    status: "pending",
    date: "2024-12-03T09:00:00Z",
  },
  {
    id: 4,
    items: [
      { productId: 5, quantity: 1 },
      { productId: 11, quantity: 2 },
    ],
    customerName: "Ana Rodríguez",
    customerPhone: "+51 987 321 654",
    customerAddress: "Calle Los Olivos 456, Surco",
    deliveryMethod: "delivery",
    location: "main-gym",
    total: 374.8,
    status: "confirmed",
    date: "2024-12-04T11:20:00Z",
  },
  {
    id: 5,
    items: [
      { productId: 16, quantity: 1 },
      { productId: 17, quantity: 2 },
    ],
    customerName: "Roberto Silva",
    customerPhone: "+51 987 456 789",
    customerAddress: "Av. Brasil 789, Pueblo Libre",
    deliveryMethod: "pickup",
    location: "branch-gym",
    total: 180.75,
    status: "delivered",
    date: "2024-12-05T16:45:00Z",
  },
  {
    id: 6,
    items: [
      { productId: 7, quantity: 1 },
      { productId: 13, quantity: 1 },
    ],
    customerName: "Lucia Mendoza",
    customerPhone: "+51 987 654 987",
    customerAddress: "Jr. Junín 321, Centro de Lima",
    deliveryMethod: "delivery",
    location: "main-gym",
    total: 290.75,
    status: "pending",
    date: "2024-12-06T08:30:00Z",
  },
];

export const mockStats: DashboardStats = {
  totalSales: 2487.95,
  monthlyRevenue: 1756.15,
  totalOrders: 6,
  mostSoldProducts: [
    { product: mockProducts[0], totalSold: 68 },
    { product: mockProducts[9], totalSold: 45 },
    { product: mockProducts[5], totalSold: 42 },
    { product: mockProducts[1], totalSold: 38 },
    { product: mockProducts[13], totalSold: 35 },
  ],
};
