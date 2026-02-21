require("dotenv").config();
const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("./db");

const app = express();
app.use(express.json());

// Get quiz by level
app.get("/quiz", async (req, res) => {
  const level = Number(req.query.level || 1);
  const db = await getDb();
  const quiz = await db.collection("quizzes").findOne({ level });
  res.json(quiz);
});

// Submit attempt
app.post("/attempt", async (req, res) => {
  const { userId, quizId, selectedFlags } = req.body;

  const db = await getDb();
  const quiz = await db.collection("quizzes").findOne({
    _id: new ObjectId(quizId)
  });

  const correct = quiz.flags.filter(f => selectedFlags.includes(f));

  await db.collection("attempts").insertOne({
    userId,
    quizId: quiz._id,
    selectedFlags,
    score: correct.length,
    total: quiz.flags.length,
    createdAt: new Date()
  });

  res.json({
    score: correct.length,
    total: quiz.flags.length,
    correct
  });
});

app.listen(3000, () =>
  console.log("✅ Server running at http://localhost:3000")
);
