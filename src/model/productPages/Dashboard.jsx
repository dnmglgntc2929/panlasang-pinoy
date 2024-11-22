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
import searchIngredients from '../../services/Axios';

const Dashboard = () => {
  const [user, setUser] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openRecipeModal, setOpenRecipeModal] = useState(false); // Recipe modal state
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null); // Selected dish for recipe modal
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Animal data
  const animalDishes = {
    chicken: [
      {
        name: "Chicken Adobo",
        description: "A classic Filipino dish made with soy sauce and vinegar.",
        recipe: {
          ingredients: ["Chicken", "Soy sauce", "Vinegar", "Garlic", "Bay leaves"],
          steps: [
            "Marinate the chicken in soy sauce, vinegar, garlic, and bay leaves for 30 minutes.",
            "Cook in a pan over medium heat until the chicken is tender.",
            "Serve with rice.",
          ],
        },
      },
      {
        name: "Chicken Curry",
        description: "Spiced chicken cooked in a rich coconut milk sauce.",
        recipe: {
          ingredients: ["Chicken", "Coconut milk", "Curry powder", "Onions", "Garlic", "Potatoes"],
          steps: [
            "Fry onions and garlic in a pan until golden.",
            "Add chicken and curry powder, cook until chicken is browned.",
            "Pour in coconut milk and simmer until the chicken is fully cooked.",
            "Serve with rice or bread.",
          ],
        },
      },
    ],
    pig: [
      {
        name: "Lechon",
        description: "Roast pig, a centerpiece of Filipino celebrations.",
        recipe: {
          ingredients: ["Whole pig", "Garlic", "Soy sauce", "Lemongrass", "Salt"],
          steps: [
            "Marinate the whole pig with garlic, soy sauce, and salt for 6 hours.",
            "Stuff the pig with lemongrass for flavor.",
            "Roast the pig slowly over a charcoal pit for 6 hours, turning occasionally.",
            "Serve with dipping sauce.",
          ],
        },
      },
      {
        name: "Sisig",
        description: "A sizzling dish made from pig's head and liver.",
        recipe: {
          ingredients: ["Pig's head", "Pig's liver", "Onions", "Lemon", "Chili peppers", "Soy sauce"],
          steps: [
            "Boil the pig's head until tender, then chop into small pieces.",
            "Grill the pig's liver, chop, and combine with the pig's head.",
            "Fry the mixture with onions, soy sauce, and chili peppers.",
            "Serve sizzling with lemon wedges.",
          ],
        },
      },
    ],
    fish: [
      {
        name: "Sinigang na Isda",
        description: "Fish in a sour tamarind broth.",
        recipe: {
          ingredients: ["Fish", "Tamarind", "Tomatoes", "Onions", "Radish", "Spinach"],
          steps: [
            "Boil tamarind with water to create the sour base.",
            "Add fish, tomatoes, and onions, and cook until fish is tender.",
            "Add radish and spinach, cook for an additional 5 minutes.",
            "Serve with rice.",
          ],
        },
      },
      {
        name: "Fish Kinilaw",
        description: "Raw fish marinated in vinegar and spices.",
        recipe: {
          ingredients: ["Fresh fish", "Vinegar", "Lemon", "Ginger", "Onions", "Chili peppers"],
          steps: [
            "Cut the fish into small cubes.",
            "Marinate the fish in vinegar, lemon, ginger, and onions for 30 minutes.",
            "Add chili peppers for a spicy kick.",
            "Serve chilled with rice or crackers.",
          ],
        },
      },
    ],
    cow: [
      {
        name: "Beef Kaldereta",
        description: "A hearty beef stew with tomatoes and vegetables.",
        recipe: {
          ingredients: ["Beef", "Tomatoes", "Potatoes", "Carrots", "Bell peppers", "Olives"],
          steps: [
            "Brown the beef in a pan and set aside.",
            "Sauté tomatoes and vegetables in the same pan.",
            "Add beef back into the pan and simmer until tender.",
            "Serve with rice.",
          ],
        },
      },
      {
        name: "Bulalo",
        description: "Beef shank soup with marrow and vegetables.",
        recipe: {
          ingredients: ["Beef shank", "Corn", "Potatoes", "Cabbage", "Onions", "Salt"],
          steps: [
            "Boil beef shank with water and salt for 2 hours.",
            "Add corn, potatoes, and onions, cook until tender.",
            "Add cabbage and cook for an additional 5 minutes.",
            "Serve hot with rice.",
          ],
        },
      },
    ],
    dog: [
      {
        name: "Dog Dish Example",
        description: "Placeholder for dog-related content.",
        recipe: {
          ingredients: ["Chicken", "Rice", "Carrots", "Peas"],
          steps: [
            "Cook chicken thoroughly and chop into small pieces.",
            "Boil rice, carrots, and peas.",
            "Mix everything together and serve in portions.",
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
    try {
      const results = await searchIngredients(searchQuery);  // Call the search API from Axios file
      setSearchResults(results);  // Set the search results
    } catch (error) {
      console.error("Error fetching search results", error);
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
              {[{ animal: "chicken", image: placeholderImage },
                { animal: "pig", image: placeholderImage },
                { animal: "fish", image: placeholderImage },
                { animal: "cow", image: placeholderImage },
                { animal: "dog", image: placeholderImage },
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
                    style={{ width: "60px", height: "60px", marginBottom: "8px" }}
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
            title="Search unsa imo trip lotuon"
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
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
              flexDirection: "column",
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
                  <Typography key={index} variant="body1" sx={{ marginBottom: "8px" }}>
                    {result.name}: {result.description}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography variant="body2">No results found. Try another search.</Typography>
            )}
          </Cards>
        </Grid>
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
  {selectedAnimal ? selectedAnimal.charAt(0).toUpperCase() + selectedAnimal.slice(1) : 'Select Animal'} Dishes
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
          <Typography variant="h6" component="h2" gutterBottom>
            Recipe for {selectedDish?.name}
          </Typography>

          <Typography variant="body1" gutterBottom>
            {selectedDish?.description}
          </Typography>

          {/* Ingredients */}
          <Typography variant="h6">Ingredients:</Typography>
          <ul>
            {selectedDish?.recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>

          {/* Steps */}
          <Typography variant="h6">Steps:</Typography>
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
