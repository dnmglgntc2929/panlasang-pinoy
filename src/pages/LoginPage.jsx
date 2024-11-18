import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useAuth } from "../services/Authentication";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrorMessage("");
  };

  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const login = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!isEmailValid(email)) {
      setErrorMessage("Invalid Email");
      return;
    }

    try {
      const res = await Axios.post("http://localhost:3001/api/login", {
        email,
        password,
      });
      if (res.data.auth) {
        localStorage.setItem("jwt", res.data.token); // Save JWT in local storage
        auth.login(res.data.result); // Log in with user sent from Express
        navigate("/dashboard", { replace: true });
      } else {
        setErrorMessage("Login failed");
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundColor: "#FFF9C4", // Light yellow background
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          backgroundColor: "white", // White container background
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "30px",
          position: "relative",
        }}
      >
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">Login</Typography>
          <Box component="form" onSubmit={login} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPasswordClick} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>

            {errorMessage && (
              <Typography variant="body2" color="error">
                {errorMessage}
              </Typography>
            )}

            <Box
              sx={{
                mt: 2,
                mb: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Divider sx={{ width: "45%" }} />
              <Typography variant="body1" sx={{ mx: 2 }}>
                or
              </Typography>
              <Divider sx={{ width: "45%" }} />
            </Box>

            <Button
              startIcon={<FacebookIcon />}
              onClick={() => console.log('Logging in with Facebook')}
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#1877f2", color: "#fff" }}
            >
              Login with Facebook
            </Button>
            <Button
              startIcon={<GoogleIcon />}
              onClick={() => console.log('Logging in with Google')}
              fullWidth
              variant="contained"
              sx={{ mt: 1, bgcolor: "#DB4437", color: "#fff" }}
            >
              Login with Google
            </Button>
            <Button
              startIcon={<XIcon />}
              onClick={() => console.log('Logging in with Twitter')}
              fullWidth
              variant="contained"
              sx={{ mt: 1, bgcolor: "#1DA1F2", color: "#fff" }}
            >
              Login with X
            </Button>
          </Box>

          <Typography variant="body1" sx={{ mt: 2, color: "black" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ textDecoration: "none" }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Container>
    </div>
  );
}
