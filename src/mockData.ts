import { Flower, BouquetProduct, Supplier, InventoryItem, Order, DailyMetrics, User } from './types';

export const mockFlowers: Flower[] = [
  {
    id: 'fl-1',
    name: 'Cameron Red Rose',
    category: 'Rose',
    origin: 'Cameron Highlands',
    seasonalMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    basePricePerStem: 4.5,
    freshnessDurationDays: 10,
    color: 'Red',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'fl-2',
    name: 'Cameron Blush Rose',
    category: 'Rose',
    origin: 'Cameron Highlands',
    seasonalMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    basePricePerStem: 4.8,
    freshnessDurationDays: 10,
    color: 'Pink',
    imageUrl: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'fl-3',
    name: 'Kundasang White Lily',
    category: 'Lily',
    origin: 'Kundasang, Sabah',
    seasonalMonths: [3, 4, 5, 6, 7, 8, 9, 10],
    basePricePerStem: 8.5,
    freshnessDurationDays: 12,
    color: 'White',
    imageUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'fl-4',
    name: 'Cameron Yellow Carnation',
    category: 'Carnation',
    origin: 'Cameron Highlands',
    seasonalMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    basePricePerStem: 2.5,
    freshnessDurationDays: 14,
    color: 'Yellow',
    imageUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'fl-5',
    name: 'Sabah Blue Hydrangea',
    category: 'Hydrangea',
    origin: 'Kundasang, Sabah',
    seasonalMonths: [4, 5, 6, 7, 8, 9],
    basePricePerStem: 12.0,
    freshnessDurationDays: 7,
    color: 'Blue',
    imageUrl: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'fl-6',
    name: 'Cameron Purple Orchid',
    category: 'Orchid',
    origin: 'Cameron Highlands',
    seasonalMonths: [1, 2, 3, 4, 10, 11, 12],
    basePricePerStem: 15.0,
    freshnessDurationDays: 18,
    color: 'Purple',
    imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'fl-7',
    name: 'Eucalyptus Leaf',
    category: 'Foliage',
    origin: 'Cameron Highlands',
    seasonalMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    basePricePerStem: 1.8,
    freshnessDurationDays: 20,
    color: 'Green',
    imageUrl: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'fl-8',
    name: 'Baby Breath',
    category: 'Foliage',
    origin: 'Cameron Highlands',
    seasonalMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    basePricePerStem: 2.0,
    freshnessDurationDays: 12,
    color: 'White',
    imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=300&q=80'
  }
];

