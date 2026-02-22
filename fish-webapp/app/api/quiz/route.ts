import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await connectToDatabase();
    const quizzes = await db.collection('audio_training').find({}).toArray();
    const data = quizzes.map((q) => ({
      ...q,
      _id: q._id.toString(),
    }));
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Quiz list error:', error);
    return NextResponse.json(
      { error: 'Failed to load quizzes' },
      { status: 500 }
    );
  }
}
