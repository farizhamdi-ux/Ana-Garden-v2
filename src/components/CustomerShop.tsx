import React, { useState } from 'react';
import { Sparkles, Star, ShoppingBag, Truck, Gift, RefreshCw, Calendar, Heart, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import { BouquetProduct, CartItem, Order } from '../types';
import { mockBouquets, mockFlowers } from '../mockData';

interface CustomerShopProps {
  onAddCustomBouquetToCart: (customItem: CartItem) => void;
  onPlaceOrder: (order: Order) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  loyaltyPoints: number;
  setLoyaltyPoints: React.Dispatch<React.SetStateAction<number>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function CustomerShop({
  onAddCustomBouquetToCart,
  onPlaceOrder,
  cart,
  setCart,
  loyaltyPoints,
  setLoyaltyPoints,
  activeTab,
  setActiveTab,
}: CustomerShopProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'success' | null>(null);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountApplied, setDiscountApplied] = useState<number>(0); // RM discount
  const [promoError, setPromoError] = useState<string>('');
  
  // Checkout Shipping Form
  const [address, setAddress] = useState('Unit 3-12, Peak Vista Block A, Tanjung Lipat, 88400 Kota Kinabalu, Sabah');
  const [phone, setPhone] = useState('+6012-8392104');
  const [recipientName, setRecipientName] = useState('Sarah J');
  const [selectedPayment, setSelectedPayment] = useState<'FPX' | 'DuitNow' | 'Stripe' | 'ToyyibPay'>('FPX');
  const [deliverySpeed, setDeliverySpeed] = useState<'Standard' | '90MinExpress'>('Standard');

  // Bloom Memories File upload
  const [uploadedMemory, setUploadedMemory] = useState<string>('');
  const [uploadingState, setUploadingState] = useState<boolean>(false);

  // Latest generated order (for receipt QR)
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const categories = [
    'All',
    'Anniversary',
    'Birthday',
    'Graduation',
    'Wedding',
    'Corporate',
    'Funeral',
    'Subscription',
    'Same Day'
  ];

  const filteredBouquets = selectedCategory === 'All'
    ? mockBouquets
    : mockBouquets.filter(bq => bq.category === selectedCategory);

  const addToCart = (product: BouquetProduct) => {
    const existing = cart.find(item => item.product.id === product.id && !item.customization);
    if (existing) {
      setCart(cart.map(item => 
        item.product.id === product.id && !item.customization
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: `cart-${Date.now()}-${product.id}`,
        product,
        quantity: 1
      }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(cart.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const applyPromo = () => {
    setPromoError('');
    if (promoCode.toUpperCase() === 'BLOOM26') {
      setDiscountApplied(15);
    } else if (promoCode.toUpperCase() === 'SABAHFRESH') {
      setDiscountApplied(25);
    } else {
      setPromoError('Invalid promo code. Try BLOOM26 (RM15 Off) or SABAHFRESH (RM25 Off)');
    }
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    if (deliverySpeed === '90MinExpress') return 25;
    return getSubtotal() > 150 ? 0 : 10;
  };

  const getTotal = () => {
    const total = getSubtotal() - discountApplied + getDeliveryFee();
    return Math.max(0, total);
  };

  const handleBloomMemoryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadingState(true);
    // Simulate upload delay
    setTimeout(() => {
      setUploadedMemory('https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80');
      setUploadingState(false);
    }, 1500);
  };

  const submitOrder = () => {
    const total = getTotal();
    const subtotal = getSubtotal();
    
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ANA-2026-07${Math.floor(100 + Math.random() * 900)}`,
      customerId: 'usr-1',
      customerName: 'Fariz Hamdi',
      customerEmail: 'farizhamdi@gmail.com',
      customerPhone: phone,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        customization: item.customization
      })),
      totalAmount: total,
      paymentMethod: selectedPayment,
      paymentStatus: 'Paid',
      status: 'Preparing',
      deliveryAddress: address,
      deliveryLatLng: { lat: 5.9750 + (Math.random() - 0.5) * 0.05, lng: 116.0725 + (Math.random() - 0.5) * 0.05 },
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      freshnessScoreAtDelivery: 95,
      bloomMemoryUrl: uploadedMemory || undefined,
      createdAt: new Date().toISOString()
    };

    // Award loyalty points: RM 1 = 1 point
    const pointsEarned = Math.floor(subtotal);
    setLoyaltyPoints(prev => prev + pointsEarned);

    onPlaceOrder(newOrder);
    setLastOrder(newOrder);
    setCart([]);
    setCheckoutStep('success');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans" id="shop-view">
      {/* Luxury Promo Banner */}
      <div className="relative mb-12 rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#FCF9F6] to-[#F5F2ED] border border-[#D4AF37]/20 p-8 md:p-14 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-4 py-1.5 bg-[#9CAF88]/10 text-[#9CAF88] text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6 w-fit">
            <Sparkles className="w-3.5 h-3.5 inline mr-1" /> FRESH FROM CAMERON HIGHLANDS
          </span>
          <h2 className="text-4xl md:text-6xl font-serif font-light italic mb-6 leading-[1.1] text-[#1A1A1A]">
            Handcrafted <br />
            <span className="text-[#D4AF37] font-serif not-italic font-bold tracking-tight">Emotions & Petals</span>
          </h2>
          <p className="text-sm md:text-base text-gray-500 mb-8 max-w-lg leading-relaxed">
            Experience the fusion of Sabah's local heritage and technology. Every premium bouquet displays an interactive **Freshness Score** and estimated vase life. Leverage our **AI Bouquet Concierge** to tell your story in petals.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab('builder')}
              className="bg-[#1A1A1A] hover:bg-[#D4AF37] text-white font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-full transition-colors duration-300 flex items-center gap-2 shadow-sm"
              id="hero-customize-btn"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Bespoke AI Designer
            </button>
            <button
              onClick={() => setSelectedCategory('Subscription')}
              className="bg-white hover:bg-gray-50 border border-[#D4AF37]/20 hover:border-[#D4AF37] text-gray-700 font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-full transition-all duration-300"
            >
              Weekly Subscription Club
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 md:opacity-30 bg-[url('https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1024')] bg-cover bg-center hidden md:block" />
      </div>

      {/* Main Grid: Products and Sidebar Cart */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Products Catalogue */}
        <div className="lg:col-span-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-[#1A1A1A] text-white shadow-sm'
                    : 'bg-white border border-gray-100 text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-50/50'
                }`}
                id={`cat-filter-${cat.toLowerCase().replace(' ', '-')}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Flowers Collection Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D4AF37]/10">
            <div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">{selectedCategory} Floral Arrangements</h3>
              <p className="text-xs text-gray-500 mt-1">Handcrafted in Sabah. Prices listed in Malaysian Ringgit (RM).</p>
            </div>
            <div className="text-[10px] uppercase tracking-wider font-bold bg-[#9CAF88]/10 text-[#9CAF88] px-4 py-2 rounded-full border border-[#9CAF88]/20 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-[#D4AF37] stroke-[#D4AF37]" />
              <span>Free Delivery above RM150</span>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredBouquets.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-[2.5rem] border border-[#D4AF37]/10 overflow-hidden shadow-xl shadow-gray-200/10 hover:shadow-2xl hover:border-[#D4AF37]/30 transition-all duration-500 flex flex-col"
                id={`product-card-${product.id}`}
              >
                {/* Product Image and badges */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Freshness Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-100 text-[10px] font-sans flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Freshness:</span>
                    <strong className="text-emerald-600 font-bold">{product.freshnessScore}%</strong>
                  </div>

                  {/* Vase Life Badge */}
                  <div className="absolute bottom-4 left-4 bg-[#1A1A1A]/85 backdrop-blur-sm px-3 py-1.5 rounded-xl text-white text-[9px] uppercase tracking-wider font-bold">
                    Est. Vase Life: {product.estimatedVaseLifeDays} Days
                  </div>

                  {/* Subscription special tag */}
                  {product.category === 'Subscription' && (
                    <div className="absolute top-4 right-4 bg-[#D4AF37] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                      Club Rate
                    </div>
                  )}
                </div>

                {/* Info and Purchase */}
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#9CAF88] mb-2">{product.category} Series</span>
                  <h4 className="text-lg font-serif font-bold text-gray-900 group-hover:text-[#D4AF37] transition-colors mb-2">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-6">
                    {product.description}
                  </p>
                  
                  {/* Price and Cart Button */}
                  <div className="mt-auto pt-4 border-t border-[#D4AF37]/10 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Price (KK Zone)</p>
                      <p className="text-lg font-serif font-bold text-gray-900">RM {product.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-[#1A1A1A] hover:bg-[#D4AF37] text-white p-3 rounded-full transition-colors duration-300 shadow-md shadow-black/5 hover:scale-105"
                      id={`add-to-cart-${product.id}`}
                      title="Add to basket"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Custom Sidebar Cart, Loyalty, & Checkout */}
        <div className="lg:col-span-1 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <h3 className="font-serif font-bold text-gray-900 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" /> Your Basket
            </h3>
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full font-medium text-gray-600">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>

          {/* Loyalty Points display */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-[#9CAF88]/10 to-[#D4AF37]/10 border border-[#D4AF37]/10 flex items-center justify-between text-xs">
            <div>
              <p className="text-gray-500 font-sans font-medium">Fariz's Bloom Rewards</p>
              <p className="text-base font-serif font-bold text-gray-800">{loyaltyPoints} Points</p>
            </div>
            <div className="bg-white/80 p-1.5 rounded-lg border border-gray-100">
              <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
            </div>
          </div>

          {/* Cart item list */}
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              <Gift className="w-8 h-8 text-[#D4AF37]/20 mx-auto mb-2 animate-pulse" />
              Your basket is empty.<br />Add a preset arrangement above or build custom blooms!
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-10 h-10 object-cover rounded-lg bg-gray-50"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-800 truncate">{item.product.name}</h5>
                    {item.customization ? (
                      <p className="text-[10px] text-[#9CAF88] font-medium">Bespoke custom composition</p>
                    ) : (
                      <p className="text-[10px] text-gray-400">Regular Bouquet</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="bg-gray-100 w-4 h-4 rounded flex items-center justify-center hover:bg-gray-200"
                      >-</button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="bg-gray-100 w-4 h-4 rounded flex items-center justify-center hover:bg-gray-200"
                      >+</button>
                      <span className="ml-auto font-semibold text-gray-800">RM{(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promo Code section */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="PROMO CODE (e.g. BLOOM26)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs uppercase focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                  <button
                    onClick={applyPromo}
                    className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-black font-semibold"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[10px] text-red-500 mt-1">{promoError}</p>}
                {discountApplied > 0 && (
                  <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Promotion Applied! Saved RM{discountApplied.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Totals Summary */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>RM{getSubtotal().toFixed(2)}</span>
                </div>
                {discountApplied > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-RM{discountApplied.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span className="flex items-center gap-1">
                    Delivery ({deliverySpeed === '90MinExpress' ? '90-Min' : 'Standard'})
                  </span>
                  <span>{getDeliveryFee() === 0 ? 'FREE' : `RM${getDeliveryFee().toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-gray-900 pt-2 border-t border-gray-50">
                  <span>Total</span>
                  <span>RM{getTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Order Checkout Button */}
              {checkoutStep === null ? (
                <button
                  onClick={() => setCheckoutStep('shipping')}
                  className="w-full bg-[#9CAF88] hover:bg-[#8FA07A] text-white py-3 rounded-xl text-xs font-semibold tracking-wide shadow-md transition-all mt-4"
                  id="checkout-btn"
                >
                  Proceed to Checkout
                </button>
              ) : (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-800">Checkout Progress</p>
                  
                  {/* Step Indicator */}
                  <div className="flex justify-between items-center text-[10px] text-gray-400 bg-gray-50 p-2 rounded-lg mb-2">
                    <span className={checkoutStep === 'shipping' ? 'text-[#9CAF88] font-bold' : ''}>1. Shipping</span>
                    <span>&rarr;</span>
                    <span className={checkoutStep === 'payment' ? 'text-[#9CAF88] font-bold' : ''}>2. Payment</span>
                  </div>

                  {checkoutStep === 'shipping' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">Recipient Name</label>
                        <input
                          type="text"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">Delivery Address (Kota Kinabalu)</label>
                        <textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs h-16"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">Recipient Phone Number</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">Delivery Speed</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setDeliverySpeed('Standard')}
                            className={`p-2 rounded-lg text-xs border ${deliverySpeed === 'Standard' ? 'border-[#9CAF88] bg-[#9CAF88]/10 font-bold' : 'border-gray-200'}`}
                          >
                            Standard (Today)
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeliverySpeed('90MinExpress')}
                            className={`p-2 rounded-lg text-xs border ${deliverySpeed === '90MinExpress' ? 'border-[#9CAF88] bg-[#9CAF88]/10 font-bold' : 'border-gray-200'}`}
                          >
                            90-Min Express
                          </button>
                        </div>
                      </div>

                      {/* Bloom Memories Feature */}
                      <div className="border border-dashed border-[#D4AF37]/30 rounded-xl p-3 bg-amber-50/50">
                        <p className="text-[10px] font-semibold text-gray-800 flex items-center gap-1">
                          <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" /> Attach a Bloom Memory? (QR Code)
                        </p>
                        <p className="text-[9px] text-gray-500 mb-2">Upload a video/voice message that prints as a QR on their card!</p>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleBloomMemoryUpload}
                          className="text-[10px] text-gray-500 block w-full file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-[#D4AF37]/10 file:text-[#a0811e] hover:file:bg-[#D4AF37]/20"
                        />
                        {uploadingState && <p className="text-[9px] text-gray-400 animate-pulse mt-1">Uploading and encoding cloud asset...</p>}
                        {uploadedMemory && <p className="text-[9px] text-emerald-600 font-medium mt-1">✓ Cloud storage file synchronized. QR enabled.</p>}
                      </div>

                      <button
                        onClick={() => setCheckoutStep('payment')}
                        className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-xs font-semibold"
                      >
                        Proceed to Payment (FPX/Stripe)
                      </button>
                    </div>
                  )}

                  {checkoutStep === 'payment' && (
                    <div className="space-y-4">
                      <p className="text-[10px] text-gray-500">Select Malaysian FPX gateway or Stripe card gateway:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {(['FPX', 'DuitNow', 'Stripe', 'ToyyibPay'] as const).map(gateway => (
                          <button
                            key={gateway}
                            onClick={() => setSelectedPayment(gateway)}
                            className={`p-2.5 rounded-lg text-xs font-semibold border flex items-center justify-center ${selectedPayment === gateway ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#7c6317]' : 'border-gray-200 text-gray-700'}`}
                          >
                            {gateway}
                          </button>
                        ))}
                      </div>

                      {selectedPayment === 'FPX' && (
                        <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs">
                          <option>Maybank2u (MBB)</option>
                          <option>CIMB Clicks</option>
                          <option>Public Bank</option>
                          <option>RHB Now</option>
                        </select>
                      )}

                      {selectedPayment === 'DuitNow' && (
                        <div className="text-center p-3 bg-gray-50 border rounded-xl space-y-1">
                          <div className="w-24 h-24 bg-gray-200 border border-gray-300 mx-auto flex items-center justify-center text-[10px] text-gray-500">
                            [DuitNow QR Code]
                          </div>
                          <p className="text-[9px] text-gray-400">Scan code with any Malaysian banking app</p>
                        </div>
                      )}

                      <div className="bg-[#9CAF88]/10 text-[10px] text-[#546247] p-3 rounded-lg border border-[#9CAF88]/20 flex items-center gap-1.5 leading-relaxed">
                        <ShieldCheck className="w-4 h-4 text-[#9CAF88] shrink-0" />
                        <span>Secured with SSL Bank Encryption and compliant with PDPA Malaysia 2010.</span>
                      </div>

                      <button
                        onClick={submitOrder}
                        className="w-full bg-[#9CAF88] text-white py-3 rounded-xl text-xs font-semibold"
                      >
                        Authorize & Pay RM {getTotal().toFixed(2)}
                      </button>

                      <button
                        onClick={() => setCheckoutStep('shipping')}
                        className="w-full text-gray-400 text-xs text-center hover:underline"
                      >
                        &larr; Back to Shipping
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {checkoutStep === 'success' && (
            <div className="text-center p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h4 className="font-serif font-bold text-gray-900 text-sm">Order Approved!</h4>
              <p className="text-[10px] text-gray-500 mt-1 mb-4">
                Your order {lastOrder?.orderNumber} is authorized. Sourced fresh from Cameron Highlands growers.
              </p>

              {lastOrder?.bloomMemoryUrl && (
                <div className="border border-[#D4AF37]/30 bg-white p-3 rounded-xl mb-4 space-y-2">
                  <p className="text-[10px] font-semibold text-[#a0811e] flex items-center justify-center gap-1">
                    <QrCode className="w-4 h-4" /> Recipients Receipt QR Code
                  </p>
                  <div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded mx-auto flex items-center justify-center text-[10px] text-gray-400 font-mono">
                    QR-MEM
                  </div>
                  <p className="text-[9px] text-gray-400">Attached on the bouquet wrapping. Scannable by recipient to watch video.</p>
                </div>
              )}

              <button
                onClick={() => {
                  setCheckoutStep(null);
                  setActiveTab('delivery');
                }}
                className="w-full bg-[#9CAF88] text-white py-2 rounded-lg text-xs font-semibold"
              >
                Track Live Delivery Rider &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
