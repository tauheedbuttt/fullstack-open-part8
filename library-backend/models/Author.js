const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number,
  },
});

// Virtual field for bookCount
schema.virtual("bookCount", {
  ref: "Book", // The model to use
  localField: "_id", // Find books where 'author' is equal to this _id
  foreignField: "author",
  count: true, // Only get the number of documents
});
// Make virtuals appear when converting to JSON
schema.set("toJSON", { virtuals: true });
schema.set("toObject", { virtuals: true });
schema.plugin(uniqueValidator);

const Author = mongoose.model("Author", schema);

module.exports = Author;
