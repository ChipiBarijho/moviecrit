if (process.env.NODE_ENV !== "production") {
  // Load environment variables from .env file in non prod environments
  require("dotenv").config();
}
const express = require("express");
const app = express();
const port = 4000;
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const path = require("path");

app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(express.json()); // express json parser
app.use(express.urlencoded({ extended: true }));

//Add the client URL to the CORS policy
const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : [];

const corsOptions = {
  // origin: "http://localhost:4001",
  origin: "http://localhost:3000",
  credentials: true,
};

// Connect to DB
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.use(cors(corsOptions));
app.use(passport.initialize());
//Passport
// Auth strategies
require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
// Authentication middleware and jwt functions to get and refresh tokens
require("./authenticate");

// Routes
const moviesRoutes = require("./routes/movies");
const usersRoutes = require("./routes/users");
const reviewsRoutes = require("./routes/reviews");

// Use Routes
app.use("/review", reviewsRoutes);
app.use("/movies", moviesRoutes);
app.use("/user", usersRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
