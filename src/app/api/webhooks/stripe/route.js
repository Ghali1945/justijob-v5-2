import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

// Configuration pour désactiver le parsing automatique du body
export const config = {
  api: {
    bodyParser: false,
  },
}

// Fonction pour lire le body brut
async function getRawBody(req) {
  const chunks = []
  for await (const chunk of req.body) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export async function POST(request) {
  try {
    const body = await getRawBody(request)
    const signature = headers().get('stripe-signature')

    if (!signature) {
      console.error('❌ Signature Stripe manquante')
      return NextResponse.json(
        { error: 'Signature manquante' },
        { status: 400 }
      )
    }

    // Vérifier la signature du webhook
    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.error('❌ Erreur de signature webhook:', err.message)
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      )
    }

    // Gérer les différents types d'événements
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object

        console.log('✅ Paiement réussi:', {
          sessionId: session.id,
          customer: session.customer_details.email,
          amount: session.amount_total / 100,
        })

        // Extraire les informations
        const customerInfo = {
          sessionId: session.id,
          email: session.customer_details.email,
          name: session.customer_details.name,
          phone: session.customer_details.phone,
          amount: session.amount_total / 100,
          currency: session.currency,
          paymentStatus: session.payment_status,
          customerId: session.customer,
        }

        // Extraire les informations syndicat si présentes
        const syndicatInfo = session.metadata.syndicatId ? {
          syndicatId: session.metadata.syndicatId,
          syndicatName: session.metadata.syndicatName,
          promoCode: session.metadata.promoCode,
          discount: parseInt(session.metadata.discount)
        } : null

        // 🔥 ICI : Enregistrer en base de données
        // TODO: Intégrer Prisma pour sauvegarder dans la BDD
        /*
        await prisma.order.create({
          data: {
            sessionId: customerInfo.sessionId,
            email: customerInfo.email,
            name: customerInfo.name,
            phone: customerInfo.phone,
            amount: customerInfo.amount,
            currency: customerInfo.currency,
            paymentStatus: customerInfo.paymentStatus,
            customerId: customerInfo.customerId,
            syndicatId: syndicatInfo?.syndicatId,
            syndicatName: syndicatInfo?.syndicatName,
            promoCode: syndicatInfo?.promoCode,
            discount: syndicatInfo?.discount,
            status: 'PAID',
            createdAt: new Date()
          }
        })
        */

        // 🔥 ICI : Envoyer email de confirmation
        // TODO: Intégrer service d'email
        /*
        await sendEmail({
          to: customerInfo.email,
          subject: 'Confirmation de paiement JustiJob',
          template: 'payment-confirmation',
          data: {
            name: customerInfo.name,
            amount: customerInfo.amount,
            sessionId: customerInfo.sessionId,
            accessLink: `${process.env.NEXT_PUBLIC_BASE_URL}/questionnaire?session_id=${customerInfo.sessionId}`
          }
        })
        */

        // Log pour le développement
        console.log('📧 Email à envoyer à:', customerInfo.email)
        console.log('💾 Données à sauvegarder:', { customerInfo, syndicatInfo })

        break

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log('💳 PaymentIntent réussi:', paymentIntent.id)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        console.error('❌ Paiement échoué:', failedPayment.id)
        
        // 🔥 ICI : Notifier l'échec
        // TODO: Logger ou envoyer notification
        break

      default:
        console.log(`ℹ️ Événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Erreur webhook:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// Pour Next.js 13+ App Router
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
