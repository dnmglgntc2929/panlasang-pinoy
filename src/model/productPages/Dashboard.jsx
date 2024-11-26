import React, { useEffect, useState } from "react";
import ProductDrawer from "../../components/prodoctComponents/ProductDrawer";
import {
  AppBar,
  Toolbar,
  Grid,
  Box,
  Button,
  Modal,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import Cards from "../../components/Cards";
import axios from "axios";
import withUserData from "../../components/UserData";
import placeholderImage from "../../assets/gulay.png";
import searchIngredients from "../../services/Axios";

const Dashboard = () => {
  const [user, setUser] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openRecipeModal, setOpenRecipeModal] = useState(false); // Recipe modal state
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null); // Selected dish for recipe modal
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [expandedRecipes, setExpandedRecipes] = useState([]);


  // Animal data
  const animalDishes = {
    Chicken: [
      {
        name: "Adobong Manok",
        description:
          "Chicken braised in soy sauce, vinegar, and garlic, a staple in Filipino households.",
        recipe: {
          ingredients: [
            "1kg Chicken",
            "1/2 cup Soy sauce",
            "1/4 cup Vinegar",
            "5 GlovesGarlic",
            "3 Bay leaves",
            "1tsp peppercorns",
            "1/2 cup water",
            "Salt to taste",
          ],
          steps: [
            "Marinate the chicken in soy sauce, vinegar, garlic, and bay leaves for 30 minutes.",
            "Cook in a pan over medium heat until the chicken is tender.",
            "Serve with rice.",
          ],
        },
      },
      {
        name: "Lomi",
        description:
          "Thick egg noodle soup with meat and vegetables, commonly served hot and comforting.",
        recipe: {
          ingredients: [
            "200g egg noodles",
            "100g pork",
            "100g shrimp",
            "1 egg",
            "1/2 cup cabbage",
            "1 carrot",
            "5 cloves garlic",
            "1 onion",
            "1/4 cup fish sauce",
            "1/4 cup soy sauce",
          ],
          steps: [
            "Boil noodles with meat and vegetables",
            "Serve hot with broth",
          ],
        },
      },
      {
        name: "Tinolang Manok",
        description:
          "A light chicken soup with ginger, papaya, and chili leaves, creating a comforting and nutritious dish.",
        recipe: {
          ingredients: [
            "1kgChicken",
            "1 Green papaya",
            "50g Ginger",
            "5 Gloves Garlic",
            "1 Onion",
            "1cup Malunggay Leaves",
            "1tbsp Fish Sauce",
            "Salt and pepper to taste",
          ],
          steps: [
            " Sauté ginger and onion, then add chicken.",
            " Pour water and add green papaya and chili leaves. ",
            " Simmer until chicken is cooked through.",
            " Season with salt and serve hot.",
          ],
        },
      },
      {
        name: "Arroz Caldo",
        description:
          "A comforting rice porridge with chicken, ginger, and garlic, topped with fried garlic and green onions.",
        recipe: {
          ingredients: [
            "1 cup glutinous rice",
            "500g chicken",
            "5 cloves garlic",
            " 1 onion, 50g ginger",
            "1 tbsp fish sauce",
            "salt to taste",
            "green onions for garnish",
          ],
          steps: [
            "Sauté garlic, onion, and ginger",
            "Add chicken and cook until browned",
            "Add rice and water, simmer until porridge is thick",
            "Garnish and serve warm",
          ],
        },
      },
    ],

    Pork: [
      {
        name: "Adobong Baboy",
        description:
          "A traditional Filipino dish made with pork marinated in soy sauce, vinegar, garlic, and spices, then simmered until tender.",
        recipe: {
          ingredients: [
            "1 kg pork belly",
            "1/2 cup soy sauce",
            " 1/4 cup vinegar",
            " 5 cloves garlic",
            " 3 bay leaves",
            "1 tsp peppercorns",
            " 1 tsp sugar (optional)",
            " 1/2 cup water",
            " salt to taste",
          ],
          steps: [
            "Marinate pork in soy sauce",
            " vinegar, garlic and bay leaf for 30 minutes",
            "Cook marinated pork in a pot over medium heat until browned",
            " Add water and simmer until pork is tender",
            "Adjust seasoning and serve with rice",
          ],
        },
      },
      {
        name: "Bicol Express",
        description:
          "A spicy dish made with pork belly cooked in coconut milk and chili, originating from the Bicol region.",
        recipe: {
          ingredients: [
            "1 kg pork belly",
            " 2 cups coconut milk",
            " 1/2 cup coconut cream",
            " 3 tbsp shrimp paste",
            " 5 green chili peppers",
            " 2 red chili peppers",
            " 5 cloves garlic",
            " 1 onion, salt to taste",
          ],
          steps: [
            "Sauté pork belly with garlic and chili",
            " Add coconut milk and simmer until pork is tender",
            " Season with salt and serve over rice",
          ],
        },
      },
      {
        name: "Binagoongan",
        description:
          "Pork belly cooked with shrimp paste, resulting in a savory and slightly salty flavor.",
        recipe: {
          ingredients: [
            "1 kg pork belly",
            " 3 tbsp shrimp paste",
            " 2 tomatoes",
            " 1 onion",
            " 5 cloves garlic",
            " 1/4 cup vinegar",
            " green chili to taste",
          ],
          steps: [
            "Sauté pork belly with shrimp paste and tomatoes",
            "Simmer until tender and serve with rice",
          ],
        },
      },
      {
        name: "Bopis",
        description:
          "A spicy pork lung dish cooked with vinegar, garlic, and chili, often served with rice.",
        recipe: {
          ingredients: [
            "1 kg pork lungs",
            " 1/4 cup vinegar",
            " 1 bell pepper",
            " 1 carrot",
            " 1 onion",
            " 5 cloves garlic",
            " chili to taste",
            " salt and pepper to taste",
          ],
          steps: [
            "Sauté pork lung with garlic and vinegar",
            "Add spices and simmer until cooked through",
            "Serve with rice",
          ],
        },
      },
      {
        name: "Chicharon Bulaklak",
        description:
          "Deep-fried pork intestines, a crunchy and flavorful Filipino snack.",
        recipe: {
          ingredients: [
            "500g pork intestines",
            " 1 tbsp salt",
            " 1/4 cup vinegar",
            "5 cloves garlic",
            " oil for frying",
          ],
          steps: [
            "Deep-fry pork intestines until crispy",
            "Serve with dipping sauce",
          ],
        },
      },
      {
        name: "Crispy Pata",
        description:
          "A spicy dish made with pork belly cooked in coconut milk and chili, originating from the Bicol region.",
        recipe: {
          ingredients: [
            "1 kg pork belly",
            " 2 cups coconut milk",
            " 1/2 cup coconut cream",
            " 3 tbsp shrimp paste",
            " 5 green chili peppers",
            " 2 red chili peppers",
            " 5 cloves garlic",
            " 1 onion, salt to taste",
          ],
          steps: [
            "Sauté pork belly with garlic and chili",
            " Add coconut milk and simmer until pork is tender",
            " Season with salt and serve over rice",
          ],
        },
      },
      {
        name: "Kare-Kare",
        description:
          "A rich peanut stew with oxtail, tripe, and vegetables, typically served with bagoong (fermented shrimp paste).",
        recipe: {
          ingredients: [
            "1 kg oxtail",
            " 1/2 cup peanut butter",
            " 1 tbsp annatto seeds",
            " 1 eggplant",
            " 100g string beans",
            " 1 banana heart",
            " 1 cup bok choy",
            " 5 cloves garlic",
            " 1 onion",
            " shrimp paste to taste",
          ],
          steps: [
            "Brown oxtail and tripe",
            " then simmer until tender",
            " Add peanut butter and vegetables cook until soft",
            "Serve with bagoong (fermented shrimp paste)",
          ],
        },
      },
      {
        name: "Lechon Kawali",
        description:
          "Crispy pork belly deep-fried to perfection, often served with lechon sauce or vinegar for dipping.",
        recipe: {
          ingredients: [
            "1 kg pork belly, 1 tbsp salt, 1 tbsp peppercorns",
            " 3 bay leaves",
            " 5 cloves garlic",
            " oil for frying",
          ],
          steps: [
            "Boil pork belly until tender",
            "Deep-fry until crispy, then slice and serve with dipping sauce",
          ],
        },
      },
      {
        name: "Inihaw na Liempo",
        description:
          "Grilled pork belly marinated in soy sauce and calamansi, delivering a smoky and flavorful taste.",
        recipe: {
          ingredients: [
            "1 kg pork belly",
            " 1/4 cup soy sauce",
            " 1/4 cup calamansi juice",
            " 5 cloves garlic",
            " 1 tsp pepper",
            " salt to taste",
            " oil for grilling",
          ],
          steps: [
            "Marinate pork belly in soy sauce, calamansi, and spices",
            "Grill until browned and cooked through",
            " Slice and serve with dipping sauce",
          ],
        },
      },
      {
        name: "Longanisa",
        description:
          "Sweet and garlicky Filipino sausage, usually served with rice and a fried egg.",
        recipe: {
          ingredients: [
            "500g ground pork",
            " 5 cloves garlic",
            " 1/4 cup brown sugar",
            " 1/4 cup vinegar",
            "salt and pepper to taste",
            " sausage casing",
          ],
          steps: [
            "Shape pork into sausage links with garlic and spices",
            "Fry until browned and serve with rice",
          ],
        },
      },
      {
        name: "Lumpiang Shanghai",
        description:
          "Crispy spring rolls filled with ground pork, carrots, and spices, commonly served as an appetizer.",
        recipe: {
          ingredients: [
            "500g ground pork",
            "1 carrot",
            " 1 onion",
            " 5 cloves garlic",
            "2 green onions",
            " salt and pepper to taste",
            " spring roll wrapper",
            " oil for frying",
          ],
          steps: [
            "Mix ground pork with minced carrots and spices",
            "Wrap in spring roll wrapper and fry until crispy",
            "Serve with dipping sauce",
          ],
        },
      },
      {
        name: "Paksiw sa Pata",
        description:
          "Pork hock braised in soy sauce and vinegar with banana blossoms for a sweet-savory flavor.",
        recipe: {
          ingredients: [
            "1 kg pork hock",
            " 1/4 cup vinegar",
            " 1/4 cup soy sauce",
            " 1/2 cup banana blossoms",
            " 5 cloves garlic",
            " 1 onion",
            " 3 bay leaves",
            " 1 tbsp peppercorns",
            " 2 tbsp brown sugar",
          ],
          steps: [
            "Braise pork hock in soy sauce and vinegar with garlic",
            " Add banana blossoms and simmer until tender",
            "Serve with rice",
          ],
        },
      },
      {
        name: "Pancit Canton",
        description:
          "Stir-fried egg noodles with vegetables, pork, shrimp, and soy sauce, commonly served at Filipino gatherings.",
        recipe: {
          ingredients: [
            "200g pancit canton noodles",
            " 100g chicken",
            " 100g shrimp",
            " 1 carrot",
            " 1/2 cabbage",
            " 1 bell pepper",
            " 50g snow peas",
            " 1 onion",
            " 5 cloves garlic",
            " 1/4 cup soy sauce",
            " 2 tbsp oyster sauce",
            " salt and pepper to taste",
          ],
          steps: [
            "Stir-fry pork and shrimp with garlic and onion",
            "Add soy sauce, broth, and noodles, then cook until tender",
            "Add vegetables and stir-fry until well-mixed",
            "Serve warm with calamansi",
          ],
        },
      },
      {
        name: "Pork Dinuguan",
        description:
          "A savory pork blood stew flavored with vinegar and spices, known for its unique flavor.",
        recipe: {
          ingredients: [
            "1 kg pork belly",
            " 1 cup pork blood",
            " 1/4 cup vinegar",
            "5 cloves garlic",
            " 1 onion",
            " green chili to taste",
            " salt and pepper to taste",
          ],
          steps: [
            "Simmer pork blood with vinegar and spices",
            " Add pork cuts and serve with rice",
          ],
        },
      },
      {
        name: "Pork Sisig",
        description:
          "A sizzling dish made from chopped pig's face, flavored with onions, chili, and calamansi.",
        recipe: {
          ingredients: [
            "1 kg pork cheeks",
            " 1 onion",
            " 1/4 cup calamansi juice",
            "salt and pepper to taste",
            "mayonnaise to taste",
          ],
          steps: [
            "Grill chopped pig's face until crispy",
            "Serve sizzling with onions and chili",
          ],
        },
      },
      {
        name: "Sinigang na Baboy",
        description:
          "A tangy pork soup with a savory-sour flavor from tamarind, cooked with vegetables like radish, eggplant, and string beans.",
        recipe: {
          ingredients: [
            "1 kg pork spare ribs",
            " 5 cups water",
            " 1 cup tamarind pulp",
            " 2 tomatoes, 1 onion",
            " 1 radish",
            " 100g string beans",
            " 2 eggplants",
            " 1 cup kangkong leaves",
            " 1 green chili",
            " salt to taste",
          ],
          steps: [
            "Boil pork with water and tamarind",
            "Add tomatoes, onions, and other vegetables",
            " Season with fish sauce and simmer until pork is tender",
            "Serve hot with rice",
          ],
        },
      },
    ],
    Seafoods: [
      {
        name: "Dinengdeng",
        description:
          "A vegetable soup with squash, string beans, and bitter melon in fish sauce, native to Ilocos region.",
        recipe: {
          ingredients: [
            "100g winged beans, 100g squash",
            " 100g eggplant",
            " 1 tomato",
            " 1 onion",
            " 1/2 cup bagoong (fermented fish paste)",
            " salt to taste",
          ],
          steps: ["Simmer vegetables with fish sauce", "Serve with rice"],
        },
      },
      {
        name: "Palabok",
        description:
          "Rice noodles with a savory sauce, topped with shrimp, egg, and crushed chicharon.",
        recipe: {
          ingredients: [
            "200g rice noodles",
            " 1/2 cup shrimp broth",
            " 100g pork",
            " 2 tbsp annatto oil",
            " 2 tbsp crushed chicharron",
            " 1 egg",
            " 1/4 cup fish sauce",
            " green onions for garnish",
          ],
          steps: [
            "Layer noodles with sauce, shrimp, and toppings",
            "Serve with calamansi",
          ],
        },
      },
      {
        name: "Sinigang na Hipon",
        description:
          "A sour shrimp soup with tamarind and vegetables like radish, tomatoes, and green beans.",
        recipe: {
          ingredients: [
            "500g shrimp",
            " 5 cups water",
            " 1 cup tamarind pulp",
            " 2 tomatoes",
            " 1 onion",
            " 1 radish",
            " 100g string beans",
            " 2 eggplants",
            " 1 cup kangkong leaves",
            " salt to taste",
          ],
          steps: [
            "Boil shrimp with tamarind and vegetables",
            "Season with fish sauce",
            "Serve hot with rice",
          ],
        },
      },
    ],
    Beef: [
      {
        name: "Beef Kaldereta",
        description:
          "A hearty stew made with beef, tomatoes, and bell peppers, usually served with steamed rice.",
        recipe: {
          ingredients: [
            "1 kg beef",
            " 1 cup tomato sauce",
            " 1/4 cup liver spread",
            " 2 potatoes",
            " 2 carrots",
            " 1 bell pepper",
            " 1/2 cup green peas",
            " 1/4 cup olives",
            " 1 onion",
            " 5 cloves garlic",
            " salt and pepper to taste",
          ],
          steps: [
            "Sauté beef with garlic and onions",
            "Add tomato sauce, bell peppers, and potatoes",
            "Simmer until beef is tender",
            "Serve with rice",
          ],
        },
      },
      {
        name: "Bulalo",
        description:
          "A beef marrow soup with corn and vegetables, slow-cooked to bring out its rich, meaty flavor.",
        recipe: {
          ingredients: [
            "1 kg beef shank",
            " 4 corn on the cob",
            " 1 bunch bok choy",
            " 100g string beans",
            " 1 onion",
            " 5 cloves garlic",
            " 1 tbsp peppercorns",
            " 1 tbsp fish sauce",
            " salt to taste",
          ],
          steps: [
            "Boil beef shank with onion and peppercorns until tender",
            "Add corn and vegetables, then simmer",
            "Season with salt and serve hot",
          ],
        },
      },
      {
        name: "Bistek Tagalog",
        description:
          "Beef steak marinated in soy sauce and calamansi, topped with caramelized onions.",
        recipe: {
          ingredients: [
            "500g beef sirloin",
            " 1/4 cup soy sauce",
            " 1/4 cup calamansi juice",
            " 2 onions",
            " 1/2 cup water",
            " salt and pepper to taste",
          ],
          steps: [
            "Marinate beef with calamansi and soy sauce",
            "Fry with onions and serve with rice",
          ],
        },
      },
      {
        name: "Nilagang Baka",
        description:
          "A hearty boiled beef dish with cabbage, corn, and potatoes, perfect for cold weather.",
        recipe: {
          ingredients: [
            "1 kg beef shank",
            " 4 corn on the cob",
            " 100g green beans",
            " 1 onion",
            " 3 cloves garlic",
            " salt and pepper to taste",
            " 1 bunch cabbage or bok choy",
          ],
          steps: [
            "Boil beef shank with onion and peppercorns until tender",
            "Add corn and vegetables, then simmer",
            "Season with salt and serve hot",
          ],
        },
      },
      {
        name: "Tapsilog",
        description:
          "Beef tapa served with garlic rice and a fried egg, a popular Filipino breakfast meal.",
        recipe: {
          ingredients: [
            "500g beef tapa",
            "5 cloves garlic",
            " 1/4 cup vinegar",
            " 1/4 cup soy sauce",
            " salt and pepper to taste",
            " 2 fried eggs",
            " garlic fried rice",
          ],
          steps: [
            " Marinate beef, then fry with garlic rice and egg",
            "Serve hot with vinegar",
          ],
        },
      },
    ],
    Vegies: [
      {
        name: "Ensaladang Talong",
        description:
          "Roasted eggplant salad with tomatoes and onions, served with bagoong or fish sauce.",
        recipe: {
          ingredients: [
            "2 eggplants",
            " 1 tomato",
            " 1 onion",
            " 1/4 cup vinegar",
            " salt to taste",
            " 1/4 cup fish sauce (optional)",
          ],
          steps: [
            "Grill eggplant and serve with tomato and onion",
            "Garnish with bagoong",
          ],
        },
      },
      {
        name: "Tortang Talong",
        description:
          "Grilled eggplant omelette topped with ground pork or crab, a savory Filipino breakfast item.",
        recipe: {
          ingredients: [
            "4 eggplants",
            " 3 eggs",
            " salt and pepper to taste",
            " oil for frying",
          ],
          steps: [
            "Grill eggplant until tender, then peel",
            "Mash and mix with eggs",
            "Fry until golden brown",
          ],
        },
      },
      {
        name: "Ginataang Gulay",
        description:
          "Mixed vegetables cooked in coconut milk, creating a creamy and savory side dish.",
        recipe: {
          ingredients: [
            "200g squash",
            " 100g string beans",
            " 2 cups coconut milk",
            "100g shrimp",
            " 5 cloves garlic",
            " 1 onion",
            " fish sauce to taste",
          ],
          steps: [
            "Sauté mixed vegetables with garlic and coconut milk",
            "Simmer until creamy and vegetables are tender",
            "Serve with rice",
          ],
        },
      },
      {
        name: "Ginisang Monggo",
        description:
          "A savory mung bean stew with pork and leafy greens, a healthy and filling dish.",
        recipe: {
          ingredients: [
            "1 cup mung beans",
            " 100g pork",
            " 100g spinach leaves",
            " 5 cloves garlic",
            " 1 onion",
            " 2 tomatoes",
            " fish sauce to taste",
          ],
          steps: [
            "Cook mung beans with pork and garlic",
            "Add vegetables and simmer",
            "Serve with rice",
            ,
          ],
        },
      },
      {
        name: "Laing",
        description:
          "Taro leaves simmered in coconut milk and spicy chilis, creating a creamy, flavorful side dish.",
        recipe: {
          ingredients: [
            " 200g dried taro leaves",
            " 2 cups coconut milk",
            " 2 tbsp shrimp paste",
            " 5 cloves garlic",
            " 1 onion, 50g ginger",
            " 5 red chili peppers",
            " salt to taste",
          ],
          steps: [
            "Boil taro leaves with coconut milk, chili, and spices",
            "Simmer until leaves are tender and sauce is creamy",
            "Serve with rice",
          ],
        },
      },
      {
        name: "Pinakbet",
        description:
          "A vegetable dish cooked with shrimp paste, often including squash, eggplant, bitter melon, and okra.",
        recipe: {
          ingredients: [
            " 200g squash",
            " 1 eggplant",
            " 1 bitter melon",
            " 100g okra",
            " 100g string beans",
            " 2 tomatoes",
            " 3 tbsp shrimp paste",
            " 100g pork belly",
          ],
          steps: [
            "Sauté shrimp paste with garlic and onion",
            "Add vegetables and cook until tender",
            "Serve as a side dish",
          ],
        },
      },
    ],
    Dessert: [
      {
        name: "Bibingka",
        description:
          "A baked rice cake with a slight sweetness, often enjoyed during Christmas.",
        recipe: {
          ingredients: [
            "1 cup rice flour",
            " 1 cup coconut milk",
            " 2 eggs",
            " 1/2 cup sugar",
            " 1/2 tsp baking powder",
            " banana leaves",
            " salted egg slices",
          ],
          steps: [
            " Mix rice flour, coconut milk, and sugar",
            " Bake until set and serve warm",
            ,
          ],
        },
      },
      {
        name: "Buko Pie",
        description:
          "A coconut custard pie with a soft and chewy texture, a popular Filipino dessert.",
        recipe: {
          ingredients: [
            "500g young coconut",
            " 1 cup flour",
            " 1/4 cup butter",
            " 1/4 cup sugar",
            " 1/2 cup evaporated milk",
            " 1 tbsp cornstarch",
          ],
          steps: [
            "Prepare coconut custard and bake until set",
            "Serve warm as dessert",
            ,
          ],
        },
      },
      {
        name: "Camote Cue",
        description:
          "Sweet potato slices deep-fried and coated in caramelized sugar, a popular street food snack.",
        recipe: {
          ingredients: [
            "4 large camote",
            " 1/2 cup brown sugar",
            " oil for frying",
          ],
          steps: [
            "Deep-fry sweet potato slices",
            "Coat with caramelized sugar and serve",
            ,
          ],
        },
      },
      {
        name: "Champorado",
        description:
          "Chocolate rice porridge, typically served hot for breakfast or dessert.",
        recipe: {
          ingredients: [
            "1 cup glutinous rice",
            " 1/4 cup cocoa powder",
            " 1/4 cup sugar",
            " evaporated milk for serving",
          ],
          steps: [
            " Cook sticky rice with chocolate and sugar",
            " Serve hot with milk",
            ,
          ],
        },
      },
      {
        name: "Empanada",
        description:
          "Filipino-style meat pastry with a savory filling of ground meat and vegetables.",
        recipe: {
          ingredients: [
            "500g ground pork",
            " 1 potato",
            " 1 carrot",
            " 1 onion",
            " 3 cloves garlic",
            " salt and pepper to taste",
            " dough for crust",
            " oil for frying",
          ],
          steps: [
            "Fill pastry with meat filling and bake until golden",
            "Serve warm",
          ],
        },
      },
      {
        name: "Halo-Halo",
        description:
          "A layered dessert with shaved ice, sweet beans, and various fruits, topped with leche flan and ube.",
        recipe: {
          ingredients: [
            "1 cup shaved ice",
            " 1/4 cup milk",
            " 1/4 cup sweetened beans",
            " assorted jellies",
            " 1/4 cup nata de coco",
          ],
          steps: [
            "Layer shaved ice with sweet beans, fruits, and toppings",
            "Serve cold",
          ],
        },
      },
      {
        name: "Kutsinta",
        description:
          "Steamed rice cake topped with grated coconut, often served as a snack or dessert.",
        recipe: {
          ingredients: [
            "1 cup rice flour",
            " 1/2 cup brown sugar",
            " 1/4 tsp lye water",
            " annatto seeds",
            " grated coconut for topping",
          ],
          steps: [
            "Steam rice flour mixture with annatto and sugar",
            "Top with coconut and serve",
          ],
        },
      },
      {
        name: "Leche Flan",
        description:
          "	A creamy caramel custard dessert, a staple at Filipino gatherings.",
        recipe: {
          ingredients: [
            "8 egg yolks",
            " 1 can condensed milk",
            " 1 can evaporated milk",
            " 1/4 cup sugar for caramel",
          ],
          steps: ["Cook caramel custard until set", "Serve as dessert"],
        },
      },
      {
        name: "Pandesal",
        description:
          "Soft and slightly sweet Filipino bread, often eaten for breakfast.",
        recipe: {
          ingredients: [
            "4 cups all-purpose flour",
            " 1/2 cup sugar",
            " 1 tsp salt",
            " 2 tsp yeast",
            " 1 cup milk",
            " 1/4 cup butter",
            " 1 egg",
          ],
          steps: ["Bake dough until golden", "Serve with butter"],
        },
      },
      {
        name: "Puto Bumbong",
        description:
          "	Sticky rice topped with shredded coconut, served during the Christmas season.",
        recipe: {
          ingredients: [
            "1 cup glutinous rice flour",
            " 1/2 cup purple food coloring",
            " banana leaves",
            " grated coconut for topping",
            " 1/4 cup brown sugar",
          ],
          steps: ["Steam sticky rice with coconut", "Serve with sugar"],
        },
      },
      {
        name: "Sapin-Sapin",
        description:
          "A colorful layered sticky rice cake, usually served during special occasions.",
        recipe: {
          ingredients: [
            "1 cup glutinous rice flour",
            "1 cup coconut milk",
            " 1 cup sugar",
            " food coloring for layers",
            " coconut curds for topping",
          ],
          steps: [
            "Layer sticky rice in colors and steam",
            "Serve as a sweet dessert",
          ],
        },
      },
      {
        name: "Turon",
        description:
          "Sweet fried plantains wrapped in spring roll wrapper and caramelized with sugar.",
        recipe: {
          ingredients: [
            "10 saba bananas",
            " 10 lumpia wrappers",
            " 1/4 cup brown sugar",
            " jackfruit (optional)",
            " oil for frying",
          ],
          steps: [
            "Wrap plantain in spring roll wrapper with sugar",
            "Fry until golden and serve",
          ],
        },
      },
      {
        name: "Ube Halaya",
        description:
          "Purple yam jam, sweet and creamy, a popular Filipino dessert.",
        recipe: {
          ingredients: [
            "1 kg ube",
            " 1 can condensed milk",
            " 1 cup coconut milk",
            " 1/4 cup butter",
            " 1/4 cup sugar",
          ],
          steps: [
            "Cook purple yam with sugar and coconut milk",
            "Mash until smooth and serve",
          ],
        },
      },
    ],
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get("http://localhost:3001/api/user", {
          headers: { "x-access-token": token },
        });

        const { result } = response.data;
        const { firstname, lastname } = result;
        setUser(`${firstname} ${lastname}`);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  // Handle the modal open action
  const handleOpenModal = (animal) => {
    setSelectedAnimal(animal);
    setOpenModal(true);
  };

  // Handle modal close action
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAnimal(null);
  };

  // Handle opening the recipe modal
  const handleOpenRecipeModal = (dish) => {
    setSelectedDish(dish);
    setOpenRecipeModal(true);
  };

  // Handle closing the recipe modal
  const handleCloseRecipeModal = () => {
    setOpenRecipeModal(false);
    setSelectedDish(null);
  };

  // Search functionality
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) {
        alert("Please enter a search query.");
        return;
    }

    try {
        const response = await axios.post(
            "http://127.0.0.1:5000/api/recipes/prompt_search",
            { prompt: searchQuery }
        );

        if (response.status === 200) {
            setSearchResults(response.data);
        } else {
            setSearchResults([]);
        }
    } catch (error) {
        console.error("Error fetching search results", error);
        if (error.response) {
            console.error("Server Error:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("Network Error:", error.request);
        } else {
            console.error("Error", error.message);
        }
        setSearchResults([]);
    }
};

  
  const handleRecipeClick = (index) => {
    if (expandedRecipes.includes(index)) {
      // Collapse the recipe if it's already expanded
      setExpandedRecipes(expandedRecipes.filter((i) => i !== index));
    } else {
      // Expand the recipe
      setExpandedRecipes([...expandedRecipes, index]);
    }
  };
  


  return (
    <div>
      <AppBar>
        <Toolbar>
          <ProductDrawer />
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Grid container spacing={3} style={{ padding: 24 }}>
        {/* Card 1 */}
        <Grid item xs={12} md={4}>
          <Cards
            title={`Welcome, ${user}!`}
            content="Your Dashboard"
            customStyles={{
              height: "250px",
              width: "100%",
              display: "flex",
              justifyContent: "top",
              alignItems: "left",
            }}
          />
        </Grid>

        {/* Card 2: Animal Buttons */}
        <Grid item xs={12} md={8}>
          <Cards
            customStyles={{
              height: "250px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: "100%",
                padding: "16px",
              }}
            >
              {[
                { animal: "Chicken", image: placeholderImage },
                { animal: "Pork", image: placeholderImage },
                { animal: "Seafoods", image: placeholderImage },
                { animal: "Beef", image: placeholderImage },
                { animal: "Vegies", image: placeholderImage },
                { animal: "Dessert", image: placeholderImage },
              ].map(({ animal, image }) => (
                <IconButton
                  key={animal}
                  onClick={() => handleOpenModal(animal)}
                  aria-label={animal}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={image}
                    alt={animal}
                    style={{
                      width: "60px",
                      height: "60px",
                      marginBottom: "8px",
                    }}
                  />
                  <Typography variant="body2">{animal}</Typography>
                </IconButton>
              ))}
            </Box>
          </Cards>
        </Grid>

        {/* Card 3: Search Bar */}
        <Grid item xs={12} md={4}>
          <Cards
            title="What to Eat Today?"
            customStyles={{ height: "400px", width: "100%" }}
          >
            <Box
              sx={{
                backgroundColor: "White",
                height: "300px",
                width: "100%",
                marginTop: "10px",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <TextField
                id="outlined-search"
                label="Search for dishes"
                type="search"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              />
              <Button
                sx={{ marginTop: "16px" }}
                fullWidth
                variant="contained"
                onClick={handleSearchSubmit}
              >
                Search
              </Button>
            </Box>
          </Cards>
        </Grid>
        </Grid>

        {/* Card 4: Search Results */}
        <Grid item xs={12} md={8}>
        <Cards
        title="Search Results"
        customStyles={{
          height: "400px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column", // Enable scrolling if content overflows
        }}
  >
    {searchResults.length > 0 ? (
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
                  padding: "16px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  width: "100%",
                  textAlign: "center",
        }}
      >
        {searchResults.map((result, index) => (
          <Box key={index} sx={{ marginBottom: "16px", textAlign: "left" }}>
            <Typography
              variant="h6"
              sx={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
              onClick={() => handleRecipeClick(index)}
            >
              {result.name}
            </Typography>
            {expandedRecipes.includes(index) && (
              <Box sx={{ paddingLeft: "16px" }}>
                <Typography variant="body1" gutterBottom>
                  {result.description}
                </Typography>
                {result.ingredients && result.ingredients.length > 0 && (
                  <>
                    <Typography variant="subtitle1">Ingredients:</Typography>
                    <ul>
                      {result.ingredients.map((ingredient, idx) => (
                        <li key={idx}>{ingredient}</li>
                      ))}
                    </ul>
                  </>
                )}
                {result.steps && result.steps.length > 0 && (
                  <>
                    <Typography variant="subtitle1">Steps:</Typography>
                    <ol>
                      {result.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </>
                )}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    ) : (
      <Typography variant="body2">
        No results found. Try another search.
      </Typography>
    )}
  </Cards>
</Grid>



      {/* Modal for Animal Dishes */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "600px",
            maxHeight: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {selectedAnimal
              ? selectedAnimal.charAt(0).toUpperCase() + selectedAnimal.slice(1)
              : "Select Animal"}{" "}
            Dishes
          </Typography>

          <Grid container spacing={3}>
            {animalDishes[selectedAnimal]?.map((dish, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer", // Make dish clickable
                  }}
                  onClick={() => handleOpenRecipeModal(dish)}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "150px",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    {/* Placeholder for dish image */}
                    <Typography variant="body2" sx={{ lineHeight: "150px" }}>
                      Image Here
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" gutterBottom>
                    {dish.name}
                  </Typography>
                  <Typography variant="body2">{dish.description}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Button
            onClick={handleCloseModal}
            sx={{ mt: 3, display: "block", margin: "0 auto" }}
            variant="contained"
          >
            Close
          </Button>
        </Box>
      </Modal>

      {/* Modal for Recipe Details */}
      <Modal open={openRecipeModal} onClose={handleCloseRecipeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "600px",
            maxHeight: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            overflowY: "auto",
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Recipe for {selectedDish?.name}
          </Typography>

          <Typography variant="body1" gutterBottom>
            {selectedDish?.description}
          </Typography>

          {/* Ingredients */}
          <Typography variant="h4">Ingredients:</Typography>
          <ul>
            {selectedDish?.recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>

          {/* Steps */}
          <Typography variant="h4">Steps:</Typography>
          <ol>
            {selectedDish?.recipe.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>

          <Button
            onClick={handleCloseRecipeModal}
            sx={{ mt: 3, display: "block", margin: "0 auto" }}
            variant="contained"
          >
            Close Recipe
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default withUserData(Dashboard);