export const mockBouquets: BouquetProduct[] = [
  {
    id: 'bq-1',
    name: 'Kinabalu Sunrise Bouquet',
    description: 'An elegant premium arrangement of Cameron blush roses and Kundasang white lilies, accented with baby breath and silver eucalyptus. Represents optimism, grace, and heartfelt love.',
    price: 185.00,
    imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80',
    category: 'Anniversary',
    freshnessScore: 92,
    estimatedVaseLifeDays: 9
  },
  {
    id: 'bq-2',
    name: 'Kundasang Mist Hydrangea',
    description: 'Luxurious Sabah blue hydrangeas paired with white roses. Features a gorgeous glassmorphic wrap and gold ribbon accent. Highly popular for modern elegant gifting.',
    price: 210.00,
    imageUrl: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=600&q=80',
    category: 'Birthday',
    freshnessScore: 88,
    estimatedVaseLifeDays: 6
  },
  {
    id: 'bq-3',
    name: 'Sabah Classic Crimson',
    description: 'A striking traditional arrangement of 12 premium Cameron Red Roses cradled in eco-friendly minimalist charcoal craft wrap. A timeless gesture of romantic passion.',
    price: 145.00,
    imageUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=600&q=80',
    category: 'Same Day',
    freshnessScore: 95,
    estimatedVaseLifeDays: 8
  },
  {
    id: 'bq-4',
    name: 'Royal Orchid Opulence',
    description: 'An premium corporate display featuring majestic Cameron purple orchids, pristine white carnations, and vibrant greenery. Ideal for hotel lobbies, corporate spaces, or grand openings.',
    price: 380.00,
    imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=80',
    category: 'Corporate',
    freshnessScore: 98,
    estimatedVaseLifeDays: 15
  },
  {
    id: 'bq-5',
    name: 'Graceful Sunset Lily',
    description: 'Gentle white Kundasang lilies nestled amongst yellow carnations and lush greens. Wrapped in soft cream silk paper, symbolizing peace, remembrance, and comfort.',
    price: 160.00,
    imageUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=600&q=80',
    category: 'Funeral',
    freshnessScore: 90,
    estimatedVaseLifeDays: 10
  },
  {
    id: 'bq-6',
    name: 'Sabah Harvest Joy',
    description: 'Inspired by the vibrant colors of the Kaamatan Festival. A warm, playful mixture of sunflowers, yellow carnations, and eucalyptus, bound with premium organic rustic jute wrapper.',
    price: 125.00,
    imageUrl: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=600&q=80',
    category: 'Graduation',
    freshnessScore: 94,
    estimatedVaseLifeDays: 8
  },
  {
    id: 'bq-7',
    name: 'Elegance Bridal Cascade',
    description: 'A spectacular cascade wedding bouquet including premium white lilies, soft pink blush roses, and cascading baby breath. Bound with premium raw silk trailing ribbons.',
    price: 450.00,
    imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80',
    category: 'Wedding',
    freshnessScore: 91,
    estimatedVaseLifeDays: 8
  },
  {
    id: 'bq-8',
    name: 'Weekly Serenity Club',
    description: 'A fresh curation of seasonal blossoms delivered weekly. Direct from Cameron Highlands farms to your vase. Perfect for homes, cafes, and boutique reception desks.',
    price: 85.00, // weekly subscription
    imageUrl: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80',
    category: 'Subscription',
    freshnessScore: 100,
    estimatedVaseLifeDays: 11
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Cameron Highlands Highlands Flora',
    location: 'Brinchang, Cameron Highlands, Pahang',
    contactPerson: 'Leong Siew Kuan',
    email: 'orders@camhighlandsflora.com',
    phone: '+6015-4829103',
    leadTimeDays: 2,
    seasonalityNotes: 'Excellent roses and carnations year-round. Lily supply slightly reduced during rainy months (Nov-Jan).',
    moq: 100
  },
  {
    id: 'sup-2',
    name: 'Kinabalu Highland Orchids & Lilies',
    location: 'Kundasang, Ranau, Sabah',
    contactPerson: 'Aziliana Ying',
    email: 'kundasangbloom@sabahflora.org',
    phone: '+6088-883921',
    leadTimeDays: 1,
    seasonalityNotes: 'Exceptional lilies, hydrangeas, and foliage grown locally under Mt. Kinabalu mountain breeze.',
    moq: 50
  }
];

