const mongoose = require("mongoose");
const { Schema } = mongoose;

const likesSchema = new Schema({
  count: {
    type: Number,
    default: 0,
  },
  likedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const reviewsSchema = new Schema(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
    },
    body: String,
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    rating: Number,
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Reviews", reviewsSchema);
