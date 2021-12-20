const Movie = require("../models/movie");
const ReviewsTMDB = require("../models/reviewTMDB");
const axios = require("axios").default;
const ObjectId = require("mongoose").Types.ObjectId;
// GET NEW AVERAGE RATING WHEN ADDING A NEW REVIEW
// newAve = ((oldAve*oldNumPoints)+ x) / (oldNumPoints+1)
// Example Harry Potter 1 ~ vote_average = 7.9 ~ vote_count = 21449 ~ let's say i added a new review with a rating of 8
// newAve = ((vote_average * vote_count) + newRating) / (vote_count + 1)
// newAve = ((7.9 * 21449) + 8) / (21449 + 1)
// newAve = (169477.1 + 8) / 21450
// newAve = 167455.1 / 21450
// newAve = 7.90 ---> 7.9 //

//GET all movies in DB
module.exports.allMovies = async (req, res) => {
  // const movies = await Movie.find({}).populate('reviews') // no need to populate reviews in this case
  const movies = await Movie.find({});
  const topLatestMovies = () => {
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
    const movieRatings = [];
    // Push to movieRatings only necessary data from the movies objects
    const movieVotes = movies.map((movie) => {
      return movieRatings.push({
        _id: movie._id,
        movie: movie.original_title,
        rating: movie.vote_average,
        vote_count: movie.vote_count,
        release_date: movie.release_date,
        image: movie.backdrop_path,
        description: movie.overview,
      });
    });
    const latestTopMovies = [];
    const topMovies = movieRatings.map((movie, index) => {
      if (
        Date.parse(movie.release_date) >= Date.parse(fourMonthsAgo) &&
        movie.vote_count >= 100 &&
        movie.rating >= 7
      ) {
        return latestTopMovies.push(movie);
      }
    });
    // Sort by rating in descending order
    // latestTopMovies.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    latestTopMovies.sort(
      (a, b) => Date.parse(b.release_date) - Date.parse(a.release_date)
    );
    return latestTopMovies.slice(0, 10);
  };

  res.send(topLatestMovies());
};

