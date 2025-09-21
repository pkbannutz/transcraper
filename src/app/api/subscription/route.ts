import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { stripe, createCheckoutSession, createCustomer } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (!subscription) {
      return NextResponse.json({ subscription: null })
    }

    // Get subscription details from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    )

    return NextResponse.json({
      subscription: {
        ...subscription,
        stripeSubscription,
      },
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
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

    const { priceId } = await request.json()

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      )
    }

    // Check if user already has a subscription
    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'User already has a subscription' },
        { status: 409 }
      )
    }

    // Create or get Stripe customer
    let customerId: string
    
    const existingCustomer = await stripe.customers.list({
      email: session.user.email!,
      limit: 1,
    })

    if (existingCustomer.data.length > 0) {
      customerId = existingCustomer.data[0].id
    } else {
      const customer = await createCustomer(
        session.user.email!,
        session.user.name || ''
      )
      customerId = customer.id
    }

    // Create checkout session
    const checkoutSession = await createCheckoutSession(
      customerId,
      priceId,
      `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`
    )

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
