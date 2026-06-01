import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  { id: 101, name: "Petit Déjeuner Marocain", description: "Msemen, baghrir, huile d'olive, miel, thé à la menthe", price: 120, category: "breakfast", isChefsRec: true, image: "/picts/menu/breakfast.jpg" },
  { id: 102, name: "Continental", description: "Pain, confiture, beurre, jus, café", price: 90, category: "breakfast" },
  { id: 103, name: "Œufs Bénédicte", description: "Œufs pochés, sauce hollandaise, muffin anglais", price: 110, category: "breakfast" },
  { id: 104, name: "Shakshuka", description: "Œufs pochés dans une sauce tomate épicée", price: 95, category: "breakfast", isVegetarian: true },
  { id: 105, name: "Toast à l'Avocat", description: "Pain au levain, avocat écrasé, piment, citron vert", price: 100, category: "breakfast", isVegetarian: true },
  { id: 106, name: "Omelette Fines Herbes", description: "Trois œufs, persil, cerfeuil, ciboulette", price: 85, category: "breakfast", isVegetarian: true },
  { id: 107, name: "Pancakes Maison", description: "Sirop d'érable, fruits frais, beurre vanillé", price: 80, category: "breakfast", isVegetarian: true },
  { id: 108, name: "Bol de Granola", description: "Granola maison, yaourt, miel, fruits frais", price: 75, category: "breakfast", isVegetarian: true },
  { id: 109, name: "Pain Perdu", description: "Brioche, vanille, fruits rouges, sucre glace", price: 85, category: "breakfast", isVegetarian: true },
  { id: 110, name: "Bagel au Saumon Fumé", description: "Fromage frais, câpres, oignon rouge, aneth", price: 130, category: "breakfast" },
  { id: 111, name: "Khlea & Œufs", description: "Bœuf séché épicé, œufs, pain frais", price: 105, category: "breakfast" },

  // STARTERS — Pour Commencer
  { id: 1, name: "Poulpe Grillé", description: "Aïoli au paprika fumé, citron grillé, herbes", price: 195, category: "starters", isChefsRec: true, image: "/picts/menu/grilled-octopus.jpg" },
  { id: 2, name: "Salade de Burrata", description: "Tomates anciennes, huile au basilic, balsamique vieilli", price: 150, category: "starters", image: "/picts/menu/burrata-salad.jpg", isVegetarian: true },
  { id: 3, name: "Zaalouk", description: "Aubergine fumée, tomate, ail, cumin", price: 85, category: "starters", isVegetarian: true },
  { id: 4, name: "Briouats", description: "Pâte croustillante, agneau & amandes, glaçage au miel", price: 110, category: "starters" },
  { id: 5, name: "Taktouka", description: "Poivrons rôtis, tomate, herbes fraîches", price: 75, category: "starters", isVegetarian: true },
  { id: 6, name: "Maakouda", description: "Beignets de pomme de terre dorés, sauce harissa", price: 70, category: "starters", isVegetarian: true },
  { id: 7, name: "Carpaccio de Bœuf", description: "Fines tranches, parmesan, roquette, huile au citron", price: 170, category: "starters" },
  { id: 8, name: "Foie Gras Maison", description: "Terrine maison, confit de figues, toast de brioche", price: 220, category: "starters" },
  { id: 9, name: "Tartare de Saumon", description: "Avocat, sésame, citron vert, wonton croustillant", price: 175, category: "starters" },
  { id: 10, name: "Caprese", description: "Mozzarella di bufala, tomate cœur de bœuf, basilic", price: 145, category: "starters", isVegetarian: true },
  { id: 11, name: "Calamari Frits", description: "Calamars croustillants, aïoli au citron, persil", price: 135, category: "starters" },

  // MEZZE — Petites Assiettes
  { id: 201, name: "Houmous", description: "Tahini, huile d'olive, paprika fumé", price: 70, category: "mezze", isVegetarian: true, isChefsRec: true, image: "/picts/menu/mezze.jpg" },
  { id: 202, name: "Baba Ganoush", description: "Aubergine fumée, tahini, citron, ail", price: 75, category: "mezze", isVegetarian: true },
  { id: 203, name: "Muhammara", description: "Noix & poivron rouge, mélasse de grenade", price: 80, category: "mezze", isVegetarian: true },
  { id: 204, name: "Labneh", description: "Yaourt égoutté, za'atar, huile d'olive", price: 65, category: "mezze", isVegetarian: true },
  { id: 205, name: "Feuilles de Vigne Farcies", description: "Riz, herbes fraîches, citron, pignons de pin", price: 90, category: "mezze", isVegetarian: true },
  { id: 206, name: "Falafel", description: "Beignets de pois chiches croustillants, tahini, herbes", price: 75, category: "mezze", isVegetarian: true },
  { id: 207, name: "Olives Marinées", description: "Olives mélangées, agrumes, fenouil, ail", price: 50, category: "mezze", isVegetarian: true },
  { id: 208, name: "Taboulé", description: "Boulgour, persil, menthe, citron, tomate", price: 70, category: "mezze", isVegetarian: true },
  { id: 209, name: "Fattoush", description: "Salade croquante, vinaigrette au sumac, chips de pita", price: 80, category: "mezze", isVegetarian: true },
  { id: 210, name: "Amandes Épicées", description: "Rôties, paprika fumé, fleur de sel", price: 45, category: "mezze", isVegetarian: true },
  { id: 211, name: "Sambousek", description: "Feuilletés à l'agneau épicé, yaourt à la menthe", price: 95, category: "mezze" },

  // SALADS — Les Salades
  { id: 301, name: "Salade Marocaine", description: "Tomate, concombre, oignon, olives, menthe", price: 80, category: "salads", isVegetarian: true, isChefsRec: true, image: "/picts/menu/salads.jpg" },
  { id: 302, name: "Salade César", description: "Romaine, parmesan, croûtons, anchois", price: 110, category: "salads" },
  { id: 303, name: "Salade Niçoise", description: "Thon, œufs, anchois, olives, haricots", price: 130, category: "salads" },
  { id: 304, name: "Salade Quinoa", description: "Quinoa, légumes rôtis, herbes fraîches", price: 105, category: "salads", isVegetarian: true },
  { id: 305, name: "Salade de Chèvre", description: "Chèvre chaud, noix, miel, jeunes pousses", price: 120, category: "salads", isVegetarian: true },
  { id: 306, name: "Salade Grecque", description: "Feta, olives, concombre, tomate, origan", price: 95, category: "salads", isVegetarian: true },
  { id: 307, name: "Salade de Poulet", description: "Poulet grillé, mesclun, balsamique", price: 115, category: "salads" },
  { id: 308, name: "Salade Caprese", description: "Mozzarella, tomate, basilic, glaçage balsamique", price: 100, category: "salads", isVegetarian: true },
  { id: 309, name: "Salade Forestière", description: "Champignons, lardons, œuf mollet, herbes", price: 125, category: "salads" },
  { id: 310, name: "Salade aux Pois Chiches", description: "Pois chiches, poivrons, citron, persil", price: 85, category: "salads", isVegetarian: true },
  { id: 311, name: "Salade de Saumon Fumé", description: "Saumon fumé, aneth, citron, câpres", price: 145, category: "salads" },

  // SOUPS — Les Soupes
  { id: 12, name: "Harira", description: "Tomate, lentilles, pois chiches, herbes fraîches", price: 60, category: "soups", isChefsRec: true, isVegetarian: true, image: "/picts/menu/soups.jpg" },
  { id: 13, name: "Bissara", description: "Velouté de fèves, cumin, huile d'olive", price: 55, category: "soups", isVegetarian: true },
  { id: 14, name: "Chorba", description: "Bouillon d'agneau, vermicelles, safran", price: 75, category: "soups" },
  { id: 15, name: "Soupe de Lentilles", description: "Lentilles rouges épicées, citron, coriandre", price: 60, category: "soups", isVegetarian: true },
  { id: 16, name: "Bisque de Tomate", description: "Tomate rôtie, crème au basilic, croûtons", price: 65, category: "soups", isVegetarian: true },
  { id: 17, name: "Gratinée à l'Oignon", description: "Oignon caramélisé, gruyère, baguette", price: 80, category: "soups" },
  { id: 18, name: "Velouté de Champignons", description: "Champignons sauvages, huile de truffe, ciboulette", price: 85, category: "soups", isVegetarian: true },
  { id: 19, name: "Soupe de Potiron", description: "Potiron rôti, gingembre, noix de coco", price: 70, category: "soups", isVegetarian: true },
  { id: 20, name: "Carotte-Coriandre", description: "Carotte épicée, cumin, herbes fraîches", price: 65, category: "soups", isVegetarian: true },
  { id: 21, name: "Soupe de Poisson Méditerranéenne", description: "Poisson de roche, safran, rouille, croûtons", price: 95, category: "soups" },
  { id: 22, name: "Gazpacho Andalou", description: "Tomate glacée, concombre, vinaigre de Xérès", price: 70, category: "soups", isVegetarian: true },

  // TAGINES — Les Tagines
  { id: 23, name: "Rfissa", description: "Mijoté aux abricots, amandes & épices", price: 320, category: "tagines", isChefsRec: true, image: "/picts/menu/lamb-tagine.jpg" },
  { id: 24, name: "Poulet & Citron Confit", description: "Olives, gingembre, safran, coriandre fraîche", price: 240, category: "tagines" },
  { id: 25, name: "Kefta Mkaouara", description: "Boulettes épicées, œufs, sauce tomate", price: 220, category: "tagines" },
  { id: 26, name: "Tajine de Légumes", description: "Sept légumes, safran, ras el hanout", price: 180, category: "tagines", isVegetarian: true },
  { id: 27, name: "Agneau aux Pruneaux", description: "Agneau mijoté, pruneaux, sésame, amandes", price: 310, category: "tagines" },
  { id: 28, name: "Mrouzia", description: "Agneau, miel, amandes, ras el hanout", price: 330, category: "tagines" },
  { id: 29, name: "Poulet Mqualli", description: "Olives, citron confit, safran", price: 230, category: "tagines" },
  { id: 30, name: "Tajine de Poisson Mqualli", description: "Dorade, tomate, poivrons, chermoula", price: 285, category: "tagines" },
  { id: 31, name: "Bœuf au Coing", description: "Bœuf mijoté, coing, cannelle", price: 295, category: "tagines" },
  { id: 32, name: "Tajine Berbère", description: "Sept légumes, herbes, beurre smen", price: 175, category: "tagines", isVegetarian: true },
  { id: 33, name: "Poulet aux Amandes", description: "Poulet confit, amandes émondées, raisins secs", price: 245, category: "tagines" },

  // COUSCOUS — Les Couscous
  { id: 34, name: "Couscous Royal", description: "Agneau, poulet, merguez, sept légumes", price: 280, category: "couscous", isChefsRec: true, image: "/picts/menu/couscous.jpg" },
  { id: 35, name: "Couscous au Poulet", description: "Poulet confit, oignons caramélisés, raisins secs", price: 220, category: "couscous" },
  { id: 36, name: "Tfaya", description: "Agneau, oignons doux, cannelle, raisins blonds", price: 260, category: "couscous" },
  { id: 37, name: "Couscous aux Légumes", description: "Légumes de saison, pois chiches, herbes", price: 160, category: "couscous", isVegetarian: true },
  { id: 38, name: "Couscous Belboula", description: "Couscous d'orge consistant, légumes", price: 200, category: "couscous", isVegetarian: true },
  { id: 39, name: "Couscous au Poisson", description: "Poisson blanc, légumes, bouillon aromatique", price: 270, category: "couscous" },
  { id: 40, name: "Couscous Seffa", description: "Vermicelles sucrés, amandes, sucre à la cannelle", price: 145, category: "couscous", isVegetarian: true },
  { id: 41, name: "Couscous Tfaya au Bœuf", description: "Bœuf tendre, oignons confits, glaçage sucré", price: 275, category: "couscous" },
  { id: 42, name: "Couscous d'Agadir", description: "Huile d'argan, épices régionales, herbes", price: 210, category: "couscous", isVegetarian: true },
  { id: 43, name: "Couscous Berbère", description: "À la manière des montagnes, lait, dattes, beurre", price: 195, category: "couscous", isVegetarian: true },
  { id: 44, name: "Couscous Merguez", description: "Saucisses d'agneau épicées, légumes, harissa", price: 230, category: "couscous" },

  // SEAFOOD — De la Mer
  { id: 45, name: "Bar Saisi à la Poêle", description: "Risotto au safran, jeunes pousses, beurre blanc au citron", price: 280, category: "seafood", isChefsRec: true, image: "/picts/menu/sea-bass.jpg" },
  { id: 46, name: "Crevettes Grillées", description: "Marinade chermoula, agrumes grillés", price: 295, category: "seafood" },
  { id: 47, name: "Tajine de Poisson", description: "Dorade, citron confit, olives, tomate", price: 260, category: "seafood" },
  { id: 48, name: "Paëlla aux Fruits de Mer", description: "Riz au safran, crevettes, moules, calamars", price: 320, category: "seafood", image: "/picts/menu/seafood-paella.jpg" },
  { id: 49, name: "Saumon Grillé", description: "Croûte aux herbes, salade d'agrumes, tapenade d'olives", price: 270, category: "seafood", image: "/picts/menu/salmon.jpg" },
  { id: 50, name: "Calamari Grillés", description: "Calamars grillés, ail, persil, citron", price: 230, category: "seafood" },
  { id: 51, name: "Moules Marinière", description: "Vin blanc, ail, persil, frites", price: 245, category: "seafood" },
  { id: 52, name: "Homard Thermidor", description: "Crème au cognac, gruyère, fines herbes", price: 480, category: "seafood" },
  { id: 53, name: "Sardines Grillées", description: "Chermoula, citron, herbes fraîches", price: 165, category: "seafood" },
  { id: 54, name: "Galettes de Crabe", description: "Crabe épicé, rémoulade aux agrumes, jeunes pousses", price: 220, category: "seafood" },
  { id: 55, name: "Sole Meunière", description: "Beurre noisette, citron, câpres, persil", price: 310, category: "seafood" },

  // GRILLS — Les Grillades
  { id: 56, name: "Méchoui d'Agneau", description: "Épaule rôtie lentement, sel au cumin, pain", price: 320, category: "grills", isChefsRec: true, image: "/picts/menu/grills.jpg" },
  { id: 57, name: "Plateau Grillades Mixtes", description: "Côtelettes d'agneau, kefta, merguez, brochettes", price: 350, category: "grills" },
  { id: 58, name: "Brochettes de Bœuf", description: "Brochettes de bœuf, chimichurri marocain", price: 240, category: "grills" },
  { id: 59, name: "Brochettes de Poulet", description: "Marinées au ras el hanout, citron, ail", price: 200, category: "grills" },
  { id: 60, name: "Filet Mignon", description: "Filet 200g, sauce au poivre, frites", price: 380, category: "grills" },
  { id: 61, name: "Côtelettes d'Agneau", description: "Croûte aux herbes, jus à la menthe, pommes de terre rôties", price: 340, category: "grills" },
  { id: 62, name: "Côte de Bœuf (pour 2)", description: "Entrecôte avec os 800g, beurre au romarin", price: 720, category: "grills" },
  { id: 63, name: "Merguez Grillés", description: "Saucisse d'agneau épicée, harissa, pain", price: 175, category: "grills" },
  { id: 64, name: "Côte de Veau", description: "Glaçage au marsala, sauge, polenta crémeuse", price: 360, category: "grills" },
  { id: 65, name: "T-Bone Steak", description: "600g, beurre aux herbes, légumes grillés", price: 480, category: "grills" },
  { id: 66, name: "Plateau de Brochettes d'Agneau", description: "En brochettes & épicé, riz au safran, salade", price: 280, category: "grills" },

  // PASTRIES — Pâtisseries Salées
  { id: 67, name: "Pastilla au Pigeon", description: "Pâte filo croustillante, pigeon, amandes, cannelle", price: 180, category: "pastries", isChefsRec: true, image: "/picts/menu/pastilla.jpg" },
  { id: 68, name: "Pastilla au Poisson", description: "Filo aux fruits de mer, vermicelles, herbes", price: 165, category: "pastries" },
  { id: 69, name: "Msemen", description: "Crêpe de semoule feuilletée, miel, beurre", price: 45, category: "pastries", isVegetarian: true },
  { id: 70, name: "Baghrir", description: "Crêpe aux mille trous, amlou, miel", price: 50, category: "pastries", isVegetarian: true },
  { id: 71, name: "Brik à l'Œuf", description: "Filo croustillant, œuf coulant, thon, câpres", price: 95, category: "pastries" },
  { id: 72, name: "Sambousek à l'Agneau", description: "Feuilleté à l'agneau épicé, yaourt à la menthe", price: 110, category: "pastries" },
  { id: 73, name: "Fatayer Sabanikh", description: "Feuilleté aux épinards, sumac, pignons de pin", price: 85, category: "pastries", isVegetarian: true },
  { id: 74, name: "Mhencha Salée", description: "Pâte aux amandes en serpentin, farce salée", price: 120, category: "pastries" },
  { id: 75, name: "Borek au Fromage", description: "Filo au fromage, sésame, miel", price: 95, category: "pastries", isVegetarian: true },
  { id: 76, name: "Khoubz Khlea", description: "Pain farci au bœuf séché épicé", price: 105, category: "pastries" },
  { id: 77, name: "Rghaif Berbère", description: "Pâte feuilletée, herbes, beurre smen", price: 80, category: "pastries", isVegetarian: true },

  // DESSERTS — Les Douceurs
  { id: 78, name: "Fondant au Chocolat", description: "Cœur coulant, glace vanille, coulis de fruits rouges", price: 120, category: "desserts", isChefsRec: true, image: "/picts/menu/chocolate-fondant.jpg" },
  { id: 79, name: "Pastilla au Lait", description: "Filo croustillant, crème au lait, fleur d'oranger", price: 95, category: "desserts" },
  { id: 80, name: "Chebakia", description: "Rosaces au sésame et au miel, traditionnel", price: 60, category: "desserts", isVegetarian: true },
  { id: 81, name: "Seffa", description: "Vermicelles sucrés, amandes, cannelle", price: 80, category: "desserts", isVegetarian: true },
  { id: 82, name: "Assiette de Fruits Frais", description: "Fruits marocains de saison, menthe", price: 65, category: "desserts", isVegetarian: true },
  { id: 83, name: "Crème Brûlée", description: "Crème à la vanille, sucre caramélisé", price: 90, category: "desserts", isVegetarian: true },
  { id: 84, name: "Tarte Tatin", description: "Pomme caramélisée, pâte feuilletée, crème", price: 95, category: "desserts", isVegetarian: true },
  { id: 85, name: "Tiramisu", description: "Mascarpone, espresso, cacao", price: 100, category: "desserts", isVegetarian: true },
  { id: 86, name: "Mahalabia", description: "Pudding au lait d'amande, eau de rose, pistache", price: 75, category: "desserts", isVegetarian: true },
  { id: 87, name: "Trio de Sorbets", description: "Trois sorbets de saison, agrumes confits", price: 85, category: "desserts", isVegetarian: true },
  { id: 88, name: "Briouats au Miel", description: "Feuilletés aux amandes trempés dans le miel", price: 70, category: "desserts", isVegetarian: true },

  // JUICES — Jus Frais
  { id: 89, name: "Jus d'Orange Frais", description: "Pressé à la commande à partir d'oranges d'Agadir", price: 40, category: "juices", isChefsRec: true, image: "/picts/menu/orange-juice.jpg" },
  { id: 90, name: "Milkshake Avocat & Amande", description: "Riche et crémeux au miel, amandes concassées", price: 65, category: "juices", image: "/picts/menu/avocado-shake.jpg" },
  { id: 91, name: "Mojito Sans Alcool", description: "Citron vert pilé, menthe, sucre, eau pétillante", price: 75, category: "juices", image: "/picts/menu/virgin-mojito.jpg" },
  { id: 92, name: "Smoothie de Saison", description: "Mangue locale, banane, fraise", price: 55, category: "juices", image: "/picts/menu/fruit-smoothie.jpg" },
  { id: 93, name: "Jus de Grenade Pressé", description: "Grenade pressée, soupçon d'eau de rose", price: 60, category: "juices" },
  { id: 94, name: "Citron-Menthe", description: "Limonade fraîche, menthe pilée, agave", price: 45, category: "juices", image: "/picts/menu/lemon-juice.jpg" },
  { id: 95, name: "Carotte-Gingembre", description: "Pressé à froid, énergisant, citron", price: 50, category: "juices" },
  { id: 96, name: "Rafraîchissement Pastèque", description: "Menthe, citron vert, eau pétillante", price: 55, category: "juices" },
  { id: 97, name: "Lassi à la Mangue", description: "Yaourt, mangue, cardamome, miel", price: 60, category: "juices" },
  { id: 98, name: "Betterave & Pomme", description: "Pressé, gingembre frais, citron", price: 55, category: "juices" },
  { id: 99, name: "Détox Vert", description: "Concombre, céleri, pomme, menthe, citron", price: 60, category: "juices" },

  // MOCKTAILS — Mocktails Signés (alcohol-free signature drinks)
  { id: 401, name: "La Breva Spritz", description: "Pomme pétillante, orange sanguine, romarin", price: 80, category: "mocktails", isChefsRec: true, image: "/picts/menu/cocktails.jpg" },
  { id: 402, name: "Atlas Cooler", description: "Concombre, menthe, citron vert, eau tonique", price: 70, category: "mocktails" },
  { id: 403, name: "Medina Spice", description: "Ginger beer, citron vert, grenade, menthe", price: 75, category: "mocktails" },
  { id: 404, name: "Casablanca Breeze", description: "Sureau, concombre, citron vert, soda", price: 75, category: "mocktails" },
  { id: 405, name: "Sahara Sunset", description: "Mangue, fruit de la passion, citron vert, eau pétillante", price: 80, category: "mocktails" },
  { id: 406, name: "Mojito Berbère", description: "Menthe, citron vert, sucre roux, soda", price: 70, category: "mocktails" },
  { id: 407, name: "Rose & Cardamome", description: "Eau de rose, sirop de cardamome, limonade", price: 75, category: "mocktails" },
  { id: 408, name: "Argan Whisper", description: "Miel d'argan, agrumes, gingembre", price: 85, category: "mocktails" },
  { id: 409, name: "Saffron Tonic", description: "Sirop de safran, tonic, zeste de citron", price: 90, category: "mocktails" },
  { id: 410, name: "Fes Garden", description: "Hibiscus, rose, citron vert, pétillant", price: 75, category: "mocktails" },
  { id: 411, name: "Spice Route", description: "Cannelle, orange, gingembre, miel", price: 80, category: "mocktails" },

  // ICE CREAM & SORBETS — Glaces & Sorbets
  { id: 501, name: "Safran & Cardamome", description: "Baratté lentement, épices exotiques, poudre de pistache", price: 75, category: "icecream", isChefsRec: true, isVegetarian: true, image: "/picts/menu/icecream.jpg" },
  { id: 502, name: "Vanille en Gousse", description: "Vanille de Madagascar, crème fraîche", price: 60, category: "icecream", isVegetarian: true },
  { id: 503, name: "Gelato Pistache", description: "Pistaches siciliennes, filet de miel", price: 70, category: "icecream", isVegetarian: true },
  { id: 504, name: "Sorbet à la Rose", description: "Infusé aux pétales, léger, rafraîchissant", price: 65, category: "icecream", isVegetarian: true },
  { id: 505, name: "Menthe & Pépites de Chocolat", description: "Menthe fraîche, éclats de chocolat noir", price: 65, category: "icecream", isVegetarian: true },
  { id: 506, name: "Sorbet Citron de l'Atlas", description: "Citrons pressés à froid, menthe de montagne", price: 60, category: "icecream", isVegetarian: true },
  { id: 507, name: "Sorbet Fraise", description: "Fruits rouges de saison, réduction balsamique", price: 60, category: "icecream", isVegetarian: true },
  { id: 508, name: "Sorbet Framboise", description: "Acidulé et éclatant, basilic frais", price: 60, category: "icecream", isVegetarian: true },
  { id: 509, name: "Caramel à l'Argan", description: "Caramel or liquide, fleur de sel", price: 75, category: "icecream", isVegetarian: true },
  { id: 510, name: "Affogato", description: "Glace vanille, espresso chaud versé", price: 70, category: "icecream", isVegetarian: true },
  { id: 511, name: "Coupe Royale", description: "Trois boules, sauce & garnitures au choix", price: 110, category: "icecream", isVegetarian: true },

  // TEA & COFFEE — Thé & Café
  { id: 100, name: "Thé à la Menthe Marocain", description: "Menthe fraîche, thé vert, service traditionnel", price: 45, category: "tea", isChefsRec: true, image: "/picts/menu/mint-tea.jpg" },
  { id: 601, name: "Thé au Safran", description: "Miel, citron, filaments de safran", price: 55, category: "tea" },
  { id: 602, name: "Espresso", description: "Torréfaction Atlas, origine unique", price: 30, category: "tea" },
  { id: 603, name: "Double Espresso", description: "Torréfaction Atlas, corsé", price: 40, category: "tea" },
  { id: 604, name: "Café Noir", description: "Café filtre fort, touche de cardamome", price: 35, category: "tea" },
  { id: 605, name: "Nous-Nous", description: "Moitié café, moitié lait chaud", price: 40, category: "tea" },
  { id: 606, name: "Cappuccino", description: "Espresso, lait mousseux, poudre de cacao", price: 45, category: "tea" },
  { id: 607, name: "Latte Glacé", description: "Cold brew, lait, sirop de vanille", price: 50, category: "tea" },
  { id: 608, name: "Tisane de Verveine", description: "Apaisante, notes d'agrumes, miel", price: 40, category: "tea" },
  { id: 609, name: "Chai Tea Latte", description: "Thé noir épicé, lait chaud", price: 50, category: "tea" },
  { id: 610, name: "Chocolat Chaud", description: "Chocolat noir, crème fouettée, cacao", price: 55, category: "tea" },
];

