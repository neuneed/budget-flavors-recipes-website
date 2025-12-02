-- =====================================================
-- ADDITIONAL SAMPLE RECIPES FOR TESTING
-- =====================================================
-- Run this in Supabase SQL Editor to add more test recipes
-- =====================================================

-- Recipe 2: Easy Black Bean Tacos
INSERT INTO recipes (title, description, author, original_url, image_url, prep_time, cook_time, servings, cost_estimate, tags)
VALUES (
  'Easy Black Bean Tacos',
  'Quick and budget-friendly vegetarian tacos packed with flavor.',
  'Budget Bytes',
  'https://www.budgetbytes.com/easy-black-bean-tacos/',
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
  '5 mins',
  '10 mins',
  4,
  '$4.50 total',
  ARRAY['vegetarian', 'dinner', 'mexican', 'quick', 'easy']
);

DO $$
DECLARE
  recipe_id BIGINT;
BEGIN
  SELECT id INTO recipe_id FROM recipes WHERE title = 'Easy Black Bean Tacos' LIMIT 1;

  INSERT INTO ingredients (recipe_id, ingredient_index, item, quantity) VALUES
    (recipe_id, 0, 'Black beans', '2 cans (15oz each)'),
    (recipe_id, 1, 'Taco seasoning', '2 tbsp'),
    (recipe_id, 2, 'Corn tortillas', '8 pieces'),
    (recipe_id, 3, 'Shredded cheese', '1 cup'),
    (recipe_id, 4, 'Lettuce', '2 cups shredded'),
    (recipe_id, 5, 'Salsa', '1 cup');

  INSERT INTO instructions (recipe_id, step_index, description) VALUES
    (recipe_id, 0, 'Drain and rinse black beans.'),
    (recipe_id, 1, 'Heat beans in a pan with taco seasoning and 1/4 cup water.'),
    (recipe_id, 2, 'Simmer for 5 minutes until heated through.'),
    (recipe_id, 3, 'Warm tortillas in a dry skillet.'),
    (recipe_id, 4, 'Fill tortillas with beans, cheese, lettuce, and salsa.');

  INSERT INTO nutrition (recipe_id, calories, protein, carbs, fat) VALUES
    (recipe_id, '280', '12g', '45g', '6g');

  INSERT INTO recipe_translations (recipe_id, locale, title, description) VALUES
    (recipe_id, 'es', 'Tacos de Frijoles Negros Fáciles', 'Tacos vegetarianos rápidos y económicos llenos de sabor.');

  INSERT INTO ingredient_translations (recipe_id, ingredient_index, locale, item) VALUES
    (recipe_id, 0, 'es', 'Frijoles negros'),
    (recipe_id, 1, 'es', 'Condimento para tacos'),
    (recipe_id, 2, 'es', 'Tortillas de maíz'),
    (recipe_id, 3, 'es', 'Queso rallado'),
    (recipe_id, 4, 'es', 'Lechuga'),
    (recipe_id, 5, 'es', 'Salsa');

  INSERT INTO instruction_translations (recipe_id, step_index, locale, description) VALUES
    (recipe_id, 0, 'es', 'Escurra y enjuague los frijoles negros.'),
    (recipe_id, 1, 'es', 'Caliente los frijoles en una sartén con condimento para tacos y 1/4 taza de agua.'),
    (recipe_id, 2, 'es', 'Cocine a fuego lento durante 5 minutos hasta que esté caliente.'),
    (recipe_id, 3, 'es', 'Caliente las tortillas en una sartén seca.'),
    (recipe_id, 4, 'es', 'Rellene las tortillas con frijoles, queso, lechuga y salsa.');
END $$;

-- Recipe 3: Simple Pasta Aglio e Olio
INSERT INTO recipes (title, description, author, original_url, image_url, prep_time, cook_time, servings, cost_estimate, tags)
VALUES (
  'Simple Pasta Aglio e Olio',
  'Classic Italian pasta with garlic and oil - simple but delicious.',
  'Budget Bytes',
  'https://www.budgetbytes.com/pasta-aglio-e-olio/',
  'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
  '5 mins',
  '15 mins',
  4,
  '$3.00 total',
  ARRAY['pasta', 'italian', 'vegetarian', 'quick']
);

DO $$
DECLARE
  recipe_id BIGINT;
