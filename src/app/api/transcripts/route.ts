import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { youtubeAPI } from '@/lib/youtube'
import { CreateTranscriptResponse } from '@/types'
import { z } from 'zod'

const createTranscriptSchema = z.object({
  url: z.string().url('Invalid URL format'),
})

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const transcripts = await prisma.transcript.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(transcripts)
  } catch (error) {
    console.error('Error fetching transcripts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transcripts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { url } = createTranscriptSchema.parse(body)

    // Extract video ID from URL
    const videoId = youtubeAPI.extractVideoId(url)
    
    // Check if transcript already exists
    const existingTranscript = await prisma.transcript.findFirst({
      where: {
        userId: session.user.id,
        videoId: videoId,
      },
    })

    if (existingTranscript) {
      return NextResponse.json(
        { error: 'Transcript already exists for this video' },
        { status: 409 }
      )
    }

    // Get video information
    const videoInfo = await youtubeAPI.getVideoInfo(videoId)
    
    // Get transcript
    const transcriptSegments = await youtubeAPI.getTranscript(videoId)
    const transcriptContent = transcriptSegments.map(segment => segment.text).join(' ')

    // Save transcript to database
    const transcript = await prisma.transcript.create({
      data: {
        userId: session.user.id,
        videoId: videoId,
        title: videoInfo.title,
        content: transcriptContent,
        language: 'en', // Default to English for now
        duration: parseInt(videoInfo.duration),
      },
    })

    const response: CreateTranscriptResponse = {
      id: transcript.id,
      videoId: transcript.videoId,
      title: transcript.title,
      status: 'completed',
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating transcript:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create transcript' },
      { status: 500 }
    )
  }
}
