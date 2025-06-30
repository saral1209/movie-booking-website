import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css"; // plain CSS

function App() {
  const [movies, setMovies] = useState([]);
  const [bookingMovieId, setBookingMovieId] = useState(null);
  const [seats, setSeats] = useState("");
  const [message, setMessage] = useState("");
  const [bookings, setBookings] = useState([]);

  const userId = "user123";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const moviesRes = await axios.get("http://localhost:5000/movies");
      setMovies(moviesRes.data);

      const bookingsRes = await axios.get(
        `http://localhost:5000/bookings/${userId}`
      );
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error("❌ Error loading data:", err);
    }
  };

  const handleBook = async () => {
    if (!bookingMovieId) {
      alert("Please click 'Book Now' first.");
      return;
    }

    if (seats.trim() === "") {
      alert("Please enter at least one seat.");
      return;
    }

    const requestedSeats = seats
      .split(",")
      .map((seat) => seat.trim().toUpperCase());

    const alreadyBooked = [];
    for (const seat of requestedSeats) {
      const isTaken = bookings.some(
        (b) =>
          (b.movieId === bookingMovieId || b.movieId?._id === bookingMovieId) &&
          b.seats.map((s) => s.toUpperCase()).includes(seat)
      );
      if (isTaken) alreadyBooked.push(seat);
    }

    if (alreadyBooked.length > 0) {
      alert(`❌ Already booked: ${alreadyBooked.join(", ")}`);
      return;
    }

    try {
      await axios.post("http://localhost:5000/book", {
        userId,
        movieId: bookingMovieId,
        seats: requestedSeats,
      });

      setMessage("✅ Booking Successful!");
      setTimeout(() => setMessage(""), 3000);
      setSeats("");
      setBookingMovieId(null);
      fetchData();
    } catch (err) {
      console.error("❌ Booking error:", err);
      setMessage("❌ Booking Failed");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:5000/bookings/${bookingId}`);
      fetchData();
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("❌ Failed to delete booking");
    }
  };

  const getMovieTitle = (movie) => {
    if (!movie) return "Unknown Movie";
    if (typeof movie === "string") {
      const found = movies.find((m) => m._id === movie);
      return found ? found.title : "Unknown Movie";
    }
    return movie.title || "Unknown Movie";
  };

  return (
    <div className="container">
      <h1>🎬 Movie List</h1>
      {message && <p className="message">{message}</p>}

      {movies.length === 0 ? (
        <p>No movies yet.</p>
      ) : (
        movies.map((movie) => (
          <div key={movie._id} className="card">
            <img src={movie.poster} alt={movie.title} />
            <div className="card-content">
              <h3>{movie.title}</h3>
              <p>{movie.description}</p>
              <p>
                <strong>🎞️ Showtime:</strong> {movie.showtime}
              </p>

              {bookingMovieId === movie._id ? (
                <div className="form">
                  <input
                    type="text"
                    placeholder="Enter seats (A1,A2)"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                  />
                  <button onClick={handleBook}>✅ Confirm Booking</button>
                </div>
              ) : (
                <button onClick={() => setBookingMovieId(movie._id)}>
                  🎟️ Book Now
                </button>
              )}
            </div>
          </div>
        ))
      )}

      <hr />
      <h2>📋 My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking, i) => (
          <div key={i} className="booking">
            <p>
              <strong>Movie:</strong> {getMovieTitle(booking.movieId)}
            </p>
            <p>
              <strong>Seats:</strong> {booking.seats.join(", ")}
            </p>
            <p>
              <strong>Booked At:</strong>{" "}
              {new Date(booking.bookedAt).toLocaleString()}
            </p>
            <button onClick={() => handleDelete(booking._id)}>❌ Cancel</button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
