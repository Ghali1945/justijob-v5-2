
// src/app/api/generate-dossier/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { referenceId, email, analysisData } = await request.json()
    
    // Simulation de la génération
    const dossier = {
      id: referenceId,
      createdAt: new Date().toISOString(),
      pages: 30,
      sections: [
        'Analyse de la situation',
        'Arguments juridiques',
        'Jurisprudences applicables',
        'Calcul des indemnités',
        'Stratégie recommandée',
        'Documents à préparer',
        'Déroulement de la procédure'
      ],
      estimatedCompensation: {
        min: 15000,
        max: 45000,
        probable: 28000
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Dossier généré et envoyé',
      dossier
    })
    
  } catch (error) {
    console.error('Erreur génération dossier:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération' },
      { status: 500 }
    )
  }
}