
// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import passport from "passport"; // Import passport directly
// import { Strategy as LocalStrategy } from "passport-local"; // Import LocalStrategy directly
// import session from "express-session";
// import methodOverride from "method-override";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import knex from "knex";
// import bookshelf from "bookshelf";
// import Stream from "node-rtsp-stream";
// import {Server as HttpServer} from "http";
// import {createReadStream} from "fs";
// import ffmpeg from 'fluent-ffmpeg';
// import gpt4 from "./services/api/gpt4.js";

// import env from "dotenv";
// import { resolve, dirname } from "path";
// import { fileURLToPath } from "url";





// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const envFile = resolve(__dirname, "env", ".env");

// env.config({ path: envFile });

// const app = express();
// const PORT = 3001;



// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// // JWT
// const verifyJWT = (req, res, next) => {
//   const token = req.headers["x-access-token"];
//   if (!token) {
//     return res.status(403).json({ auth: false, message: "Token not provided" });
//   } else {
//     jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
//       if (err) {
//         return res
//           .status(500)
//           .json({ auth: false, message: "Failed to authenticate token" });
//       } else {
//         req.userId = decoded.id;
//         next();
//       }
//     });
//   }
// };

// // Cors
// const whitelist = process.env.WHITELISTED_DOMAINS
//   ? process.env.WHITELISTED_DOMAINS.split(",")
//   : [];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
//   preflightContinue: false,
//   optionsSuccessStatus: 200,
// };

// app.options("*", cors(corsOptions));
// app.use(cors(corsOptions));

// // knex & bookshelf
// const knexInstance = knex({
//   client: "pg",
//   connection: {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DATABASE,
//   },
// });

// const bookshelfInstance = bookshelf(knexInstance);

// async function createBookshelfOf(tbl) {
//   return bookshelfInstance.Model.extend({
//     tableName: tbl,
//     idAttribute: "id",
//   });
// }

// async function insertInto(table, obj) {
//   try {
//     await knexInstance(table).insert(obj);
//     console.log("INSERTED:", obj, "INTO table:", table);
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// }

// // Passport initialization
// passport.use(
//   new LocalStrategy(
//     { usernameField: "email" },
//     async (email, password, done) => {
//       try {
//         const Users = await createBookshelfOf("user_accounts");
//         const user = await new Users({ email: email }).fetch();

//         if (!user) {
//           return done(null, false, { message: "Invalid email" });
//         }

//         const isValidPassword = await bcrypt.compare(
//           password,
//           user.get("hash_password")
//         );
//         if (!isValidPassword) {
//           return done(null, false, { message: "Invalid password" });
//         }

//         return done(null, user.toJSON());
//       } catch (error) {
//         return done(error);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const Users = await createBookshelfOf("user_accounts");
//     const user = await new Users({ id: id }).fetch();
//     if (!user) {
//       return done(new Error("User not found"));
//     }
//     done(null, user.toJSON());
//   } catch (error) {
//     done(error);
//   }
// });

// // Session
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());
// app.use(methodOverride("__method"));


// // Authentication

// app.post("/login", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ auth: false, message: "Internal server error" });
//     }
//     if (!user) {
//       return res
//         .status(401)
//         .json({ auth: false, message: "Invalid email or password" });
//     }

//     req.logIn(user, async (err) => {
//       if (err) {
//         return res
//           .status(500)
//           .json({ auth: false, message: "Error logging in" });
//       }

//       try {
//         const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
//           expiresIn: 300,
//         });
//         const userData = { id: user.id, email: user.email }; // Include relevant user data here

//         // Log the token created per user
//         console.log(`Token created for user ${user.email}: ${token}`);

//         return res
//           .status(200)
//           .json({ auth: true, token: token, result: userData });
//       } catch (error) {
//         console.error(error);
//         return res
//           .status(500)
//           .json({ auth: false, message: "Error creating token" });
//       }
//     });
//   })(req, res, next);
// });

// app.post("/signup", async (req, res) => {
//   const {
//     firstName: firstname,
//     lastName: lastname,
//     email: email,
//     password: hash_password,
//   } = req.body;

//   try {
//     // Check if the email already exists in the database
//     let Users = await createBookshelfOf("user_accounts");
//     let users = await new Users().fetchAll();
//     for (let user of users.toJSON()) {
//       if (user.email === email) {
//         res.status(400).send("Email already in use");
//         return;
//       }
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(hash_password, 10);

//     // Insert the new user with the hashed password
//     let obj = [
//       {
//         firstname: firstname,
//         lastname: lastname,
//         email: email,
//         hash_password: hashedPassword,
//       },
//     ];
//     await insertInto("user_accounts", obj);

//     res.status(201).send("User created successfully");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error creating user");
//   }
// });

// app.get("/user", verifyJWT, async (req, res) => {
//   try{
//   const Users = await createBookshelfOf("user_accounts");
//   const user = await new Users({ id: req.userId }).fetch();

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
  
//   const userData = user.toJSON();
//   return res.status(200).json({ result: userData });
// } catch (error) {
//   console.error(error);
//   return res.status(500).json({ message: "error fetching data" });
// }
// });


// app.post("/userData",  async (req, res) => {
//   const {token} = req.body;
//   try{
//     const user = jwt.verify(token, process.env.JWT_KEY, (err, res) => {
//       if(err){
//         return "Token has expired"
//       }
//       return res;
//     });
//     console.log(user)
//     if(user === "Token has expired"){
//       return res.send({status: "error", data: "Token expired"})
//     }
//     const useremail = user.email;
//     User.findOne({ email: useremail })
//       .then((data) => {
//         res.send({ status: "ok", data: data });
//       })
//       .catch((error) => {
//         res.send({ status: "error", data: error });
//       });
//   } catch (error) {}
// })

// app.post("/api/GPT4" , async (req, res) => {
//   const {prompt} = req.body;
//   if(!prompt){
//     return res.send({status: "error", data: "Prompt is required"})
//   }

//   const response = await gpt4(prompt);
//   res.send({status: "ok", data: response})

// })




// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });


import app from "./app.js";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
