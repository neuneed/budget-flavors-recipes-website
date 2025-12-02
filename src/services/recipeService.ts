'use server';

import OpenAI from "openai";
import { Recipe } from "../types";

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const searchAndTranslateRecipes = async (query: string): Promise<Recipe[]> => {
  const apiKey = process.env.MINIMAX_API_KEY;
  const baseURL = (process.env.MINIMAX_API_PROD || "https://api.minimaxi.com/v1").split(' ')[0].trim();

  if (!apiKey) throw new Error("MINIMAX_API_KEY not found");

  const client = new OpenAI({
    apiKey,
    baseURL,
  });

  // Prompt updated for MiniMax. Note: MiniMax via OpenAI SDK does not support the 'googleSearch' tool directly.
  // We rely on the model's internal knowledge or we would need to implement a search tool.
  // For now, we ask it to generate recipes based on its knowledge of BudgetBytes.
  const prompt = `
    You are a culinary expert familiar with 'budgetbytes.com' recipes.
    Your task is to provide recipes that are likely found on 'budgetbytes.com' based on the user's query: "${query}".

    INSTRUCTIONS:
    1. Identify 3-6 popular or relevant recipes from BudgetBytes that match the query.
    2. TRANSLATION: Provide the 'title', 'description', 'ingredients' (items), and 'instructions' (descriptions) in BOTH Spanish (default fields) and English (fields ending in 'En').
    3. OUTPUT FORMAT: Return ONLY a valid JSON array. No markdown, no code blocks, no conversation.

    JSON STRUCTURE:
    [
      {
        "title": "Titulo en Español",
        "titleEn": "Title in English",
        "description": "Breve descripción en Español",
        "descriptionEn": "Brief description in English",
        "originalUrl": "https://www.budgetbytes.com/...",
        "imageUrl": "URL of the recipe image (placeholder or real if known)",
        "prepTime": "15 mins",
        "cookTime": "30 mins",
        "servings": 4,
        "costEstimate": "$5.00 total",
        "tags": ["Cena", "Pollo", "Económico"],
        "ingredients": [
           {"item": "Nombre ingr. Español", "itemEn": "Name ingr. English", "quantity": "1 cup"}
        ],
        "instructions": [
           {"stepNumber": 1, "description": "Paso en Español", "descriptionEn": "Step in English"}
        ],
        "nutrition": {"calories": "300", "protein": "20g", "carbs": "40g", "fat": "10g"}
      }
    ]
  `;

  try {
    const response = await client.chat.completions.create({
      model: "MiniMax-M2",
      messages: [
        { role: "system", content: "You are a helpful assistant that outputs strictly JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7, // Recommended range (0, 1]
    });

    let text = response.choices[0].message.content;
    if (!text) return [];

    // Manually clean up markdown code blocks if the model includes them
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Ensure we are extracting the array part strictly
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');

    if (start !== -1 && end !== -1) {
      text = text.substring(start, end + 1);
    } else {
      console.warn("Valid JSON array not found in response, attempting loose parse", text);
    }

    let parsed: Partial<Recipe>[] = [];
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error("JSON Parse failed:", e);
      return [];
    }

    // Hydrate with client-side IDs and placeholder images if needed
    return parsed.map(r => ({
      ...r,
      id: generateId(),
      // Ensure image URL is valid or use a high-quality food placeholder
      imageUrl: r.imageUrl && r.imageUrl.startsWith('http')
        ? r.imageUrl
        : `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80`,
    })) as Recipe[];

  } catch (error) {
    console.error("MiniMax API Error:", error);
    throw error;
  }
};

// Initial simulated "Latest" recipes for the home page
export const getFeaturedRecipes = async (): Promise<Recipe[]> => {
  return searchAndTranslateRecipes("budgetbytes popular recipes top rated");
}
