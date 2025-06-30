// server/models/Movie.js

import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  poster: { type: String },       // Image URL
  showtime: { type: String },     // Can be string like "7:30 PM"
});

export default mongoose.model("Movie", movieSchema);
