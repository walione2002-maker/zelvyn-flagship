export type Gender = "boys" | "girls" | "unisex";

export type Category = "casual" | "formal" | "sports" | "slippers";

export type SubType =
  | "Sneakers"
  | "Joggers"
  | "Loafers"
  | "Formal Shoes"
  | "Grippers"
  | "Sports Shoes"
  | "Slippers"
  | "Crocs";

export type BadgeType = "NEW DROP" | "BESTSELLER" | "50% OFF" | "LIMITED" | null;

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductSpecs {
  upper: string;
  sole: string;
  lining: string;
  fit: string;
  weight: string;
  origin: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  gender: Gender;
  category: Category;
  subType: SubType;
  pricePKR: number;
  originalPricePKR?: number;
  badge: BadgeType;
  sizes: number[];
  colors: ProductColor[];
  description: string;
  specs: ProductSpecs;
  rating: number;
  reviewCount: number;
  image: string;
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  image: string;
  pricePKR: number;
  size: number;
  color: string;
  quantity: number;
}

export interface GuestUser {
  isLoggedIn: boolean;
  mode: "guest" | "member";
  fullName: string;
  phone: string;
  email: string;
  savedCity?: string;
  savedAddress?: string;
  loggedInAt: string;
}

export type PaymentMethod = "cod" | "card" | "wallet" | "bank";

export type OrderStage = 0 | 1 | 2 | 3;

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  statusStage: OrderStage;
  customer: OrderCustomer;
  paymentMethod: PaymentMethod;
  paymentSummary: string;
  items: CartItem[];
  subtotalPKR: number;
  discountPKR: number;
  shippingPKR: number;
  totalPKR: number;
  promoCode?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
}
