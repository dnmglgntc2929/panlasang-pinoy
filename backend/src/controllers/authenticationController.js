import { AuthService } from "../services/authService.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { gpt4 } from "../services/api/gpt4.js";

// Sign Up Function
const signUp = async (req, res) => {
  try {
    await AuthService.signUp(req.body);
    res.status(201).send("User created successfully");
  } catch (error) {
    console.error('Error during sign up:', error);
    res.status(500).send(error.message);
  }
};

// Login Function
const login = (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      console.error('Passport authentication error:', err);
      return res.status(500).json({ auth: false, message: "Internal server error" });
    }
    if (!user) {
      return res.status(401).json({ auth: false, message: "Invalid email or password" });
    }

    req.logIn(user, async (err) => {
      if (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ auth: false, message: "Error logging in" });
      }

      try {
        const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, { expiresIn: 300 });
        const userData = { id: user.id, email: user.email };

        return res.status(200).json({ auth: true, token: token, result: userData });
      } catch (error) {
        console.error('Error creating token:', error);
        return res.status(500).json({ auth: false, message: "Error creating token" });
      }
    });
  })(req, res, next);
};

// Get User Function
const getUser = async (req, res) => {
  try {
    const user = await AuthService.getUser(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ result: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: "Error fetching data" });
  }
};

// GPT-4 Function
const gpt4Handler = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.send({ status: "error", data: "Prompt is required" });
  }
  try {
    const response = await gpt4.gpt4(prompt);
    res.send({ status: "ok", data: response });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
};

module.exports = {
  signUp,
  login,
  getUser,
  gpt4Handler,
};
