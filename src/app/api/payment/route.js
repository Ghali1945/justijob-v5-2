
// src/app/api/payment/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { amount, email, syndicatCode } = await request.json()
    
    // Validation du code syndicat
    let finalAmount = amount
    if (syndicatCode) {
      // Vérifier le code dans la base de données
      const validCodes = ['CFDT2025', 'CGT2025', 'FO2025'] // Exemple
      
      if (validCodes.includes(syndicatCode)) {
        finalAmount = 45 // Tarif réduit
      }
    }
    
    // Simulation pour les tests
    return NextResponse.json({
      success: true,
      paymentId: `PAY-${Date.now()}`,
      amount: finalAmount,
      message: 'Paiement simulé avec succès'
    })
    
  } catch (error) {
    console.error('Erreur paiement:', error)
    return NextResponse.json(
      { error: 'Erreur lors du paiement' },
      { status: 500 }
    )
  }
}