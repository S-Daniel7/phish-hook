/**
 * Seed script for scam_quizzes collection.
 * Run with: node scripts/seed-quiz.js
 * Requires MONGODB_URI and MONGODB_DB env vars (or defaults to localhost/scamquiz).
 *
 * For audio: either set audioUrl (external URL) or upload via GridFS and store
 * the file _id in audioGridFsId.
 */
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'scamquiz';

const sampleQuizzes = [
  {
    title: 'IRS Impersonation Call',
    script: 'Hello, this is Officer Smith from the IRS. Your social security number has been flagged for tax fraud. We need you to pay $2,000 in gift cards immediately or face arrest. Do not hang up—this call is being recorded.',
    audioUrl: null,
    scamAspects: [
      { text: 'Urgency / immediate payment demand', explanation: 'Scammers pressure you to act before you can verify.' },
      { text: 'Gift card payment', explanation: 'Legitimate agencies never demand payment in gift cards.' },
      { text: 'Threat of arrest', explanation: 'The IRS does not threaten arrest over the phone.' },
      { text: 'Pre-recorded / high pressure', explanation: 'Trying to prevent you from hanging up and researching.' },
    ],
    distractors: [
      'Polite greeting',
      'Professional tone',
      'Mentions your name',
    ],
  },
  {
    title: 'Tech Support Scam',
    script: 'Hi, this is Microsoft Security. We detected a virus on your computer. I need remote access to fix it. Please go to anydesk.com and give me the code. There will be a one-time fee of $299.',
    audioUrl: null,
    scamAspects: [
      { text: 'Remote access request', explanation: 'Genuine tech support does not ask for remote access via third-party tools.' },
      { text: 'Unsolicited contact', explanation: 'Microsoft does not call you about viruses.' },
      { text: 'Immediate fee for "fix"', explanation: 'Legitimate support does not charge over the phone for urgent fixes.' },
    ],
    distractors: [
      'References a real company',
      'Offers to "help"',
      'Uses technical terms',
    ],
  },
];

async function seed() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const col = db.collection('scam_quizzes');
  await col.deleteMany({});
  const result = await col.insertMany(sampleQuizzes);
  console.log('Inserted', result.insertedCount, 'quiz items');
  await client.close();
}

seed().catch(console.error);
