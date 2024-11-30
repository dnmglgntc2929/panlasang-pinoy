from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
import json
import logging
import re
from langdetect import detect, DetectorFactory
from googletrans import Translator
from collections import defaultdict
from functools import lru_cache
from nltk.stem import WordNetLemmatizer
import nltk

try:
    from flask_limiter import Limiter
    from flask_limiter.util import get_remote_address
    from flask_limiter.errors import RateLimitExceeded
except ImportError:
    raise ImportError("Flask-Limiter is not installed. Please install it using 'pip install flask-limiter'")

# Ensure consistent language detection
DetectorFactory.seed = 0

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # Enable CORS for specific origin
limiter = Limiter(get_remote_address, app=app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Recipe file path
RECIPES_FILE = 'recipes.json'

# Initialize Google Translator for multi-language support
translator = Translator()

# Initialize WordNetLemmatizer for plural to singular conversion
nltk.download('wordnet')
lemmatizer = WordNetLemmatizer()

# Global variable to store the inverted index
inverted_index = defaultdict(list)
recipes = []

# Custom dictionary for Filipino and Cebuano ingredients
ingredient_translation_dict = {
    "itlog": "egg",
    "manok": "chicken",
    "baboy": "pork",
    "bawang": "garlic",
    "sibuyas": "onion",
    "asukal": "sugar",
    "paminta": "pepper",
    "sili": "chili",
    "gatas": "milk",
    "tubig": "water",
    "kamatis": "tomato",
    "patatas": "potato",
    "luya": "ginger",
    "talong": "eggplant",
    "isda": "fish",
    "bangus": "fish",
    "tilapia": "fish",
    "galunggong": "fish",
    "ube": "purple yam",
    "vegetables": [
    "Garlic",
    "Onion",
    "Eggplant",
    "Kangkong (water spinach)",
    "Radish",
    "Okra",
    "String beans",
    "Bok choy",
    "Banana blossom",
    "Ginger",
    "Chili leaves",
    "Malunggay leaves",
    "Cabbage",
    "Carrot",
    "Bell pepper",
    "Pechay (bok choy)",
    "Potatoes",
    "Corn",
    "Bird's eye chilies",
    "Taro leaves",
    "Bitter melon",
    "Squash",
    "Long beans",
    "Tomatoes",
    "Mung beans",
    "Spinach",
    "Lemongrass",
    "Spring onions",
    "Sweet potatoes",
    "Ube (purple yam)",
    "Green peas",
    "Green chilies",
    "Squash flowers",
    "Mustard leaves",
    "Red chilies"
  ],
  "fruits": [
    "Tamarind",
    "Calamansi",
    "Lemon",
    "Coconut",
    "Banana",
    "Jackfruit",
    "Raisins",
    "Cocoa",
    "Lime",
    "Coconut gel (nata de coco)",
    "Sugar palm fruit (kaong)",
    "Macapuno",
    "Kamias",
    "Papaya"
  ]
}

@lru_cache(maxsize=1000)
def load_recipes():
    """Load recipes from the JSON file."""
    try:
        with open(RECIPES_FILE, 'r', encoding='utf-8') as file:
            recipes = json.load(file)
            logging.debug(f"Total recipes loaded: {len(recipes)}")
            return recipes
    except Exception as e:
        logging.error(f"Error loading recipes: {e}")
        return []

def build_inverted_index(recipes):  
    """Build an inverted index from recipes."""
    index = defaultdict(list)
    for idx, recipe in enumerate(recipes):
        # Combine keywords from title, description, and ingredients
        title_keywords = recipe.get('name', '').lower().split()
        description_keywords = recipe.get('description', '').lower().split()
        ingredients_keywords = " ".join(recipe.get('ingredients', [])).lower().split()

        all_keywords = set(title_keywords + description_keywords + ingredients_keywords)
        
        for keyword in all_keywords:
            index[keyword].append(idx)
    return index

@lru_cache(maxsize=1000)
def translate_text(text, target_language):
    """Translate text to the target language."""
    try:
        translated_text = translator.translate(text, dest=target_language).text
        logging.debug(f"Translated '{text}' to '{translated_text}'")
        return translated_text.lower()
    except Exception as e:
        logging.error(f"Translation error for text '{text}': {e}")
        return text.lower()  # Fallback to the original text

# Initialize the app by building the index and loading recipes
logging.info("Initializing app...")
recipes = load_recipes()
inverted_index = build_inverted_index(recipes)
logging.info("Inverted index built successfully.")

def extract_ingredient_name(ingredient_line):
    original_line = ingredient_line  # Keep the original line for debugging
    # Remove quantities and units (e.g., "1 kg", "500 grams")
    ingredient_line = re.sub(r'^\d+[\d\s\/]*\b(kg|g|grams|gram|lbs|pounds|cup|cups|ml|l|liter|liters|ounce|ounces)\b\s*', '', ingredient_line, flags=re.IGNORECASE)
    # Remove descriptors in parentheses
    ingredient_line = re.sub(r'\(.*?\)', '', ingredient_line)
    # Split by commas and take the first part
    ingredient_name = ingredient_line.split(',')[0]
    # Remove any additional descriptors
    descriptors = [
        'chopped', 'sliced', 'minced', 'diced', 'crushed', 'peeled', 'grated',
        'julienned', 'divided', 'rinsed', 'drained', 'fresh', 'dried', 'large',
        'small', 'medium', 'optional', 'pieces', 'whole', 'skinless', 'boneless',
        'cubes', 'cubed', 'trimmed', 'ground', 'lean', 'with', 'without', 'stems',
        'leaves', 'heads', 'cloves', 'halves', 'ribs', 'sticks', 'inch', 'inches'
    ]
    pattern = r'\b(' + '|'.join(descriptors) + r')\b'
    ingredient_name = re.sub(pattern, '', ingredient_name, flags=re.IGNORECASE)
    # Remove extra whitespace and non-alphabetic characters
    ingredient_name = re.sub(r'[^a-zA-Z\s]', '', ingredient_name)
    ingredient_name = re.sub(r'\s+', ' ', ingredient_name).strip()
    # Convert to singular form
    ingredient_name = lemmatizer.lemmatize(ingredient_name)
    logging.debug(f"Extracted ingredient name from '{original_line}' -> '{ingredient_name}'")
    return ingredient_name.lower()

def translate_ingredient(ingredient):
    """Translate ingredient using custom dictionary or fallback to Google Translate."""
    ingredient = ingredient.lower().strip()
    if ingredient in ingredient_translation_dict:
        translated_ingredient = ingredient_translation_dict[ingredient]
        if isinstance(translated_ingredient, list):
            logging.debug(f"Translated '{ingredient}' using dictionary to list: {translated_ingredient}")
            return translated_ingredient
        else:
            logging.debug(f"Translated '{ingredient}' using dictionary to '{translated_ingredient}'")
            return [translated_ingredient]
    else:
        # Fallback to Google Translate if not found in the dictionary
        translated_ingredient = translate_text(ingredient, 'en')
        logging.debug(f"Translated '{ingredient}' to '{translated_ingredient}' using Google Translate")
    
    # Convert translated ingredient to singular form
    translated_ingredient = lemmatizer.lemmatize(translated_ingredient)
    return [translated_ingredient]


# Helper function to add CORS headers to response
def add_cors_headers(response):
    response.headers.update({
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    })
    return response

def error_response(message, status_code):
    response = jsonify({"error": message})
    return add_cors_headers(response), status_code

recipe_api = Blueprint('recipe_api', __name__)

@recipe_api.route('/api/recipes/ingredient_search', methods=['POST', 'OPTIONS'])
@limiter.limit("10 per minute")
def ingredient_search():
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight success"})
        return add_cors_headers(response)

    try:
        # Attempt to get JSON data from the request
        user_ingredients = request.get_json(silent=True)
        if user_ingredients is None or 'ingredients' not in user_ingredients:
            raise ValueError("Invalid JSON format.")

        ingredients = user_ingredients.get('ingredients', [])
        logging.debug(f"Received ingredients: {ingredients}")

        # Translate ingredients if needed and handle umbrella terms
        user_ingredient_keywords = set()
        for ingredient in ingredients:
            translated_ingredients = translate_ingredient(ingredient)
            user_ingredient_keywords.update(translated_ingredients)

        logging.debug(f"Translated ingredients: {user_ingredient_keywords}")

        matching_recipes = []

        # Process recipes to find matches
        for recipe in recipes:
            recipe_ingredient_names = set()
            for ingredient in recipe.get('ingredients', []):
                ingredient_name = extract_ingredient_name(ingredient)
                recipe_ingredient_names.add(ingredient_name)
            logging.debug(f"Recipe '{recipe['name']}' ingredients: {recipe_ingredient_names}")

            # Find matched ingredients
            matched_ingredients = user_ingredient_keywords.intersection(recipe_ingredient_names)
            logging.debug(f"Matched ingredients for '{recipe['name']}': {matched_ingredients}")

            if matched_ingredients:
                # Calculate match score
                match_score = len(matched_ingredients) / len(user_ingredient_keywords)
                recipe_copy = recipe.copy()
                recipe_copy['match_score'] = match_score
                recipe_copy['matched_ingredients'] = list(matched_ingredients)
                matching_recipes.append(recipe_copy)

        # Sort recipes by match score in descending order
        matching_recipes = sorted(matching_recipes, key=lambda r: r['match_score'], reverse=True)

        # Limit the results to top N recipes
        N = 5
        matching_recipes = matching_recipes[:N]

        if not matching_recipes:
            logging.info("No matching recipes found.")

        response = jsonify(matching_recipes)
        return add_cors_headers(response), 200

    except ValueError as e:
        logging.error(f"Invalid JSON format: {e}")
        return jsonify({"message": "Invalid JSON format."}), 400
    except Exception as e:
        logging.error(f"Error during ingredient search: {e}")
        return jsonify({"message": "Internal server error."}), 500

# Custom error handler for rate limit exceeded
@limiter.request_filter
def exempt_options_requests():
    # Exempt OPTIONS requests from rate limiting
    return request.method == "OPTIONS"

@app.errorhandler(RateLimitExceeded)
def rate_limit_exceeded(e):
    logging.warning("Rate limit exceeded.")
    return jsonify({"message": "Rate limit exceeded. Please wait a minute before trying again."}), 429

def search_recipes_with_index(keywords):
    """Search for recipes using the inverted index."""
    matching_indices = set()
    for keyword in keywords:
        if keyword in inverted_index:
            matching_indices.update(inverted_index[keyword])
    return [recipes[idx] for idx in matching_indices]

# Register the blueprint
app.register_blueprint(recipe_api)

if __name__ == '__main__':
    app.run(debug=True)
