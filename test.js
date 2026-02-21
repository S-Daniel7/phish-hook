const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://octobermorning_db_user:KtM19ZQohM8v6Gva@cluster0.jxqtpow.mongodb.net/?appName=Cluster0";

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("appdb");
    const users = db.collection("users");

    const result = await users.insertOne({
      name: "First User",
      email: "first@test.com"
    });

    console.log("Inserted ID:", result.insertedId);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
