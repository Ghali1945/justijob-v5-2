
// src/app/api/create-checkout-session/route.js
import { NextResponse } from 'next/server';

// ⚠️ IMPORTANT : Installer Stripe avec : npm install stripe
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, serviceType, paymentMethod, amount, diagnosticData, metadata } = body;
    
    // Validation des données
    if (!email || !name || !amount) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }
    
    // Configuration Stripe (à décommenter quand Stripe est installé)
    /*
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    // Créer ou récupérer le client
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    });
    
    let customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: email,
        name: name,
        metadata: {
          service: serviceType,
          diagnosticData: JSON.stringify(diagnosticData || {})
        }
      });
    }
    
    // Configuration du produit
    const lineItems = [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: serviceType === 'syndical' ? 'Dossier Prud\'homal - Tarif Syndical' : 'Dossier Prud\'homal Complet',
          description: serviceType === 'syndical' 
            ? 'Dossier complet avec tarif réduit syndical'
            : 'Dossier personnalisé prêt à déposer au conseil de prud\'hommes',
          images: ['https://justijob.fr/logo.png'], // Remplacer par votre logo
        },
        unit_amount: amount * 100, // Stripe utilise les centimes
      },
      quantity: 1,
    }];
    
    // Configuration de la session de paiement
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: paymentMethod === 'twice' ? 'subscription' : 'payment',
      customer: customer.id,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/paiement/annule`,
      metadata: {
        ...metadata,
        paymentMethod: paymentMethod,
        serviceType: serviceType
      },
      locale: 'fr',
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    };
    
    // Si paiement en 2 fois, configurer la souscription
    if (paymentMethod === 'twice' && serviceType === 'dossier-complet') {
      // Créer un plan de paiement en 2 fois
      const product = await stripe.products.create({
        name: 'Dossier Prud\'homal - Paiement en 2 fois',
      });
      
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: 4500, // 60€ en centimes
        currency: 'eur',
        recurring: {
          interval: 'month',
          interval_count: 1,
        },
      });
      
      sessionConfig.line_items = [{
        price: price.id,
        quantity: 1,
      }];
      sessionConfig.subscription_data = {
        metadata: metadata,
        trial_period_days: 0,
        invoice_settings: {
          days_until_due: 30,
        },
      };
    }
    
    // Créer la session Stripe
    const session = await stripe.checkout.sessions.create(sessionConfig);
    
    // Sauvegarder la session en base de données (à implémenter)
    // await savePaymentSession(session.id, email, serviceType, amount);
    
    return NextResponse.json({ url: session.url });
    */
    
    // VERSION DE TEST (à supprimer en production)
    // Simuler une URL de paiement pour le développement
    const testUrl = `/paiement/succes?test=true&email=${email}&amount=${amount}`;
    
    return NextResponse.json({ 
      url: testUrl,
      message: 'Mode test - Stripe non configuré' 
    });
    
  } catch (error) {
    console.error('Erreur création session:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}

// Webhook pour gérer les événements Stripe (paiement confirmé, échec, etc.)
export async function PUT(request) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');
    
    // Configuration du webhook (à décommenter)
    /*
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    
    // Gérer les différents événements
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Marquer le paiement comme complété
        await handlePaymentSuccess(session);
        
        // Envoyer l'email avec le dossier
        await sendDossierEmail(session.customer_email, session.metadata);
        
        break;
        
      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object;
        
        // Gérer l'échec du paiement
        await handlePaymentFailure(paymentIntent);
        
        break;
        
      case 'customer.subscription.created':
        // Gérer la création d'abonnement (paiement en 2 fois)
        const subscription = event.data.object;
        await handleSubscriptionCreated(subscription);
        
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    */
    
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Fonctions helper (à implémenter selon vos besoins)
async function handlePaymentSuccess(session) {
  // Logique après paiement réussi
  console.log('Paiement réussi:', session.id);
  
  // TODO: 
  // - Mettre à jour la base de données
  // - Générer le dossier prud'homal
  // - Préparer l'envoi par email
}

async function sendDossierEmail(email, metadata) {
  // Envoyer le dossier par email
  console.log('Envoi du dossier à:', email);
  
  // TODO:
  // - Générer le PDF du dossier
  // - Envoyer l'email avec pièce jointe
  // - Utiliser un service comme SendGrid ou Resend
}

async function handlePaymentFailure(paymentIntent) {
  // Gérer l'échec du paiement
  console.log('Paiement échoué:', paymentIntent.id);
  
  // TODO:
  // - Notifier l'utilisateur
  // - Logger l'erreur
}

async function handleSubscriptionCreated(subscription) {
  // Gérer la souscription (paiement en 2 fois)
  console.log('Souscription créée:', subscription.id);
  
  // TODO:
  // - Planifier le second paiement
  // - Envoyer la confirmation
}