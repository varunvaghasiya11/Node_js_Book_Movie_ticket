# Movie Ticket App (Node.js)

A full-stack Node.js web application for booking movie tickets. It includes an admin dashboard for adding screens, shows, and movies, and a user portal for browsing shows, booking seats, and receiving email confirmations.

## 🚀 Features

- **User Authentication**: Secure signup and login flow using `bcrypt` and cookie-based sessions.
- **Admin Panel**: Add, edit, and delete movies, screens, and shows.
- **Seat Booking**: Users can view available shows and book specific seats.
- **Email Confirmations**: Sends an automated HTML confirmation email to users upon successful booking using `nodemailer`.
- **MVC Architecture**: Code is organized into Models, Views, and Controllers for scalability and maintainability.
- **Server-Side Rendering**: Uses `ejs` for dynamic, fast page rendering.

## 🛠️ Technology Stack

- **Backend**: Node.js & Express.js
- **Database**: MongoDB (via Mongoose)
- **View Engine**: EJS (Embedded JavaScript templating)
- **Authentication**: `bcrypt` for password hashing, `cookie-parser` for session tracking.
- **Email Service**: `nodemailer`

## Admin Access
- Email :- admin@gmail.com
- password :- 12345

## 📁 Project Structure

```text
movie_ticket_app/
├── config/        # Database and app configuration files
├── controllers/   # Route handlers and business logic (e.g. showController.js)
├── middlewares/   # Custom Express middlewares (e.g. authentication checks)
├── models/        # Mongoose database schemas (Movie, Screen, Show, Ticket, User)
├── partials/      # EJS reusable layout components
├── public/        # Static files (CSS, images, client-side JS)
├── routes/        # Express route definitions
├── views/         # EJS templates for pages
└── index.js       # Main application entry point

 
