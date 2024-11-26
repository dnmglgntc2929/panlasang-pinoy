from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import logging
from langdetect import detect, DetectorFactory
from fuzzywuzzy import fuzz, process

# Ensure consistent language detection
DetectorFactory.seed = 0

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Recipe file path
RECIPES_FILE = 'recipes.json'

def load_recipes():
    """Load recipes from the JSON file."""
    try:
        with open(RECIPES_FILE, 'r', encoding='utf-8') as file:
            recipes = json.load(file)
            logging.debug(f"Loaded {len(recipes)} recipes.")
            return recipes
    except Exception as e:
        logging.error(f"Error loading recipes: {e}")
        return []

def detect_language(prompt):
    """Detect the language of the input prompt."""
    try:
        language = detect(prompt)
        logging.debug(f"Detected language: {language}")
        return language
    except Exception as e:
        logging.error(f"Error detecting language: {e}")
        return "unknown"

def match_recipes(prompt, recipes):
    """Match recipes based on the prompt."""
    prompt_lower = prompt.lower()
    matched_recipes = []

    for recipe in recipes:
        description = recipe.get('description', '').lower()
        ingredients = recipe.get('ingredients', [])
        
        # Fuzzy match for description and ingredients
        if fuzz.partial_ratio(prompt_lower, description) > 70 or any(
            fuzz.partial_ratio(prompt_lower, ingredient.lower()) > 70 for ingredient in ingredients
        ):
            matched_recipes.append(recipe)

    # Return the top 3 matches
    return matched_recipes[:3]

@app.route('/api/recipes/prompt_search', methods=['POST'])
def prompt_search():
    try:
        data = request.get_json()
        logging.debug(f"Received data: {data}")

        if not data or 'prompt' not in data:
            logging.error("Invalid request data. JSON object with 'prompt' key expected.")
            return jsonify({"error": "Invalid request data. JSON object with 'prompt' key expected."}), 400

        prompt = data['prompt'].strip()
        if not prompt:
            logging.error("Prompt is empty.")
            return jsonify({"error": "Please provide a search prompt."}), 400

        # Detect language
        language = "en"  # Default to English if no detection library is used
        logging.debug(f"Detected language: {language}")

        recipes = load_recipes()
        if not recipes:
            logging.error("No recipes loaded.")
            return jsonify({"error": "No recipes available."}), 500

        # Perform keyword matching and fuzzy matching
        keywords = prompt.lower().split()  # Simple keyword extraction
        matching_recipes = []

        for recipe in recipes:
            description = recipe.get('description', '').lower()
            ingredients = " ".join(recipe.get('ingredients', [])).lower()

            # Use fuzzy matching for description and ingredients
            match_score = max(
                fuzz.partial_ratio(prompt.lower(), description),
                max(fuzz.partial_ratio(keyword, ingredients) for keyword in keywords)
            )

            if match_score > 50:  # Threshold for matching
                matching_recipes.append(recipe)

        # Limit to top 3 matches
        matching_recipes = matching_recipes[:3]

        if not matching_recipes:
            logging.info("No matching recipes found.")
            return jsonify({"message": "No recipes found matching the criteria."}), 404

        logging.info(f"Found {len(matching_recipes)} matching recipes.")
        return jsonify(matching_recipes), 200

    except json.JSONDecodeError:
        logging.error("Invalid JSON format.")
        return jsonify({"error": "Invalid JSON format."}), 400
    except Exception as e:
        logging.error(f"Error during prompt search: {e}")
        logging.exception("Exception occurred:")
        return jsonify({"error": "Internal server error."}), 500

if __name__ == '__main__':
    app.run(debug=True)
