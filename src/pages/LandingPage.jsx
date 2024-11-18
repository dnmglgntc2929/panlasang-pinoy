import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import(
  "https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400;700&display=swap"
);

// Custom font styles using "Reem Kufi"
const headingFont = {
  fontFamily: "'Reem Kufi', sans-serif",
  fontOpticalSizing: "auto",
  fontWeight: 700,
  fontStyle: "normal",
};

const bodyFont = {
  fontFamily: "'Reem Kufi', sans-serif",
  fontOpticalSizing: "auto",
  fontWeight: 400,
  fontStyle: "normal",
};

// Import your background image
import backgroundImage from "../assets/background.jpg";

export default function LandingPage() {
  return (
    <div
      className="Landing"
      style={{
        backgroundImage: `url(${backgroundImage})`, // Corrected here
        backgroundColor: "#fff8e1",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
      }}
    >
      <Header />
      <Container
        disableGutters // Remove padding from the container
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Stack on small screens
          alignItems: "center",
          marginTop: { xs: 0, md: 0 }, // Adjust for screen sizes
          paddingTop: "20px",
          width: "100%", // Ensure the container spans the full width
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            paddingRight: { xs: 0, md: 15 },
          }}
        >
          {/* Text Section */}
          <Container
            sx={{
              flex: 1,
              textAlign: { xs: "center", md: "left" },
              paddingRight: { xs: 0, md: 15 },
            }}
          >
            {/* Headings */}
            <Typography
              variant="h2"
              sx={{
                ...headingFont,
                ml: { xs: 0, md: -19 },
                mt: { xs: 2, md: 5 },
              }}
            >
              Welcome to Panlasang Pinoy
            </Typography>
            <Typography
              variant="body1"
              sx={{
                ...bodyFont,
                ml: { xs: 0, md: -19 },
                textAlign: { xs: "center", md: "left" },
                fontSize: "1.2rem",
              }}
            >
              Welcome to Panlasang Pinoy! Discover the rich and diverse flavors
              of Filipino cuisine with our easy-to-follow recipes. Whether
              you're a beginner in the kitchen or a seasoned chef, we’re here to
              help you bring the taste of the Philippines to your table. Let's
              cook and enjoy the best of Filipino food together!
            </Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{ ml: { xs: 0, md: -19 }, mt: 1, borderRadius: "10px" }}
              component={Link}
              to="/signup"
            >
              Sign Up
            </Button>
          </Container>

          {/* Image Section */}
          <Container
            disableGutters
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: { xs: "center", md: "flex-end" },
              marginLeft: { xs: 0, md: "20%" },
              marginTop: { xs: 2, md: 0 },
            }}
          >
            <img
              src="src/assets/hdpinoy.png"
              alt="Pinoy Cuisine"
              style={{
                width: "100%", // Sets image to fill its container
                height: "auto",
                marginRight: "-150px",
                maxWidth: { xs: "80%", md: "60%", lg: "50%" }, // Adjusts width for different screen sizes
              }}
            />
          </Container>
        </Container>
      </Container>

      <Container
        disableGutters
        sx={{
          mt: { xs: 10, md: 20 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "transparent",
          minWidth: "100%",
        }}
      >
        {/* Centered Icon */}
        <Container
          disableGutters
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            marginLeft: { xs: 0, md: "-45%" },
            marginTop: { xs: 2, md: "-80px" },
          }}
        >
          <img
            src="src/assets/gulay2.png"
            alt="Pinoy Cuisine"
            style={{
              maxWidth: { xs: "100%", md: "200%" },
              height: "auto",
              marginRight: 0,
              marginLeft: { xs: 0, md: "auto" },
            }}
          />
        </Container>

        <Container
          sx={{
            flex: 1,
            textAlign: { xs: "center", md: "left" },
            ml: { xs: 0, md: 27 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              ...headingFont,
              mt: { xs: 0, md: -60 },
              ml: { xs: 0, md: 50 },
            }}
          >
            YOUR TRUSTED KITCHEN COMPANION
          </Typography>
          <Typography
            variant="body1"
            sx={{ ...bodyFont, mt: 1, ml: { xs: 0, md: 50 } }}
          >
            Panlasang Pinoy is like having a trusted kitchen companion who’s
            always ready to guide you. Whether you're unsure of what to cook or
            looking for inspiration, we’re here to offer easy, flavorful recipes
            that fit what you have on hand...
          </Typography>
        </Container>

        <EmojiObjectsIcon sx={{ fontSize: 100, mt: { xs: 10, md: 20 } }} />

        <Container sx={{ flex: 1, textAlign: "center" }}>
          <Typography variant="h3" sx={headingFont}>
            ABOUT PANLASANG PINOY
          </Typography>
          <Typography
            variant="body1"
            sx={{ ...bodyFont, mt: 2, textAlign: "center" }}
          >
            Panlasang Pinoy is a dynamic and innovative team of young
            entrepreneurs...
          </Typography>
        </Container>
      </Container>

      <Footer />
    </div>
  );
}
