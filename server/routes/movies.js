const express = require("express");
const router = express.Router();

// Controllers
const moviesController = require("../controllers/movies");

// Routes
router.get("/", moviesController.allMovies);
router.get("/topgenres", moviesController.topGenre);
router.get("/search", moviesController.searchMovie);
router.get("/:id", moviesController.movieData);
router.get("/theatre/:tmdbid", moviesController.getInTheatre);
router.post("/:id/reviews", moviesController.movieReviews);
router.post("/new", moviesController.newMovie);
router.post("/checkdb", moviesController.checkInDb);

module.exports = router;