type CourseDef = {
  key: string;
  title: string;
  french: string;
  Icon: typeof Salad;
};

const COURSE_ORDER: CourseDef[] = [
  { key: "breakfast", title: "Petit Déjeuner", french: "Petit Déjeuner", Icon: Egg },
  { key: "starters", title: "Entrées", french: "Pour Commencer", Icon: UtensilsCrossed },
  { key: "mezze", title: "Mezzés", french: "Petites Assiettes", Icon: Sandwich },
  { key: "salads", title: "Salades", french: "Les Salades", Icon: Salad },
  { key: "soups", title: "Soupes", french: "Les Soupes", Icon: Soup },
  { key: "tagines", title: "Tajines", french: "Les Tagines", Icon: Utensils },
  { key: "couscous", title: "Couscous", french: "Les Couscous", Icon: Wheat },
  { key: "seafood", title: "Fruits de Mer", french: "De la Mer", Icon: Fish },
  { key: "grills", title: "Grillades", french: "Les Grillades", Icon: Beef },
  { key: "pastries", title: "Pâtisseries", french: "Pâtisseries Salées", Icon: Croissant },
  { key: "desserts", title: "Desserts", french: "Les Douceurs", Icon: Cookie },
  { key: "juices", title: "Jus", french: "Jus Frais", Icon: GlassWater },
  { key: "mocktails", title: "Mocktails", french: "Mocktails Signés", Icon: CupSoda },
  { key: "icecream", title: "Glaces", french: "Glaces & Sorbets", Icon: IceCream2 },
  { key: "tea", title: "Thé & Café", french: "Thé & Café", Icon: Coffee },
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

function ChefLetterClose() {
  const sectionRef = useRef<HTMLElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Paper unfurl from the center as you scroll into view
      if (paperRef.current) {
        gsap.fromTo(
          paperRef.current,
          { clipPath: "inset(48% 0% 48% 0%)", opacity: 0.3 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Signature ink stroke draws in
      if (signatureRef.current) {
        const length = signatureRef.current.getTotalLength();
        gsap.set(signatureRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 1,
        });
        gsap.to(signatureRef.current, {
          strokeDashoffset: 0,
          duration: 2.4,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="menu-close"
      className="relative px-6 py-12 md:py-16 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #E8D5C0 0%, #D4A574 55%, #B8895A 100%)",
      }}
    >
      {/* Paper grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft glow behind the letter */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.45) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />

      {/* Deckled top edge ornament */}
      <svg
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 w-full h-3 text-[#3C2415]/12"
        viewBox="0 0 400 12"
        preserveAspectRatio="none"
      >
        <path d="M0,12 L0,6 Q10,0 20,6 T40,6 T60,6 T80,6 T100,6 T120,6 T140,6 T160,6 T180,6 T200,6 T220,6 T240,6 T260,6 T280,6 T300,6 T320,6 T340,6 T360,6 T380,6 T400,6 L400,12 Z" fill="currentColor" />
      </svg>

      <div
        ref={paperRef}
        className="relative max-w-3xl mx-auto text-center"
        style={{ color: "#3C2415" }}
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.15em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.5em" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, delay: 0.2 }}
          className="font-mono text-[12px] md:text-[14px] font-bold uppercase mb-6"
          style={{ color: "#4A2F1C" }}
        >
          Une Lettre du Chef
        </motion.p>

        {/* Main quote — large script */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.35 }}
          className="font-accent font-semibold italic text-[clamp(1.7rem,4.4vw,2.85rem)] leading-[1.18] max-w-2xl mx-auto mb-8"
          style={{ color: "#2A1810" }}
        >
          &ldquo;Une carte est une lettre. Lisez-la lentement et répondez par une assiette vide.&rdquo;
        </motion.h2>

        {/* Signature block */}
        <div className="mb-7">
          <svg
            viewBox="0 0 280 50"
            className="mx-auto block w-[260px] md:w-[300px] h-[44px] md:h-[50px]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              ref={signatureRef}
              d="M 18 32 C 32 8, 48 42, 64 24 C 78 8, 92 38, 108 22 C 122 6, 138 36, 152 26 C 168 14, 184 40, 200 28 C 216 14, 232 36, 248 24 C 256 18, 262 22, 265 30"
              stroke="#3C2415"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              opacity="0"
            />
          </svg>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="font-display font-semibold italic text-2xl md:text-3xl mt-1"
            style={{ color: "#3C2415" }}
          >
            Krishna Chaithanya
          </motion.p>
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.15em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
            viewport={{ once: true }}
            transition={{ delay: 2.1, duration: 0.9 }}
            className="font-mono text-[12px] md:text-[14px] font-bold uppercase mt-1.5"
            style={{ color: "#4A2F1C" }}
          >
            Chef Cuisinier &middot; Maison La Breva
          </motion.p>
        </div>

        {/* Vintage divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.4, ease: EASE_OUT_EXPO }}
          className="flex items-center justify-center gap-3 mb-6 origin-center"
        >
          <span className="h-px w-12 bg-[#3C2415]/35" />
          <span className="w-1.5 h-1.5 rotate-45 border" style={{ borderColor: "#8B5A2B" }} aria-hidden="true" />
          <span className="h-px w-12 bg-[#3C2415]/35" />
        </motion.div>

        {/* Postscript line */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="font-accent font-semibold italic text-lg md:text-2xl max-w-lg mx-auto mb-7 leading-relaxed"
          style={{ color: "#5A4438" }}
        >
          Notre offre de ce soir se savoure le mieux à notre table, avec l&apos;appel à la prière qui monte de la médina.
        </motion.p>

        {/* CTA — stamped envelope style */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="inline-block"
        >
          <motion.div
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          >
            <Link
              to="/reservation"
              className="group relative inline-flex items-center gap-3 px-10 py-4 text-[13px] md:text-[14px] font-bold tracking-[0.28em] uppercase rounded-none"
              style={{
                background: "#3C2415",
                color: "#F5E6D3",
                boxShadow:
                  "0 8px 20px -6px rgba(60,36,21,0.5), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.25)",
              }}
            >
              {/* Stamp postmark corners */}
              <span aria-hidden="true" className="absolute top-1 left-1 w-2 h-2 border-l border-t border-[#F5E6D3]/30" />
              <span aria-hidden="true" className="absolute top-1 right-1 w-2 h-2 border-r border-t border-[#F5E6D3]/30" />
              <span aria-hidden="true" className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-[#F5E6D3]/30" />
              <span aria-hidden="true" className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-[#F5E6D3]/30" />
              <span>Réserver une Table</span>
              <span className="group-hover:translate-x-1 transition-transform duration-500" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Deckled bottom edge */}
      <svg
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 w-full h-3 text-[#3C2415]/12 rotate-180"
        viewBox="0 0 400 12"
        preserveAspectRatio="none"
      >
        <path d="M0,12 L0,6 Q10,0 20,6 T40,6 T60,6 T80,6 T100,6 T120,6 T140,6 T160,6 T180,6 T200,6 T220,6 T240,6 T260,6 T280,6 T300,6 T320,6 T340,6 T360,6 T380,6 T400,6 L400,12 Z" fill="currentColor" />
      </svg>
    </section>
  );
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
          className="fixed inset-x-0 mx-auto w-fit z-40 bottom-6 md:bottom-8"
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
              aria-label={prev ? `Service précédent : ${prev.title}` : "Aucun service précédent"}
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
              aria-label={next ? `Service suivant : ${next.title}` : "Aucun service suivant"}
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
            Plat du Mois
          </span>
        </div>

        <h3 className="font-display italic text-4xl md:text-5xl text-white mb-3 leading-[0.95]">
          {item.name}
        </h3>

        <p className="font-mono font-bold text-[10px] tracking-[0.22em] uppercase text-white/85 mb-3">
          Signature du Chef · Disponible Toute la Saison
        </p>

        {item.description && (
          <p className="font-body text-[13px] md:text-sm text-white/85 leading-relaxed mb-5 max-w-md">
            {item.description}. Servi avec notre cérémonie traditionnelle et nos accompagnements de saison.
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
          · {String(items.length).padStart(2, "0")} plats
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
                    aria-label="Choix du chef"
                  />
                )}
                {item.isVegetarian && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#7C9D5A] text-white text-[9px] font-mono font-bold tracking-wider uppercase">
                    <Leaf size={8} strokeWidth={2.8} /> Vég
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
          </div>

          <motion.nav
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.9, ease: EASE_OUT_EXPO }}
            className="mt-12 md:mt-16 max-w-3xl mx-auto"
            aria-label="Sections du menu"
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
                  Le Menu
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

      {/* ====== CHEF'S CLOSING NOTE — handwritten letter ====== */}
      <ChefLetterClose />
    </div>
  );
}
