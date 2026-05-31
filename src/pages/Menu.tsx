import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Utensils,
  UtensilsCrossed,
  Soup,
  Wheat,
  Fish,
  Coffee,
  Cookie,
  GlassWater,
  Croissant,
  Salad,
  Leaf,
  Sparkles,
  Beef,
  Egg,
  Sandwich,
  IceCream2,
  CupSoda,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import { EASE_OUT_EXPO } from "@/lib/motion";

type MenuItem = {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  isChefsRec?: boolean;
  isVegetarian?: boolean;
  winePairing?: string;
};

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  // BREAKFAST — Petit Déjeuner
  { id: 101, name: "Moroccan Breakfast", description: "Msemen, baghrir, olive oil, honey, mint tea", price: 120, category: "breakfast", isChefsRec: true, image: "/picts/menu/breakfast.jpg" },
  { id: 102, name: "Continental", description: "Bread, jam, butter, juice, coffee", price: 90, category: "breakfast" },
  { id: 103, name: "Eggs Benedict", description: "Poached eggs, hollandaise, English muffin", price: 110, category: "breakfast" },
  { id: 104, name: "Shakshuka", description: "Eggs poached in spiced tomato sauce", price: 95, category: "breakfast", isVegetarian: true },
  { id: 105, name: "Avocado Toast", description: "Sourdough, smashed avocado, chili, lime", price: 100, category: "breakfast", isVegetarian: true },
  { id: 106, name: "Omelette Fines Herbes", description: "Three eggs, parsley, chervil, chives", price: 85, category: "breakfast", isVegetarian: true },
  { id: 107, name: "Pancakes Maison", description: "Maple syrup, fresh fruit, vanilla butter", price: 80, category: "breakfast", isVegetarian: true },
  { id: 108, name: "Granola Bowl", description: "House granola, yogurt, honey, fresh fruit", price: 75, category: "breakfast", isVegetarian: true },
  { id: 109, name: "French Toast", description: "Brioche, vanilla, berries, powdered sugar", price: 85, category: "breakfast", isVegetarian: true },
  { id: 110, name: "Smoked Salmon Bagel", description: "Cream cheese, capers, red onion, dill", price: 130, category: "breakfast" },
  { id: 111, name: "Khlea & Eggs", description: "Cured spiced beef, eggs, fresh bread", price: 105, category: "breakfast" },

  // STARTERS — Pour Commencer
  { id: 1, name: "Grilled Octopus", description: "Smoked paprika aioli, charred lemon, herbs", price: 195, category: "starters", isChefsRec: true, image: "/picts/menu/grilled-octopus.jpg" },
  { id: 2, name: "Burrata Salad", description: "Heirloom tomatoes, basil oil, aged balsamic", price: 150, category: "starters", image: "/picts/menu/burrata-salad.jpg", isVegetarian: true },
  { id: 3, name: "Zaalouk", description: "Smoked eggplant, tomato, garlic, cumin", price: 85, category: "starters", isVegetarian: true },
  { id: 4, name: "Briouats", description: "Crispy pastry, lamb & almonds, honey glaze", price: 110, category: "starters" },
  { id: 5, name: "Taktouka", description: "Roasted peppers, tomato, fresh herbs", price: 75, category: "starters", isVegetarian: true },
  { id: 6, name: "Maakouda", description: "Golden potato fritters, harissa dip", price: 70, category: "starters", isVegetarian: true },
  { id: 7, name: "Beef Carpaccio", description: "Thin slices, parmesan, arugula, lemon oil", price: 170, category: "starters" },
  { id: 8, name: "Foie Gras Maison", description: "House terrine, fig confit, brioche toast", price: 220, category: "starters" },
  { id: 9, name: "Salmon Tartare", description: "Avocado, sesame, lime, crispy wonton", price: 175, category: "starters" },
  { id: 10, name: "Caprese Stack", description: "Buffalo mozzarella, beefsteak tomato, basil", price: 145, category: "starters", isVegetarian: true },
  { id: 11, name: "Calamari Frits", description: "Crispy squid, lemon aioli, parsley", price: 135, category: "starters" },

  // MEZZE — Petites Assiettes
  { id: 201, name: "Hummus", description: "Tahini, olive oil, smoked paprika", price: 70, category: "mezze", isVegetarian: true, isChefsRec: true, image: "/picts/menu/mezze.jpg" },
  { id: 202, name: "Baba Ganoush", description: "Smoked eggplant, tahini, lemon, garlic", price: 75, category: "mezze", isVegetarian: true },
  { id: 203, name: "Muhammara", description: "Walnut & red pepper, pomegranate molasses", price: 80, category: "mezze", isVegetarian: true },
  { id: 204, name: "Labneh", description: "Strained yogurt, za'atar, olive oil", price: 65, category: "mezze", isVegetarian: true },
  { id: 205, name: "Stuffed Vine Leaves", description: "Rice, fresh herbs, lemon, pine nuts", price: 90, category: "mezze", isVegetarian: true },
  { id: 206, name: "Falafel", description: "Crispy chickpea fritters, tahini, herbs", price: 75, category: "mezze", isVegetarian: true },
  { id: 207, name: "Marinated Olives", description: "Mixed olives, citrus, fennel, garlic", price: 50, category: "mezze", isVegetarian: true },
  { id: 208, name: "Tabbouleh", description: "Bulgur, parsley, mint, lemon, tomato", price: 70, category: "mezze", isVegetarian: true },
  { id: 209, name: "Fattoush", description: "Crisp salad, sumac dressing, pita crisps", price: 80, category: "mezze", isVegetarian: true },
  { id: 210, name: "Spiced Almonds", description: "Roasted, smoked paprika, sea salt", price: 45, category: "mezze", isVegetarian: true },
  { id: 211, name: "Sambousek", description: "Spiced lamb pastries, mint yogurt", price: 95, category: "mezze" },

  // SALADS — Les Salades
  { id: 301, name: "Salade Marocaine", description: "Tomato, cucumber, onion, olives, mint", price: 80, category: "salads", isVegetarian: true, isChefsRec: true, image: "/picts/menu/salads.jpg" },
  { id: 302, name: "Salade César", description: "Romaine, parmesan, croutons, anchovy", price: 110, category: "salads" },
  { id: 303, name: "Salade Niçoise", description: "Tuna, eggs, anchovies, olives, beans", price: 130, category: "salads" },
  { id: 304, name: "Salade Quinoa", description: "Quinoa, roasted vegetables, fresh herbs", price: 105, category: "salads", isVegetarian: true },
  { id: 305, name: "Salade de Chèvre", description: "Warm goat cheese, walnuts, honey, greens", price: 120, category: "salads", isVegetarian: true },
  { id: 306, name: "Salade Grecque", description: "Feta, olives, cucumber, tomato, oregano", price: 95, category: "salads", isVegetarian: true },
  { id: 307, name: "Salade de Poulet", description: "Grilled chicken, mixed greens, balsamic", price: 115, category: "salads" },
  { id: 308, name: "Salade Caprese", description: "Mozzarella, tomato, basil, balsamic glaze", price: 100, category: "salads", isVegetarian: true },
  { id: 309, name: "Salade Forestière", description: "Mushrooms, lardons, soft egg, herbs", price: 125, category: "salads" },
  { id: 310, name: "Salade aux Pois Chiches", description: "Chickpeas, peppers, lemon, parsley", price: 85, category: "salads", isVegetarian: true },
  { id: 311, name: "Salade de Saumon Fumé", description: "Smoked salmon, dill, lemon, capers", price: 145, category: "salads" },

  // SOUPS — Les Soupes
  { id: 12, name: "Harira", description: "Tomato, lentils, chickpeas, fresh herbs", price: 60, category: "soups", isChefsRec: true, isVegetarian: true, image: "/picts/menu/soups.jpg" },
  { id: 13, name: "Bissara", description: "Fava bean velouté, cumin, olive oil", price: 55, category: "soups", isVegetarian: true },
  { id: 14, name: "Chorba", description: "Lamb broth, vermicelli, saffron", price: 75, category: "soups" },
  { id: 15, name: "Lentil Soup", description: "Spiced red lentils, lemon, coriander", price: 60, category: "soups", isVegetarian: true },
  { id: 16, name: "Tomato Bisque", description: "Roasted tomato, basil cream, croutons", price: 65, category: "soups", isVegetarian: true },
  { id: 17, name: "French Onion Gratin", description: "Caramelized onion, gruyère, baguette", price: 80, category: "soups" },
  { id: 18, name: "Mushroom Velouté", description: "Wild mushrooms, truffle oil, chives", price: 85, category: "soups", isVegetarian: true },
  { id: 19, name: "Pumpkin Soup", description: "Roasted pumpkin, ginger, coconut", price: 70, category: "soups", isVegetarian: true },
  { id: 20, name: "Carrot Coriander", description: "Spiced carrot, cumin, fresh herbs", price: 65, category: "soups", isVegetarian: true },
  { id: 21, name: "Mediterranean Fish Soup", description: "Rockfish, saffron, rouille, croutons", price: 95, category: "soups" },
  { id: 22, name: "Gazpacho Andalou", description: "Chilled tomato, cucumber, sherry vinegar", price: 70, category: "soups", isVegetarian: true },

  // TAGINES — Les Tagines
  { id: 23, name: "Rfissa", description: "Slow-cooked with apricots, almonds & spices", price: 320, category: "tagines", isChefsRec: true, image: "/picts/menu/lamb-tagine.jpg" },
  { id: 24, name: "Chicken & Preserved Lemon", description: "Olives, ginger, saffron, fresh coriander", price: 240, category: "tagines" },
  { id: 25, name: "Kefta Mkaouara", description: "Spiced meatballs, eggs, tomato sauce", price: 220, category: "tagines" },
  { id: 26, name: "Vegetable Tagine", description: "Seven vegetables, saffron, ras el hanout", price: 180, category: "tagines", isVegetarian: true },
  { id: 27, name: "Lamb & Prunes", description: "Slow-braised lamb, prunes, sesame, almonds", price: 310, category: "tagines" },
  { id: 28, name: "Mrouzia", description: "Lamb, honey, almonds, ras el hanout", price: 330, category: "tagines" },
  { id: 29, name: "Chicken Mqualli", description: "Olives, lemon confit, saffron", price: 230, category: "tagines" },
  { id: 30, name: "Fish Tagine Mqualli", description: "Sea bream, tomato, peppers, chermoula", price: 285, category: "tagines" },
  { id: 31, name: "Beef & Quince", description: "Slow-braised beef, quince, cinnamon", price: 295, category: "tagines" },
  { id: 32, name: "Berber Tagine", description: "Seven vegetables, herbs, smen butter", price: 175, category: "tagines", isVegetarian: true },
  { id: 33, name: "Chicken & Almonds", description: "Confit chicken, blanched almonds, raisins", price: 245, category: "tagines" },

  // COUSCOUS — Les Couscous
  { id: 34, name: "Royal Couscous", description: "Lamb, chicken, merguez, seven vegetables", price: 280, category: "couscous", isChefsRec: true, image: "/picts/menu/couscous.jpg" },
  { id: 35, name: "Chicken Couscous", description: "Confit chicken, caramelized onions, raisins", price: 220, category: "couscous" },
  { id: 36, name: "Tfaya", description: "Lamb, sweet onions, cinnamon, golden raisins", price: 260, category: "couscous" },
  { id: 37, name: "Vegetable Couscous", description: "Seasonal vegetables, chickpeas, herbs", price: 160, category: "couscous", isVegetarian: true },
  { id: 38, name: "Couscous Belboula", description: "Hearty barley couscous, vegetables", price: 200, category: "couscous", isVegetarian: true },
  { id: 39, name: "Couscous au Poisson", description: "White fish, vegetables, aromatic broth", price: 270, category: "couscous" },
  { id: 40, name: "Couscous Seffa", description: "Sweet vermicelli, almonds, cinnamon sugar", price: 145, category: "couscous", isVegetarian: true },
  { id: 41, name: "Couscous Tfaya Beef", description: "Tender beef, onion confit, sweet glaze", price: 275, category: "couscous" },
  { id: 42, name: "Couscous d'Agadir", description: "Argan oil, regional spices, herbs", price: 210, category: "couscous", isVegetarian: true },
  { id: 43, name: "Couscous Berber", description: "Mountain style, milk, dates, butter", price: 195, category: "couscous", isVegetarian: true },
  { id: 44, name: "Couscous Merguez", description: "Spicy lamb sausages, vegetables, harissa", price: 230, category: "couscous" },

  // SEAFOOD — De la Mer
  { id: 45, name: "Pan-Seared Sea Bass", description: "Saffron risotto, microgreens, lemon beurre blanc", price: 280, category: "seafood", isChefsRec: true, image: "/picts/menu/sea-bass.jpg" },
  { id: 46, name: "Grilled Prawns", description: "Chermoula marinade, charred citrus", price: 295, category: "seafood" },
  { id: 47, name: "Fish Tagine", description: "Sea bream, preserved lemon, olives, tomato", price: 260, category: "seafood" },
  { id: 48, name: "Seafood Paella", description: "Saffron rice, prawns, mussels, calamari", price: 320, category: "seafood", image: "/picts/menu/seafood-paella.jpg" },
  { id: 49, name: "Grilled Salmon", description: "Herb crust, citrus salad, olive tapenade", price: 270, category: "seafood", image: "/picts/menu/salmon.jpg" },
  { id: 50, name: "Calamari Grillés", description: "Charred squid, garlic, parsley, lemon", price: 230, category: "seafood" },
  { id: 51, name: "Mussels Marinière", description: "White wine, garlic, parsley, frites", price: 245, category: "seafood" },
  { id: 52, name: "Lobster Thermidor", description: "Cognac cream, gruyère, fine herbs", price: 480, category: "seafood" },
  { id: 53, name: "Sardines Grillées", description: "Chermoula, lemon, fresh herbs", price: 165, category: "seafood" },
  { id: 54, name: "Crab Cakes", description: "Spiced crab, citrus remoulade, micro greens", price: 220, category: "seafood" },
  { id: 55, name: "Sole Meunière", description: "Brown butter, lemon, capers, parsley", price: 310, category: "seafood" },

  // GRILLS — Les Grillades
  { id: 56, name: "Lamb Mechoui", description: "Slow-roasted shoulder, cumin salt, bread", price: 320, category: "grills", isChefsRec: true, image: "/picts/menu/grills.jpg" },
  { id: 57, name: "Mixed Grill Platter", description: "Lamb chops, kefta, merguez, brochettes", price: 350, category: "grills" },
  { id: 58, name: "Brochettes de Boeuf", description: "Beef skewers, chimichurri marocain", price: 240, category: "grills" },
  { id: 59, name: "Chicken Brochettes", description: "Marinated in ras el hanout, lemon, garlic", price: 200, category: "grills" },
  { id: 60, name: "Filet Mignon", description: "Tenderloin 200g, pepper sauce, frites", price: 380, category: "grills" },
  { id: 61, name: "Lamb Chops", description: "Herb-crusted, mint jus, roasted potatoes", price: 340, category: "grills" },
  { id: 62, name: "Côte de Boeuf (for 2)", description: "Bone-in ribeye 800g, rosemary butter", price: 720, category: "grills" },
  { id: 63, name: "Merguez Grillés", description: "Spicy lamb sausage, harissa, bread", price: 175, category: "grills" },
  { id: 64, name: "Veal Chop", description: "Marsala glaze, sage, creamy polenta", price: 360, category: "grills" },
  { id: 65, name: "T-Bone Steak", description: "600g, herb butter, grilled vegetables", price: 480, category: "grills" },
  { id: 66, name: "Lamb Kebab Platter", description: "Skewered & spiced, saffron rice, salad", price: 280, category: "grills" },

  // PASTRIES — Pâtisseries Salées
  { id: 67, name: "Pastilla au Pigeon", description: "Crispy filo, pigeon, almonds, cinnamon", price: 180, category: "pastries", isChefsRec: true, image: "/picts/menu/pastilla.jpg" },
  { id: 68, name: "Pastilla au Poisson", description: "Filo with seafood, vermicelli, herbs", price: 165, category: "pastries" },
  { id: 69, name: "Msemen", description: "Layered semolina pancake, honey, butter", price: 45, category: "pastries", isVegetarian: true },
  { id: 70, name: "Baghrir", description: "Thousand-hole pancake, amlou, honey", price: 50, category: "pastries", isVegetarian: true },
  { id: 71, name: "Brik à l'Œuf", description: "Crisp filo, runny egg, tuna, capers", price: 95, category: "pastries" },
  { id: 72, name: "Sambousek Lamb", description: "Spiced lamb pastry, mint yogurt", price: 110, category: "pastries" },
  { id: 73, name: "Fatayer Sabanikh", description: "Spinach pastry, sumac, pine nuts", price: 85, category: "pastries", isVegetarian: true },
  { id: 74, name: "Mhencha Salée", description: "Coiled almond pastry, savory filling", price: 120, category: "pastries" },
  { id: 75, name: "Borek au Fromage", description: "Cheese-filled filo, sesame, honey", price: 95, category: "pastries", isVegetarian: true },
  { id: 76, name: "Khoubz Khlea", description: "Bread filled with cured spiced beef", price: 105, category: "pastries" },
  { id: 77, name: "Rghaif Berber", description: "Layered pastry, herbs, smen butter", price: 80, category: "pastries", isVegetarian: true },

  // DESSERTS — Les Douceurs
  { id: 78, name: "Chocolate Fondant", description: "Molten center, vanilla ice cream, berry coulis", price: 120, category: "desserts", isChefsRec: true, image: "/picts/menu/chocolate-fondant.jpg" },
  { id: 79, name: "Pastilla au Lait", description: "Crisp filo, milk cream, orange blossom", price: 95, category: "desserts" },
  { id: 80, name: "Chebakia", description: "Sesame-honey rosettes, traditional", price: 60, category: "desserts", isVegetarian: true },
  { id: 81, name: "Seffa", description: "Sweet vermicelli, almonds, cinnamon", price: 80, category: "desserts", isVegetarian: true },
  { id: 82, name: "Fresh Fruit Plate", description: "Seasonal Moroccan fruits, mint", price: 65, category: "desserts", isVegetarian: true },
  { id: 83, name: "Crème Brûlée", description: "Vanilla custard, caramelized sugar", price: 90, category: "desserts", isVegetarian: true },
  { id: 84, name: "Tarte Tatin", description: "Caramelized apple, flaky pastry, cream", price: 95, category: "desserts", isVegetarian: true },
  { id: 85, name: "Tiramisu", description: "Mascarpone, espresso, cocoa", price: 100, category: "desserts", isVegetarian: true },
  { id: 86, name: "Mahalabia", description: "Almond milk pudding, rose water, pistachio", price: 75, category: "desserts", isVegetarian: true },
  { id: 87, name: "Sorbet Trio", description: "Three seasonal sorbets, candied citrus", price: 85, category: "desserts", isVegetarian: true },
  { id: 88, name: "Briouats au Miel", description: "Almond pastries soaked in honey", price: 70, category: "desserts", isVegetarian: true },

  // JUICES — Jus Frais
  { id: 89, name: "Fresh Orange Juice", description: "Squeezed to order from Agadir oranges", price: 40, category: "juices", isChefsRec: true, image: "/picts/menu/orange-juice.jpg" },
  { id: 90, name: "Avocado & Almond Shake", description: "Rich and creamy with honey, crushed almonds", price: 65, category: "juices", image: "/picts/menu/avocado-shake.jpg" },
  { id: 91, name: "Virgin Mojito", description: "Muddled lime, mint, sugar, sparkling water", price: 75, category: "juices", image: "/picts/menu/virgin-mojito.jpg" },
  { id: 92, name: "Seasonal Smoothie", description: "Local mango, banana, strawberry", price: 55, category: "juices", image: "/picts/menu/fruit-smoothie.jpg" },
  { id: 93, name: "Pomegranate Press", description: "Pressed pomegranate, rose water hint", price: 60, category: "juices" },
  { id: 94, name: "Lemon-Mint", description: "Fresh lemonade, crushed mint, agave", price: 45, category: "juices", image: "/picts/menu/lemon-juice.jpg" },
  { id: 95, name: "Carrot-Ginger", description: "Cold-pressed, energizing, lemon", price: 50, category: "juices" },
  { id: 96, name: "Watermelon Cooler", description: "Mint, lime, sparkling water", price: 55, category: "juices" },
  { id: 97, name: "Mango Lassi", description: "Yogurt, mango, cardamom, honey", price: 60, category: "juices" },
  { id: 98, name: "Beetroot & Apple", description: "Pressed, fresh ginger, lemon", price: 55, category: "juices" },
  { id: 99, name: "Detox Green", description: "Cucumber, celery, apple, mint, lemon", price: 60, category: "juices" },

  // MOCKTAILS — Mocktails Signés (alcohol-free signature drinks)
  { id: 401, name: "La Breva Spritz", description: "Sparkling apple, blood orange, rosemary", price: 80, category: "mocktails", isChefsRec: true, image: "/picts/menu/cocktails.jpg" },
  { id: 402, name: "Atlas Cooler", description: "Cucumber, mint, lime, tonic water", price: 70, category: "mocktails" },
  { id: 403, name: "Medina Spice", description: "Ginger beer, lime, pomegranate, mint", price: 75, category: "mocktails" },
  { id: 404, name: "Casablanca Breeze", description: "Elderflower, cucumber, lime, soda", price: 75, category: "mocktails" },
  { id: 405, name: "Sahara Sunset", description: "Mango, passion fruit, lime, sparkling water", price: 80, category: "mocktails" },
  { id: 406, name: "Berber Mojito", description: "Mint, lime, brown sugar, soda", price: 70, category: "mocktails" },
  { id: 407, name: "Rose & Cardamom", description: "Rose water, cardamom syrup, lemonade", price: 75, category: "mocktails" },
  { id: 408, name: "Argan Whisper", description: "Argan honey, citrus, ginger", price: 85, category: "mocktails" },
  { id: 409, name: "Saffron Tonic", description: "Saffron syrup, tonic, lemon zest", price: 90, category: "mocktails" },
  { id: 410, name: "Fes Garden", description: "Hibiscus, rose, lime, sparkling", price: 75, category: "mocktails" },
  { id: 411, name: "Spice Route", description: "Cinnamon, orange, ginger, honey", price: 80, category: "mocktails" },

  // ICE CREAM & SORBETS — Glaces & Sorbets
  { id: 501, name: "Saffron & Cardamom", description: "Slow-churned, exotic spices, pistachio dust", price: 75, category: "icecream", isChefsRec: true, isVegetarian: true, image: "/picts/menu/icecream.jpg" },
  { id: 502, name: "Vanilla Bean", description: "Madagascan vanilla, fresh cream", price: 60, category: "icecream", isVegetarian: true },
  { id: 503, name: "Pistachio Gelato", description: "Sicilian pistachios, honey drizzle", price: 70, category: "icecream", isVegetarian: true },
  { id: 504, name: "Rose Sorbet", description: "Petal infused, light, refreshing", price: 65, category: "icecream", isVegetarian: true },
  { id: 505, name: "Mint Chocolate Chip", description: "Fresh mint, dark chocolate shards", price: 65, category: "icecream", isVegetarian: true },
  { id: 506, name: "Atlas Lemon Sorbet", description: "Cold-pressed lemons, mountain mint", price: 60, category: "icecream", isVegetarian: true },
  { id: 507, name: "Strawberry Sorbet", description: "Seasonal berries, balsamic reduction", price: 60, category: "icecream", isVegetarian: true },
  { id: 508, name: "Raspberry Sorbet", description: "Tart and bright, fresh basil", price: 60, category: "icecream", isVegetarian: true },
  { id: 509, name: "Argan Caramel", description: "Liquid gold caramel, sea salt", price: 75, category: "icecream", isVegetarian: true },
  { id: 510, name: "Affogato", description: "Vanilla ice cream, hot espresso pour", price: 70, category: "icecream", isVegetarian: true },
  { id: 511, name: "Coupe Royale", description: "Three scoops, sauce & toppings of choice", price: 110, category: "icecream", isVegetarian: true },

  // TEA & COFFEE — Thé & Café
  { id: 100, name: "Moroccan Mint Tea", description: "Fresh mint, green tea, traditional pour", price: 45, category: "tea", isChefsRec: true, image: "/picts/menu/mint-tea.jpg" },
  { id: 601, name: "Saffron Tea", description: "Honey, lemon, threads of saffron", price: 55, category: "tea" },
  { id: 602, name: "Espresso", description: "Single-origin Atlas roast", price: 30, category: "tea" },
  { id: 603, name: "Double Espresso", description: "Atlas roast, full-bodied", price: 40, category: "tea" },
  { id: 604, name: "Café Noir", description: "Strong filter coffee, cardamom edge", price: 35, category: "tea" },
  { id: 605, name: "Nous-Nous", description: "Half coffee, half steamed milk", price: 40, category: "tea" },
  { id: 606, name: "Cappuccino", description: "Espresso, foamed milk, cocoa dust", price: 45, category: "tea" },
  { id: 607, name: "Iced Latte", description: "Cold brew, milk, vanilla syrup", price: 50, category: "tea" },
  { id: 608, name: "Verbena Tea", description: "Calming, citrus notes, honey", price: 40, category: "tea" },
  { id: 609, name: "Chai Tea Latte", description: "Spiced black tea, steamed milk", price: 50, category: "tea" },
  { id: 610, name: "Hot Chocolate", description: "Dark chocolate, whipped cream, cocoa", price: 55, category: "tea" },
];

