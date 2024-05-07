const plm = require("passport-local-mongoose");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/newdbforpinterest");
const personSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  dp: {
    type: String, // Assuming dp is stored as a string (URL or file path)
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});

personSchema.plugin(plm);
module.exports = mongoose.model("Person", personSchema);
