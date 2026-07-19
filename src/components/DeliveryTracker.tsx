import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle2, Navigation, Phone, ShieldCheck, Camera, Star, HelpCircle, Heart } from 'lucide-react';
import { Order, Role } from '../types';

interface DeliveryTrackerProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  currentRole: Role;
}

export default function DeliveryTracker({ orders, setOrders, currentRole }: DeliveryTrackerProps) {
  // Find the most active or latest order to track
  const trackableOrders = orders.filter(o => o.status !== 'Delivered' || (o.status === 'Delivered' && !o.rating));
  const activeOrder = trackableOrders.length > 0 ? trackableOrders[0] : orders[0];

  const [otp, setOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [otpSuccess, setOtpSuccess] = useState<boolean>(false);
  
  // Review ratings
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Simulated live coordinates mapping
  const [riderLatLng, setRiderLatLng] = useState({ lat: 5.9750, lng: 116.0725 }); // Start at Lintas Area
  const destLatLng = activeOrder?.deliveryLatLng || { lat: 5.9922, lng: 116.0888 }; // Peak Vista

  // Animate rider closer to destination over time
  useEffect(() => {
    if (!activeOrder || activeOrder.status !== 'Out for Delivery') return;

    const interval = setInterval(() => {
      setRiderLatLng(current => {
        const latDiff = destLatLng.lat - current.lat;
        const lngDiff = destLatLng.lng - current.lng;

        // Move 10% closer
        const newLat = current.lat + latDiff * 0.1;
        const newLng = current.lng + lngDiff * 0.1;

        // Check if extremely close
        if (Math.abs(latDiff) < 0.001 && Math.abs(lngDiff) < 0.001) {
          clearInterval(interval);
          return destLatLng;
        }

        return { lat: newLat, lng: newLng };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeOrder, destLatLng]);

  if (!activeOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center font-sans">
        <Truck className="w-12 h-12 text-[#D4AF37]/20 mx-auto mb-3 animate-bounce" />
        <h3 className="text-xl font-serif font-bold text-gray-800">No Orders in Transit</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
          There are no orders currently being prepared or out for delivery. Visit our **Boutique Shop** to place an order!
        </p>
      </div>
    );
  }

  // Handle Rider OTP confirmation
  const handleVerifyOtp = () => {
    setOtpError('');
    if (otp === '1234') {
      setOtpSuccess(true);
      // Update order status to Delivered
      setOrders(orders.map(o => o.id === activeOrder.id ? { ...o, status: 'Delivered', otpVerified: true } : o));
    } else {
      setOtpError('Invalid secure delivery OTP. Use simulation override code "1234".');
    }
  };

  // Handle Rider Status advancements
  const advanceRiderStatus = (newStatus: Order['status']) => {
    setOrders(orders.map(o => o.id === activeOrder.id ? { ...o, status: newStatus } : o));
  };

  // Handle customer rating submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setOrders(orders.map(o => o.id === activeOrder.id ? { ...o, rating, reviewComment: comment } : o));
    setReviewSubmitted(true);
  };

  // Track status steps
  const steps: { name: Order['status']; label: string; desc: string }[] = [
    { name: 'Pending', label: 'Order Confirmed', desc: 'Sourcing Cameron Highlands blooms' },
    { name: 'Preparing', label: 'Bouquet Handcrafting', desc: 'Designing in glassmorphic wrap' },
    { name: 'Quality Inspection', label: 'Freshness Control Check', desc: 'True index evaluation' },
    { name: 'Out for Delivery', label: 'Out for Delivery', desc: '90-Min express courier on the way' },
    { name: 'Delivered', label: 'Delivered Safe', desc: 'Handed over with smile proof' }
  ];

  const currentStepIdx = steps.findIndex(s => s.name === activeOrder.status);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans" id="delivery-view">
      <div className="mb-10 text-center sm:text-left">
        <span className="inline-block px-4 py-1.5 bg-[#9CAF88]/10 text-[#9CAF88] text-[10px] font-bold uppercase tracking-[0.25em] rounded-full mb-3">
          Sabah's Live Gifting Dispatch
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight flex items-center justify-center sm:justify-start gap-2">
          <Truck className="w-7 h-7 text-[#9CAF88]" /> Delivery Tracker
        </h2>
        <p className="text-xs text-gray-500 mt-1.5">Live transport and freshness countdown for order {activeOrder.orderNumber} in Kota Kinabalu, Sabah.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Map Tracker Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Simulated High-Fidelity KK Map Card */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="bg-[#1A1A1A] text-white px-6 py-4 flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" /> GPS Live Radar Coverage
              </span>
              <span className="bg-white/10 px-2.5 py-1 rounded-full text-[9px] uppercase font-mono tracking-wider">
                KK Lat: {riderLatLng.lat.toFixed(4)}, Lng: {riderLatLng.lng.toFixed(4)}
              </span>
            </div>

            {/* Simulated Vector KK Map */}
            <div className="relative aspect-[16/10] bg-[#FCF9F6] overflow-hidden flex items-center justify-center p-4 select-none">
              {/* KK Coastline Grid Visualizer */}
              <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Coastal line */}
                <path d="M 0 100 Q 150 150 250 120 T 450 180 T 650 250 T 800 180" fill="none" stroke="#D4AF37" strokeWidth="2" strokeOpacity="0.3" />
                <path d="M 0 100 Q 150 150 250 120 T 450 180 T 650 250 T 800 180 L 800 0 L 0 0 Z" fill="#90B7D6" fillOpacity="0.1" />
                {/* Roads Grid */}
                <line x1="120" y1="0" x2="120" y2="400" stroke="#E5DED5" strokeWidth="1.5" />
                <line x1="380" y1="0" x2="380" y2="400" stroke="#E5DED5" strokeWidth="1.5" />
                <line x1="0" y1="200" x2="800" y2="200" stroke="#E5DED5" strokeWidth="1.5" />
                <line x1="0" y1="320" x2="800" y2="320" stroke="#E5DED5" strokeWidth="1" />
                <circle cx="380" cy="200" r="180" fill="none" stroke="#E5DED5" strokeWidth="1" strokeDasharray="4 4" />
              </svg>

              {/* Major KK Zones text indicators */}
              <span className="absolute top-10 left-12 text-[9px] uppercase text-[#90B7D6] font-bold tracking-widest">South China Sea</span>
              <span className="absolute top-14 right-20 text-[9px] uppercase text-[#7a8c67] font-bold tracking-widest">Tanjung Lipat (Likas Bay)</span>
              <span className="absolute bottom-1/2 left-24 text-[9px] uppercase text-gray-400 font-bold tracking-wider">KK City Center</span>
              <span className="absolute bottom-28 right-32 text-[9px] uppercase text-[#7a8c67] font-bold tracking-wider">Damai & Lintas Hub</span>
              <span className="absolute bottom-10 right-12 text-[9px] uppercase text-[#7a8c67] font-bold tracking-wider">Penampang Area</span>

              {/* Landmark: Peak Vista (Destination) */}
              <div className="absolute top-24 right-1/3 text-center flex flex-col items-center">
                <span className="bg-[#1A1A1A] text-[#D4AF37] p-1.5 rounded-full shadow-md border border-[#D4AF37]/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
                <span className="bg-white border border-[#D4AF37]/20 rounded-full px-2.5 py-0.5 text-[9px] font-bold text-gray-800 shadow-sm mt-1.5 whitespace-nowrap">
                  Peak Vista (Sarah)
                </span>
              </div>

              {/* Landmark: Ana's Garden Boutique Store (Origin) */}
              <div className="absolute bottom-20 right-1/4 text-center flex flex-col items-center">
                <span className="bg-[#1A1A1A] text-[#D4AF37] p-1.5 rounded-full shadow-md border border-[#D4AF37]/30">
                  <Heart className="w-3.5 h-3.5" />
                </span>
                <span className="bg-white border border-[#D4AF37]/20 rounded-full px-2.5 py-0.5 text-[9px] font-bold text-gray-800 shadow-sm mt-1.5 whitespace-nowrap">
                  Ana's Garden Damai
                </span>
              </div>

              {/* Live Delivery Rider Marker */}
              {activeOrder.status === 'Out for Delivery' && (
                <div
                  className="absolute p-2.5 bg-[#D4AF37] text-black rounded-full shadow-2xl border-2 border-white flex flex-col items-center transition-all duration-1000 ease-out z-30"
                  style={{
                    // Map lat/lng coordinates to percentage offsets
                    bottom: '38%',
                    right: '28%',
                    transform: 'translate(50%, 50%)'
                  }}
                  id="live-rider-marker"
                >
                  <Truck className="w-5 h-5 text-gray-900" />
                  <span className="absolute -top-7 bg-gray-900 text-white font-mono text-[8px] px-2 py-0.5 rounded-full shadow-md whitespace-nowrap uppercase tracking-wider">
                    Rider: Ferry
                  </span>
                </div>
              )}
            </div>

            {/* Rider coordinates panel */}
            <div className="p-5 bg-[#FCF9F6] border-t border-gray-100 grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-gray-100 text-[#9CAF88]">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Assigned Delivery Rider</p>
                  <p className="font-bold text-gray-800">{activeOrder.riderName || 'Ferry bin Herman'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-gray-100 text-[#D4AF37]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Contact Delivery Desk</p>
                  <p className="font-bold text-gray-800">{activeOrder.riderPhone || '+6019-8837264'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* SIMULATION OVERRIDES (For Admin and Riders to simulate workflow states) */}
          {currentRole !== 'customer' && (
            <div className="bg-gradient-to-br from-[#FCF9F6] to-[#F5F2ED] border border-[#D4AF37]/20 rounded-3xl p-6 space-y-4 shadow-sm">
              <h4 className="font-serif font-bold text-gray-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Simulation Control Board
              </h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">Since you are logged in as **{currentRole.toUpperCase()}**, you can manually trigger delivery stage transitions:</p>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => advanceRiderStatus('Preparing')}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${activeOrder.status === 'Preparing' ? 'bg-[#1A1A1A] text-white shadow' : 'bg-white border text-gray-600 hover:bg-[#FCF9F6]'}`}
                >
                  Preparing Bouquet
                </button>
                <button
                  onClick={() => advanceRiderStatus('Quality Inspection')}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${activeOrder.status === 'Quality Inspection' ? 'bg-[#1A1A1A] text-white shadow' : 'bg-white border text-gray-600 hover:bg-[#FCF9F6]'}`}
                >
                  Quality Inspection
                </button>
                <button
                  onClick={() => advanceRiderStatus('Out for Delivery')}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${activeOrder.status === 'Out for Delivery' ? 'bg-[#1A1A1A] text-white shadow' : 'bg-white border text-gray-600 hover:bg-[#FCF9F6]'}`}
                >
                  Deploy Rider
                </button>
                <button
                  onClick={() => advanceRiderStatus('Delivered')}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${activeOrder.status === 'Delivered' ? 'bg-[#9CAF88] text-white shadow' : 'bg-white border text-gray-600 hover:bg-[#FCF9F6]'}`}
                >
                  Mark Delivered (Direct)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Tracking Progress and Feedback (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-gray-900 text-base border-b border-gray-50 pb-3">Track Progress</h3>
          
          {/* Milestone Stepper */}
          <div className="relative pl-6 space-y-5">
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>

            {steps.map((s, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              
              return (
                <div key={idx} className="relative flex gap-3 text-xs">
                  {/* Step Dot */}
                  <div className={`absolute -left-5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    isPast
                      ? 'bg-[#9CAF88] border-[#9CAF88] text-white'
                      : isCurrent
                        ? 'bg-white border-[#D4AF37] scale-110 shadow-sm'
                        : 'bg-white border-gray-200'
                  }`}>
                    {isPast && <CheckCircle2 className="w-3 h-3 text-white fill-white" />}
                  </div>

                  <div>
                    <h4 className={`font-semibold ${isCurrent ? 'text-gray-900 text-sm font-bold' : 'text-gray-500'}`}>{s.label}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Secure OTP hand-off (Customer verification code) */}
          {activeOrder.status === 'Out for Delivery' && (
            <div className="bg-[#FCF9F6] border border-[#D4AF37]/15 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
                <span>Secure Delivery Pin Verification</span>
                <span className="font-mono bg-amber-100 px-2 py-0.5 rounded text-[10px] text-amber-800">
                  Customer Code: 1234
                </span>
              </div>
              <p className="text-[10px] text-gray-400">Please provide code **1234** to Ferry at your doorstep to confirm secure receipt handover.</p>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 4-Digit Delivery Code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-lg p-2 text-xs text-center font-bold tracking-widest focus:ring-1 focus:ring-[#9CAF88]"
                />
                <button
                  onClick={handleVerifyOtp}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#9CAF88]"
                >
                  Verify Code
                </button>
              </div>
              {otpError && <p className="text-[10px] text-red-500 font-medium text-center">{otpError}</p>}
            </div>
          )}

          {/* Delivered safe & Customer Feedback Form */}
          {activeOrder.status === 'Delivered' && (
            <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-5 space-y-4">
              <div className="text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-serif font-bold text-gray-900 text-sm">Bouquet Safely Delivered!</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">Proof of delivery captured by rider Ferry on Mt Kinabalu dew standard.</p>
              </div>

              {/* Photo proof */}
              <div className="border border-gray-100 bg-white p-2 rounded-xl flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=150&q=80"
                  alt="Delivery Proof"
                  className="w-12 h-12 object-cover rounded-lg bg-gray-50 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] text-gray-400 flex items-center gap-1">
                    <Camera className="w-3 h-3 text-[#9CAF88]" /> Signature Photo Proof
                  </p>
                  <p className="text-[10px] font-bold text-gray-800 truncate">Recipient: Sarah J</p>
                </div>
              </div>

              {/* Feedback Survey */}
              {!reviewSubmitted && !activeOrder.rating ? (
                <form onSubmit={handleSubmitReview} className="space-y-3 pt-3 border-t border-emerald-100 text-xs">
                  <label className="font-semibold text-gray-800 block text-center">Rate Your Smart Gifting Experience</label>
                  
                  {/* Stars select */}
                  <div className="flex justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="text-amber-400 p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-gray-300'}`} />
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Add your thoughts (review comments)</label>
                    <textarea
                      placeholder="Was the freshness score of Cameron Highlands roses accurate? Smells nice?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs h-16 focus:ring-1 focus:ring-[#9CAF88]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#9CAF88] text-white py-2 rounded-lg font-semibold"
                  >
                    Submit Review to Ana's Desk
                  </button>
                </form>
              ) : (
                <div className="text-center py-2 text-xs text-gray-500 font-medium">
                  <Heart className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37] mx-auto mb-1 animate-pulse" />
                  Thank you for rating! Your review is saved under CRM order metrics.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
