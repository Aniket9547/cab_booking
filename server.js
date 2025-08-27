const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config(); 

// Models
const Booking = require("./models/booking"); 
const User = require("./models/login");


const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // static files (HTML, CSS, JS)

const session = require("express-session");

app.use(session({
  secret: "aniket",  
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));



// Local + Render 
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cab_booking";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


// ---------------- Routes ---------------- //

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signin.html"));
 
});
app.get("/about",(req,res)=>{
  res.sendFile(path.join(__dirname,"public","about.html"))
})

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index1.html"));
});

// SIGNUP
app.post("/user-entry", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ exists: true });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.json({ invalid: true });
  }
});

// LOGIN
app.post("/user-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: true });
    }

    if (password !== user.password) {
      return res.json({ err: true });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.json({ error: true });
  }
});
app.get("/signout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// BOOKING 
app.post("/book", async (req, res) => {
  try {
    const bookingData = req.body;
    const newBooking = new Booking(bookingData);
    await newBooking.save();
    res.json({ success: true, message: "✅ Booking saved successfully", booking: newBooking });
  } catch (error) {
    console.error("❌ Booking Error:", error);
    res.status(500).json({ success: false, error: "Booking failed" });
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    return res.json(bookings);
  } catch (err) {
    console.error("❌ Fetch Booking Error:", err);
    return res.json({ error: true });
  }
});
app.post("/send-message", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Gmail transporter config
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aniketbanerjee9547@gmail.com", // 👉 tera Gmail
        pass: "hnmb curz qawz nclh",   // 👉 Gmail App Password
      },
    });

    // Mail options
    let mailOptions = {
      from: email,  // sender (form ka email)
      to: "aniketbanerjee9547@gmail.com", // 👉 yaha apna Gmail
      subject: subject || "New Contact Form Message",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "✅ Message sent successfully" });
  } catch (error) {
    console.error("❌ Mail Error:", error);
    res.status(500).json({ success: false, message: "❌ Failed to send message" });
  }
});


// Server start
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});



