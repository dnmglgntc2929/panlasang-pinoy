import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { createBookshelfModel } from "../models/userModel.js";



passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const User = createBookshelfModel("user_accounts");
        const user = await new User({ email: email }).fetch();

        if (!user) {
          return done(null, false, { message: "Invalid email" });
        }

        const isValidPassword = await bcrypt.compare(
          password,
          user.get("hash_password")
        );
        if (!isValidPassword) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user.toJSON());
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const User = createBookshelfModel("user_accounts");
    const user = await User.where({ id: id }).fetch();
    if (!user) {
      return done(new Error("User not found"));
    }
    done(null, user.toJSON());
  } catch (error) {
    done(error);
  }
});

export default passport;
