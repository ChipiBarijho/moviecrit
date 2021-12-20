const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const Session = new Schema({
  refreshToken: {
    type: String,
    default: "",
  },
});

const User = new Schema(
  {
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
    },
    authStrategy: {
      type: String,
      default: "local",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
    refreshToken: {
      type: [Session],
    },
    profileImg: {
      type: String,
      default:
        "https://res.cloudinary.com/chipi/image/upload/v1639193975/MovieCrit/jlwkssathz3s9fkzncdt.jpg",
    },
    likedReviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
  },
  { timestamps: { createdAt: "created_at" } }
);

//Remove refreshToken from the response
User.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.refreshToken;
    return ret;
  },
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);
