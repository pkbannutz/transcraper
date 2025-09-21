import { YouTubeVideoInfo, TranscriptSegment } from '@/types'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

export class YouTubeAPI {
  private apiKey: string

  constructor() {
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key is not configured')
    }
    this.apiKey = YOUTUBE_API_KEY
  }

  async getVideoInfo(videoId: string): Promise<YouTubeVideoInfo> {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails&id=${videoId}&key=${this.apiKey}`
    )

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found')
    }

    const video = data.items[0]
    const duration = this.parseDuration(video.contentDetails.duration)

    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      channelTitle: video.snippet.channelTitle,
      duration: duration.toString(),
      publishedAt: video.snippet.publishedAt,
      thumbnails: {
        default: video.snippet.thumbnails.default,
        medium: video.snippet.thumbnails.medium,
        high: video.snippet.thumbnails.high,
      },
    }
  }

  async getTranscript(videoId: string, language: string = 'en'): Promise<TranscriptSegment[]> {
    // For now, we'll return a mock transcript
    // In a real implementation, you would use the YouTube Transcript API
    // or a service like youtube-transcript-api
    
    const videoInfo = await this.getVideoInfo(videoId)
    
    // Mock transcript data - in production, you'd fetch from YouTube's transcript API
    const mockTranscript: TranscriptSegment[] = [
      { start: 0, duration: 5, text: "Welcome to this video about transcript extraction." },
      { start: 5, duration: 8, text: "We'll be discussing how to extract transcripts from YouTube videos." },
      { start: 13, duration: 6, text: "This is a mock transcript for demonstration purposes." },
    ]

    return mockTranscript
  }

  extractVideoId(url: string): string {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    
    if (!match) {
      throw new Error('Invalid YouTube URL')
    }
    
    return match[1]
  }

  private parseDuration(duration: string): number {
    // Parse ISO 8601 duration format (PT4M13S)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    
    if (!match) {
      return 0
    }
    
    const hours = parseInt(match[1] || '0', 10)
    const minutes = parseInt(match[2] || '0', 10)
    const seconds = parseInt(match[3] || '0', 10)
    
    return hours * 3600 + minutes * 60 + seconds
  }
}

export const youtubeAPI = new YouTubeAPI()
