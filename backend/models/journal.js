const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const entrySchema = new Schema({
  headline: { type: String, required: true },
  journalText: { type: String, required: true },
  photo: { type: String, required: true },
  locationName: { type: String, required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  author: { type: String, required: true }, 
});

module.exports = mongoose.model("Entry", entrySchema);