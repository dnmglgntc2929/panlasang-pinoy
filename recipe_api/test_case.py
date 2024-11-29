# Test cases for the Flask API

import unittest
import json
import logging
from app import app, limiter  # Assuming the code is in app.py
from werkzeug.exceptions import BadRequest

try:
    from flask_limiter import Limiter
    from flask_limiter.util import get_remote_address
    from flask_limiter.errors import RateLimitExceeded  # Correct module for RateLimitExceeded
except ImportError:
    raise ImportError("Flask-Limiter is not installed. Please install it using 'pip install flask-limiter'")


# Configure logging to write to a text file
logging.basicConfig(filename='C:/Users/User/Desktop/panlasang-pinoy/recipe_api/test_log.txt', level=logging.DEBUG,
                    format='%(asctime)s %(levelname)s %(message)s')

class RecipeApiTestCase(unittest.TestCase):
    def setUp(self):
        # Setup the test client
        self.app = app.test_client()
        self.app.testing = True
        logging.info('Setting up test client')

    def test_ingredient_search_english(self):
        logging.info('Testing ingredient search with English ingredients')
        response = self.app.post('/api/recipes/ingredient_search',
                                 data=json.dumps({"ingredients": ["chicken", "onion"]}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0, "Should return at least one recipe")

    def test_ingredient_search_filipino(self):
        logging.info('Testing ingredient search with Filipino ingredients')
        response = self.app.post('/api/recipes/ingredient_search',
                                 data=json.dumps({"ingredients": ["manok", "sibuyas"]}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0, "Should return at least one recipe for Filipino ingredients")

    def test_ingredient_search_cebuano(self):
        logging.info('Testing ingredient search with Cebuano ingredients')
        response = self.app.post('/api/recipes/ingredient_search',
                                 data=json.dumps({"ingredients": ["baboy", "bawang"]}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0, "Should return at least one recipe for Cebuano ingredients")

    def test_ingredient_search_empty(self):
        logging.info('Testing ingredient search with empty ingredient list')
        response = self.app.post('/api/recipes/ingredient_search',
                                 data=json.dumps({"ingredients": []}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 0, "Should return no recipes for empty ingredient list")

    def test_rate_limit_exceeded(self):
        logging.info('Testing rate limit exceeded scenario')
        # Simulate exceeding rate limit by sending more than 10 requests in a minute
        last_response = None
        for _ in range(11):
            last_response = self.app.post('/api/recipes/ingredient_search',
                                          data=json.dumps({"ingredients": ["chicken"]}),
                                          content_type='application/json')
        self.assertEqual(last_response.status_code, 429)
        if last_response.is_json:
            data = last_response.get_json()
            self.assertIn("message", data)
            self.assertEqual(data["message"], "Rate limit exceeded. Please wait a minute before trying again.")
        else:
            self.fail("Expected JSON response when rate limit is exceeded")

    def test_invalid_json_format(self):
        logging.info('Testing ingredient search with invalid JSON format')
        try:
            response = self.app.post('/api/recipes/ingredient_search',
                                     data="This is not JSON",
                                     content_type='application/json')
            self.assertEqual(response.status_code, 400)
            if response.is_json:
                data = response.get_json()
                self.assertIn("message", data)
                self.assertEqual(data["message"], "Invalid JSON format.")
            else:
                self.fail("Expected JSON response for invalid JSON format error")
        except BadRequest as e:
            logging.error(f"BadRequest occurred during invalid JSON format test: {e}")
            self.assertEqual(e.code, 400)
        except Exception as e:
            logging.error(f"Exception during invalid JSON format test: {e}")
            self.fail("Exception occurred during test_invalid_json_format")

if __name__ == '__main__':
    unittest.main()
