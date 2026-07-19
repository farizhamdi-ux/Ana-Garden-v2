import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client to prevent server crashes if the API Key is unconfigured
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
      console.warn('GEMINI_API_KEY is not configured or placeholder. AI features will fallback to simulation mode.');
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// System instruction reflecting Ana's gentle educator philosophy, Mt Kinabalu backdrop, and Cameron Highlands freshness
const SYSTEM_CHAT_INSTRUCTION = `You are Ana's AI Bouquet Assistant. Ana's Garden is a premium boutique florist in Kota Kinabalu, Sabah, Malaysia. 
Our founder, Ana, is a former educator who believes flowers are expressions of emotions, hope, and connection. 
Our flowers are sourced fresh daily from Cameron Highlands and Kundasang (near Mt. Kinabalu).
Your tone is gentle, nurturing, professional, poetic, and highly personalized.
When users describe an occasion, budget (usually in RM), or recipient, recommend specific customized combinations.
Keep recommendations realistic, citing estimated vase lives and freshness scores (typically 90-100%).
Suggest upselling add-ons like premium chocolates, balloon bundles, teddy bears, or natural KK perfumes if the budget allows.
Mention local Kota Kinabalu delivery (like Damai, Lintas, Penampang, Likas, Tanjung Aru) and 90-minute express service.
Keep responses beautifully structured and concise (around 150-200 words).`;

// API 1: AI Bouquet Concierge & Chat Assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback response if GEMINI_API_KEY is missing
      const simulatedText = simulateChatResponse(message);
      return res.json({ text: simulatedText, source: 'Simulated' });
    }

    // Call Gemini using the correct @google/genai method: ai.models.generateContent
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: message,
      config: {
        systemInstruction: SYSTEM_CHAT_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const text = response.text || 'I am processing your beautiful request...';
    res.json({ text, source: 'Gemini' });
  } catch (error: any) {
    console.error('Error calling Gemini chat API:', error);
    res.status(500).json({ error: error.message || 'Error occurred in Gemini communication' });
  }
});

