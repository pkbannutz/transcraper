import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export const subscriptionTiers = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'eur',
    interval: 'month' as const,
    features: [
      '10 transcripts per month',
      'Basic search functionality',
      'TXT export format',
    ],
    limits: {
      transcriptsPerMonth: 10,
      maxTranscriptLength: 10000,
    },
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 865, // €8.65 in cents
    currency: 'eur',
    interval: 'month' as const,
    features: [
      'Unlimited transcripts',
      'Advanced search and filtering',
      'All export formats (TXT, SRT, VTT, JSON)',
      'Batch processing',
      'API access',
      'Priority support',
    ],
    limits: {
      transcriptsPerMonth: -1, // Unlimited
      maxTranscriptLength: -1, // Unlimited
    },
  },
}

export const createCheckoutSession = async (
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) => {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
  })
}

export const createCustomer = async (email: string, name: string) => {
  return await stripe.customers.create({
    email,
    name,
  })
}

export const getSubscription = async (subscriptionId: string) => {
  return await stripe.subscriptions.retrieve(subscriptionId)
}

export const cancelSubscription = async (subscriptionId: string) => {
  return await stripe.subscriptions.cancel(subscriptionId)
}
