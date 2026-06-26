// Типы данных, соответствующие API BROX

export interface User {
  id: string;
  email: string;
  avatarId?: string | null;
  avatar?: UploadedFile | null;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  title?: string | null;
  description?: string | null;
  imageId?: string | null;
  image?: UploadedFile | null;
  createdAt: string;
  updatedAt: string;
}

export interface UploadedFile {
  id: string;
  bucketKey: string;
  url: string;
  mimeType: string;
  size: number;
  category: 'AVATAR' | 'PRODUCT_IMAGE' | 'CATEGORY_IMAGE' | 'ORDER_DOCUMENT' | 'QUOTE_ATTACHMENT' | 'BRANDING';
  fileName: string;
  userId?: string | null;
  productId?: string | null;
  orderId?: string | null;
  quoteId?: string | null;
  createdAt: string;
}

export interface Characteristic {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  type: 'SIMPLE' | 'CONFIGURATOR' | 'REQUEST_QUOTE';
  priceType: 'FIXED' | 'QUOTE';
  price: number | null;
  characteristics: Characteristic[] | null;
  article: string | null;
  isActive: boolean;
  categoryId: string;
  category: Category;
  images: UploadedFile[];
  attributes: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'CREATED'
  | 'PENDING'
  | 'PAID'
  | 'IN_PROGRESS'
  | 'SHIPPED'
  | 'DONE'
  | 'CANCELED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  documents?: UploadedFile[];
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  type: string;
  path: string | null;
  productId: string | null;
  userId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface EventStats {
  total: number;
  byType: { type: string; _count: number }[];
}

export interface LoginResponse {
  ok: boolean;
  token?: string;
  user?: User;
}

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  ordersByStatus: { status: OrderStatus; _count: number }[];
  recentOrders: Order[];
  recentEvents: Event[];
}