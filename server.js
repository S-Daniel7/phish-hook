require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getDb } = require("./db");


const app = express();
app.use(express.json());
const cors = require("cors");
// app.use(cors());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));


function normalizeEmail(email) {
 return String(email || "").trim().toLowerCase();
}


/* ---------- REGISTER (SIGNUP) ---------- */
app.post("/register", async (req, res) => {
 try {
   const { name, email, password } = req.body;


   const cleanEmail = normalizeEmail(email);


   if (!cleanEmail || !password) {
     return res.status(400).json({ message: "Email and password required" });
   }


   if (String(password).length < 6) {
     return res.status(400).json({ message: "Password must be at least 6 characters" });
   }


   const db = await getDb();
   const users = db.collection("users");


   // Optional but recommended: ensure unique email index once (see note below)
   const existing = await users.findOne({ email: cleanEmail });
   if (existing) {
     return res.status(409).json({ message: "User already exists" });
   }


   const passwordHash = await bcrypt.hash(password, 10);


   const result = await users.insertOne({
     name: name ? String(name).trim() : "",
     email: cleanEmail,
     passwordHash,
     createdAt: new Date(),
   });


   return res.status(201).json({
     message: "User created",
     user: { id: result.insertedId, name: name ? String(name).trim() : "", email: cleanEmail },
   });
 } catch (err) {
   console.error(err);
   return res.status(500).json({ error: err.message });
 }
});


/* ---------- LOGIN ---------- */
app.post("/login", async (req, res) => {
 try {
   const { email, password } = req.body;


   const cleanEmail = normalizeEmail(email);
   if (!cleanEmail || !password) {
     return res.status(400).json({ message: "Email and password required" });
   }


   const db = await getDb();
   const users = db.collection("users");


   const user = await users.findOne({ email: cleanEmail });
   if (!user) {
     return res.status(401).json({ message: "Invalid credentials" });
   }


   const ok = await bcrypt.compare(password, user.passwordHash);
   if (!ok) {
     return res.status(401).json({ message: "Invalid credentials" });
   }


   if (!process.env.JWT_SECRET) {
     return res.status(500).json({ message: "Missing JWT_SECRET in .env" });
   }


   const token = jwt.sign(
     { userId: user._id.toString(), email: user.email },
     process.env.JWT_SECRET,
     { expiresIn: "7d" }
   );


   return res.json({
     message: "Login successful",
     token,
     user: {
       id: user._id,
       name: user.name || "",
       email: user.email,
     },
   });
 } catch (err) {
   console.error(err);
   return res.status(500).json({ error: err.message });
 }
});

/* ---------- GET QUIZ ---------- */
app.get("/api/visual-quiz/quiz", async (req, res) => {
  try {
    const level = Number(req.query.level || 1);

    const db = await getDb();
    const quizzes = db.collection("scam_training");

    const quiz = await quizzes.findOne({ level });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/* ---------- HEALTH CHECK ---------- */
app.get("/", (req, res) => {
 res.send("Backend is running");
});


const PORT = 5000;
app.listen(PORT, () => {
 console.log(`✅ Server running at http://localhost:${PORT}`);
});

