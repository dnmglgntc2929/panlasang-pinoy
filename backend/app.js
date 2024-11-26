import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import methodOverride from 'method-override';
import passport from 'passport';
import authRoutes from './routes/authRoutes.js';
import './config/envConfig.js';
import './config/passportConfig.js'; // Ensure passport configuration is loaded


const app = express();

const PORT = process.env.PORT

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const whitelist = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(',') : [];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('__method'));

app.use('/api', authRoutes);

console.log("Database Password:", typeof process.env.DB_PASSWORD);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

//export default app;