type CourseDef = {
  key: string;
  title: string;
  french: string;
  Icon: typeof Salad;
};

const COURSE_ORDER: CourseDef[] = [
  { key: "breakfast", title: "Breakfast", french: "Petit Déjeuner", Icon: Egg },
  { key: "starters", title: "Starters", french: "Pour Commencer", Icon: UtensilsCrossed },
  { key: "mezze", title: "Mezze", french: "Petites Assiettes", Icon: Sandwich },
  { key: "salads", title: "Salads", french: "Les Salades", Icon: Salad },
  { key: "soups", title: "Soups", french: "Les Soupes", Icon: Soup },
  { key: "tagines", title: "Tagines", french: "Les Tagines", Icon: Utensils },
  { key: "couscous", title: "Couscous", french: "Les Couscous", Icon: Wheat },
  { key: "seafood", title: "Seafood", french: "De la Mer", Icon: Fish },
  { key: "grills", title: "Grills", french: "Les Grillades", Icon: Beef },
  { key: "pastries", title: "Pastries", french: "Pâtisseries Salées", Icon: Croissant },
  { key: "desserts", title: "Desserts", french: "Les Douceurs", Icon: Cookie },
  { key: "juices", title: "Juices", french: "Jus Frais", Icon: GlassWater },
  { key: "mocktails", title: "Mocktails", french: "Mocktails Signés", Icon: CupSoda },
  { key: "icecream", title: "Ice Cream", french: "Glaces & Sorbets", Icon: IceCream2 },
  { key: "tea", title: "Tea & Coffee", french: "Thé & Café", Icon: Coffee },
];

