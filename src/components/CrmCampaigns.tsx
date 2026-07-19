import React, { useState } from 'react';
import { Calendar, Phone, Sparkles, Send, Users, Gift, CheckCircle2, Star, Loader2, ArrowRight } from 'lucide-react';
import { Campaign } from '../types';

export default function CrmCampaigns() {
  const [generatingCopy, setGeneratingCopy] = useState<boolean>(false);
  const [generatedText, setGeneratedText] = useState<string>('');
  const [aiSource, setAiSource] = useState<string>('');

  // Form State
  const [campaignTitle, setCampaignTitle] = useState<string>('Kaamatan Harvest Festival Surprise');
  const [targetSegment, setTargetSegment] = useState<string>('Sabah Anniversary Club Members');
  const [channel, setChannel] = useState<'Email' | 'WhatsApp' | 'SMS'>('WhatsApp');

  const [savedCampaigns, setSavedCampaigns] = useState<Campaign[]>([
    {
      id: 'camp-1',
      title: 'Graduation Congratulations',
      description: 'UMS graduation congratulations discount code offering free same-day KK shipping.',
      targetSegment: 'Parents & Relatives of local UMS students',
      channel: 'Email',
      content: 'Dearest parents, celebrate your graduate\'s brilliant achievement at UMS this weekend with an authentic bouquet from Ana\'s Garden...',
      status: 'Sent',
      sentAt: '2026-07-12T09:00:00Z'
    }
  ]);

  const [campaignCreated, setCampaignCreated] = useState<boolean>(false);

  // Reminders Calendar State (Sabah Gifting reminders)
  const reminders = [
    { name: 'Sarah J (Wife of Fariz)', occasion: 'Wedding Anniversary', date: 'Oct 22', remainingDays: 96, recommendedBouquet: 'Kinabalu Sunrise Bouquet (RM185)' },
    { name: 'DoubleTree Hilton KK Reception', occasion: 'Weekly Lobby Subscription', date: 'Every Monday', remainingDays: 2, recommendedBouquet: 'Weekly Serenity Club (RM85)' },
    { name: 'Lilian Chew', occasion: 'Mother\'s Birthday', date: 'Jul 24', remainingDays: 6, recommendedBouquet: 'Kundasang Mist Hydrangea (RM210)' },
    { name: 'Sutera Harbour Resort HR Desk', occasion: 'Staff Monthly Birthday Pool', date: 'Jul 30', remainingDays: 12, recommendedBouquet: 'Royal Orchid Opulence (RM380)' }
  ];

  // Call the Gemini backend to generate campaign copies!
  const generateCampaignCopy = async () => {
    setGeneratingCopy(true);
    setAiSource('');
    try {
      const response = await fetch('/api/generate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignTitle,
          targetSegment,
          channel
        })
      });
      const data = await response.json();
      if (data.text) {
        setGeneratedText(data.text);
        setAiSource(data.source);
      }
    } catch (err) {
      console.error(err);
      setGeneratedText(`📱 **WhatsApp Broadcast Copy**\n\n"Hello there, Bloom Club Member! 🌸\n\nOur fresh Cameron Highlands shipment just arrived at Ana's Garden boutique with the season's finest red roses!\n\n*Campaign: ${campaignTitle}*\n\nExclusively for our premium ${targetSegment}, enjoy **15% off** on our hand-tied custom bouquets and earn **Double Bloom Points**! 🌟\n\n🚀 Need it urgently? Enjoy our signature **90-minute express doorstep delivery** anywhere in Kota Kinabalu, Lintas, and Penampang.\n\nClick to customize: anasgarden.com.my"`);
      setAiSource('Simulated');
    } finally {
      setGeneratingCopy(false);
    }
  };

  const saveCampaign = () => {
    if (!generatedText) return;

    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      title: campaignTitle,
      description: `Targeting ${targetSegment} via ${channel}.`,
      targetSegment,
      channel,
      content: generatedText,
      status: 'Scheduled'
    };

    setSavedCampaigns([newCampaign, ...savedCampaigns]);
    setCampaignCreated(true);
    setGeneratedText('');

    setTimeout(() => {
      setCampaignCreated(false);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans" id="crm-view">
      {/* Title */}
      <div className="mb-10 text-center sm:text-left">
        <span className="inline-block px-4 py-1.5 bg-[#9CAF88]/10 text-[#9CAF88] text-[10px] font-bold uppercase tracking-[0.25em] rounded-full mb-3">
          Sabah's Intelligent CRM & AI Agent
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight flex items-center justify-center sm:justify-start gap-2">
          <Users className="w-7 h-7 text-gray-900" /> CRM Gifting Calendar &amp; AI Marketer
        </h2>
        <p className="text-xs text-gray-500 mt-1.5">Nurture lifelong relationships. Automated anniversaries tracking and Gemini-powered smart promotional copywriting.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Grid: Sabah Gifting Anniversary Calendar Reminders (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-5">
            <h3 className="font-serif font-bold text-gray-900 text-sm pb-3 border-b border-gray-50 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4AF37]" /> Active Gifting Reminders Calendar
            </h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">Ana's Garden automatically scans customer wedding databases and corporate registries to trigger proactive reminders:</p>

            <div className="space-y-4">
              {reminders.map((r, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#FCF9F6] border border-[#D4AF37]/10 flex justify-between items-center gap-4 text-xs">
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-gray-800 leading-none">{r.name}</h4>
                    <p className="text-[10px] text-gray-400">{r.occasion} • <strong className="text-gray-600">{r.date}</strong></p>
                    <p className="text-[10px] text-gray-500 font-medium">Auto: <span className="font-semibold text-[#546247]">{r.recommendedBouquet}</span></p>
                  </div>

                  <div className="text-right shrink-0 space-y-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider border ${r.remainingDays <= 7 ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                      In {r.remainingDays} days
                    </span>
                    <button
                      onClick={() => alert(`Pre-ordering activated for ${r.name}. Standard RM price applied. QR Bloom Memory greeting placeholder allocated.`)}
                      className="block bg-[#1A1A1A] hover:bg-[#D4AF37] hover:text-white text-[9px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-full transition-all duration-300 shadow-sm"
                    >
                      Pre-order Gifting
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#FCF9F6] to-[#F5F2ED] border border-[#D4AF37]/20 rounded-[2rem] p-7 shadow-sm text-xs space-y-3">
            <h4 className="font-serif font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Gift className="w-4 h-4 text-[#D4AF37]" /> Bloom Memories QR Campaigns
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Our unique QR-card prints allow customers to link video thank-you cards. When recipients scan, the CRM records emotional engagements, updating recipient favorability matrices dynamically!
            </p>
          </div>
        </div>

        {/* Right Grid: Gemini Campaign Copywriter (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-50 pb-4">
            <h3 className="font-serif font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" /> Gemini CRM Copywriter
            </h3>
            <span className="text-[9px] bg-[#9CAF88]/10 text-[#546247] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Marketing copy generator
            </span>
          </div>

          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Campaign Occasion Title</label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="w-full bg-[#FCF9F6] border border-[#D4AF37]/15 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Target Customer Segment</label>
                <input
                  type="text"
                  value={targetSegment}
                  onChange={(e) => setTargetSegment(e.target.value)}
                  className="w-full bg-[#FCF9F6] border border-[#D4AF37]/15 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Marketing Broadcast Channel</label>
              <div className="flex gap-2.5">
                {(['WhatsApp', 'Email', 'SMS'] as const).map(ch => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setChannel(ch)}
                    className={`px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex-1 transition-all duration-300 ${channel === ch ? 'border-gray-900 bg-[#1A1A1A] text-white shadow-sm' : 'border-gray-200 text-gray-600 bg-white hover:bg-[#FCF9F6]'}`}
                  >
                    {ch} Broadcast
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateCampaignCopy}
              disabled={generatingCopy}
              className="w-full bg-[#1A1A1A] hover:bg-[#D4AF37] text-white py-3.5 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors duration-300 shadow-sm"
              id="ai-promo-btn"
            >
              {generatingCopy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  Weaving marketing magic from Cameron Highlands...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  Generate Elegant AI Gifting Copy
                </>
              )}
            </button>

            {/* Generated Copy text panel */}
            {generatedText && (
              <div className="border border-[#D4AF37]/25 bg-gradient-to-br from-[#FCF9F6] to-[#F5F2ED] p-5 rounded-2xl space-y-4 shadow-sm">
                <p className="font-bold text-[9px] uppercase tracking-[0.2em] text-[#9CAF88]">AI Draft Output</p>
                <textarea
                  value={generatedText}
                  onChange={(e) => setGeneratedText(e.target.value)}
                  className="w-full bg-white border border-[#D4AF37]/15 rounded-xl p-3.5 text-xs h-40 font-serif leading-relaxed text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
                
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-2">
                  <span className="text-[10px] text-gray-400 font-medium">✓ Copy generated. You can edit directly. ({aiSource})</span>
                  <button
                    onClick={saveCampaign}
                    className="bg-[#1A1A1A] hover:bg-[#D4AF37] text-white font-bold text-[10px] uppercase tracking-wider py-2.5 px-5 rounded-full transition-colors duration-300 flex items-center gap-1.5 shadow"
                  >
                    Save &amp; Schedule Broadcast <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
                </div>
              </div>
            )}

            {campaignCreated && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-center font-semibold">
                ✓ Campaign scheduled in CRM pipeline. Staggered queue initialized.
              </div>
            )}

            {/* Past Campaigns */}
            <div className="border-t border-gray-100 pt-5 space-y-4">
              <p className="font-bold uppercase text-[9px] tracking-[0.2em] text-gray-400">Broadcast Campaign History</p>
              
              {savedCampaigns.map((camp) => (
                <div key={camp.id} className="border border-[#D4AF37]/10 bg-[#FCF9F6] rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <h5 className="font-bold text-gray-800 tracking-tight">{camp.title}</h5>
                    <span className={`px-2.5 py-1 rounded-full text-[8px] font-bold border uppercase tracking-wider ${camp.status === 'Sent' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {camp.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400">Segment: <strong className="text-gray-600">{camp.targetSegment}</strong> | Channel: <strong className="text-gray-600">{camp.channel}</strong></p>
                  <p className="text-[11px] text-gray-600 italic leading-relaxed bg-white/70 p-3 rounded-xl border border-gray-100">
                    "{camp.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
