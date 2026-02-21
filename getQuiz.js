const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://octobermorning_db_user:KtM19ZQohM8v6Gva@cluster0.jxqtpow.mongodb.net/?appName=Cluster0"; 

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected");

    const db = client.db("appdb");
    const quizzes = db.collection("quizzes");

    // Get ONE quiz from level 2
    const quiz = await quizzes.findOne({ level: 2 });

    console.log("🎯 Quiz found:");
    console.log(quiz);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.close();
  }
}

run();
