export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent?: Category | null;
  children?: Category[];
  products?: Product[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface ProductConnection {
  edges: Product[];
  totalCount: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  user: User;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  id: string;
  user: User;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  user: User;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  address: string;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface ProductFilterInput {
  search?: string;
  categoryId?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}
