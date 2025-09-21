# YouTube Transcraper

A modern, full-stack application for extracting and managing YouTube video transcripts with a freemium subscription model.

## Features

- 🚀 **Fast Transcript Extraction** - Extract transcripts from YouTube videos in seconds
- 🔍 **Advanced Search** - Search through your transcript library with powerful filtering
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🔐 **Secure Authentication** - OAuth integration with Google and GitHub
- 💳 **Subscription Management** - 30-day free trial, €8.65/month premium
- 📤 **Multiple Export Formats** - TXT, SRT, VTT, JSON support
- 🎯 **Batch Processing** - Process multiple videos at once
- 🔌 **API Access** - Programmatic access for developers

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Deployment**: Vercel
- **UI Components**: Radix UI

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Redis (optional, for caching)
- YouTube Data API key
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/transcraper.git
cd transcraper
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/transcraper"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# YouTube API
YOUTUBE_API_KEY="your-youtube-api-key"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# Redis (optional)
REDIS_URL="redis://localhost:6379"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="your-blob-token"
```

5. Set up the database:
```bash
npx prisma db push
npx prisma generate
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## Project Structure

```
transcraper/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── providers/        # Context providers
├── lib/                   # Utilities and configuration
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database connection
│   ├── stripe.ts         # Stripe configuration
│   └── youtube.ts        # YouTube API service
├── prisma/               # Database schema and migrations
├── src/                  # Source code
│   └── types/            # TypeScript type definitions
└── docs/                 # Documentation
    ├── prd.md           # Product Requirements Document
    └── architecture.md  # Architecture documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/signup` - Sign up with credentials
- `GET /api/auth/session` - Get current session

### Transcripts
- `GET /api/transcripts` - Get user's transcripts
- `POST /api/transcripts` - Extract new transcript
- `GET /api/transcripts/[id]` - Get specific transcript
- `DELETE /api/transcripts/[id]` - Delete transcript

### Subscriptions
- `GET /api/subscription` - Get user subscription
- `POST /api/subscription` - Create subscription
- `DELETE /api/subscription` - Cancel subscription

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook handler

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Make sure to set all required environment variables in your Vercel dashboard:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `YOUTUBE_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `BLOB_READ_WRITE_TOKEN`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@transcraper.com or join our Discord community.

## Roadmap

- [ ] Real-time transcript processing status
- [ ] Advanced transcript analysis with AI
- [ ] Team collaboration features
- [ ] Mobile app (React Native)
- [ ] Chrome extension
- [ ] API rate limiting and analytics
- [ ] Multi-language support
- [ ] Transcript sharing and collaboration