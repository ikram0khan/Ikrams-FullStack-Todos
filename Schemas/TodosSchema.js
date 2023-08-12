const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  collectionId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "collections",
    required: true,
  },
  createdAy: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("todos", todoSchema);