export const mockInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    flowerId: 'fl-1',
    flowerName: 'Cameron Red Rose',
    currentStock: 350,
    incomingStock: 200,
    reservedStock: 80,
    soldStock: 420,
    damagedStock: 15,
    arrivalDate: '2026-07-16T08:00:00Z',
    expiryDate: '2026-07-26T08:00:00Z',
    warehouseLocation: 'Cold Room A - Row 1',
    barcode: 'ANA-ROS-RED-01'
  },
  {
    id: 'inv-2',
    flowerId: 'fl-2',
    flowerName: 'Cameron Blush Rose',
    currentStock: 180,
    incomingStock: 150,
    reservedStock: 50,
    soldStock: 290,
    damagedStock: 8,
    arrivalDate: '2026-07-17T09:30:00Z',
    expiryDate: '2026-07-27T09:30:00Z',
    warehouseLocation: 'Cold Room A - Row 2',
    barcode: 'ANA-ROS-PNK-02'
  },
  {
    id: 'inv-3',
    flowerId: 'fl-3',
    flowerName: 'Kundasang White Lily',
    currentStock: 95,
    incomingStock: 100,
    reservedStock: 30,
    soldStock: 140,
    damagedStock: 5,
    arrivalDate: '2026-07-18T07:15:00Z',
    expiryDate: '2026-07-30T07:15:00Z',
    warehouseLocation: 'Cold Room B - Row 1',
    barcode: 'ANA-LIL-WHT-03'
  },
  {
    id: 'inv-4',
    flowerId: 'fl-4',
    flowerName: 'Cameron Yellow Carnation',
    currentStock: 450,
    incomingStock: 300,
    reservedStock: 110,
    soldStock: 530,
    damagedStock: 25,
    arrivalDate: '2026-07-15T11:00:00Z',
    expiryDate: '2026-07-29T11:00:00Z',
    warehouseLocation: 'Cold Room B - Row 2',
    barcode: 'ANA-CAR-YLW-04'
  },
  {
    id: 'inv-5',
    flowerId: 'fl-5',
    flowerName: 'Sabah Blue Hydrangea',
    currentStock: 40,
    incomingStock: 60,
    reservedStock: 15,
    soldStock: 90,
    damagedStock: 12,
    arrivalDate: '2026-07-18T07:30:00Z',
    expiryDate: '2026-07-25T07:30:00Z',
    warehouseLocation: 'Cold Room C - Row 1',
    barcode: 'ANA-HYD-BLU-05'
  }
];

export const mockUsers: User[] = [
  {
    id: 'usr-1',
    role: 'customer',
    fullName: 'Fariz Hamdi',
    email: 'farizhamdi@gmail.com',
    phone: '+6012-8392104',
    loyaltyPoints: 340,
    preferences: {
      favoriteFlowers: ['Lily', 'Rose'],
      allergicTo: [],
      anniversaries: [
        { name: 'Wife\'s Birthday', date: '08-15' },
        { name: 'Wedding Anniversary', date: '10-22' }
      ]
    }
  },
  {
    id: 'usr-admin',
    role: 'admin',
    fullName: 'Aziliana Ying',
    email: 'ana@anasgarden.com.my',
    phone: '+6011-239485',
    loyaltyPoints: 0,
    preferences: {
      favoriteFlowers: ['Orchid', 'Lily'],
      allergicTo: [],
      anniversaries: []
    }
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'ANA-2026-07001',
    customerId: 'usr-1',
    customerName: 'Fariz Hamdi',
    customerEmail: 'farizhamdi@gmail.com',
    customerPhone: '+6012-8392104',
    items: [
      {
        productId: 'bq-1',
        productName: 'Kinabalu Sunrise Bouquet',
        quantity: 1,
        price: 185.00,
        customization: {
          primaryFlower: 'Cameron Blush Rose',
          flowerColor: 'Pink',
          wrapping: 'Soft Silk Wrapper',
          ribbon: 'Brilliant Gold Ribbon',
          greetingCard: {
            recipient: 'Sarah',
            sender: 'Fariz',
            message: 'To my dearest, Happy Wedding Anniversary! You are my eternal sunrise. Handcrafted for you with love.'
          },
          addOns: {
            chocolate: true,
            balloon: false,
            bear: true,
            perfume: false
          }
        }
      }
    ],
    totalAmount: 185.00,
    paymentMethod: 'FPX',
    paymentStatus: 'Paid',
    status: 'Delivered',
    deliveryAddress: 'Unit 3-12, Peak Vista Block A, Tanjung Lipat, 88400 Kota Kinabalu, Sabah',
    deliveryLatLng: { lat: 5.9922, lng: 116.0888 },
    scheduledAt: '2026-07-18T10:00:00Z',
    freshnessScoreAtDelivery: 96,
    bloomMemoryUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80',
    riderName: 'Ferry bin Herman',
    riderPhone: '+6019-8837264',
    otpVerified: true,
    createdAt: '2026-07-18T08:15:00Z',
    rating: 5,
    reviewComment: 'Absolutely stunning arrangement! The Cameron Highlands freshness score was 96%, and they still smell amazing.'
  },
  {
    id: 'ord-2',
    orderNumber: 'ANA-2026-07002',
    customerId: 'usr-1',
    customerName: 'Fariz Hamdi',
    customerEmail: 'farizhamdi@gmail.com',
    customerPhone: '+6012-8392104',
    items: [
      {
        productId: 'bq-2',
        productName: 'Kundasang Mist Hydrangea',
        quantity: 1,
        price: 210.00
      }
    ],
    totalAmount: 210.00,
    paymentMethod: 'DuitNow',
    paymentStatus: 'Paid',
    status: 'Out for Delivery',
    deliveryAddress: 'DoubleTree Hilton, Jalan Tunku Abdul Rahman, 88100 Kota Kinabalu, Sabah',
    deliveryLatLng: { lat: 5.9750, lng: 116.0725 },
    scheduledAt: '2026-07-18T22:30:00Z',
    freshnessScoreAtDelivery: 92,
    riderName: 'Amiruddin S',
    riderPhone: '+6014-9988123',
    riderLatLng: { lat: 5.9782, lng: 116.0768 },
    createdAt: '2026-07-18T19:30:00Z'
  }
];

