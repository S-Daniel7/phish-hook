const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb+srv://octobermorning_db_user:KtM19ZQohM8v6Gva@cluster0.jxqtpow.mongodb.net/?appName=Cluster0";

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected");

    const db = client.db("appdb");
    const quizzes = db.collection("scam_training");
    const attempts = db.collection("attempts");

    // 1) Pick a quiz (level 2)
    const quiz = await quizzes.findOne({ level: 2 });
    if (!quiz) throw new Error("Quiz not found");

    // 2) Pretend the user selected these flags 
    const selectedFlags = [
      "Sense of urgency (due today / late fees)",
      "No identifying details (your name, company, service)"
    ];

    // 3) Score it
    const correctSet = new Set(quiz.flags);
    const correctSelected = selectedFlags.filter(f => correctSet.has(f));
    const score = correctSelected.length;
    const total = quiz.flags.length;

    // 4) Save attempt
    const attemptDoc = {
      userId: "guest-123",
      quizId: quiz._id,
      selectedFlags,
      correctSelected,
      score,
      total,
      createdAt: new Date()
    };

    const result = await attempts.insertOne(attemptDoc);
    console.log("🎉 Attempt saved:", result.insertedId);
    console.log(`Score: ${score}/${total}`);

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.close();
  }
}

run();
