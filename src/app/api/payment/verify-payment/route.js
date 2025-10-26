import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { 
          verified: false,
          error: 'Session ID manquant' 
        },
        { status: 400 }
      )
    }

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'payment_intent']
    })

    // Vérifier que le paiement a été effectué
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { 
          verified: false,
          error: 'Paiement non confirmé',
          status: session.payment_status
        },
        { status: 400 }
      )
    }

    // Extraire les infos syndicat si applicable
    const syndicatInfo = session.metadata.syndicatId ? {
      syndicatId: session.metadata.syndicatId,
      syndicatName: session.metadata.syndicatName,
      promoCode: session.metadata.promoCode,
      discount: parseInt(session.metadata.discount) || 0
    } : null

    // Retourner les infos de la session
    return NextResponse.json({
      verified: true,
      sessionId: session.id,
      amount: session.amount_total / 100,
      currency: session.currency.toUpperCase(),
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      customerPhone: session.customer_details?.phone,
      syndicatInfo,
      paymentDate: new Date(session.created * 1000).toISOString(),
      paymentIntent: session.payment_intent
    })

  } catch (error) {
    console.error('Erreur vérification session:', error)
    
    // Erreur spécifique si session non trouvée
    if (error.code === 'resource_missing') {
      return NextResponse.json(
        { 
          verified: false,
          error: 'Session de paiement non trouvée' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        verified: false,
        error: 'Erreur lors de la vérification du paiement' 
      },
      { status: 500 }
    )
  }
}
