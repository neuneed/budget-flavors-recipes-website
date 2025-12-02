-- =====================================================
-- BUDGET BYTES RECIPE DATABASE SCHEMA
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to create the database structure
-- =====================================================

-- Create recipes table (main recipe data in English)
CREATE TABLE recipes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT,
  original_url TEXT NOT NULL,
  image_url TEXT,
  prep_time TEXT NOT NULL,
  cook_time TEXT NOT NULL,
  servings INTEGER NOT NULL,
  cost_estimate TEXT,
  tags TEXT[] DEFAULT '{}', -- Array of tags
  rating DECIMAL(3, 2) DEFAULT 0, -- Average rating (0-5)
  rating_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ingredients table
CREATE TABLE ingredients (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  recipe_id BIGINT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_index INTEGER NOT NULL, -- Order of ingredient
  item TEXT NOT NULL, -- English ingredient name
  quantity TEXT NOT NULL,
  UNIQUE(recipe_id, ingredient_index)
);

-- Create instructions table
CREATE TABLE instructions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  recipe_id BIGINT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_index INTEGER NOT NULL, -- Order of step
  description TEXT NOT NULL, -- English instruction
  UNIQUE(recipe_id, step_index)
);

-- Create nutrition table
CREATE TABLE nutrition (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  recipe_id BIGINT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE UNIQUE,
  calories TEXT,
  protein TEXT,
  carbs TEXT,
  fat TEXT
);

-- =====================================================
-- TRANSLATION TABLES
-- =====================================================

-- Recipe translations (title, description)
CREATE TABLE recipe_translations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  recipe_id BIGINT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  locale TEXT NOT NULL, -- 'es', 'en', etc.
  title TEXT,
  description TEXT,
  UNIQUE(recipe_id, locale)
);

-- Ingredient translations
CREATE TABLE ingredient_translations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  recipe_id BIGINT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_index INTEGER NOT NULL,
  locale TEXT NOT NULL,
  item TEXT,
  UNIQUE(recipe_id, ingredient_index, locale),
  FOREIGN KEY (recipe_id, ingredient_index) REFERENCES ingredients(recipe_id, ingredient_index) ON DELETE CASCADE
);

