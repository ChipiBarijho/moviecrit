const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema(
  {
    adult: {
      type: "Boolean",
    },
    backdrop_path: {
      type: "String",
    },
    belongs_to_collection: {
      id: {
        type: "Number",
      },
      name: {
        type: "String",
      },
      poster_path: {
        type: "String",
      },
      backdrop_path: {
        type: "String",
      },
    },
    budget: {
      type: "Number",
    },
    genres: {
      type: Array,
    },
    homepage: {
      type: "String",
    },
    id: {
      type: "Number",
    },
    imdb_id: {
      type: "String",
    },
    original_language: {
      type: "String",
    },
    original_title: {
      type: "String",
    },
    overview: {
      type: "String",
    },
    popularity: {
      type: "Number",
    },
    poster_path: {
      type: "String",
    },
    release_date: {
      type: "String",
    },
    revenue: {
      type: "Number",
    },
    runtime: {
      type: "Number",
    },
    status: {
      type: "String",
    },
    tagline: {
      type: "String",
    },
    title: {
      type: "String",
    },
    vote_average: {
      type: "Number",
    },
    vote_count: {
      type: "Number",
    },
    trailer: {
      type: Object,
    },
    tmdbId: {
      type: Number,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "ReviewsTMDB",
      },
    ],
    critReviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
    credits: {
      type: "Mixed",
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Movie", MovieSchema);
