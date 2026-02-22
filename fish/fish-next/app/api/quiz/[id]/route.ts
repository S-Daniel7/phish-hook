import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();
    const { ObjectId } = await import('mongodb');

    const quiz = await db
      .collection('scam_quizzes')
      .findOne({ _id: new ObjectId(id) });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        _id: String(quiz._id),
        title: quiz.title,
        script: quiz.script,
        audioGridFsId: quiz.audioGridFsId,
        audioUrl: quiz.audioUrl,
        scamAspects: quiz.scamAspects || [],
        distractors: quiz.distractors || [],
      },
    });
  } catch (error) {
    console.error('Quiz fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}
