require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // Allow all origins by default, or specify an origin
  })
);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
    initializeCounter(); // Initialize counter after successful connection
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process with failure
  });

// Counter schema and model
const counterSchema = new mongoose.Schema({
  value: { type: Number, default: 0 },
});
const Counter = mongoose.model("Counter", counterSchema);

// Initialize counter if it doesn't exist
const initializeCounter = async () => {
  try {
    const counter = await Counter.findOne();
    if (!counter) {
      const newCounter = new Counter({ value: 0 });
      await newCounter.save();
      console.log("Counter initialized with value 0");
    } else {
      console.log("Counter already exists with value:", counter.value);
    }
  } catch (err) {
    console.error("Error initializing counter:", err.message);
  }
};

// GET /counter route
app.get("/counter", async (req, res) => {
  try {
    const counter = await Counter.findOne();
    res.json({ value: counter.value });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST /increment route
app.post("/increment", async (req, res) => {
  try {
    const counter = await Counter.findOne();
    counter.value += 1;
    await counter.save();
    res.json({ value: counter.value });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST /decrement route
app.post("/decrement", async (req, res) => {
  try {
    const counter = await Counter.findOne();
    counter.value -= 1;
    await counter.save();
    res.json({ value: counter.value });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Health check route
app.get("/healthcheck", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
