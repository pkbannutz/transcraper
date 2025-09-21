'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Search, Download, Trash2, ExternalLink } from 'lucide-react'
import { Transcript } from '@/types'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [url, setUrl] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchTranscripts()
    }
  }, [session])

  const fetchTranscripts = async () => {
    try {
      const response = await fetch('/api/transcripts')
      if (response.ok) {
        const data = await response.json()
        setTranscripts(data)
      }
    } catch (error) {
      console.error('Error fetching transcripts:', error)
    }
  }

  const handleExtractTranscript = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/transcripts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (response.ok) {
        setUrl('')
        fetchTranscripts()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to extract transcript')
      }
    } catch (error) {
      console.error('Error extracting transcript:', error)
      alert('Failed to extract transcript')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTranscripts = transcripts.filter(transcript =>
    transcript.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transcript.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">YT</span>
                </div>
                <span className="text-xl font-bold">Transcraper</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user?.name}
              </span>
              <Button
                variant="outline"
                onClick={() => router.push('/api/auth/signout')}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Extract Transcript Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Extract New Transcript</CardTitle>
            <CardDescription>
              Enter a YouTube URL to extract its transcript
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleExtractTranscript} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">YouTube URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !url.trim()}>
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search transcripts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Transcripts List */}
        <div className="space-y-4">
          {filteredTranscripts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No transcripts found' : 'No transcripts yet'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'Extract your first transcript to get started'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTranscripts.map((transcript) => (
              <Card key={transcript.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{transcript.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Duration: {Math.floor(transcript.duration / 60)}:{(transcript.duration % 60).toString().padStart(2, '0')} • 
                        Language: {transcript.language} • 
                        Created: {new Date(transcript.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {transcript.content.substring(0, 200)}...
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
