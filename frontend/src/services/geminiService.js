import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
    constructor() {
        this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        this.genAI = null;
        this.model = null;
        this.chat = null;
        this.isInitialized = false;

        this.initialize();
    }

    initialize() {
        if (!this.apiKey) {
            console.error('Gemini API key not found');
            return;
        }

        try {
            console.log('Initializing Gemini with stable model...');
            this.genAI = new GoogleGenerativeAI(this.apiKey);

            // Reverting to 'gemini-1.5-flash' - The most stable and reliable model currently
            this.model = this.genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
                safetySettings: [
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
                ]
            });

            this.systemPrompt = `You are a helpful AI assistant for the FPT Greenwich Graduation Ceremony.

Context:
- Event: Graduation Ceremony 2024
- Date: June 15, 2024
- Location: Main Hall
- Max Guests: 3 per student
- Gown Collection: May 20 - June 10
- Help with: Registration, Tickets, Seats, Gowns.

Answer efficiently and politely. Use emojis.`;

            this.startChat();
            this.isInitialized = true;
        } catch (error) {
            console.error('Gemini initialization failed:', error);
        }
    }

    startChat() {
        if (!this.model) return;
        try {
            this.chat = this.model.startChat({
                history: [
                    { role: 'user', parts: [{ text: this.systemPrompt }] },
                    { role: 'model', parts: [{ text: 'Hello! I am ready to assist you with the Graduation Ceremony. 😊' }] }
                ]
            });
        } catch (e) {
            console.error('Chat start failed:', e);
        }
    }

    async sendMessage(message) {
        // Method 1: Try SDK first
        try {
            if (this.chat) {
                console.log('Sending via SDK...');
                // Check if chat is still valid, if not restart
                if (!this.chat.params) this.startChat();

                const result = await this.chat.sendMessage(message);
                const response = await result.response;
                return { success: true, message: response.text() };
            }
        } catch (sdkError) {
            console.error('SDK failed, switching to Direct API:', sdkError);
        }

        // Method 2: Direct REST API Fallback (No SDK dependency)
        try {
            console.log('Sending via Direct API...');
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            { role: 'user', parts: [{ text: this.systemPrompt }] },
                            { role: 'model', parts: [{ text: "I understand." }] },
                            { role: 'user', parts: [{ text: message }] }
                        ]
                    })
                }
            );

            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;
            return { success: true, message: text };

        } catch (apiError) {
            console.error('Direct API failed:', apiError);

            // Method 3: Local Fallback
            const fallback = this.getQuickResponse(message);
            if (fallback) {
                return {
                    success: true,
                    message: fallback + '\n\n(Offline mode - AI unavailable)'
                };
            }

            return {
                success: false,
                message: "I'm having trouble connecting right now. Please check your internet or try again later."
            };
        }
    }

    resetChat() {
        this.initialize();
    }

    getQuickResponse(query) {
        const q = query.toLowerCase();
        if (q.includes('register') || q.includes('đăng ký'))
            return "📝 To register: Go to the Registration page, fill your details, and submit. Check your email for confirmation!";
        if (q.includes('ticket') || q.includes('vé') || q.includes('qr'))
            return "🎫 Your ticket is in the 'My Ticket' section. Save the QR code for entry!";
        if (q.includes('locat') || q.includes('where') || q.includes('đâu'))
            return "📍 The ceremony is at the Main Hall on June 15, 2024.";
        if (q.includes('time') || q.includes('when') || q.includes('giờ'))
            return "⏰ Ceremony starts at 2:00 PM. Please arrive by 1:00 PM.";
        if (q.includes('gown') || q.includes('áo'))
            return "👔 Collect gowns from May 20-June 10 at the Student Services office.";

        return null;
    }
}

export default new GeminiService();
