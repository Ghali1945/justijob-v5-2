import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import syndicatsData from '@/data/syndicats-partners.json'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export async function POST(request) {
  try {
    const { customerInfo, syndicatId, promoCode, price } = await request.json()

    // Validation des données
    if (!customerInfo || !customerInfo.email) {
      return NextResponse.json(
        { error: 'Informations client manquantes' },
        { status: 400 }
      )
    }

    // Validation du prix et du syndicat si applicable
    let finalPrice = 120 // Prix de base en euros
    let syndicatInfo = null

    if (syndicatId && promoCode) {
      // Trouver le syndicat
      const syndicat = syndicatsData.syndicats.find(s => s.id === syndicatId)
      
      if (!syndicat) {
        return NextResponse.json(
          { error: 'Syndicat invalide' },
          { status: 400 }
        )
      }

      // Valider le code promo
      const codeUpperCase = promoCode.toUpperCase().trim()
      const isValidCode = syndicat.promoCodes.some(
        validCode => validCode.toUpperCase() === codeUpperCase
      )

      if (!isValidCode) {
        return NextResponse.json(
          { error: 'Code promo invalide' },
          { status: 400 }
        )
      }

      // Appliquer la réduction
      finalPrice = syndicat.priceDiscounted
      syndicatInfo = {
        syndicatId: syndicat.id,
        syndicatName: syndicat.name,
        promoCode: promoCode,
        discount: syndicat.discount
      }
    }

    // Vérifier que le prix envoyé correspond au prix calculé
    if (price !== finalPrice) {
      return NextResponse.json(
        { error: 'Prix invalide' },
        { status: 400 }
      )
    }

    // Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Analyse Premium JustiJob',
              description: syndicatInfo 
                ? `Tarif préférentiel ${syndicatInfo.syndicatName} - Analyse juridique complète par IA`
                : 'Analyse juridique complète par IA',
              images: ['https://votre-domaine.com/images/justijob-logo.png'],
            },
            unit_amount: finalPrice * 100, // Stripe utilise les centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/paiement/annule`,
      customer_email: customerInfo.email,
      metadata: {
        customerName: `${customerInfo.prenom} ${customerInfo.nom}`,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.telephone || '',
        ...(syndicatInfo && {
          syndicatId: syndicatInfo.syndicatId,
          syndicatName: syndicatInfo.syndicatName,
          promoCode: syndicatInfo.promoCode,
          discount: syndicatInfo.discount.toString()
        })
      },
      billing_address_collection: 'auto',
      phone_number_collection: {
        enabled: true,
      },
      customer_creation: 'always',
      locale: 'fr',
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error('Erreur création session Stripe:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    )
  }
}