// API 2: AI Inventory Demand & Procurement Forecast
app.post('/api/forecast', async (req, res) => {
  try {
    const { historicalSummary, upcomingHolidays } = req.body;
    const ai = getGeminiClient();

    const prompt = `Analyze this raw flower inventory data and upcoming cultural holidays in Sabah:
Historical Summary: ${JSON.stringify(historicalSummary)}
Upcoming Holidays: ${JSON.stringify(upcomingHolidays)}

Deliver:
1. Demand predictions for Roses, Lilies, Orchids, Hydrangeas, and Carnations (High, Medium, Low).
2. Predicted stem requirements for the upcoming weeks.
3. Waste & Freshness optimization tips for Sabah's tropical climate.
4. Specific local procurement actions for Cameron Highlands suppliers.

Format your output strictly as a JSON object matching this TypeScript structure:
{
  "recommendations": string[],
  "predictions": { "flowerName": string, "forecastDemand": "High" | "Medium" | "Low", "suggestedOrderQty": number, "confidence": number }[],
  "businessInsights": string
}`;

    if (!ai) {
      // Fallback mock JSON
      const simulatedData = simulateForecastData();
      return res.json({ ...simulatedData, source: 'Simulated' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text?.trim() || '{}';
    try {
      const parsed = JSON.parse(text);
      res.json({ ...parsed, source: 'Gemini' });
    } catch {
      res.json({ ...simulateForecastData(), source: 'Gemini-Failed-Parse' });
    }
  } catch (error: any) {
    console.error('Error calling Gemini forecast API:', error);
    res.status(500).json({ error: error.message || 'Error forecasting demand' });
  }
});

// API 3: AI Personalized Greeting Card Generator
app.post('/api/generate-card', async (req, res) => {
  try {
    const { occasion, recipient, relationship, tone, additionalDetails } = req.body;
    const ai = getGeminiClient();

    const prompt = `Write a premium, deeply touching, elegant greeting card message.
Occasion: ${occasion}
Recipient: ${recipient}
Relationship: ${relationship}
Tone requested: ${tone} (e.g. romantic, grateful, poetic, comforting, encouraging)
Special memories or local details: ${additionalDetails}

Make it feel handwritten, authentic, and exceptionally beautiful. Avoid clichés; tap into genuine human warmth.
Provide 2 alternative options (Option A and Option B).`;

    if (!ai) {
      const simulatedText = simulateCardResponse(occasion, recipient, relationship, tone, additionalDetails);
      return res.json({ text: simulatedText, source: 'Simulated' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
      },
    });

    res.json({ text: response.text || 'May your days bloom with eternal happiness.', source: 'Gemini' });
  } catch (error: any) {
    console.error('Error generating card:', error);
    res.status(500).json({ error: error.message });
  }
});

// API 4: AI CRM Marketing & Campaign Copies
app.post('/api/generate-promo', async (req, res) => {
  try {
    const { campaignTitle, targetSegment, channel } = req.body;
    const ai = getGeminiClient();

    const prompt = `Generate a highly engaging, luxurious marketing copy for Ana's Garden Florist.
Campaign: ${campaignTitle}
Target Audience Segment: ${targetSegment} (e.g. corporate clients, luxury spenders, anniversary members)
Channel: ${channel} (WhatsApp, Email, or SMS)

Our brand represents Mount Kinabalu morning dew, Cameron Highlands floral fields, and elegant smart gifting.
Create a compelling subject line (for Email) or opening hook, the body text with soft persuasion, and a call-to-action promoting our 90-minute KK doorstep delivery or Bloom Rewards points.`;

    if (!ai) {
      const simulatedText = simulatePromoResponse(campaignTitle, targetSegment, channel);
      return res.json({ text: simulatedText, source: 'Simulated' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || 'Celebrate life with beautiful blooms.', source: 'Gemini' });
  } catch (error: any) {
    console.error('Error generating promo:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper: Simulate chat when Gemini key is absent
function simulateChatResponse(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes('wife') || msg.includes('romance') || msg.includes('love') || msg.includes('anniversary')) {
    return `🌸 *Ana's Flower Recommendation* 🌸\n\nFor a cherished anniversary gesture, I highly recommend our signature **Kinabalu Sunrise Bouquet** (RM185.00). \n\nIt features fresh Cameron Highlands blush roses beautifully balanced with white Kundasang lilies and silver eucalyptus. Lilies represent purity and deep commitment, while blush roses convey absolute admiration.\n\n*Freshness guarantee: 92% Freshness Score (Approx. 9 days vase life).* \n\nWould you like me to customize this with a touch of gold ribbons, premium chocolates (+RM25), or a handwritten message card? We can deliver this to Penampang, Lintas, or Tanjung Aru within 90 minutes!`;
  }
  if (msg.includes('budget') || msg.includes('rm150') || msg.includes('rm 150') || msg.includes('price') || msg.includes('cheap')) {
    return `🌿 *Ana's Budget Recommendation* 🌿\n\nUnder RM150, our beautiful **Sabah Classic Crimson** (RM145.00) is a breathtaking luxury selection. It features 12 hand-selected deep crimson roses fresh from our Cameron Highlands growers, bound elegantly in premium charcoal organic craft wrap.\n\n*Freshness guarantee: 95% Freshness Score (approx. 8 days vase life).* \n\nIt includes a complimentary hand-printed parchment greeting card with your words, and qualifies for free standard shipping in Kota Kinabalu city center!`;
  }
  if (msg.includes('sorry') || msg.includes('apolog') || msg.includes('forgive')) {
    return `🤍 *Ana's Graceful Apology Recommendation* 🤍\n\nTo convey a sincere apology, the **Graceful Sunset Lily** (RM160.00) is highly symbolic. Pristine white Kundasang lilies nestled amongst soft yellow carnations reflect healing, humility, and peaceful recovery. \n\n*Freshness guarantee: 90% Freshness Score.*\n\nLet us add a note that expresses your words with absolute sincerity. I can schedule delivery to her workplace in Tanjung Aru or Damai today.`;
  }
  return `✨ *Hello from Ana's Garden!* \n\nI am Ana's AI Bouquet Concierge. Our flowers are harvested directly from Cameron Highlands and Kundasang mountain slopes, ensuring unmatched fragrance and vitality in Kota Kinabalu. \n\nTell me about the special person you're buying for, your budget, or the emotion you want to express (e.g. apology, celebratory, gratitude, or comfort). I will find the perfect floral pairing for you.`;
}

// Helper: Simulate forecast data when Gemini key is absent
function simulateForecastData() {
  return {
    recommendations: [
      'Increase Cameron Red Rose orders by 35% in anticipation of the upcoming wedding and graduation seasons in Kota Kinabalu.',
      'Establish early pre-orders for Sabah Blue Hydrangea from local Kundasang smallholders due to high birthday demand.',
      'Release a targeted WhatsApp marketing blast to corporate anniversary accounts to clear incoming Purple Orchid reserves.',
      'Optimize delivery schedules for early morning to beat the Lintas-Penampang peak traffic hours.'
    ],
    predictions: [
      { flowerName: 'Cameron Red Rose', forecastDemand: 'High', suggestedOrderQty: 450, confidence: 94 },
      { flowerName: 'Cameron Blush Rose', forecastDemand: 'High', suggestedOrderQty: 250, confidence: 91 },
      { flowerName: 'Kundasang White Lily', forecastDemand: 'Medium', suggestedOrderQty: 180, confidence: 88 },
      { flowerName: 'Sabah Blue Hydrangea', forecastDemand: 'High', suggestedOrderQty: 120, confidence: 85 },
      { flowerName: 'Cameron Yellow Carnation', forecastDemand: 'Low', suggestedOrderQty: 150, confidence: 79 }
    ],
    businessInsights: 'With the upcoming wedding registrations at local KK registration offices and the UMS Graduation period, demand is heavily skewed towards premium roses and baby breath. Maintaining a 1-day safety stock buffer is recommended due to potential highway transport delays from Cameron Highlands.'
  };
}

// Helper: Simulate Greeting Card
function simulateCardResponse(occasion: string, recipient: string, relationship: string, tone: string, additionalDetails: string): string {
  return `💖 **Option A (Warm & Romantic)**\n"To my dearest ${recipient},\n\nEvery day with you feels like a fresh bloom in Mount Kinabalu's sunrise mist. Happy ${occasion}! Thank you for nurturing our family with your absolute grace, love, and patience. You are my eternal sanctuary.\n\nWith all my heart, always."\n\n\n✨ **Option B (Poetic & Sophisticated)**\n"Dearest ${recipient},\n\nJust as flowers turn towards the soft morning light, my heart turns to you. On this beautiful ${occasion}, I celebrate every season we've shared, and look forward to all the gardens we have yet to grow together. ${additionalDetails ? additionalDetails : 'Thank you for your beautiful soul.'}\n\nWith everlasting devotion."`;
}

// Helper: Simulate CRM campaign copies
function simulatePromoResponse(campaignTitle: string, targetSegment: string, channel: string): string {
  if (channel === 'WhatsApp') {
    return `📱 **WhatsApp Broadcast Copy**\n\n"Hello there, Bloom Club Member! 🌸\n\nOur Cameron Highlands transport just arrived at Ana's Garden boutique with the freshest seasonal blossoms of the month. \n\n*Special Campaign: ${campaignTitle}*\n\nExclusively for our premium ${targetSegment}, enjoy **15% off** on our hand-tied custom bouquets and earn **Double Bloom Points**! 🌟\n\n🚀 Need it urgently? Enjoy our signature **90-minute express doorstep delivery** anywhere in Kota Kinabalu, Lintas, Penampang, and Likas. \n\nClick to customize your dream arrangement now: anasgarden.com.my/shop"`;
  }
  return `📧 **Email Newsletter Copy**\n\n**Subject Line:** Fresh from Cameron Highlands: An exclusive invitation for our ${targetSegment} ✨\n\nDear Bloom Admirer,\n\nAt Ana's Garden, we believe that flowers are more than beautiful arrangements—they are expressions of life's most meaningful milestones. \n\nIn honor of **${campaignTitle}**, we've curated a stunning new collection of premium orchids, blushing roses, and pristine Kundasang lilies specifically for our valued ${targetSegment}.\n\nAs a subscriber, enjoy priority booking, custom greeting card printouts, and complimentary 90-minute courier service across Kota Kinabalu.\n\n**Earn 150 Bloom Loyalty Points** on your first purchase this weekend!\n\nWarmly,\nAziliana Ying & The Smart Florist Team\nAna's Garden KK`;
}

// Vite integration middleware
async function startServer() {
  // Integrate Vite dev middleware or serve production static assets
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Florist full-stack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
