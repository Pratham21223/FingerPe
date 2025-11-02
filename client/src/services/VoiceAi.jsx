import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const contacts = {
  'john': '9876543210',
  'john doe': '9876543210',
  'jane': '9123456789',
  'jane smith': '9123456789',
  'mom': '8765432109',
  'dad': '9654321098',
  'brother': '7654321098',
  'sister': '6543210987',
};

export const processCommandWithGemini = async (userTranscript) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `You are Fingu, a voice assistant for a wallet app. Be concise (max 2 sentences).

Available contacts: ${JSON.stringify(contacts)}

User said: "${userTranscript}"

Respond ONLY in JSON:
{
  "action": "scan_qr" | "contact_payment" | "acknowledge",
  "response": "Your response here",
  "contactName": "name or null",
  "phoneNumber": "10-digit number or null",
  "amount": number or null
}`;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      action: 'acknowledge',
      response: 'How can I help?',
      contactName: null,
      phoneNumber: null,
      amount: null
    };
  } catch (error) {
    console.error('Gemini error:', error);
    return {
      action: 'acknowledge',
      response: 'Sorry, try again.',
      contactName: null,
      phoneNumber: null,
      amount: null
    };
  }
};

export const extractPhoneNumber = (text) => {
  const phoneRegex = /\b[6-9]\d{9}\b/;
  const match = text.match(phoneRegex);
  return match ? match[0] : null;
};

export const extractAmount = (text) => {
  const amountRegex = /(?:rupees?|rs\.?|\₹|send|pay)\s*(\d+(?:,\d{3})*(?:\.\d{2})?|\d+)/gi;
  const match = text.match(amountRegex);
  if (match) {
    const numberStr = match[0].replace(/[^\d]/g, '');
    return parseInt(numberStr);
  }
  return null;
};

export const findContactByName = (text) => {
  const lowerText = text.toLowerCase();
  for (const [name, number] of Object.entries(contacts)) {
    if (lowerText.includes(name)) {
      return { name, number };
    }
  }
  return null;
};
