
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `
You are an intelligent, secure, and citizen-friendly WhatsApp chatbot developed for Vadodara Municipal Corporation (VMC).
Your primary goal is to assist citizens by answering their queries, resolving common civic issues, and delivering official municipal information in a simple, polite, and accurate manner.

LANGUAGE SUPPORT:
Automatically detect and respond in the user's preferred language (Gujarati, Hindi, or English). If the user switches language mid-conversation, continue in the new language.

CORE RESPONSIBILITIES:
1. Answer general queries: Property tax, water supply, garbage collection, road repairs, streetlight complaints, certificates (birth/death), building permissions, health services, and emergency contacts.
2. Complaint Assistance: Guide users step-by-step. Ask for location, issue type, and description.
3. Property Tax: Explain calculation, deadlines, and penalties. Ask for Property ID (e.g., mention it starts with a zone code) before showing bills.
4. Professional Style: Use short, clear sentences. Be empathetic and professional. 

SECURITY & PRIVACY:
- Never assume personal data. 
- Ask permission before requesting identifiers.
- Do not store or reuse personal information beyond the current session.

LIMITATIONS:
- No legal advice.
- No false promises or guessed deadlines.
- Prefer accuracy. If unsure, suggest contacting VMC support: 1800-233-0265 or vmc.gov.in.

CONTEXT:
Vadodara (Baroda) is a major city in Gujarat. VMC handles municipal duties.
`;

export const getGeminiResponse = async (history: Message[]) => {
  const apiKey = process.env.GEMINI_API_KEY;

  // Check if API key is missing or placeholder
  if (!apiKey || apiKey === "PLACEHOLDER_API_KEY" || apiKey.trim() === "") {
    console.warn("No valid API key found. Using fallback responses.");
    return getFallbackResponse(history);
  }

  const ai = new GoogleGenAI({ apiKey });

  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents as any,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      }
    });

    return response.text || "I apologize, I'm having trouble connecting to the VMC servers. Please try again later.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return getFallbackResponse(history);
  }
};

const getFallbackResponse = (history: Message[]) => {
  const lastMessage = history[history.length - 1];
  const userMessage = lastMessage?.content?.toLowerCase() || "";

  // Simple keyword-based responses for demo purposes
  if (userMessage.includes("property tax") || userMessage.includes("tax")) {
    return "🏠 **Property Tax Information**\n\nTo check your property tax:\n• Visit VMC website: vmc.gov.in\n• Use your Property ID (starts with zone code)\n• Online payment available\n• Due date: March 31st\n\nFor detailed info, call: 1800-233-0265";
  }

  if (userMessage.includes("water") || userMessage.includes("supply")) {
    return "💧 **Water Supply Issues**\n\nFor water-related problems:\n• Report leakages: 1916\n• New connection: Visit VMC office\n• Water quality: 1915\n• Emergency: 108\n\n24/7 helpline: 1800-233-0265";
  }

  if (userMessage.includes("garbage") || userMessage.includes("waste") || userMessage.includes("trash")) {
    return "🗑️ **Garbage Collection**\n\n• Collection time: 7-9 AM & 5-7 PM\n• Segregate: Wet, Dry, Hazardous\n• Bulk waste: Call 1916\n• Complaint: VMC mobile app\n\nKeep Vadodara clean! 🧹";
  }

  if (userMessage.includes("complaint") || userMessage.includes("status")) {
    return "📄 **Complaint Status**\n\nTo check complaint status:\n• Visit: vmc.gov.in/complaints\n• Use complaint ID\n• Call: 1800-233-0265\n• Mobile app: VMC Connect\n\nWe track all complaints! 🔍";
  }

  if (userMessage.includes("emergency") || userMessage.includes("urgent")) {
    return "🚨 **Emergency Contacts**\n\n• Fire: 101\n• Police: 100\n• Ambulance: 102/108\n• VMC Helpline: 1800-233-0265\n\nFor civic emergencies, call VMC! 🏢";
  }

  if (userMessage.includes("hello") || userMessage.includes("hi") || userMessage.includes("namaste")) {
    return "🙏 **Welcome to VMC Citizen Connect!**\n\nI'm here to help with:\n✅ Property Tax Information\n✅ Water & Garbage Issues\n✅ Complaint Registration\n✅ Certificate Services\n✅ Emergency Contacts\n\nWhat would you like to know?";
  }

  // Default response
  return "I'm here to help with VMC services! 🏢\n\nFor quick help, try asking about:\n• Property Tax 💸\n• Water Supply 💧\n• Garbage Collection 🗑️\n• Complaint Status 📄\n• Emergency Services 🚨\n\nFor detailed assistance: 1800-233-0265";
};
