import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createBookshelfModel } from "../models/userModel.js";
import { insertInto } from "../config/dbConfig.js";

class AuthService {
  // AuthService.js
static signUp = async (userData) => {
  const { firstName, lastName, email, password } = userData; // use password here
  try {
    if (!password) {
      throw new Error("Password is required");
    }

    const User = createBookshelfModel("user_accounts");

    const existingUser = await new User({ email }).fetch({ require: false });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      hash_password: hashedPassword,
    };

    await insertInto("user_accounts", [newUser]);

    return newUser;
  } catch (error) {
    console.error("Error during sign up:", error.message);
    throw error;
  }
};


  static login = async (userData) => {
    const { email, password } = userData;
    try {
      const User = createBookshelfModel("user_accounts");

      const user = await User({ email }).fetch();
      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isValidPassword = await bcrypt.compare(
        password,
        user.get("hash_password")
      );
      if (!isValidPassword) {
        throw new Error("Invalid email or password");
      }

      const token = jwt.sign(
        { id: user.id, email: user.get("email") },
        process.env.JWT_KEY,
        { expiresIn: 300 }
      );

      return { user: user.toJSON(), token };
    } catch (error) {
      throw error;
    }
  };

  static getUser = async (userId) => {
    try {
      console.log('Fetching user with ID:', userId);
      const User = createBookshelfModel("user_accounts");

      const user = await User.where({ id: userId }).fetch();
      if (!user) {
        throw new Error("User not found");
      }
      return user.toJSON();
    
    } catch (error) {
      throw error;
    }
  };

  static getUserData = async (token) => {
    try {
        const user = jwt.verify(token, process.env.JWT_KEY);
        const useremail = user.email;
        const User = createBookshelfModel("user_accounts");

        const userData = await User.where({ email: useremail }).fetch();
        return { status: "ok", data: userData.toJSON() };
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return { status: "error", data: "Token expired" };
        }
        return { status: "error", data: error.message };
    }
};

  
}

export { AuthService };