BEGIN
  SELECT id INTO recipe_id FROM recipes WHERE title = 'Simple Pasta Aglio e Olio' LIMIT 1;

  INSERT INTO ingredients (recipe_id, ingredient_index, item, quantity) VALUES
    (recipe_id, 0, 'Spaghetti', '1 lb'),
    (recipe_id, 1, 'Olive oil', '1/2 cup'),
    (recipe_id, 2, 'Garlic cloves', '6 cloves, sliced'),
    (recipe_id, 3, 'Red pepper flakes', '1/2 tsp'),
    (recipe_id, 4, 'Fresh parsley', '1/4 cup chopped'),
    (recipe_id, 5, 'Parmesan cheese', '1/2 cup grated');

  INSERT INTO instructions (recipe_id, step_index, description) VALUES
    (recipe_id, 0, 'Cook spaghetti according to package directions. Reserve 1 cup pasta water.'),
    (recipe_id, 1, 'Heat olive oil in a large pan over medium heat.'),
    (recipe_id, 2, 'Add garlic and red pepper flakes, cook until garlic is golden.'),
    (recipe_id, 3, 'Add drained pasta and 1/2 cup pasta water to the pan.'),
    (recipe_id, 4, 'Toss well, add parsley and parmesan. Serve immediately.');

  INSERT INTO nutrition (recipe_id, calories, protein, carbs, fat) VALUES
    (recipe_id, '420', '12g', '55g', '18g');

  INSERT INTO recipe_translations (recipe_id, locale, title, description) VALUES
    (recipe_id, 'es', 'Pasta Simple Aglio e Olio', 'Pasta italiana clásica con ajo y aceite - simple pero deliciosa.');

  INSERT INTO ingredient_translations (recipe_id, ingredient_index, locale, item) VALUES
    (recipe_id, 0, 'es', 'Espagueti'),
    (recipe_id, 1, 'es', 'Aceite de oliva'),
    (recipe_id, 2, 'es', 'Dientes de ajo'),
    (recipe_id, 3, 'es', 'Hojuelas de chile rojo'),
    (recipe_id, 4, 'es', 'Perejil fresco'),
    (recipe_id, 5, 'es', 'Queso parmesano');

  INSERT INTO instruction_translations (recipe_id, step_index, locale, description) VALUES
    (recipe_id, 0, 'es', 'Cocine el espagueti según las instrucciones del paquete. Reserve 1 taza de agua de pasta.'),
    (recipe_id, 1, 'es', 'Caliente el aceite de oliva en una sartén grande a fuego medio.'),
    (recipe_id, 2, 'es', 'Agregue el ajo y las hojuelas de chile, cocine hasta que el ajo esté dorado.'),
    (recipe_id, 3, 'es', 'Agregue la pasta escurrida y 1/2 taza de agua de pasta a la sartén.'),
    (recipe_id, 4, 'es', 'Mezcle bien, agregue perejil y parmesano. Sirva inmediatamente.');
END $$;

-- Recipe 4: Egg Fried Rice
INSERT INTO recipes (title, description, author, original_url, image_url, prep_time, cook_time, servings, cost_estimate, tags)
VALUES (
  'Egg Fried Rice',
  'A perfect way to use leftover rice - quick, easy, and delicious.',
  'Budget Bytes',
  'https://www.budgetbytes.com/egg-fried-rice/',
  'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
  '5 mins',
  '10 mins',
  4,
  '$2.50 total',
  ARRAY['rice', 'asian', 'vegetarian', 'quick', 'leftover']
);

DO $$
DECLARE
  recipe_id BIGINT;
BEGIN
  SELECT id INTO recipe_id FROM recipes WHERE title = 'Egg Fried Rice' LIMIT 1;

  INSERT INTO ingredients (recipe_id, ingredient_index, item, quantity) VALUES
    (recipe_id, 0, 'Cooked rice', '4 cups (cold)'),
    (recipe_id, 1, 'Eggs', '3 large'),
    (recipe_id, 2, 'Vegetable oil', '3 tbsp'),
    (recipe_id, 3, 'Soy sauce', '3 tbsp'),
    (recipe_id, 4, 'Frozen peas and carrots', '1 cup'),
    (recipe_id, 5, 'Green onions', '3 stalks, sliced');

  INSERT INTO instructions (recipe_id, step_index, description) VALUES
    (recipe_id, 0, 'Beat eggs in a bowl. Heat 1 tbsp oil in a wok or large pan.'),
    (recipe_id, 1, 'Scramble eggs until just cooked, remove from pan.'),
    (recipe_id, 2, 'Add remaining oil, then cold rice. Break up clumps.'),
    (recipe_id, 3, 'Add peas and carrots, stir fry for 2-3 minutes.'),
    (recipe_id, 4, 'Add soy sauce, eggs, and green onions. Toss well and serve.');

  INSERT INTO nutrition (recipe_id, calories, protein, carbs, fat) VALUES
    (recipe_id, '310', '11g', '48g', '9g');

  INSERT INTO recipe_translations (recipe_id, locale, title, description) VALUES
    (recipe_id, 'es', 'Arroz Frito con Huevo', 'Una forma perfecta de usar arroz sobrante - rápido, fácil y delicioso.');

  INSERT INTO ingredient_translations (recipe_id, ingredient_index, locale, item) VALUES
    (recipe_id, 0, 'es', 'Arroz cocido'),
    (recipe_id, 1, 'es', 'Huevos'),
    (recipe_id, 2, 'es', 'Aceite vegetal'),
    (recipe_id, 3, 'es', 'Salsa de soja'),
    (recipe_id, 4, 'es', 'Guisantes y zanahorias congelados'),
    (recipe_id, 5, 'es', 'Cebolletas');

  INSERT INTO instruction_translations (recipe_id, step_index, locale, description) VALUES
    (recipe_id, 0, 'es', 'Bata los huevos en un tazón. Caliente 1 cucharada de aceite en un wok o sartén grande.'),
    (recipe_id, 1, 'es', 'Revuelva los huevos hasta que estén cocidos, retire de la sartén.'),
    (recipe_id, 2, 'es', 'Agregue el aceite restante, luego el arroz frío. Rompa los grumos.'),
    (recipe_id, 3, 'es', 'Agregue guisantes y zanahorias, saltee durante 2-3 minutos.'),
    (recipe_id, 4, 'es', 'Agregue salsa de soja, huevos y cebolletas. Mezcle bien y sirva.');
