export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionTier: 'free' | 'trial' | 'premium';
  trialEndsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transcript {
  id: string;
  userId: string;
  videoId: string;
  title: string;
  content: string;
  language: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId: string;
  };
}

export interface YouTubeVideoInfo {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  duration: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
}

export interface TranscriptSegment {
  start: number;
  duration: number;
  text: string;
}

export interface CreateTranscriptRequest {
  url: string;
}

export interface CreateTranscriptResponse {
  id: string;
  videoId: string;
  title: string;
  status: 'processing' | 'completed' | 'failed';
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    transcriptsPerMonth: number;
    maxTranscriptLength: number;
  };
}
