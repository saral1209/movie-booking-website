// server/scripts/seed.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "../models/Movie.js";

// Load environment variables from .env file
dotenv.config();

// MongoDB connection URI from .env
const mongoUri = process.env.MONGO_URI;

// Sample movie data
const movies = [
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space to ensure humanity's survival.",
    poster: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    showtime: "7:30 PM"
  },
  {
    title: "The Dark Knight",
    description: "Batman takes on crime in Gotham with a new enemy, the Joker.",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    showtime: "9:00 PM"
  },
  {
    title: "Inception",
    description: "A skilled thief is offered a chance to erase his criminal past.",
    poster: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    showtime: "6:00 PM"
  }
];

// Main seeding function
async function seedMovies() {
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    await Movie.deleteMany(); // Clear old movie entries
    await Movie.insertMany(movies); // Insert new movies
    console.log("🎉 Movies seeded successfully!");

    process.exit(0); // Exit process on success
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1); // Exit with error
  }
}

// Run the seeding function
seedMovies();
