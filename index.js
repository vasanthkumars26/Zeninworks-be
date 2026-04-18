// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const inquiryRoutes = require('./routes/inquiryRoutes');
// const projectRoutes = require('./routes/projectRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');

// const app = express();

// const path = require('path');

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes
// app.use('/api/inquiry', inquiryRoutes);
// app.use('/api/project', projectRoutes);
// app.use('/api/booking', bookingRoutes);

// app.get('/', (req, res) => {
//   res.send('Zeninworks Backend API is running...');
// });

// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log('Connected to MongoDB');
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('MongoDB connection error:', err);
//   });


require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const inquiryRoutes = require("./routes/inquiryRoutes");
const projectRoutes = require("./routes/projectRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// ✅ Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://zeninworks.vercel.app"
];

// ✅ CORS middleware for local + deployed frontend
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman/mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: This origin is not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
  })
);

// ✅ Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ Static folder for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API routes
app.use("/api/inquiry", inquiryRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/booking", bookingRoutes);

// ✅ Health route
app.get("/", (req, res) => {
  res.status(200).send("✅ Zeninworks Backend API is running...");
});

// ✅ 404 route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// ✅ MongoDB connection + server start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });