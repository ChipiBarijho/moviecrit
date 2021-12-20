const Review = require("../models/review");
const User = require("../models/user");
const Movie = require("../models/movie");

// Add review to db
module.exports.newReview = async (req, res) => {
  const authorId = req.user._id;
  const { body, rating, movieId } = req.body;
  const review = await new Review({
    body: body,
    rating: rating,
    movieId: movieId,
    authorId: authorId,
  });

  await review.save(); // save review

  const movie = await Movie.findById(movieId); // get the movie based on the review
  movie.critReviews.push(review._id);
  await movie.save();

  const user = await User.findById(authorId);
  user.reviews.push(review._id);
  await user.save();
  res.sendStatus(200);
};

// Remove review from movie page, action taken by review author
module.exports.deleteReview = async (req, res) => {
  const { id } = req.user;
  const { reviewId, authorId } = req.body;

  if (id === authorId) {
    // Remove review from user's review array using mongoose's $pull
    await User.findByIdAndUpdate(authorId, { $pull: { reviews: reviewId } });
    // Delete review from DB
    await Review.findByIdAndDelete(reviewId);
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
};

module.exports.editReview = async (req, res) => {
  // findOneAndUpdate({ _id: id }, ...).
  const { id } = req.user;
  const { reviewId, body, rating, authorId } = req.body;
  if (id === authorId) {
    await Review.findByIdAndUpdate(reviewId, {
      body: body,
      rating: rating,
      edited: true,
    });
    res.sendStatus(200);
  } else {
    console.log("aaaa");
    res.sendStatus(401);
  }
};

module.exports.addLike = async (req, res) => {
  const { reviewId } = req.params;
  const { currentUserId } = req.body;

  // Check if user already liked the review
  const review = await Review.findById(reviewId);
  if (reviewId && currentUserId) {
    // Add 1 to likes amount in Review
    await Review.findByIdAndUpdate(reviewId, { $inc: { likes: 1 } });
    await Review.findByIdAndUpdate(reviewId, {
      $push: { likedBy: currentUserId },
    });

    const user = await User.findById(currentUserId);
    user.likedReviews.push(reviewId);
    await user.save();
    res.sendStatus(200);
  } else {
    console.log("a");
  }
};

module.exports.removeLike = async (req, res) => {
  const { reviewId } = req.params;
  const { _id } = req.user;
  await Review.findByIdAndUpdate(reviewId, { $inc: { likes: -1 } });
  await Review.findByIdAndUpdate(reviewId, { $pull: { likedBy: _id } });

  // remove like from user's db
  await User.findByIdAndUpdate(_id, { $pull: { likedReviews: reviewId } });

  res.sendStatus(200);
};

module.exports.latestReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("authorId")
      .populate("movieId");
    reviews.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
    res.send(reviews.slice(0, 5));
  } catch (error) {}
};
