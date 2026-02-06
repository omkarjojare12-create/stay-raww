
import { GoogleGenAI, Chat } from "@google/genai";
import { Product } from "../types";

// Ensure API_KEY is handled by the environment as per instructions.
// Do not add UI for key input.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("Gemini API key not found. Using mock functionality.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

let chat: Chat | null = null;

const initializeChat = () => {
    if (!API_KEY) return;
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: 'You are a friendly and helpful customer support assistant for an e-commerce store called STAY RAW. You will be provided with a JSON list of products to answer specific product-related questions about price, stock, descriptions, and ratings. If a user asks to compare products, use the data to create a helpful comparison. If a product isn\'t in the provided data, state that you can\'t find information on it. Keep answers concise. Use markdown for formatting like lists or bold text.',
            }
        });
    }
};

export const getChatResponse = async (message: string, products: Product[]): Promise<string> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (message.toLowerCase().includes('stock') || message.toLowerCase().includes('available')) {
            return "In mock mode, I can tell you that all our fantastic products are always in stock!";
        }
        return "I'm currently in mock mode. I can't process your product request right now, but thanks for asking!";
    }

    initializeChat();

    if (!chat) {
        return "Chat could not be initialized. Please check your API key.";
    }

    // Create a lean version of product data for the model to reduce token usage
    const productDataForModel = products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        discountPrice: p.discountPrice,
        stock: p.stock,
        rating: p.rating,
    }));

    const enrichedMessage = `
Context: Use the following JSON data of products to answer the user's question. Do not mention the JSON context unless asked for it.

Product Catalog:
${JSON.stringify(productDataForModel, null, 2)}

---

User Question:
"${message}"
`;

    try {
        const response = await chat.sendMessage({ message: enrichedMessage });
        return response.text ?? 'Sorry, I could not process that.';
    } catch (error) {
        console.error("Error getting chat response:", error);
        return "Sorry, I encountered an error. Please try again.";
    }
};


export const generateProductDescription = async (productName: string): Promise<string> => {
    if (!API_KEY) {
        return `This is a high-quality ${productName} with excellent features and a modern design. Perfect for your needs. It is built to last and provides great value for its price.`;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate a compelling and brief e-commerce product description for: ${productName}. Make it sound appealing and keep it under 50 words.`,
        });
        return response.text ?? `A fantastic ${productName} you will love.`;
    } catch (error) {
        console.error("Error generating product description with Gemini:", error);
        return `Discover the amazing features of the ${productName}. It is designed for performance and style.`;
    }
};

export const generateProductImage = async (productName: string): Promise<string> => {
    if (!API_KEY) {
        // Return a placeholder image if API key is not available
        return "https://picsum.photos/seed/product/400/400";
    }

    try {
        const prompt = `A professional, clean product photograph of a single "${productName}" on a plain white background, suitable for an e-commerce website. The image should be well-lit and in focus.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image data found in Gemini response.");

    } catch (error) {
        console.error("Error generating product image with Gemini:", error);
        // Fallback to a placeholder image on error
        return "https://picsum.photos/seed/error/400/400";
    }
};