const RED = "#B0413E";
const RED_DARK = "#8E332F";
const INK = "#2A1810";
const CREAM = "#FAF1E2";
const PAGE_INK = "#5A4438";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function CourseFloatingNav({ courses }: { courses: CourseDef[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => {
      const top = document.getElementById("menu-top");
      const close = document.getElementById("menu-close");
      const headerBottom = top ? top.getBoundingClientRect().bottom : 0;
      const closeTop = close ? close.getBoundingClientRect().top : Number.POSITIVE_INFINITY;
      setVisible(headerBottom < 80 && closeTop > window.innerHeight * 0.6);

      const mid = window.innerHeight * 0.4;
      let current = 0;
      courses.forEach((c, idx) => {
        const el = document.getElementById(`course-${c.key}`);
        if (!el) return;
        if (el.getBoundingClientRect().top <= mid) current = idx;
      });
      setActiveIdx(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [courses]);

  const prev = courses[activeIdx - 1];
  const next = courses[activeIdx + 1];
  const current = courses[activeIdx];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
        >
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-full shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)]"
            style={{
              background: "rgba(255,250,240,0.92)",
              backdropFilter: "blur(12px)",
              border: `1px solid ${RED}33`,
            }}
          >
            <motion.button
              type="button"
              onClick={() => prev && scrollToId(`course-${prev.key}`)}
              disabled={!prev}
              whileHover={prev ? { scale: 1.08, x: -2 } : {}}
              whileTap={prev ? { scale: 0.92 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              aria-label={prev ? `Previous course: ${prev.title}` : "No previous course"}
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-300 ${
                prev ? "cursor-pointer" : "cursor-not-allowed opacity-30"
              }`}
              style={{ color: RED }}
            >
              <ChevronLeft size={18} strokeWidth={1.8} />
            </motion.button>

            <div className="px-4 min-w-[140px] text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current?.key}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-mono text-[9px] font-bold tracking-[0.25em] uppercase leading-none mb-1" style={{ color: RED }}>
                    {String(activeIdx + 1).padStart(2, "0")} / {String(courses.length).padStart(2, "0")}
                  </p>
                  <p className="font-display italic text-base leading-none" style={{ color: INK }}>
                    {current?.title}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.button
              type="button"
              onClick={() => next && scrollToId(`course-${next.key}`)}
              disabled={!next}
              whileHover={next ? { scale: 1.08, x: 2 } : {}}
              whileTap={next ? { scale: 0.92 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              aria-label={next ? `Next course: ${next.title}` : "No next course"}
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-300 ${
                next ? "cursor-pointer" : "cursor-not-allowed opacity-30"
              }`}
              style={{ color: RED }}
            >
              <ChevronRight size={18} strokeWidth={1.8} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FeaturedCard({ item }: { item: MenuItem }) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
      className="relative rounded-md overflow-hidden p-6 md:p-8 shadow-[0_18px_45px_-12px_rgba(176,65,62,0.4)]"
      style={{ background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)` }}
    >
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/8 blur-2xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-black/15 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-white" strokeWidth={2.2} />
          <span className="font-mono font-bold text-[10px] tracking-[0.32em] uppercase text-white/95">
            Dish of the Month
          </span>
        </div>

        <h3 className="font-display italic text-4xl md:text-5xl text-white mb-3 leading-[0.95]">
          {item.name}
        </h3>

        <p className="font-mono font-bold text-[10px] tracking-[0.22em] uppercase text-white/85 mb-3">
          Chef&apos;s Signature · Available All Season
        </p>

        {item.description && (
          <p className="font-body text-[13px] md:text-sm text-white/85 leading-relaxed mb-5 max-w-md">
            {item.description}. Served with our traditional ceremony and seasonal accompaniments.
          </p>
        )}

        <span
          className="inline-flex items-baseline gap-1 px-4 py-1.5 rounded-full border text-white font-mono font-bold text-xs md:text-[13px] tracking-wider"
          style={{ borderColor: "rgba(255,255,255,0.85)" }}
        >
          {item.price.toLocaleString()} <span className="text-[10px] opacity-85">MAD</span>
        </span>
      </div>
    </motion.aside>
  );
}

function CourseColumn({ course, items }: { course: CourseDef; items: MenuItem[] }) {
  if (!items.length) return null;

  const feature =
    items.find((i) => i.isChefsRec && i.image) ?? items.find((i) => i.image) ?? items[0];
  const Icon = course.Icon;

  return (
    <motion.div
      id={`course-${course.key}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
      className="relative scroll-mt-24"
    >
      <div className="flex items-center gap-3 mb-1">
        <Icon className="w-7 h-7 flex-shrink-0" strokeWidth={1.6} style={{ color: RED }} />
        <h2 className="font-display italic text-3xl md:text-[2.4rem] leading-none" style={{ color: INK }}>
          {course.title}
        </h2>
      </div>
      <p className="font-accent italic text-sm mb-5 ml-10" style={{ color: `${PAGE_INK}99` }}>
        {course.french}
        <span className="font-mono not-italic text-[10px] tracking-[0.25em] uppercase ml-2" style={{ color: RED }}>
          · {String(items.length).padStart(2, "0")} dishes
        </span>
      </p>

      {feature.image && (
        <motion.figure
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
          className="relative aspect-[16/10] overflow-hidden rounded-md mb-6 shadow-[0_12px_30px_-12px_rgba(42,24,16,0.25)]"
          style={{ backgroundColor: "#F0E5D0", border: `1px solid ${RED}1F` }}
        >
          <img
            src={feature.image}
            alt={course.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </motion.figure>
      )}

      <ul className="space-y-0">
        {items.map((item, idx) => (
          <motion.li
            key={item.id}
            id={`dish-${item.id}`}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.45, delay: idx * 0.04, ease: EASE_OUT_EXPO }}
            className="py-3 group/dish"
          >
            <div className="flex items-baseline gap-3">
              <div className="flex items-center gap-2 flex-shrink min-w-0">
                <span
                  className="font-mono font-bold text-[11px] md:text-[12px] tracking-[0.08em] uppercase transition-colors duration-300 group-hover/dish:opacity-80"
                  style={{ color: INK }}
                >
                  {item.name}
                </span>
                {item.isChefsRec && (
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: RED }}
                    aria-label="Chef's pick"
                  />
                )}
                {item.isVegetarian && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#7C9D5A] text-white text-[9px] font-mono font-bold tracking-wider uppercase">
                    <Leaf size={8} strokeWidth={2.8} /> Veg
                  </span>
                )}
              </div>

              <span
                aria-hidden="true"
                className="flex-1 min-w-[0.75rem] border-b border-dotted translate-y-[-0.35em]"
                style={{ borderColor: `${RED}55` }}
              />

              <span
                className="inline-flex items-baseline gap-1 px-3 py-1 rounded-full border border-[#B0413E]/70 text-[#B0413E] font-mono font-bold text-[10px] md:text-[11px] tracking-wider whitespace-nowrap flex-shrink-0 cursor-default transition-colors duration-300 hover:bg-[#B0413E] hover:text-white hover:border-[#B0413E]"
              >
                {item.price.toLocaleString()} <span className="text-[9px] opacity-85">MAD</span>
              </span>
            </div>
            {item.description && (
              <p className="font-body text-[12px] md:text-[13px] mt-1 leading-snug" style={{ color: `${PAGE_INK}B3` }}>
                {item.description}
              </p>
            )}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Menu() {
  const { data: menuData } = trpc.public.menu.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const allItems = useMemo<MenuItem[]>(
    () => (menuData && menuData.length > 0 ? (menuData as MenuItem[]) : DEFAULT_MENU_ITEMS),
    [menuData]
  );

  const byCourse = useMemo(() => {
    const map: Record<string, MenuItem[]> = {};
    for (const item of allItems) {
      (map[item.category] ??= []).push(item);
    }
    return map;
  }, [allItems]);

  const activeCourses = COURSE_ORDER.filter((c) => (byCourse[c.key]?.length ?? 0) > 0);

  // Dish of the Month — first chef's-rec with an image, fallback to first item
  const featured = useMemo<MenuItem | undefined>(() => {
    return (
      allItems.find((i) => i.isChefsRec && i.image && i.category === "tagines") ??
      allItems.find((i) => i.isChefsRec && i.image) ??
      allItems.find((i) => i.image)
    );
  }, [allItems]);

  return (
    <div className="min-h-screen" style={{ color: INK }}>
      {/* ====== HEADER — bound-menu cover, elegant and rare ====== */}
      <section
        id="menu-top"
        className="relative min-h-screen min-h-[100svh] flex flex-col justify-center py-24 md:py-20 px-4 sm:px-6 overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("/picts/rooftop/fes-sunset.jpg")` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0E0D0C]/90 via-[#0E0D0C]/65 to-[#0E0D0C]/85"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, ease: EASE_OUT_EXPO, delay: 0.1 }}
          className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(200,149,108,0.22) 0%, rgba(200,149,108,0.08) 35%, transparent 65%)",
            filter: "blur(40px)",
          }}
          aria-hidden="true"
        />

        <span aria-hidden="true" className="hidden md:block pointer-events-none absolute top-28 left-10 w-14 h-14 border-l border-t border-amber/50" />
        <span aria-hidden="true" className="hidden md:block pointer-events-none absolute top-28 right-10 w-14 h-14 border-r border-t border-amber/50" />
        <span aria-hidden="true" className="hidden md:block pointer-events-none absolute bottom-12 left-10 w-14 h-14 border-l border-b border-amber/50" />
        <span aria-hidden="true" className="hidden md:block pointer-events-none absolute bottom-12 right-10 w-14 h-14 border-r border-b border-amber/50" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center relative">
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1.1, delay: 0.5, ease: EASE_OUT_EXPO }}
              className="flex items-center justify-center gap-3 mb-3 origin-center"
            >
              <span className="h-px w-12 bg-blush/40" />
              <span className="w-1.5 h-1.5 rotate-45 border border-amber" aria-hidden="true" />
              <span className="h-px w-12 bg-blush/40" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
              transition={{ duration: 1.5, ease: EASE_OUT_EXPO, delay: 0.6 }}
              className="font-display italic text-[clamp(3rem,11vw,9rem)] leading-[0.9] tracking-tight text-blush"
            >
              Carte
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
              transition={{ duration: 1.5, ease: EASE_OUT_EXPO, delay: 0.9 }}
              className="font-display italic text-[clamp(1.875rem,7vw,5.5rem)] leading-[0.9] tracking-tight -mt-1 md:-mt-3 text-gold-shimmer"
            >
              du Soir
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1.1, delay: 1.2, ease: EASE_OUT_EXPO }}
              className="flex items-center justify-center gap-3 mt-6 origin-center"
            >
              <span className="h-px w-20 bg-blush/40" />
              <span className="w-1.5 h-1.5 rotate-45 border border-amber" aria-hidden="true" />
              <span className="h-px w-20 bg-blush/40" />
            </motion.div>
          </div>

          <motion.nav
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.9, ease: EASE_OUT_EXPO }}
            className="mt-16 md:mt-24 max-w-3xl mx-auto"
            aria-label="Menu sections"
          >
            <div
              className="relative rounded-md px-6 py-8 md:px-10 md:py-10 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.6)]"
              style={{
                background: "rgba(14, 13, 12, 0.72)",
                backdropFilter: "blur(14px) saturate(140%)",
                WebkitBackdropFilter: "blur(14px) saturate(140%)",
                border: "1px solid rgba(200,149,108,0.28)",
              }}
            >
              <span aria-hidden="true" className="absolute top-2 left-2 w-5 h-5 border-l border-t border-amber/60" />
              <span aria-hidden="true" className="absolute top-2 right-2 w-5 h-5 border-r border-t border-amber/60" />
              <span aria-hidden="true" className="absolute bottom-2 left-2 w-5 h-5 border-l border-b border-amber/60" />
              <span aria-hidden="true" className="absolute bottom-2 right-2 w-5 h-5 border-r border-b border-amber/60" />

              <div className="flex items-center justify-center gap-4 mb-7">
                <span className="h-px w-14 bg-amber/60" />
                <p className="font-mono text-[10px] font-bold tracking-[0.4em] uppercase text-amber">
                  The Order
                </p>
                <span className="h-px w-14 bg-amber/60" />
              </div>
              <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
                {activeCourses.map((co, i) => (
                  <li key={co.key} className="flex items-center gap-3">
                    <a
                      href={`#course-${co.key}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(`course-${co.key}`);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="group relative inline-flex items-baseline gap-2 font-display font-semibold italic text-lg md:text-xl text-blush hover:text-amber transition-colors duration-500"
                    >
                      <span className="font-mono text-[10px] not-italic tracking-[0.25em] text-amber">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{co.title}</span>
                      <span className="absolute -bottom-0.5 left-6 right-0 h-px bg-amber scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                    </a>
                    {i < activeCourses.length - 1 && (
                      <span className="text-amber/60 select-none" aria-hidden="true">
                        &diams;
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </motion.nav>
        </div>
      </section>

      {/* Floating prev/next course nav */}
      <CourseFloatingNav courses={activeCourses} />

      {/* ====== COURSES — cream canvas, Rumbeke-style grid ====== */}
      <section
        className="relative px-6 py-20 md:py-28 overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${CREAM} 0%, #F5EAD5 50%, ${CREAM} 100%)`,
        }}
      >
        {/* Soft warm pools to add depth without distracting */}
        <div
          className="pointer-events-none absolute top-[8%] -right-32 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${RED}15 0%, transparent 70%)` }}
        />
        <div
          className="pointer-events-none absolute bottom-[10%] -left-32 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${RED}10 0%, transparent 70%)` }}
        />

        <div className="max-w-7xl mx-auto relative">
          {/* Section eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <span className="h-px w-12" style={{ backgroundColor: `${RED}66` }} />
            <span className="w-1.5 h-1.5 rotate-45 border" style={{ borderColor: RED }} aria-hidden="true" />
            <span className="h-px w-12" style={{ backgroundColor: `${RED}66` }} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display italic text-center text-5xl md:text-6xl leading-none mb-14 md:mb-18"
            style={{ color: INK }}
          >
            Le Menu
          </motion.h2>

          {(() => {
            const blocks: Array<{ kind: "featured"; item: MenuItem } | { kind: "course"; course: CourseDef }> = [];
            if (featured) blocks.push({ kind: "featured", item: featured });
            for (const c of activeCourses) blocks.push({ kind: "course", course: c });

            const left = blocks.filter((_, i) => i % 2 === 0);
            const right = blocks.filter((_, i) => i % 2 === 1);

            const renderBlock = (
              b: { kind: "featured"; item: MenuItem } | { kind: "course"; course: CourseDef }
            ) =>
              b.kind === "featured" ? (
                <FeaturedCard key="featured" item={b.item} />
              ) : (
                <CourseColumn
                  key={b.course.key}
                  course={b.course}
                  items={byCourse[b.course.key] || []}
                />
              );

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20">
                <div className="flex flex-col gap-y-16 md:gap-y-24">
                  {left.map(renderBlock)}
                </div>
                <div className="flex flex-col gap-y-16 md:gap-y-24 md:mt-32 lg:mt-44">
                  {right.map(renderBlock)}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ====== CHEF'S CLOSING NOTE — cinematic finish ====== */}
      <section
        id="menu-close"
        className="relative px-6 py-32 md:py-40 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0E0D0C 0%, #0A0A0A 100%)" }}
      >
        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.12)_0%,transparent_70%)] blur-3xl" />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, type: "spring", stiffness: 110, damping: 18 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-amber/60 mb-8"
          >
            <span className="font-display italic text-2xl text-amber">L</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
            className="font-accent italic text-2xl md:text-4xl text-blush leading-snug"
          >
            &ldquo;A menu is a letter. Read it slowly, and reply with an empty plate.&rdquo;
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-amber mt-8"
          >
            &mdash; Krishna Chaithanya, Head Chef
          </motion.p>

          <div className="flex items-center justify-center gap-4 mt-16 mb-10">
            <span className="h-px w-16 bg-blush/30" />
            <span className="w-2 h-2 rotate-45 border border-amber" aria-hidden="true" />
            <span className="h-px w-16 bg-blush/30" />
          </div>

          <p className="font-body text-base text-parchment max-w-md mx-auto mb-8">
            Tonight&apos;s offering is best enjoyed at our table, with the call to prayer drifting up from the medina.
          </p>

          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="inline-block"
          >
            <Link
              to="/reservation"
              className="magnetic-btn inline-flex items-center px-10 py-4 bg-amber text-void text-xs font-medium tracking-[0.25em] uppercase rounded-full hover:bg-soft-gold transition-colors duration-500"
            >
              Reserve a Table
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
