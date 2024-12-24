const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // For hashing passwords

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
 
// MongoDB setup (replace with your actual MongoDB URI)
mongoose.connect(
  "mongodb+srv://harshpandya5099:Mahakal123@day3task.pvns6.mongodb.net/?retryWrites=true&w=majority&appName=day3task",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Create User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Insert hardcoded credentials (only once, if not already inserted)
const insertHardcodedCredentials = async () => {
  // Check if user already exists
  const userExists = await User.findOne({ email: "harshpandya5678@gmail.com" });
  if (!userExists) {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash("harsh@123", 10);

    // Save hardcoded user to the database
    const newUser = new User({
      email: "harshpandya5678@gmail.com",
      password: hashedPassword,
    });

    try {
      await newUser.save();
      console.log("Hardcoded user credentials inserted.");
    } catch (err) {
      console.error("Error inserting hardcoded user:", err);
    }
  } else {
    console.log("User already exists, skipping insert.");
  }
};

// Insert hardcoded credentials on server start
insertHardcodedCredentials();

// Email Validation
app.post("/login/email", async (req, res) => {
  const { email } = req.body;

  // Check if email exists in the database
  const user = await User.findOne({ email });
  if (user) {
    return res.status(200).json({ message: "Email is valid, please enter your password." });
  } else {
    return res.status(400).json({ message: "Invalid email address" });
  }
});

// Password Validation
app.post("/login/password", async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  if (user) {
    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(400).json({ message: "Invalid email or password" });
    }
  } else {
    return res.status(400).json({ message: "Invalid email address" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
