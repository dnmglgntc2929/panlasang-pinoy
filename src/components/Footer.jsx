import React from "react";
import Container from "@mui/material/Container";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Typography, Link } from "@mui/material";

export default function Footer() {
  const year = new Date().getFullYear();
  const [language, setLanguage] = React.useState("");
  const country = [
    "English",
    "French",
    "Spanish",
    "Portuguese",
    "Chinese",
    "Japanese",
    "Korean",
    "Hindi",
    "Russian",
    "German",
  ];

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div>
      <Container
        sx={{
          mt: 5,
          mg: 5,
          minWidth: "100%",
          textAlign: "center",
          backgroundColor: "#fff8e1",
          paddingY: 2,
        }}
      >
        <footer>
          <Container>
            <Typography variant="body2" color="textSecondary" align="center">
              Copyright © {year} Panlasang Pinoy. All rights reserved
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              <Link color="inherit" href="/about">
                About Us
              </Link>{" "}
              |
              <Link color="inherit" href="/contact">
                Contact Us
              </Link>{" "}
              |
              <Link color="inherit" href="/privacy">
                Privacy Policy
              </Link>{" "}
              |
              <Link color="inherit" href="/terms">
                Terms of Service
              </Link>
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              Follow us on:
              <Link color="inherit" href="https://facebook.com">
                Facebook
              </Link>{" "}
              |
              <Link color="inherit" href="https://twitter.com">
                Twitter
              </Link>{" "}
              |
              <Link color="inherit" href="https://instagram.com">
                Instagram
              </Link>
            </Typography>
          </Container>
        </footer>

        <Container>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">
              Language
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={language}
              label="language"
              onChange={handleChange}
            >
              {country.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Container>
      </Container>
    </div>
  );
}
