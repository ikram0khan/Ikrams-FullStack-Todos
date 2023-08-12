const mongoose = require("mongoose");

const collecSchema = new mongoose.Schema({
  collectionName: {
    type: String,
    maxLength: [40, "Collection Name Must Be Smaller Than 40 Character"],
    required: true,
  },
  collectionDescripton: {
    type: String,
    maxLength: [100, "Collection Description Cannot Exceed 400 Character"],
  },
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("collection", collecSchema);
