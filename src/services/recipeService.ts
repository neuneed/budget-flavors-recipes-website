'use server';

import OpenAI from "openai";
import { Recipe, Ingredient, InstructionStep } from "../types";
import { supabase } from "../lib/supabase";

// Types for AI-generated recipes and database operations
interface AIRecipeIngredient {
  item: string;
  itemEn?: string;
  quantity: string;
}

interface AIRecipeInstruction {
  stepNumber?: number;
  description: string;
  descriptionEn?: string;
}

interface AIRecipe {
  id?: number | string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  author?: string;
  originalUrl: string;
  imageUrl?: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  costEstimate?: string;
  tags?: string[];
  ingredients: AIRecipeIngredient[];
  instructions: AIRecipeInstruction[];
  nutrition?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
}

interface DbRecipe {
  id: number;
  title: string;
  description: string;
  author: string | null;
  original_url: string;
  image_url: string | null;
  prep_time: string;
  cook_time: string;
  servings: number;
  cost_estimate: string | null;
  tags: string[];
  rating: number;
  rating_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  ingredients?: Array<{
    item: string;
    quantity: string;
    ingredient_index: number;
  }>;
  instructions?: Array<{
    description: string;
    step_index: number;
  }>;
  nutrition?: Array<{
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  }>;
}

interface RecipeTranslations {
  recipe?: {
    title?: string | null;
    description?: string | null;
  } | null;
  ingredients?: Array<{
    ingredient_index: number;
    item: string;
  }> | null;
  instructions?: Array<{
    step_index: number;
    description: string;
  }> | null;
}

