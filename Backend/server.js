const catalyst = require("zcatalyst-sdk-node");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;

// Middleware
app.use(bodyParser.json());

// Catalyst CORS handling
app.use((req, res, next) => {
  const catalystApp = catalyst.initialize(req);
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }
  next();
});

// MongoDB Atlas connection
mongoose
  .connect(
    "mongodb+srv://surya:VmIYCGXra9jAq1y3@forms.fsj0h.mongodb.net/?retryWrites=true&w=majority&appName=Forms"
  )
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

app.get("/", (req, res) => {
  res.send("connected");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
