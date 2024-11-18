import Axios from "axios";
import { Navigate } from "react-router-dom";

const jwtToken = localStorage.getItem("jwtToken");

const port = 3001;

export const signup = async (firstName, lastName, email, password) => {
  try {
    const response = await Axios.post(`http://localhost:${port}/api/signup`, {
      // Use the port variable
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    throw new Error("Signup failed"); // Handle signup failure
  }
};

export const login = async (email, password) => {
  try {
    const response = await Axios.post(`http://localhost:${port}/api/login`, {
      // Use the port variable
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error("Login failed"); // Handle login failure
  }
};

export const gpt4 = async (message) => {
  try {
    const response = await Axios.post(`http://localhost:${port}/api/gpt4`, {
      prompt: message,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// const tokenLoggedOut = () => {
//   try{
//     const response = await Axios.post(`https://localhost:${port}/userData`, {
//       token: jwtToken
//     })
//   }
// }

export default {
  signup,
  login,
  gpt4,
};
