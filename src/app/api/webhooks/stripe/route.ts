import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          ) as Stripe.Subscription

          // Find user by email
          const user = await prisma.user.findUnique({
            where: {
              email: session.customer_email!,
            },
          })

          if (!user) {
            console.error('User not found for subscription:', session.customer_email)
            break
          }

          // Create subscription record
          await prisma.subscription.create({
            data: {
              userId: user.id,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: subscription.id,
              status: subscription.status,
              currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            },
          })

          // Update user subscription tier
          await prisma.user.update({
            where: { id: user.id },
            data: { subscriptionTier: 'premium' },
          })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            status: subscription.status,
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          },
        })

        // Update user subscription tier based on status
        const user = await prisma.user.findFirst({
          where: {
            subscription: {
              stripeSubscriptionId: subscription.id,
            },
          },
        })

        if (user) {
          const subscriptionTier = subscription.status === 'active' ? 'premium' : 'free'
          await prisma.user.update({
            where: { id: user.id },
            data: { subscriptionTier },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            status: 'canceled',
          },
        })

        // Update user subscription tier
        const user = await prisma.user.findFirst({
          where: {
            subscription: {
              stripeSubscriptionId: subscription.id,
            },
          },
        })

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { subscriptionTier: 'free' },
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