-- Instruction translations
CREATE TABLE instruction_translations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  recipe_id BIGINT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_index INTEGER NOT NULL,
  locale TEXT NOT NULL,
  description TEXT,
  UNIQUE(recipe_id, step_index, locale),
  FOREIGN KEY (recipe_id, step_index) REFERENCES instructions(recipe_id, step_index) ON DELETE CASCADE
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX idx_recipes_rating ON recipes(rating DESC);
CREATE INDEX idx_ingredients_recipe_id ON ingredients(recipe_id);
CREATE INDEX idx_instructions_recipe_id ON instructions(recipe_id);
CREATE INDEX idx_recipe_translations_recipe_id ON recipe_translations(recipe_id);
CREATE INDEX idx_recipe_translations_locale ON recipe_translations(locale);
CREATE INDEX idx_ingredient_translations_recipe_id ON ingredient_translations(recipe_id);
CREATE INDEX idx_instruction_translations_recipe_id ON instruction_translations(recipe_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE instruction_translations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "recipes_public_read" ON recipes FOR SELECT TO anon USING (true);
CREATE POLICY "ingredients_public_read" ON ingredients FOR SELECT TO anon USING (true);
CREATE POLICY "instructions_public_read" ON instructions FOR SELECT TO anon USING (true);
CREATE POLICY "nutrition_public_read" ON nutrition FOR SELECT TO anon USING (true);
CREATE POLICY "recipe_translations_public_read" ON recipe_translations FOR SELECT TO anon USING (true);
CREATE POLICY "ingredient_translations_public_read" ON ingredient_translations FOR SELECT TO anon USING (true);
CREATE POLICY "instruction_translations_public_read" ON instruction_translations FOR SELECT TO anon USING (true);

-- Allow authenticated users to read (same as anon for now)
CREATE POLICY "recipes_auth_read" ON recipes FOR SELECT TO authenticated USING (true);
CREATE POLICY "ingredients_auth_read" ON ingredients FOR SELECT TO authenticated USING (true);
CREATE POLICY "instructions_auth_read" ON instructions FOR SELECT TO authenticated USING (true);
CREATE POLICY "nutrition_auth_read" ON nutrition FOR SELECT TO authenticated USING (true);
CREATE POLICY "recipe_translations_auth_read" ON recipe_translations FOR SELECT TO authenticated USING (true);
CREATE POLICY "ingredient_translations_auth_read" ON ingredient_translations FOR SELECT TO authenticated USING (true);
CREATE POLICY "instruction_translations_auth_read" ON instruction_translations FOR SELECT TO authenticated USING (true);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (OPTIONAL - for testing)
-- =====================================================

-- Insert a sample recipe
INSERT INTO recipes (title, description, author, original_url, image_url, prep_time, cook_time, servings, cost_estimate, tags)
VALUES (
  'One Pot Chicken and Rice',
  'A simple and flavorful one pot meal that requires minimal cleanup.',
  'Budget Bytes',
  'https://www.budgetbytes.com/one-pot-chicken-rice/',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  '10 mins',
  '30 mins',
  4,
  '$5.00 total',
  ARRAY['chicken', 'dinner', 'one-pot', 'easy']
);

-- Get the ID of the inserted recipe
DO $$
DECLARE
  recipe_id BIGINT;
BEGIN
  SELECT id INTO recipe_id FROM recipes WHERE title = 'One Pot Chicken and Rice' LIMIT 1;

  -- Insert ingredients
  INSERT INTO ingredients (recipe_id, ingredient_index, item, quantity) VALUES
    (recipe_id, 0, 'Chicken thighs', '1 lb'),
    (recipe_id, 1, 'White rice', '1 cup'),
    (recipe_id, 2, 'Chicken broth', '2 cups'),
    (recipe_id, 3, 'Onion', '1 medium'),
    (recipe_id, 4, 'Garlic', '3 cloves');

  -- Insert instructions
  INSERT INTO instructions (recipe_id, step_index, description) VALUES
    (recipe_id, 0, 'Season chicken with salt and pepper.'),
    (recipe_id, 1, 'Brown chicken in a large pot over medium heat.'),
    (recipe_id, 2, 'Add onions and garlic, cook until softened.'),
    (recipe_id, 3, 'Add rice and chicken broth, bring to a boil.'),
    (recipe_id, 4, 'Reduce heat and simmer covered for 20 minutes.');

  -- Insert nutrition
  INSERT INTO nutrition (recipe_id, calories, protein, carbs, fat) VALUES
    (recipe_id, '350', '25g', '40g', '10g');

  -- Insert Spanish translations
  INSERT INTO recipe_translations (recipe_id, locale, title, description) VALUES
    (recipe_id, 'es', 'Pollo y Arroz en Una Olla', 'Una comida simple y sabrosa que requiere limpieza mínima.');

  -- Insert ingredient translations (Spanish)
  INSERT INTO ingredient_translations (recipe_id, ingredient_index, locale, item) VALUES
    (recipe_id, 0, 'es', 'Muslos de pollo'),
    (recipe_id, 1, 'es', 'Arroz blanco'),
    (recipe_id, 2, 'es', 'Caldo de pollo'),
    (recipe_id, 3, 'es', 'Cebolla'),
    (recipe_id, 4, 'es', 'Ajo');

  -- Insert instruction translations (Spanish)
  INSERT INTO instruction_translations (recipe_id, step_index, locale, description) VALUES
    (recipe_id, 0, 'es', 'Sazone el pollo con sal y pimienta.'),
    (recipe_id, 1, 'es', 'Dore el pollo en una olla grande a fuego medio.'),
    (recipe_id, 2, 'es', 'Agregue cebollas y ajo, cocine hasta que se ablanden.'),
    (recipe_id, 3, 'es', 'Agregue arroz y caldo de pollo, hierva.'),
    (recipe_id, 4, 'es', 'Reduzca el fuego y cocine tapado por 20 minutos.');
END $$;

-- =====================================================
-- VIEW FOR EASY QUERYING
-- =====================================================

-- Create a view that combines recipe with all related data
CREATE OR REPLACE VIEW recipes_full AS
SELECT
  r.id,
  r.title,
  r.description,
  r.author,
  r.original_url,
  r.image_url,
  r.prep_time,
  r.cook_time,
  r.servings,
  r.cost_estimate,
  r.tags,
  r.rating,
  r.rating_count,
  r.view_count,
  r.created_at,
  r.updated_at,
  COALESCE(
    json_agg(
      jsonb_build_object(
        'item', i.item,
        'quantity', i.quantity,
        'index', i.ingredient_index
      ) ORDER BY i.ingredient_index
    ) FILTER (WHERE i.id IS NOT NULL),
    '[]'
  ) AS ingredients,
  COALESCE(
    json_agg(
      jsonb_build_object(
        'description', ins.description,
        'index', ins.step_index
      ) ORDER BY ins.step_index
    ) FILTER (WHERE ins.id IS NOT NULL),
    '[]'
  ) AS instructions,
  jsonb_build_object(
    'calories', n.calories,
    'protein', n.protein,
    'carbs', n.carbs,
    'fat', n.fat
  ) AS nutrition
FROM recipes r
LEFT JOIN ingredients i ON r.id = i.recipe_id
LEFT JOIN instructions ins ON r.id = ins.recipe_id
LEFT JOIN nutrition n ON r.id = n.recipe_id
GROUP BY r.id, n.id;

