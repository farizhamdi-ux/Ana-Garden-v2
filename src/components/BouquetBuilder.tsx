import React, { useState } from 'react';
import { Sparkles, ShoppingBag, RefreshCw, Star, Heart, Check, HelpCircle, Loader2 } from 'lucide-react';
import { Flower, CartItem, BouquetProduct } from '../types';
import { mockFlowers } from '../mockData';

interface BouquetBuilderProps {
  onAddCustomBouquetToCart: (customItem: CartItem) => void;
  setActiveTab: (tab: string) => void;
}

export default function BouquetBuilder({
  onAddCustomBouquetToCart,
  setActiveTab,
}: BouquetBuilderProps) {
  // Bouquet Configuration state
  const [selectedFlower, setSelectedFlower] = useState<Flower>(mockFlowers[0]); // Cameron Red Rose
  const [stemsCount, setStemsCount] = useState<number>(12);
  const [flowerColor, setFlowerColor] = useState<string>('Classic Red');
  const [wrapping, setWrapping] = useState<string>('Glassmorphic Transparent Wrap');
  const [ribbon, setRibbon] = useState<string>('Liquid Gold Satin Ribbon');
  
  // Greeting Card details
  const [recipient, setRecipient] = useState('Sarah J');
  const [sender, setSender] = useState('Fariz Hamdi');
  const [message, setMessage] = useState('To the love of my life, thank you for making every day bloom with hope and joy.');
  const [occasion, setOccasion] = useState('Anniversary');
  const [tone, setTone] = useState('Romantic & Poetic');

  // Add-ons
  const [addOns, setAddOns] = useState({
    chocolate: false,
    balloon: false,
    bear: false,
    perfume: false,
  });

  // AI Generation state
  const [generatingCard, setGeneratingCard] = useState<boolean>(false);
  const [aiResponseSource, setAiResponseSource] = useState<'Gemini' | 'Simulated' | ''>('');

  // Wrapping options
  const wrappingOptions = [
    { name: 'Glassmorphic Transparent Wrap', price: 15, desc: 'Ultra-modern translucent frosted wrap with elegant light play' },
    { name: 'Minimalist Charcoal Craft Wrap', price: 10, desc: 'Eco-friendly textured recycled paper giving dramatic high-contrast' },
    { name: 'Pristine Silk Cream Paper', price: 12, desc: 'Delicate, premium, non-woven textured paper bound tightly' },
    { name: 'Kaamatan Jute Organic Wrap', price: 8, desc: 'Natural golden-brown organic fibers, rustic and fully compostable' }
  ];

  // Ribbon options
  const ribbonOptions = [
    { name: 'Liquid Gold Satin Ribbon', price: 5, desc: 'Heavy weight double-sided high-luster premium satin' },
    { name: 'Raw Edge Burgundy Velvet', price: 8, desc: 'Splendid textured deep burgundy velvet with soft organic edge' },
    { name: 'Sage Green Matte Cotton', price: 4, desc: 'Simple, rustic, biodegradable weave with understated organic texture' }
  ];

  // Add-on options with RM prices
  const addOnOptions = [
    { id: 'chocolate', name: 'Ferrero Premium Chocolates', price: 25, desc: 'Hand-wrapped chocolate gift box (16pcs)' },
    { id: 'balloon', name: 'Bespoke Helium Love Balloon', price: 15, desc: 'Double bubble helium balloon floating gracefully' },
    { id: 'bear', name: 'Nurture Soft Plush Teddy', price: 30, desc: 'Premium luxury safe cotton teddy' },
    { id: 'perfume', name: 'Mount Kinabalu Dew Perfume', price: 45, desc: 'Local artisan botanical organic natural mist (50ml)' }
  ];

  // Calculate dynamic live pricing
  const calculateBasePrice = () => {
    const stemsCost = selectedFlower.basePricePerStem * stemsCount;
    const wrapCost = wrappingOptions.find(w => w.name === wrapping)?.price || 0;
    const ribCost = ribbonOptions.find(r => r.name === ribbon)?.price || 0;
    
    let addonsCost = 0;
    if (addOns.chocolate) addonsCost += 25;
    if (addOns.balloon) addonsCost += 15;
    if (addOns.bear) addonsCost += 30;
    if (addOns.perfume) addonsCost += 45;

    return Number((stemsCost + wrapCost + ribCost + addonsCost).toFixed(2));
  };

  // Freshness score calculation based on stems count and flower selection
  const calculateFreshnessScore = () => {
    // Lilies expire in 12 days, Roses in 10, Hydrangeas in 7.
    // Freshness score decreases slightly for complex mixed custom orders, but stays above 90%
    const baseLife = selectedFlower.freshnessDurationDays;
    const score = Math.min(100, Math.round((baseLife / 12) * 100));
    return score;
  };

  const getVaseLife = () => {
    const days = selectedFlower.freshnessDurationDays;
    return `${days - 2}-${days} Days`;
  };

  // Call the Gemini backend to generate a highly customized card message based on occasion and tone!
  const enhanceCardWithMessage = async () => {
    setGeneratingCard(true);
    setAiResponseSource('');
    try {
      const response = await fetch('/api/generate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          recipient,
          relationship: tone.includes('Romantic') ? 'Partner' : 'Family/Friend',
          tone,
          additionalDetails: `Card sender: ${sender}. Spoken near Mt Kinabalu.`
        })
      });
      const data = await response.json();
      if (data.text) {
        setMessage(data.text);
        setAiResponseSource(data.source);
      }
    } catch (err) {
      console.error(err);
      setMessage(`To my beloved ${recipient},\n\nEvery moment with you is as beautiful as a garden in full bloom. On this special ${occasion}, I celebrate us with these fresh Cameron Highlands flowers.\n\nWith everlasting love,\n${sender}`);
      setAiResponseSource('Simulated');
    } finally {
      setGeneratingCard(false);
    }
  };

  const handleAddCustomToCart = () => {
    const price = calculateBasePrice();
    const freshness = calculateFreshnessScore();
    const vaseLife = selectedFlower.freshnessDurationDays;

    const customProduct: BouquetProduct = {
      id: `custom-${Date.now()}`,
      name: `Bespoke Custom ${selectedFlower.name} Bouquet`,
      description: `Hand-customized bouquet featuring ${stemsCount} stems of premium ${selectedFlower.color} ${selectedFlower.category}s. Wrapped beautifully in ${wrapping} and tied with ${ribbon}.`,
      price,
      imageUrl: selectedFlower.imageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      category: 'Same Day',
      isCustom: true,
      freshnessScore: freshness,
      estimatedVaseLifeDays: vaseLife
    };

    const cartItem: CartItem = {
      id: `cart-${Date.now()}-custom`,
      product: customProduct,
      quantity: 1,
      customization: {
        primaryFlower: selectedFlower.name,
        flowerColor,
        wrapping,
        ribbon,
        greetingCard: { recipient, sender, message },
        addOns
      }
    };

    onAddCustomBouquetToCart(cartItem);
    setActiveTab('shop');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans" id="builder-view">
      {/* Title */}
      <div className="mb-10 text-center sm:text-left">
        <span className="inline-block px-4 py-1.5 bg-[#9CAF88]/10 text-[#9CAF88] text-[10px] font-bold uppercase tracking-[0.25em] rounded-full mb-3">
          Sabah's Interactive Gifting Suite
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight flex items-center justify-center sm:justify-start gap-2">
          <Sparkles className="w-6 h-6 text-[#D4AF37]" /> Interactive Bouquet Concierge
        </h2>
        <p className="text-xs text-gray-500 mt-1.5">Design your own luxury botanical arrangement with real-time pricing and live freshness analytics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Grid Panel: Customizer Controls (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-8">
          {/* Step 1: Primary Flower selection */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-[#D4AF37]/10">
              <span className="bg-[#1A1A1A] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
              Select Premium Flower Species
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {mockFlowers.map((flower) => {
                const isSelected = selectedFlower.id === flower.id;
                return (
                  <button
                    key={flower.id}
                    onClick={() => {
                      setSelectedFlower(flower);
                      setFlowerColor(flower.color);
                    }}
                    className={`p-4 rounded-3xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-[#D4AF37] bg-gradient-to-br from-[#FCF9F6] to-[#F5F2ED]'
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                    id={`flower-opt-${flower.id}`}
                  >
                    {isSelected && (
                      <span className="absolute top-2.5 right-2.5 bg-[#1A1A1A] text-[#D4AF37] p-0.5 rounded-full">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                    <img
                      src={flower.imageUrl}
                      alt={flower.name}
                      className="w-full h-20 object-cover rounded-2xl mb-3 bg-gray-50"
                      referrerPolicy="no-referrer"
                    />
                    <h4 className="text-xs font-bold text-gray-800 truncate">{flower.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-mono">RM {flower.basePricePerStem.toFixed(2)}/stem</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stems count slider and petal color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stems Count */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-gray-800">Flower Stems Count</label>
                <span className="bg-gray-100 px-2.5 py-0.5 rounded-full font-bold text-gray-700">{stemsCount} Stems</span>
              </div>
              <input
                type="range"
                min="6"
                max="36"
                step="1"
                value={stemsCount}
                onChange={(e) => setStemsCount(Number(e.target.value))}
                className="w-full accent-[#9CAF88] cursor-pointer"
                id="stems-slider"
              />
              <div className="flex justify-between text-[9px] text-gray-400">
                <span>Min: 6 (Standard)</span>
                <span>Recommended: 12 (Premium)</span>
                <span>Max: 36 (Grand)</span>
              </div>
            </div>

            {/* Custom Petal Color */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-800 block">Select Custom Blossom Shade</label>
              <div className="flex gap-2">
                {['Classic Red', 'Blush Pink', 'Pure White', 'Sunny Yellow', 'Majestic Purple'].map((color) => {
                  const isSel = flowerColor === color;
                  return (
                    <button
                      key={color}
                      onClick={() => setFlowerColor(color)}
                      className={`text-[10px] px-2.5 py-1.5 rounded-lg border font-medium ${
                        isSel ? 'border-[#9CAF88] bg-[#9CAF88]/10 text-[#546247] font-bold' : 'border-gray-200 text-gray-600 bg-white'
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 2: Wrapping selection */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-[#D4AF37]/10">
              <span className="bg-[#1A1A1A] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
              Select Luxury Wrapping Style
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wrappingOptions.map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => setWrapping(opt.name)}
                  className={`p-4 rounded-2xl border text-left flex gap-3.5 items-center transition-all ${
                    wrapping === opt.name ? 'border-[#D4AF37] bg-[#FCF9F6]' : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                  id={`wrap-opt-${opt.name.toLowerCase().replace(/ /g, '-')}`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${wrapping === opt.name ? 'border-[#D4AF37]' : 'border-gray-300'}`}>
                    {wrapping === opt.name && <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-gray-800 flex justify-between items-center">
                      <span>{opt.name}</span>
                      <span className="text-[#9CAF88] font-mono font-bold text-[11px] ml-2">+RM{opt.price}</span>
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Ribbon styling */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-[#D4AF37]/10">
              <span className="bg-[#1A1A1A] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
              Select Premium Ribbons
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ribbonOptions.map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => setRibbon(opt.name)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    ribbon === opt.name ? 'border-[#D4AF37] bg-[#FCF9F6]' : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                  id={`ribbon-opt-${opt.name.toLowerCase().replace(/ /g, '-')}`}
                >
                  <h4 className="text-xs font-bold text-gray-800 flex justify-between items-center">
                    <span>{opt.name}</span>
                    <span className="text-[#9CAF88] font-mono font-bold text-[11px] ml-2">+RM{opt.price}</span>
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Greeting Card message with AI writing assistance */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-[#D4AF37]/10">
              <span className="bg-[#1A1A1A] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">4</span>
              Write Handwritten Greeting Card
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">To (Recipient Name)</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-[#FCF9F6] border border-[#D4AF37]/15 rounded-xl p-3 text-xs focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">From (Sender Name)</label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="w-full bg-[#FCF9F6] border border-[#D4AF37]/15 rounded-xl p-3 text-xs focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* AI Generator Helper Box */}
            <div className="bg-gradient-to-br from-[#FCF9F6] to-[#F5F2ED] border border-[#D4AF37]/20 rounded-[2rem] p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                  Gemini Poetic Card Enhancer
                </span>
                <span className="text-[9px] font-mono font-bold bg-white border border-[#D4AF37]/15 text-[#856c1f] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Vertex LLM Connected
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Select Occasion</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-[#D4AF37] focus:outline-none cursor-pointer"
                  >
                    <option>Anniversary</option>
                    <option>Apology & Forgiveness</option>
                    <option>Birthday celebration</option>
                    <option>UMS Graduation Ceremony</option>
                    <option>Comfort & Healing</option>
                    <option>Romantic Surprise</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Emotional Sentiment</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-[#D4AF37] focus:outline-none cursor-pointer"
                  >
                    <option>Romantic & Poetic</option>
                    <option>Heartfelt & Deeply Grateful</option>
                    <option>Humble, apologetic & Soft</option>
                    <option>Warm, joyful & Inspiring</option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={enhanceCardWithMessage}
                disabled={generatingCard}
                className="w-full bg-[#1A1A1A] hover:bg-[#D4AF37] text-white py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors duration-300 shadow-sm"
                id="ai-card-enhance-btn"
              >
                {generatingCard ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                    Baking poetic sentiment from Cameron Highlands...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Write Beautiful AI Gifting Message
                  </>
                )}
              </button>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Message printed on physical card</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#FCF9F6] border border-[#D4AF37]/15 rounded-2xl p-4 text-xs h-28 focus:ring-1 focus:ring-[#D4AF37] focus:outline-none leading-relaxed text-gray-700"
              />
              {aiResponseSource && (
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-2 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Enhanced with {aiResponseSource === 'Gemini' ? 'Google Gemini AI' : 'Boutique local knowledge'}.
                </p>
              )}
            </div>
          </div>

          {/* Step 5: Premium Add-ons */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-[#D4AF37]/10">
              <span className="bg-[#1A1A1A] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">5</span>
              Premium Gifting Add-ons
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {addOnOptions.map((opt) => {
                const isActive = addOns[opt.id as keyof typeof addOns];
                return (
                  <button
                    key={opt.id}
                    onClick={() => setAddOns({ ...addOns, [opt.id]: !isActive })}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isActive
                        ? 'border-[#D4AF37] bg-[#FCF9F6] shadow-sm'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`w-4 h-4 rounded border flex items-center justify-center ${isActive ? 'bg-[#1A1A1A] border-[#1A1A1A]' : 'border-gray-300'}`}>
                        {isActive && <Check className="w-3 h-3 text-[#D4AF37] stroke-[3]" />}
                      </span>
                      <span className="text-[#D4AF37] font-mono text-[11px] font-bold">+RM{opt.price}</span>
                    </div>
                    <h4 className="text-xs font-bold text-gray-800 mt-3">{opt.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Grid Panel: Interactive Bouquet Preview & Pricing (4 cols) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#FCF9F6] to-[#F5F2ED] border border-[#D4AF37]/20 rounded-[2.5rem] p-7 shadow-xl sticky top-28 space-y-6">
          <h3 className="font-serif font-bold text-gray-900 text-lg border-b border-[#D4AF37]/10 pb-3 text-center">Bespoke Bouquet Composition</h3>
          
          {/* Interactive Visual Canvas */}
          <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-white shadow-inner flex flex-col justify-center items-center p-4 border border-[#D4AF37]/10">
            {/* Layer 1: Wrap background */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50/20 to-amber-50/5"></div>
            
            {/* Visual simulation based on customization */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
              <div className="flex -space-x-4">
                {[...Array(Math.min(5, Math.ceil(stemsCount / 3)))].map((_, i) => (
                  <div
                    key={i}
                    className="w-14 h-14 rounded-full border-2 border-white shadow-lg overflow-hidden animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  >
                    <img
                      src={selectedFlower.imageUrl}
                      alt={selectedFlower.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <span className="bg-[#9CAF88]/10 text-[#9CAF88] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-[#9CAF88]/20">
                  {flowerColor} Palette
                </span>
              </div>
            </div>

            {/* Wrap visual feedback */}
            <div className="absolute bottom-8 left-4 right-4 bg-white/80 backdrop-blur-md border border-[#D4AF37]/10 p-3.5 rounded-2xl text-center z-20">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#9CAF88] mb-0.5">Packaging Layout</p>
              <p className="text-xs font-bold text-gray-800">{wrapping}</p>
              <p className="text-[9px] text-gray-400 mt-0.5">&amp; {ribbon}</p>
            </div>

            {/* Freshness scores inside canvas */}
            <div className="absolute top-4 right-4 bg-[#1A1A1A]/95 backdrop-blur-sm text-white text-[10px] p-2.5 rounded-xl text-right z-20 border border-[#D4AF37]/10">
              <p className="text-emerald-400 font-bold uppercase text-[8px] tracking-wider mb-0.5">Estimated Freshness</p>
              <p className="text-base font-serif font-bold">{calculateFreshnessScore()}% Score</p>
              <p className="text-[9px] text-gray-300">Vase Life: {getVaseLife()}</p>
            </div>
          </div>

          {/* Pricing breakdowns */}
          <div className="space-y-2 text-xs border-t border-b border-[#D4AF37]/10 py-4 font-sans">
            <div className="flex justify-between text-gray-600">
              <span>{stemsCount}x {selectedFlower.name} ({selectedFlower.color})</span>
              <span className="font-mono">RM {(selectedFlower.basePricePerStem * stemsCount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{wrapping}</span>
              <span className="font-mono">RM {(wrappingOptions.find(w => w.name === wrapping)?.price || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{ribbon}</span>
              <span className="font-mono">RM {(ribbonOptions.find(r => r.name === ribbon)?.price || 0).toFixed(2)}</span>
            </div>
            {Object.entries(addOns).some(([_, v]) => v) && (
              <div className="pt-2 border-t border-dashed border-[#D4AF37]/10 mt-2">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#9CAF88] mb-1">Add-ons Selected:</p>
                {addOnOptions.filter(o => addOns[o.id as keyof typeof addOns]).map(o => (
                  <div key={o.id} className="flex justify-between text-gray-500 pl-2 text-[11px] mt-1">
                    <span>• {o.name}</span>
                    <span className="font-mono">RM {o.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Bespoke Bouquet Price</p>
              <p className="text-2xl font-serif font-bold text-[#1A1A1A]">RM {calculateBasePrice().toFixed(2)}</p>
            </div>
            <button
              onClick={handleAddCustomToCart}
              className="bg-[#1A1A1A] hover:bg-[#D4AF37] text-white px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-md transition-colors duration-300 hover:scale-105"
              id="add-custom-to-basket-btn"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" /> Add to Basket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
