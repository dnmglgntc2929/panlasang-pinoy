import React, { useEffect, useState } from "react";
import ProductDrawer from "../../components/prodoctComponents/ProductDrawer";
import { AppBar, Toolbar, Grid, Box } from "@mui/material";
import Cards from "../../components/Cards";
import axios from "axios";
import Carousel from "../../components/Carousel";
import withUserData from "../../components/UserData";
import pic1 from "../../assets/pic1.jpg";
import pic2 from "../../assets/pic2.jpg";
import pic3 from "../../assets/pic3.jpg";

const Dashboard = () => {
  const [user, setUser] = useState("");

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

  const images = [pic1, pic2, pic3];

  return (
    <div>
      <AppBar>
        <Toolbar>
          <ProductDrawer />
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Grid container spacing={3} style={{ padding: 24 }}>
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
            <Carousel images={images} />
          </Cards>
        </Grid>
        <Grid item xs={12} md={4}>
          <Cards
            title="Available Ingredients: "
            customStyles={{ height: "400px", width: "100%" }}
          >
            {/* White box inside the card */}
            <Box
              sx={{
                backgroundColor: "White", // White background
                height: "300px", // Adjust height as needed
                width: "100%", // Full width
                marginTop: "10px", // Add spacing if necessary
                padding: "16px", // Padding inside the box
                borderRadius: "8px", // Optional: rounded corners
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Optional: shadow effect
              }}
            >
              {/* Content inside the white box */}

              <ul style={{ listStyleType: "none", padding: 0 }}>
                <li>Ingredient 1</li>
                <li>Ingredient 2</li>
                <li>Ingredient 3</li>
              </ul>
            </Box>
          </Cards>
        </Grid>
        <Grid item xs={12} md={8}>
          <Cards
            customStyles={{ height: "400px", width: "100%" }}
            title="Recipes"
          >
            {/* White box inside the card */}
            <Box
              sx={{
                backgroundColor: "White", // White background
                height: "300px", // Adjust height as needed
                width: "100%", // Full width
                marginTop: "10px", // Add spacing if necessary
                padding: "16px", // Padding inside the box
                borderRadius: "8px", // Optional: rounded corners
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Optional: shadow effect
              }}
            >
              {/* Content inside the white box */}

              <ul style={{ listStyleType: "none", padding: 0 }}>
                <li>
                  To make Binangkal, start by sifting together 2 cups of
                  all-purpose flour, 1/2 cup sugar, 2 teaspoons baking powder,
                  and 1/4 teaspoon salt in a bowl. In a separate bowl, beat 1
                  large egg and mix it with 1/2 cup evaporated milk (or regular
                  milk) and 1 tablespoon of vegetable oil. Gradually combine the
                  wet and dry ingredients until a smooth dough forms. The dough
                  should be firm but not sticky; adjust with milk or flour if
                  necessary. Next, shape the dough into small balls, about the
                  size of a tablespoon, and roll each one in sesame seeds until
                  fully coated. Heat oil in a deep pan or pot to around 350°F
                  (175°C) for frying. Once the oil is ready, carefully fry the
                  dough balls in batches until they turn golden brown, which
                  should take about 3-5 minutes. Be sure to turn them
                  occasionally for even cooking. After frying, drain the
                  Binangkal on a paper towel to remove excess oil. Serve and
                  enjoy this crispy, sesame-coated Filipino snack!
                </li>
              </ul>
            </Box>
          </Cards>
        </Grid>
        <Grid item xs={12} md={8}></Grid>
      </Grid>
    </div>
  );
};

export default withUserData(Dashboard);