END $$;

-- Recipe 5: Budget Chili
INSERT INTO recipes (title, description, author, original_url, image_url, prep_time, cook_time, servings, cost_estimate, tags)
VALUES (
  'Budget Chili',
  'Hearty, flavorful chili that feeds a crowd without breaking the bank.',
  'Budget Bytes',
  'https://www.budgetbytes.com/budget-chili/',
  'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=800&q=80',
  '10 mins',
  '45 mins',
  8,
  '$8.00 total',
  ARRAY['beef', 'dinner', 'comfort-food', 'batch-cooking']
);

DO $$
DECLARE
  recipe_id BIGINT;
BEGIN
  SELECT id INTO recipe_id FROM recipes WHERE title = 'Budget Chili' LIMIT 1;

  INSERT INTO ingredients (recipe_id, ingredient_index, item, quantity) VALUES
    (recipe_id, 0, 'Ground beef', '1 lb'),
    (recipe_id, 1, 'Kidney beans', '2 cans (15oz each)'),
    (recipe_id, 2, 'Diced tomatoes', '1 can (28oz)'),
    (recipe_id, 3, 'Onion', '1 large, diced'),
    (recipe_id, 4, 'Chili powder', '2 tbsp'),
    (recipe_id, 5, 'Cumin', '1 tsp'),
    (recipe_id, 6, 'Garlic powder', '1 tsp');

  INSERT INTO instructions (recipe_id, step_index, description) VALUES
    (recipe_id, 0, 'Brown ground beef in a large pot over medium heat. Drain excess fat.'),
    (recipe_id, 1, 'Add diced onion, cook until softened (5 minutes).'),
    (recipe_id, 2, 'Add chili powder, cumin, and garlic powder. Stir for 1 minute.'),
    (recipe_id, 3, 'Add diced tomatoes and drained beans. Stir well.'),
    (recipe_id, 4, 'Bring to a boil, then reduce heat and simmer for 30 minutes.');

  INSERT INTO nutrition (recipe_id, calories, protein, carbs, fat) VALUES
    (recipe_id, '320', '22g', '35g', '8g');

  INSERT INTO recipe_translations (recipe_id, locale, title, description) VALUES
    (recipe_id, 'es', 'Chili Económico', 'Chili abundante y sabroso que alimenta a una multitud sin gastar mucho.');

  INSERT INTO ingredient_translations (recipe_id, ingredient_index, locale, item) VALUES
    (recipe_id, 0, 'es', 'Carne molida'),
    (recipe_id, 1, 'es', 'Frijoles rojos'),
    (recipe_id, 2, 'es', 'Tomates en cubitos'),
    (recipe_id, 3, 'es', 'Cebolla'),
    (recipe_id, 4, 'es', 'Chile en polvo'),
    (recipe_id, 5, 'es', 'Comino'),
    (recipe_id, 6, 'es', 'Ajo en polvo');

  INSERT INTO instruction_translations (recipe_id, step_index, locale, description) VALUES
    (recipe_id, 0, 'es', 'Dore la carne molida en una olla grande a fuego medio. Escurra el exceso de grasa.'),
    (recipe_id, 1, 'es', 'Agregue la cebolla en cubitos, cocine hasta que se ablande (5 minutos).'),
    (recipe_id, 2, 'es', 'Agregue chile en polvo, comino y ajo en polvo. Revuelva durante 1 minuto.'),
    (recipe_id, 3, 'es', 'Agregue tomates en cubitos y frijoles escurridos. Mezcle bien.'),
    (recipe_id, 4, 'es', 'Hierva, luego reduzca el fuego y cocine a fuego lento durante 30 minutos.');
END $$;

-- Success message
SELECT 'Successfully added 5 sample recipes!' AS message;