// Add movie to DB
module.exports.newMovie = async (req, res) => {
  const movieId = req.body.id; // movie id to find movie in themoviedb.org api.
  // check in DB if movie already exists
  const checkId = await Movie.find({ tmdbId: movieId });
  if (checkId == "") {
    const resMovie = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=en-US&append_to_response=videos,reviews,credits`
    ); // get movie data from themovidedb.org
    const { data } = resMovie;
    const {
      spoken_languages,
      production_companies,
      production_countries,
      videos,
      id,
      reviews,
      ...info
    } = data; // create a new object (info) from 'data', excluding spoken_languages, production_companies, etc...

    info.tmdbId = id; // adding tmdbId to info object

    // adding trailer data to info object using data.videos.results
    const videosResult = data.videos.results;
    const getTrailer = videosResult.map((v) => {
      if (v.type === "Trailer" && v.official === true) {
        return (info.trailer = v);
      }
    });

    // Add reviews from tmdb to DB, specifically to reviewTMDB model and then add the review's ObjectId to the movie model.
    const asyncRes = await Promise.all(
      reviews.results.map(async (r) => {
        const review = await new ReviewsTMDB({
          body: r.content,
          author: r.author,
          url: r.url,
        });
        await review.save();
        return review;
      })
    );

    const idReviews = [];
    asyncRes.forEach((element) => {
      idReviews.push(element._id);
    });

    info.reviews = idReviews; // add reviews to info object, so then that object can be passed into the movie db model.
    const movie = await new Movie(info);
    await movie.save();
    res.status(201).send("Movie added");
  } else {
    res.status(409).send("Movie already exists in MovieCrit's database!");
  }
};

module.exports.movieData = async (req, res, next) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);

    // Only get 15 most important cast members
    const castArray = [];
    const cast = movie.credits.cast.map((c, index) => {
      if (index < 15) {
        return castArray.push(c);
      }
    });

    // only get the director from movie.credits.crew
    const crewArray = [];
    const director = movie.credits.crew.map((d) => {
      if (d.job === "Director") {
        crewArray.push(d);
      }
    });

    // Make deep copy of movie object
    let copiedMovie = JSON.parse(JSON.stringify(movie));

    // remove the property credits from copiedMovie and create a new object called newMovie then add castArray and crewArray to newMovie and send newMovie
    const { credits, ...newMovie } = copiedMovie;
    newMovie.credits = {};
    newMovie.credits.crew = crewArray;
    newMovie.credits.cast = castArray;

    res.json(newMovie);
  } catch (error) {
    res.sendStatus(204);
  }
};

module.exports.movieReviews = async (req, res) => {
  const { id } = req.params;
  const { sortBy } = req.body;

  // console.log(ObjectId.isValid(id));
  try {
    //Find movie by id and only get the critReviews field
    const movieReviews = await Movie.findById(id)
      .select("critReviews -_id")
      .populate({
        path: "critReviews",
        populate: {
          path: "authorId",
        },
      });
    if (sortBy === "popular") {
      // Sort movieReviews.critReviews by likes in descending order
      movieReviews.critReviews.sort((a, b) => b.likes - a.likes);
      res.send(movieReviews.critReviews);
    } else if (sortBy === "latest") {
      // Sort movieReviews.critReviews by latest reviews
      movieReviews.critReviews.sort(
        (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
      );
      res.send(movieReviews.critReviews);
    }
  } catch (error) {
    res.sendStatus(204);
  }
};

module.exports.searchMovie = async (req, res, next) => {
  // setTimeout(next, 1000);
  const { q } = req.query;
  // console.log(movie);
  // res.send(movie);
  if (q.length) {
    try {
      const movie = await Movie.find({
        original_title: { $regex: q, $options: "i" },
      });
      if (movie.length) {
        res.send(movie);
      } else if (movie.length === 0) {
        res.sendStatus(204);
      }
    } catch (error) {
      res.sendStatus(404);
    }
  }
};

module.exports.topLatestMovies = async (req, res, next) => {};

// const result = await Product.find({"title" :{ $regex: search, $options: "i"}}).populate('reviews');

module.exports.topGenre = async (req, res) => {
  const action = await Movie.find({ "genres.name": "Action" }).select(
    "vote_average original_title poster_path"
  );
  const sciFi = await Movie.find({ "genres.name": "Science Fiction" }).select(
    "vote_average original_title poster_path"
  );
  const drama = await Movie.find({ "genres.name": "Drama" }).select(
    "vote_average original_title poster_path"
  );
  const fantasy = await Movie.find({ "genres.name": "Fantasy" }).select(
    "vote_average original_title poster_path"
  );
  const horror = await Movie.find({ "genres.name": "Horror" }).select(
    "vote_average original_title poster_path"
  );

  action.sort(
    (a, b) => parseFloat(b.vote_average) - parseFloat(a.vote_average)
  );
  sciFi.sort((a, b) => parseFloat(b.vote_average) - parseFloat(a.vote_average));
  drama.sort((a, b) => parseFloat(b.vote_average) - parseFloat(a.vote_average));
  fantasy.sort(
    (a, b) => parseFloat(b.vote_average) - parseFloat(a.vote_average)
  );
  horror.sort(
    (a, b) => parseFloat(b.vote_average) - parseFloat(a.vote_average)
  );

  const topAction = action.length > 5 ? action.slice(0, 5) : action;
  const topSciFi = sciFi.length > 5 ? sciFi.slice(0, 5) : sciFi;
  const topDrama = drama.length > 5 ? drama.slice(0, 5) : drama;
  const topFantasy = fantasy.length > 5 ? fantasy.slice(0, 5) : fantasy;
  const topHorror = horror.length > 5 ? horror.slice(0, 5) : horror;
  res.send([
    { name: "Top Action", data: topAction },
    { name: "Top Science Fiction", data: topSciFi },
    { name: "Top Drama", data: topDrama },
    { name: "Top Fantasy", data: topFantasy },
    { name: "Top Horror", data: topHorror },
  ]);
};

module.exports.checkInDb = async (req, res, next) => {
  const { body } = req;

  //get tmdbIds from req to compare them to tmdbids in database
  const tmdbIds = [];
  body.map((m) => {
    tmdbIds.push(m.id);
  });

  // find movies in db matching the ids from tmdbIds
  const movie = await Movie.find({ tmdbId: { $in: tmdbIds } }).select(
    "tmdbId -_id"
  );

  // push movies found from 'movie' to moviesTmdbIds to later compare those 'movie ids' to the 'tmdbIds' array
  const moviesTmdbIds = [];
  movie.map((m) => {
    moviesTmdbIds.push(m.tmdbId);
  });

  // Filter movies not in DB
  const notInDb = tmdbIds.filter((id) => !moviesTmdbIds.includes(id));

  res.send(notInDb);
};

module.exports.getInTheatre = async (req, res, next) => {
  // tmdb id
  const { tmdbid } = req.params;
  const movie = await Movie.find({ tmdbId: tmdbid }).select("_id");
  res.send(movie);
};
