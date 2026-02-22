import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export interface ScamAspect {
  text: string;
  explanation: string;
}

export interface QuizItem {
  _id: string;
  title: string;
  script: string;
  audioGridFsId?: string;
  audioUrl?: string;
  scamAspects: ScamAspect[];
  distractors?: string[];
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    const quizzes = await db
      .collection<Omit<QuizItem, '_id'> & { _id: unknown }>('scam_quizzes')
      .find({})
      .limit(10)
      .toArray();

    const items: QuizItem[] = quizzes.map((q) => ({
      _id: String(q._id),
      title: q.title,
      script: q.script,
      audioGridFsId: q.audioGridFsId,
      audioUrl: q.audioUrl,
      scamAspects: q.scamAspects || [],
      distractors: q.distractors || [],
    }));

    return NextResponse.json({ data: items });
  } catch (error) {
    console.error('Quiz API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}
