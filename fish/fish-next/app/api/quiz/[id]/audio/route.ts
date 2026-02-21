import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId, GridFSBucket } from 'mongodb';
import { Readable } from 'stream';

const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';

async function generateElevenLabsAudio(text: string): Promise<ArrayBuffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY is not configured');
  }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs API error: ${res.status} ${err}`);
  }

  return res.arrayBuffer();
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();
    const quiz = await db
      .collection('scam_quizzes')
      .findOne({ _id: new ObjectId(id) });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    if (quiz.audioGridFsId) {
      const bucket = new GridFSBucket(db, { bucketName: 'audio' });
      const stream = bucket.openDownloadStream(new ObjectId(quiz.audioGridFsId));
      const webStream = Readable.toWeb(stream) as ReadableStream;

      return new NextResponse(webStream, {
        headers: { 'Content-Type': 'audio/mpeg' },
      });
    }

    if (quiz.script && process.env.ELEVENLABS_API_KEY) {
      const buffer = await generateElevenLabsAudio(quiz.script);
      return new NextResponse(buffer, {
        headers: { 'Content-Type': 'audio/mpeg' },
      });
    }

    return NextResponse.json(
      { error: 'No audio available (no stored file and ElevenLabs not configured)' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Audio stream error:', error);
    return NextResponse.json(
      { error: 'Failed to stream audio' },
      { status: 500 }
    );
  }
}