export const searchAndTranslateRecipes = async (query: string): Promise<Recipe[]> => {
  const apiKey = process.env.MINIMAX_API_KEY;
  const baseURL = (process.env.MINIMAX_API_PROD || "https://api.minimaxi.com/v1").split(' ')[0].trim();

  if (!apiKey) throw new Error("MINIMAX_API_KEY not found");

  const client = new OpenAI({
    apiKey,
    baseURL,
  });

  // Prompt for AI recipe generation - works with any recipe source
  const prompt = `
    You are a culinary expert specializing in budget-friendly, home cooking recipes.
    Your task is to provide recipes based on the user's query: "${query}".

    INSTRUCTIONS:
    1. Identify 3-6 popular, practical recipes that match the query.
    2. Focus on affordable, easy-to-follow recipes perfect for home cooks.
    3. TRANSLATION: Provide the 'title', 'description', 'ingredients' (items), and 'instructions' (descriptions) in BOTH Spanish (default fields) and English (fields ending in 'En').
    4. OUTPUT FORMAT: Return ONLY a valid JSON array. No markdown, no code blocks, no conversation.

    JSON STRUCTURE:
    [
      {
        "title": "Titulo en Español",
        "titleEn": "Title in English",
        "description": "Breve descripción en Español",
        "descriptionEn": "Brief description in English",
        "originalUrl": "https://example.com/recipe-name",
        "imageUrl": "https://images.unsplash.com/photo-relevant-food-image",
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

    REQUIREMENTS:
    - Use real Unsplash food images (search for relevant food type)
    - Provide realistic cost estimates
    - Include complete ingredient quantities and clear step-by-step instructions
    - Ensure recipes are practical and achievable for home cooks
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
    return parsed.map((r): Recipe => ({
      id: typeof r.id === 'string' ? parseInt(r.id as string, 10) : (r.id as number || 0),
      title: r.title || '',
      description: r.description || '',
      author: r.author,
      originalUrl: r.originalUrl || '',
      imageUrl: r.imageUrl && r.imageUrl.startsWith('http')
        ? r.imageUrl
        : `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80`,
      prepTime: r.prepTime || '',
      cookTime: r.cookTime || '',
      servings: r.servings || 0,
      costEstimate: r.costEstimate,
      ingredients: r.ingredients || [],
      instructions: r.instructions || [],
      nutrition: r.nutrition,
      tags: r.tags || [],
      rating: r.rating,
      ratingCount: r.ratingCount,
      viewCount: r.viewCount,
      createdAt: r.createdAt || new Date().toISOString(),
      updatedAt: r.updatedAt || new Date().toISOString(),
    }));

  } catch (error) {
    console.error("MiniMax API Error:", error);
    throw error;
  }
};

// Fetch recipes from Supabase database
export const getRecipes = async (limit: number = 10, offset: number = 0): Promise<Recipe[]> => {
  const { data, error } = await supabase
    .from('recipes_full')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }

  return data?.map(formatRecipeFromDb) || [];
};

// Get a single recipe by ID
export const getRecipeById = async (id: number, locale: string = 'en'): Promise<Recipe | null> => {
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .select(`
      *,
      ingredients (item, quantity, ingredient_index),
      instructions (description, step_index),
      nutrition (calories, protein, carbs, fat)
    `)
    .eq('id', id)
    .single();

  if (recipeError || !recipe) {
    console.error('Error fetching recipe:', recipeError);
    return null;
  }

  // Fetch translations if locale is not English
  let translations: RecipeTranslations | null = null;
  if (locale !== 'en') {
    const { data: transData } = await supabase
      .from('recipe_translations')
      .select('title, description')
      .eq('recipe_id', id)
      .eq('locale', locale)
      .single();

    const { data: ingredientTrans } = await supabase
      .from('ingredient_translations')
      .select('ingredient_index, item')
      .eq('recipe_id', id)
      .eq('locale', locale);

    const { data: instructionTrans } = await supabase
      .from('instruction_translations')
      .select('step_index, description')
      .eq('recipe_id', id)
      .eq('locale', locale);

    translations = {
      recipe: transData,
      ingredients: ingredientTrans,
      instructions: instructionTrans,
    };
  }

  return formatRecipeWithTranslations(recipe as DbRecipe, translations);
};

// Search recipes (AI-powered or database search)
export const searchRecipes = async (query: string, useAI: boolean = true): Promise<Recipe[]> => {
  if (useAI) {
    // Use AI to generate recipe suggestions
    return searchAndTranslateRecipes(query);
  } else {
    // Simple database search
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        ingredients (item, quantity, ingredient_index),
        instructions (description, step_index),
        nutrition (calories, protein, carbs, fat)
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(20);

    if (error) {
      console.error('Error searching recipes:', error);
      return [];
    }

    return data?.map(r => formatRecipeWithTranslations(r, null)) || [];
  }
};

// Save AI-generated recipes to database
export const saveRecipesToDb = async (recipes: AIRecipe[]): Promise<number[]> => {
  const savedIds: number[] = [];

  for (const recipe of recipes) {
    try {
      // Insert main recipe
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          title: recipe.titleEn || recipe.title,
          description: recipe.descriptionEn || recipe.description,
          author: recipe.author || 'Budget Bytes',
          original_url: recipe.originalUrl,
          image_url: recipe.imageUrl,
          prep_time: recipe.prepTime,
          cook_time: recipe.cookTime,
          servings: recipe.servings,
          cost_estimate: recipe.costEstimate,
          tags: recipe.tags || [],
        })
        .select('id')
        .single();

      if (recipeError || !recipeData) {
        console.error('Error saving recipe:', recipeError);
        continue;
      }

      const recipeId = recipeData.id;
      savedIds.push(recipeId);

      // Insert ingredients
      if (recipe.ingredients && recipe.ingredients.length > 0) {
        const ingredients = recipe.ingredients.map((ing, index) => ({
          recipe_id: recipeId,
          ingredient_index: index,
          item: ing.itemEn || ing.item,
          quantity: ing.quantity,
        }));
        await supabase.from('ingredients').insert(ingredients);

        // Insert Spanish translations if available
        const ingredientTrans = recipe.ingredients
          .filter((ing) => ing.item && ing.item !== ing.itemEn)
          .map((ing, index) => ({
            recipe_id: recipeId,
            ingredient_index: index,
            locale: 'es',
            item: ing.item,
          }));
        if (ingredientTrans.length > 0) {
          await supabase.from('ingredient_translations').insert(ingredientTrans);
        }
      }

      // Insert instructions
      if (recipe.instructions && recipe.instructions.length > 0) {
        const instructions = recipe.instructions.map((inst, index) => ({
          recipe_id: recipeId,
          step_index: inst.stepNumber ? inst.stepNumber - 1 : index,
          description: inst.descriptionEn || inst.description,
        }));
        await supabase.from('instructions').insert(instructions);

        // Insert Spanish translations if available
        const instructionTrans = recipe.instructions
          .filter((inst) => inst.description && inst.description !== inst.descriptionEn)
          .map((inst, index) => ({
            recipe_id: recipeId,
            step_index: inst.stepNumber ? inst.stepNumber - 1 : index,
            locale: 'es',
            description: inst.description,
          }));
        if (instructionTrans.length > 0) {
          await supabase.from('instruction_translations').insert(instructionTrans);
        }
      }

      // Insert nutrition
      if (recipe.nutrition) {
        await supabase.from('nutrition').insert({
          recipe_id: recipeId,
          calories: recipe.nutrition.calories,
          protein: recipe.nutrition.protein,
          carbs: recipe.nutrition.carbs,
          fat: recipe.nutrition.fat,
        });
      }

      // Insert recipe translations
      if (recipe.title && recipe.title !== recipe.titleEn) {
        await supabase.from('recipe_translations').insert({
          recipe_id: recipeId,
          locale: 'es',
          title: recipe.title,
          description: recipe.description,
        });
      }
    } catch (error) {
      console.error('Error saving recipe to database:', error);
    }
  }

  return savedIds;
};

// Format recipe from database view
function formatRecipeFromDb(dbRecipe: DbRecipe): Recipe {
  const ingredients = (dbRecipe.ingredients || [])
    .sort((a, b) => a.ingredient_index - b.ingredient_index)
    .map((ing) => ({
      item: ing.item,
      quantity: ing.quantity,
    }));

  const instructions = (dbRecipe.instructions || [])
    .sort((a, b) => a.step_index - b.step_index)
    .map((inst) => ({
      description: inst.description,
    }));

  return {
    id: dbRecipe.id,
    title: dbRecipe.title,
    description: dbRecipe.description,
    author: dbRecipe.author || undefined,
    originalUrl: dbRecipe.original_url,
    imageUrl: dbRecipe.image_url || undefined,
    prepTime: dbRecipe.prep_time,
    cookTime: dbRecipe.cook_time,
    servings: dbRecipe.servings,
    costEstimate: dbRecipe.cost_estimate || undefined,
    ingredients,
    instructions,
    nutrition: dbRecipe.nutrition?.[0],
    tags: dbRecipe.tags || [],
    rating: dbRecipe.rating || 0,
    ratingCount: dbRecipe.rating_count || 0,
    viewCount: dbRecipe.view_count || 0,
    createdAt: dbRecipe.created_at,
    updatedAt: dbRecipe.updated_at,
  };
}

// Format recipe with translations
function formatRecipeWithTranslations(recipe: DbRecipe, translations: RecipeTranslations | null): Recipe {
  const ingredients: Ingredient[] = (recipe.ingredients || [])
    .sort((a, b) => a.ingredient_index - b.ingredient_index)
    .map((ing) => {
      const trans = translations?.ingredients?.find((t) => t.ingredient_index === ing.ingredient_index);
      return {
        item: trans?.item || ing.item,
        quantity: ing.quantity,
      };
    });

  const instructions: InstructionStep[] = (recipe.instructions || [])
    .sort((a, b) => a.step_index - b.step_index)
    .map((inst) => {
      const trans = translations?.instructions?.find((t) => t.step_index === inst.step_index);
      return {
        description: trans?.description || inst.description,
      };
    });

  return {
    id: recipe.id,
    title: translations?.recipe?.title || recipe.title,
    description: translations?.recipe?.description || recipe.description,
    author: recipe.author || undefined,
    originalUrl: recipe.original_url,
    imageUrl: recipe.image_url || undefined,
    prepTime: recipe.prep_time,
    cookTime: recipe.cook_time,
    servings: recipe.servings,
    costEstimate: recipe.cost_estimate || undefined,
    ingredients,
    instructions,
    nutrition: recipe.nutrition?.[0],
    tags: recipe.tags || [],
    rating: recipe.rating || 0,
    ratingCount: recipe.rating_count || 0,
    viewCount: recipe.view_count || 0,
    createdAt: recipe.created_at,
    updatedAt: recipe.updated_at,
  };
}

// Initial simulated "Latest" recipes for the home page
export const getFeaturedRecipes = async (): Promise<Recipe[]> => {
  // First try to get recipes from database
  const dbRecipes = await getRecipes(6, 0);

  if (dbRecipes.length > 0) {
    return dbRecipes;
  }

  // If no recipes in database, generate some with AI and save them
  const aiRecipes = await searchAndTranslateRecipes("popular easy budget-friendly dinner recipes");
  if (aiRecipes.length > 0) {
    await saveRecipesToDb(aiRecipes);
  }

  return aiRecipes;
}
