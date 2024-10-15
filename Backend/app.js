const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Atlas connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const teamSchema = new mongoose.Schema({
  teamName: String,
  teamLeadName: String,
  phone: String,
  email: String,
  collegeName: String,
  year: String,
  department: String,
  teamSize: Number,
  teamMembers: [
    {
      name: String,
      email: String,
      phone: String,
      department: String,
      year: String,
    },
  ],
});

const Team = mongoose.model("Team", teamSchema);

// API Routes
app.post("/api/submit-team", async (req, res) => {
  try {
    const newTeam = new Team(req.body);
    await newTeam.save();
    res.status(200).json({ message: "Team submitted successfully" });
  } catch (error) {
    console.error("Error saving team:", error);
    res.status(500).json({ message: "Error submitting team" });
  }
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Export the Express API
module.exports = app;
