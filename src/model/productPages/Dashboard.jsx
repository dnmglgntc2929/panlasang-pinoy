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

const Dashboard = () => {
  const [user, setUser] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openRecipeModal, setOpenRecipeModal] = useState(false); // Recipe modal state
  const [openSearchResultsModal, setOpenSearchResultsModal] = useState(false); // New state for search results modal
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null); // Selected dish for recipe modal
  const [selectedSearchResult, setSelectedSearchResult] = useState(null); // Selected search result for recipe modal
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);


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
      // ... other chicken dishes ...
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
      // ... other pork dishes ...
    ],
    // ... other animal categories ...
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          setErrorMessage('User not authenticated. Please log in.');
          // Optionally, redirect to login page
          return;
        }
  
        const response = await axios.get("http://localhost:3001/api/user", {
          headers: { "x-access-token": token },
        });
  
        if (response.status === 200) {
          const { result } = response.data;
          const { firstname, lastname } = result;
          setUser(`${firstname} ${lastname}`);
        } else {
          console.error('Failed to fetch user data:', response.status);
          setErrorMessage('Failed to load user data.');
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        setErrorMessage('An error occurred while fetching user data.');
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
    // Clear previous error messages and search results
    setErrorMessage('');
    setSearchResults([]);
    setOpenSearchResultsModal(false);

    const trimmedQuery = searchQuery.trim();
  if (!trimmedQuery) {
    setErrorMessage('Please enter at least one ingredient or dish name.');
    return;
  }

  setIsLoading(true);
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/recipes/ingredient_search",
        { ingredients: searchQuery.split(',').map((item) => item.trim()) },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.status === 200) {
        if (Array.isArray(response.data)) {
          if (response.data.length > 0) {
            const enrichedResults = response.data.map((recipe) => {
              return {
                ...recipe,
                recipe: {
                  ingredients: recipe.ingredients,
                  steps: recipe.steps,
                },
              };
            });
            setSearchResults(enrichedResults);
            setOpenSearchResultsModal(true); // Open the modal
          } else {
            // No recipes found
            setErrorMessage('No recipes found matching your ingredients.');
          }
        } else {
          // Unexpected response format
          console.error('Unexpected response format:', response.data);
          setErrorMessage('Unexpected response from server.');
        }
      } else {
        // Non-200 status code
        console.error('Server responded with status:', response.status);
        setErrorMessage('Server error occurred. Please try again later.');
      }
    } catch (error) {
      console.error("Error fetching search results", error);
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        console.error(
          "Server Error:",
          error.response.status,
          error.response.data
        );
        setErrorMessage('Server error occurred. Please try again later.');
      } else if (error.request) {
        // Request was made but no response received
        console.error("Network Error:", error.request);
        setErrorMessage('Network error. Please check your internet connection.');
      } else {
        // Something else happened
        console.error("Error", error.message);
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchResultClick = (result) => {
    setSelectedSearchResult(result);
    setOpenRecipeModal(true);
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
                label="Enter ingredients or dish name"
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

        {/* Card 4: Search Information */}
        <Grid item xs={12} md={8}>
          <Cards
            title="Search"
            customStyles={{
              height: "400px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="body2">
              Enter a query and click "Search" to view results.
            </Typography>
          </Cards>
        </Grid>
      </Grid>

      {/* Modal for Search Results */}
      <Modal
        open={openSearchResultsModal}
        onClose={() => setOpenSearchResultsModal(false)}
      >
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
            Search Results
          </Typography>

          {searchResults.length > 0 ? (
            <Grid container spacing={3}>
              {searchResults.map((dish, index) => (
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
                      cursor: "pointer",
                    }}
                    onClick={() => handleSearchResultClick(dish)}
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
          ) : (
            <Typography variant="body2">
              {errorMessage || 'No results found. Try another search.'}
            </Typography>
          )}

          <Button
            onClick={() => setOpenSearchResultsModal(false)}
            sx={{ mt: 3, display: "block", margin: "0 auto" }}
            variant="contained"
          >
            Close
          </Button>
        </Box>
      </Modal>

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
              ? selectedAnimal.charAt(0).toUpperCase() +
                selectedAnimal.slice(1)
              : "Select Animal"} Dishes
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
            Recipe for {selectedDish?.name || selectedSearchResult?.name}
          </Typography>

          <Typography variant="body1" gutterBottom>
            {selectedDish?.description || selectedSearchResult?.description}
          </Typography>

          {/* Ingredients */}
          <Typography variant="h4">Ingredients:</Typography>
          <ul>
            {(selectedDish?.recipe.ingredients || selectedSearchResult?.recipe?.ingredients)?.map(
              (ingredient, index) => (
                <li key={index}>{ingredient}</li>
              )
            )}
          </ul>

          {/* Steps */}
          <Typography variant="h4">Steps:</Typography>
          <ol>
            {(selectedDish?.recipe.steps || selectedSearchResult?.recipe?.steps)?.map(
              (step, index) => (
                <li key={index}>{step}</li>
              )
            )}
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
