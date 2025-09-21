# Deployment Guide

## Vercel Deployment

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Database**: Set up a PostgreSQL database (recommended: Supabase, Neon, or Vercel Postgres)
4. **External Services**: Configure YouTube API, Stripe, and OAuth providers

### Step 1: Set up Database

1. **Option A: Supabase (Recommended)**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your database URL from Settings > Database
   - Run the following commands locally to set up the schema:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

2. **Option B: Vercel Postgres**
   - In your Vercel dashboard, go to Storage
   - Create a new Postgres database
   - Get the connection string

### Step 2: Configure OAuth Providers

1. **Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://your-domain.vercel.app/api/auth/callback/google` (for production)

2. **GitHub OAuth**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set Authorization callback URL:
     - `http://localhost:3000/api/auth/callback/github` (for development)
     - `https://your-domain.vercel.app/api/auth/callback/github` (for production)

### Step 3: Configure YouTube API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable YouTube Data API v3
3. Create API credentials
4. Copy the API key

### Step 4: Configure Stripe

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the dashboard
3. Set up webhook endpoints:
   - Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Events to send: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### Step 5: Deploy to Vercel

1. **Connect Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   - In the Vercel dashboard, go to your project settings
   - Navigate to Environment Variables
   - Add the following variables:

   ```env
   DATABASE_URL=your_postgresql_connection_string
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your_random_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   YOUTUBE_API_KEY=your_youtube_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete
   - Your app will be available at `https://your-domain.vercel.app`

### Step 6: Post-Deployment Setup

1. **Update OAuth Redirect URLs**
   - Update your OAuth provider settings with the production URLs
   - Test authentication flows

2. **Test Database Connection**
   - Visit your deployed app
   - Try signing up/signing in
   - Check if data is being saved to the database

3. **Test Stripe Integration**
   - Test the subscription flow
   - Verify webhook events are being received

4. **Set up Custom Domain (Optional)**
   - In Vercel dashboard, go to Domains
   - Add your custom domain
   - Update OAuth redirect URLs accordingly

### Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Your app's URL | Yes |
| `NEXTAUTH_SECRET` | Random secret for JWT signing | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | Yes |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | Yes |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token | Yes |

### Troubleshooting

1. **Database Connection Issues**
   - Verify your `DATABASE_URL` is correct
   - Check if your database allows connections from Vercel IPs
   - Run `npx prisma db push` to ensure schema is up to date

2. **Authentication Issues**
   - Verify OAuth redirect URLs match exactly
   - Check if `NEXTAUTH_URL` is set correctly
   - Ensure `NEXTAUTH_SECRET` is set

3. **API Issues**
   - Check YouTube API key is valid and has proper permissions
   - Verify Stripe keys are correct and webhook is configured
   - Check Vercel function logs for errors

4. **Build Issues**
   - Ensure all dependencies are in `package.json`
   - Check if TypeScript compilation passes
   - Verify environment variables are set correctly

### Monitoring

1. **Vercel Analytics**
   - Monitor performance and usage
   - Check error rates and response times

2. **Database Monitoring**
   - Monitor database performance
   - Set up alerts for connection issues

3. **Stripe Dashboard**
   - Monitor payment processing
   - Check webhook delivery status

### Scaling Considerations

1. **Database**
   - Consider connection pooling for high traffic
   - Set up read replicas if needed

2. **Caching**
   - Implement Redis for session storage
   - Cache frequently accessed data

3. **CDN**
   - Vercel automatically provides global CDN
   - Optimize images and static assets

### Security Checklist

- [ ] All environment variables are properly set
- [ ] OAuth redirect URLs are correctly configured
- [ ] Database connections use SSL
- [ ] Stripe webhook signature verification is enabled
- [ ] API keys are not exposed in client-side code
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
