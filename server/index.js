// server.js

// Importing required modules
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Importing movie and booking models
import Movie from "./models/Movie.js";
import Booking from "./models/Booking.js";

// Load .env file variables
dotenv.config();


console.log("🔐 Mongo URI loaded:", process.env.MONGO_URI);

// Initialize express app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// 🔹 GET all movies
app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// 🔹 POST a new movie (admin use)
app.post("/movies", async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ error: "Failed to add movie" });
  }
});

// 🔥 DELETE a movie by ID (Admin use)
app.delete("/movies/:id", async (req, res) => {
  try {
    const deleted = await Movie.findByIdAndDelete(req.params.id);
    if (deleted) {
      res.json({ message: "Deleted movie successfully" });
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete movie" });
  }
});

// ✅ NEW: GET all booked seats for a movie
app.get("/movies/:id/booked-seats", async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await Booking.find({ movieId: id });
    const allBookedSeats = bookings.flatMap(b => b.seats.map(s => s.toUpperCase()));
    res.json(allBookedSeats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch booked seats" });
  }
});

// 🔹 POST a booking
app.post("/book", async (req, res) => {
  try {
    const { userId, movieId, seats } = req.body;

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    const normalizedSeats = seats.map(s => s.trim().toUpperCase());

    // Check for already booked seats
    const existing = await Booking.find({ movieId });
    const existingSeats = existing.flatMap(b => b.seats.map(s => s.toUpperCase()));
    const overlap = normalizedSeats.filter(seat => existingSeats.includes(seat));

    if (overlap.length > 0) {
      return res.status(409).json({ error: `Seats already booked: ${overlap.join(", ")}` });
    }

    const booking = new Booking({
      userId,
      movieId,
      seats: normalizedSeats,
      bookedAt: new Date()
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: "Failed to book seats" });
  }
});

// 🔹 GET bookings by userId (with movie info populated)
app.get("/bookings/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate("movieId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// ✅ TEMP: Debug route - view raw bookings
app.get("/bookings-debug", async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Error fetching bookings" });
  }
});

// ✅ TEMP: Delete bookings with null movieId
app.delete("/bookings/cleanup", async (req, res) => {
  try {
    const result = await Booking.deleteMany({ movieId: null });
    res.json({ deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete invalid bookings" });
  }
});

// ✅ Delete bookings with non-existing movieId
app.delete("/bookings/cleanup-invalid", async (req, res) => {
  try {
    const validMovieIds = (await Movie.find({}, "_id")).map((m) => m._id.toString());
    const result = await Booking.deleteMany({
      movieId: { $nin: validMovieIds }
    });
    res.json({ deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to cleanup invalid bookings" });
  }
});

// ✅ Manual: Delete booking by ID
app.delete("/bookings/:id", async (req, res) => {
  try {
    const result = await Booking.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ message: "Deleted successfully" });
    } else {
      res.status(404).json({ error: "Booking not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error deleting booking" });
  }
});

// ✅ Start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => {
      console.log("✅ Server running on http://localhost:5000");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
