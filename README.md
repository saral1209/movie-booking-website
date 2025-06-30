

# 🎟️ Movie Booking App

A **full-stack web app** to browse movies and book seats in real-time. Built using **React**, **Node.js**, **Express**, and **MongoDB**, this project demonstrates how to manage seat availability, user bookings, and dynamic movie data.

---

## 📽️ Overview

This movie booking system allows users to:

* 🔍 Browse a list of available movies
* 🪑 View and select available seats
* 🚫 Prevent double booking of already reserved seats
* 📆 Track their bookings
* ❌ Cancel existing bookings

Built with a beginner-friendly tech stack but structured for real-world applications.

---

## 🎯 Features

✅ Browse movies with posters, descriptions, and showtimes
✅ Live seat selection with booking conflict check
✅ Responsive and minimal user interface
✅ Realtime booking feedback and alerts
✅ Delete/cancel your own bookings
✅ Admin: Add new movies via backend (or DB)

---

## 🛠️ Tech Stack

| Technology | Usage                     |
| ---------- | ------------------------- |
| React      | Frontend UI               |
| Node.js    | Backend server            |
| Express    | API routing               |
| MongoDB    | NoSQL database            |
| Mongoose   | MongoDB ODM for Node.js   |
| CSS        | Custom responsive styling |
| Vercel     | Frontend hosting          |
| Render     | Backend deployment        |

---

## 🧠 How It Works

### 🔗 Backend API

| Endpoint                | Description                     |
| ----------------------- | ------------------------------- |
| `GET /movies`           | Fetch all movies                |
| `POST /movies`          | Add a new movie                 |
| `GET /bookings/:userId` | Get all bookings for a user     |
| `POST /book`            | Book seats for a selected movie |
| `DELETE /bookings/:id`  | Cancel a specific booking       |

### 🧾 Booking Logic

* Seat values like `A1`, `B2` are **normalized and checked** before saving.
* Duplicate seat bookings are rejected and show a user-friendly error.
* User bookings are listed with timestamp and movie details.



## 🚀 Live Demo

🌐 **Frontend:** [View on Vercel](https://movie-booking-website-qd7a.vercel.app/)
🖥️ **Backend API:** [View on Render](https://movie-booking-website-japo.onrender.com)
📦 **GitHub Repo:** [View Code](https://github.com/saral1209/movie-booking-website)

---


