'use server';

import { Recipe } from "../types";

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock recipe data for development
const MOCK_RECIPES: Omit<Recipe, 'id' | 'createdAt'>[] = [
  {
    title: "Pollo al Limón con Ajo",
    titleEn: "Lemon Garlic Chicken",
    description: "Pechuga de pollo jugosa marinada con limón y ajo, perfecta para una cena rápida",
    descriptionEn: "Juicy chicken breast marinated with lemon and garlic, perfect for a quick dinner",
    originalUrl: "https://www.budgetbytes.com/wp-content/uploads/2022/12/Swedish-Meatballs-Overhead-Macro-With-Spoon.jpg",
    imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80",
    prepTime: "10 mins",
    cookTime: "25 mins",
    servings: 4,
    costEstimate: "$6.50 total",
    tags: ["Cena", "Pollo", "Económico", "Rápido"],
    ingredients: [
      { item: "Pechuga de pollo", itemEn: "Chicken breast", quantity: "1 lb" },
      { item: "Limones", itemEn: "Lemons", quantity: "2" },
      { item: "Ajo picado", itemEn: "Minced garlic", quantity: "4 cloves" },
      { item: "Aceite de oliva", itemEn: "Olive oil", quantity: "2 tbsp" },
      { item: "Sal y pimienta", itemEn: "Salt and pepper", quantity: "to taste" }
    ],
    instructions: [
      { stepNumber: 1, description: "Mezclar limón, ajo, aceite y especias", descriptionEn: "Mix lemon, garlic, oil and spices" },
      { stepNumber: 2, description: "Marinar el pollo durante 30 minutos", descriptionEn: "Marinate chicken for 30 minutes" },
      { stepNumber: 3, description: "Cocinar en sartén a fuego medio por 6-7 minutos por lado", descriptionEn: "Cook in pan over medium heat for 6-7 minutes per side" }
    ],
    nutrition: { calories: "280", protein: "32g", carbs: "4g", fat: "14g" }
  },
  {
    title: "Pasta Aglio e Olio",
    titleEn: "Garlic and Oil Pasta",
    description: "Pasta italiana clásica con ajo, aceite de oliva y chile",
    descriptionEn: "Classic Italian pasta with garlic, olive oil and chili",
    originalUrl: "https://www.budgetbytes.com/pasta-aglio-e-olio/",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80",
    prepTime: "5 mins",
    cookTime: "15 mins",
    servings: 4,
    costEstimate: "$3.20 total",
    tags: ["Pasta", "Vegetariano", "Rápido", "Italiano"],
    ingredients: [
      { item: "Espagueti", itemEn: "Spaghetti", quantity: "1 lb" },
      { item: "Ajo en láminas", itemEn: "Sliced garlic", quantity: "6 cloves" },
      { item: "Aceite de oliva", itemEn: "Olive oil", quantity: "1/3 cup" },
      { item: "Hojuelas de chile", itemEn: "Red pepper flakes", quantity: "1/2 tsp" },
      { item: "Perejil fresco", itemEn: "Fresh parsley", quantity: "1/4 cup" }
    ],
    instructions: [
      { stepNumber: 1, description: "Cocinar la pasta según las instrucciones del paquete", descriptionEn: "Cook pasta according to package instructions" },
      { stepNumber: 2, description: "Calentar aceite y dorar el ajo a fuego bajo", descriptionEn: "Heat oil and brown garlic over low heat" },
      { stepNumber: 3, description: "Mezclar pasta con ajo, chile y perejil", descriptionEn: "Toss pasta with garlic, chili and parsley" }
    ],
    nutrition: { calories: "420", protein: "12g", carbs: "58g", fat: "16g" }
  },
  {
    title: "Tacos de Frijoles Negros",
    titleEn: "Black Bean Tacos",
    description: "Tacos vegetarianos saludables con frijoles negros especiados",
    descriptionEn: "Healthy vegetarian tacos with spiced black beans",
    originalUrl: "https://www.budgetbytes.com/black-bean-tacos/",
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    prepTime: "10 mins",
    cookTime: "15 mins",
    servings: 6,
    costEstimate: "$4.80 total",
    tags: ["Mexicano", "Vegetariano", "Frijoles", "Saludable"],
    ingredients: [
      { item: "Frijoles negros en lata", itemEn: "Canned black beans", quantity: "2 cans" },
      { item: "Tortillas", itemEn: "Tortillas", quantity: "12" },
      { item: "Comino", itemEn: "Cumin", quantity: "1 tsp" },
      { item: "Aguacate", itemEn: "Avocado", quantity: "1" },
      { item: "Cilantro", itemEn: "Cilantro", quantity: "1/4 cup" }
    ],
    instructions: [
      { stepNumber: 1, description: "Calentar frijoles con comino y especias", descriptionEn: "Heat beans with cumin and spices" },
      { stepNumber: 2, description: "Calentar tortillas", descriptionEn: "Warm tortillas" },
      { stepNumber: 3, description: "Armar tacos con frijoles, aguacate y cilantro", descriptionEn: "Assemble tacos with beans, avocado and cilantro" }
    ],
    nutrition: { calories: "240", protein: "10g", carbs: "38g", fat: "6g" }
  },
  {
    title: "Arroz Frito con Vegetales",
    titleEn: "Vegetable Fried Rice",
    description: "Arroz frito casero con vegetales frescos y huevo",
    descriptionEn: "Homemade fried rice with fresh vegetables and egg",
    originalUrl: "https://www.budgetbytes.com/vegetable-fried-rice/",
    imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    prepTime: "15 mins",
    cookTime: "10 mins",
    servings: 4,
    costEstimate: "$5.50 total",
    tags: ["Asiático", "Arroz", "Vegetariano", "Rápido"],
    ingredients: [
      { item: "Arroz cocido", itemEn: "Cooked rice", quantity: "3 cups" },
      { item: "Vegetales mixtos congelados", itemEn: "Frozen mixed vegetables", quantity: "2 cups" },
      { item: "Huevos", itemEn: "Eggs", quantity: "2" },
      { item: "Salsa de soya", itemEn: "Soy sauce", quantity: "3 tbsp" },
      { item: "Aceite de sésamo", itemEn: "Sesame oil", quantity: "1 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, description: "Revolver huevos en el wok, reservar", descriptionEn: "Scramble eggs in wok, set aside" },
      { stepNumber: 2, description: "Saltear vegetales hasta que estén tiernos", descriptionEn: "Stir-fry vegetables until tender" },
      { stepNumber: 3, description: "Agregar arroz, huevo y salsa de soya, mezclar bien", descriptionEn: "Add rice, egg and soy sauce, mix well" }
    ],
    nutrition: { calories: "320", protein: "11g", carbs: "52g", fat: "8g" }
  },
  {
    title: "Sopa de Lentejas",
    titleEn: "Lentil Soup",
    description: "Sopa casera de lentejas con vegetales, reconfortante y nutritiva",
    descriptionEn: "Homemade lentil soup with vegetables, comforting and nutritious",
    originalUrl: "https://www.budgetbytes.com/lentil-soup/",
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    prepTime: "10 mins",
    cookTime: "35 mins",
    servings: 6,
    costEstimate: "$4.20 total",
    tags: ["Sopa", "Lentejas", "Vegetariano", "Saludable"],
    ingredients: [
      { item: "Lentejas secas", itemEn: "Dry lentils", quantity: "1 cup" },
      { item: "Zanahorias picadas", itemEn: "Diced carrots", quantity: "2" },
      { item: "Apio picado", itemEn: "Diced celery", quantity: "2 stalks" },
      { item: "Caldo de vegetales", itemEn: "Vegetable broth", quantity: "6 cups" },
      { item: "Comino", itemEn: "Cumin", quantity: "1 tsp" }
    ],
    instructions: [
      { stepNumber: 1, description: "Saltear zanahorias y apio hasta que ablanden", descriptionEn: "Sauté carrots and celery until softened" },
      { stepNumber: 2, description: "Agregar lentejas, caldo y especias", descriptionEn: "Add lentils, broth and spices" },
      { stepNumber: 3, description: "Cocinar a fuego lento por 30-35 minutos", descriptionEn: "Simmer for 30-35 minutes" }
    ],
    nutrition: { calories: "180", protein: "12g", carbs: "32g", fat: "1g" }
  },
  {
    title: "Ensalada de Quinoa Mediterránea",
    titleEn: "Mediterranean Quinoa Salad",
    description: "Ensalada fresca de quinoa con pepino, tomate y queso feta",
    descriptionEn: "Fresh quinoa salad with cucumber, tomato and feta cheese",
    originalUrl: "https://www.budgetbytes.com/mediterranean-quinoa-salad/",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    prepTime: "15 mins",
    cookTime: "15 mins",
    servings: 4,
    costEstimate: "$7.00 total",
    tags: ["Ensalada", "Quinoa", "Mediterráneo", "Vegetariano"],
    ingredients: [
      { item: "Quinoa", itemEn: "Quinoa", quantity: "1 cup" },
      { item: "Pepino picado", itemEn: "Diced cucumber", quantity: "1" },
      { item: "Tomates cherry", itemEn: "Cherry tomatoes", quantity: "1 cup" },
      { item: "Queso feta", itemEn: "Feta cheese", quantity: "1/2 cup" },
      { item: "Aceitunas", itemEn: "Olives", quantity: "1/4 cup" }
    ],
    instructions: [
      { stepNumber: 1, description: "Cocinar quinoa según instrucciones, dejar enfriar", descriptionEn: "Cook quinoa per instructions, let cool" },
      { stepNumber: 2, description: "Picar todos los vegetales", descriptionEn: "Chop all vegetables" },
      { stepNumber: 3, description: "Mezclar todo con aceite de oliva y limón", descriptionEn: "Mix everything with olive oil and lemon" }
    ],
    nutrition: { calories: "290", protein: "10g", carbs: "38g", fat: "11g" }
  }
];

// Mock implementation - no API calls during development
export const searchAndTranslateRecipes = async (query: string): Promise<Recipe[]> => {
  console.log(`[MOCK] Searching for: ${query}`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return all mock recipes with unique IDs and timestamps
  return MOCK_RECIPES.map(recipe => ({
    ...recipe,
    id: generateId(),
    createdAt: Date.now()
  }));
};

// Initial simulated "Latest" recipes for the home page
export const getFeaturedRecipes = async (): Promise<Recipe[]> => {
  console.log("[MOCK] Loading featured recipes");
  return searchAndTranslateRecipes("featured");
};
