import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createBookshelfModel } from "../models/userModel.js";
import { insertInto } from "../config/dbConfig.js";

class AuthService {
  static signUp = async (userData) => {
    const { firstName, lastName, email, hash_password } = userData;
    try {
      const User = createBookshelfModel("user_accounts");

      const existingUser = await new User({ email }).fetch({ require: false });
      if (existingUser) {
        throw new Error("Email already in use");
      }

      const hashedPassword = await bcrypt.hash(hash_password, 10);

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

      const user = await new User({ email }).fetch();
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
      const User = createBookshelfModel("user_accounts");

      const user = await new User({ id: userId }).fetch();
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
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      const User = createBookshelfModel("user_accounts");

      const user = await new User({ email: decoded.email }).fetch();
      if (!user) {
        throw new Error("User not found");
      }
      return user.toJSON();
    } catch (error) {
      throw error;
    }
  };
}

export { AuthService };
