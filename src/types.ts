export type Role = 'admin' | 'staff' | 'rider' | 'customer' | 'supplier';

export interface User {
  id: string;
  role: Role;
  fullName: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  preferences: {
    favoriteFlowers: string[];
    allergicTo: string[];
    anniversaries: { name: string; date: string }[];
  };
}

export interface Flower {
  id: string;
  name: string;
  category: string; // Rose, Lily, Carnation, Orchid, Hydrangea, Daisy, Eucalyptus, etc.
  origin: string; // e.g. Cameron Highlands, Kundasang
  seasonalMonths: number[]; // e.g. [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  basePricePerStem: number;
  freshnessDurationDays: number;
  color: string;
  imageUrl?: string;
}

export interface InventoryItem {
  id: string;
  flowerId: string;
  flowerName: string;
  currentStock: number;
  incomingStock: number;
  reservedStock: number;
  soldStock: number;
  damagedStock: number;
  arrivalDate: string; // ISO date string
  expiryDate: string; // ISO date string
  warehouseLocation: string; // e.g., "Row A - Shelf 2"
  barcode: string; // e.g., "ANA-ROS-001"
}

export interface BouquetItem {
  flower: Flower;
  stemsCount: number;
  color: string;
}

export interface BouquetProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'Wedding' | 'Corporate' | 'Funeral' | 'Graduation' | 'Birthday' | 'Anniversary' | 'Subscription' | 'Same Day';
  isCustom?: boolean;
  freshnessScore: number; // calculated freshness score e.g., 95
  estimatedVaseLifeDays: number; // e.g., 7-9
}

export interface CartItem {
  id: string; // can be bouquet id or custom bouquet configuration id
  product: BouquetProduct;
  quantity: number;
  customization?: {
    primaryFlower: string;
    flowerColor: string;
    wrapping: string;
    ribbon: string;
    greetingCard: {
      recipient: string;
      sender: string;
      message: string;
    };
    addOns: {
      chocolate: boolean;
      balloon: boolean;
      bear: boolean;
      perfume: boolean;
    };
  };
}

export interface Supplier {
  id: string;
  name: string;
  location: string; // e.g., Brinchang, Cameron Highlands
  contactPerson: string;
  email: string;
  phone: string;
  leadTimeDays: number;
  seasonalityNotes: string;
  moq: number; // Minimum Order Quantity
}

export interface SupplierFlower {
  supplierId: string;
  flowerId: string;
  price: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: {
    flowerId: string;
    flowerName: string;
    quantity: number;
    pricePerStem: number;
    subtotal: number;
  }[];
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Shipped' | 'Received';
  createdAt: string;
  expectedDeliveryDate: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    customization?: CartItem['customization'];
  }[];
  totalAmount: number;
  paymentMethod: 'FPX' | 'DuitNow' | 'Stripe' | 'ToyyibPay';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  status: 'Pending' | 'Preparing' | 'Quality Inspection' | 'Out for Delivery' | 'Delivered';
  deliveryAddress: string;
  deliveryLatLng: { lat: number; lng: number };
  scheduledAt: string;
  freshnessScoreAtDelivery: number;
  bloomMemoryUrl?: string; // photo/video/voice URL
  riderName?: string;
  riderPhone?: string;
  otpVerified?: boolean;
  riderLatLng?: { lat: number; lng: number };
  createdAt: string;
  rating?: number;
  reviewComment?: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  targetSegment: string;
  channel: 'Email' | 'WhatsApp' | 'SMS';
  content: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
  sentAt?: string;
}

export interface DailyMetrics {
  date: string;
  sales: number;
  revenue: number;
  profit: number;
  wasteCount: number;
  wasteCost: number;
  deliveryOnTimeRate: number;
  customerSatisfaction: number;
}