export const mockDailyMetrics: DailyMetrics[] = [
  { date: '07-12', sales: 12, revenue: 2150, profit: 950, wasteCount: 15, wasteCost: 67, deliveryOnTimeRate: 0.95, customerSatisfaction: 4.8 },
  { date: '07-13', sales: 15, revenue: 2780, profit: 1210, wasteCount: 10, wasteCost: 45, deliveryOnTimeRate: 0.96, customerSatisfaction: 4.9 },
  { date: '07-14', sales: 18, revenue: 3200, profit: 1420, wasteCount: 22, wasteCost: 99, deliveryOnTimeRate: 0.94, customerSatisfaction: 4.7 },
  { date: '07-15', sales: 24, revenue: 4100, profit: 1850, wasteCount: 8, wasteCost: 36, deliveryOnTimeRate: 0.98, customerSatisfaction: 4.9 },
  { date: '07-16', sales: 30, revenue: 5400, profit: 2450, wasteCount: 12, wasteCost: 54, deliveryOnTimeRate: 1.00, customerSatisfaction: 5.0 },
  { date: '07-17', sales: 22, revenue: 3950, profit: 1780, wasteCount: 18, wasteCost: 81, deliveryOnTimeRate: 0.97, customerSatisfaction: 4.8 },
  { date: '07-18', sales: 28, revenue: 4980, profit: 2240, wasteCount: 5, wasteCost: 22, deliveryOnTimeRate: 0.99, customerSatisfaction: 4.9 }
];

export const mockHolidays = [
  { name: 'Sabah Kaamatan Festival (Harvest Festival)', date: 'May 30 - 31', weight: 4.5, demandFlower: 'Sunflowers & Gerberas (Yellow/Warm theme)' },
  { name: 'Hari Raya Aidilfitri', date: 'Varies', weight: 3.5, demandFlower: 'Lilies & Orchids (White/Green themes)' },
  { name: 'Chinese New Year', date: 'Varies', weight: 4.0, demandFlower: 'Red Roses & Orchids (Red/Gold themes)' },
  { name: 'Valentine\'s Day', date: 'Feb 14', weight: 5.0, demandFlower: 'Cameron Red Roses (Premium Red themed)' },
  { name: 'Mother\'s Day', date: 'May 10', weight: 4.8, demandFlower: 'Carnations & Pink Hydrangeas' },
  { name: 'Graduation Season (Sabah Universities - UMS)', date: 'November', weight: 3.8, demandFlower: 'Mixed bright Bouquets with Baby Breath' },
  { name: 'Sabah Governor\'s Birthday', date: 'October 3', weight: 2.2, demandFlower: 'Orchids & Premium Lilies for Corporate' }
];
