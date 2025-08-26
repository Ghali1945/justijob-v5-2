
// src/app/api/diagnostic/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const data = await request.json()
    
    // Calcul du score basé sur les réponses
    let score = 0
    
    // Logique de scoring
    if (data.typeContrat === 'CDI') score += 15
    else if (data.typeContrat === 'CDD') score += 10
    
    if (data.anciennete === 'Plus de 5 ans') score += 20
    else if (data.anciennete === '2 à 5 ans') score += 15
    else if (data.anciennete === '6 mois à 2 ans') score += 10
    
    if (data.procedureRespecte === 'Non') score += 25
    else if (data.procedureRespecte === 'Partiellement') score += 15
    
    if (data.preuves === 'Oui, nombreuses') score += 20
    else if (data.preuves === 'Quelques-unes') score += 10
    
    if (data.impactFinancier === 'Plus de 30000€') score += 15
    else if (data.impactFinancier === '15000€ à 30000€') score += 10
    
    if (data.impactPsychologique === 'Oui, documenté médicalement') score += 15
    
    if (data.temoins === 'Oui, plusieurs') score += 10
    
    // Analyse détaillée
    const analysis = {
      score,
      level: score >= 80 ? 'Excellent' : score >= 60 ? 'Bon' : score >= 40 ? 'Moyen' : 'À renforcer',
      strengths: [],
      weaknesses: [],
      recommendations: []
    }
    
    // Points forts
    if (data.procedureRespecte === 'Non') {
      analysis.strengths.push('Procédure non respectée par l\'employeur')
    }
    if (data.preuves === 'Oui, nombreuses') {
      analysis.strengths.push('Preuves documentées nombreuses')
    }
    if (data.anciennete === 'Plus de 5 ans' || data.anciennete === '2 à 5 ans') {
      analysis.strengths.push('Ancienneté significative')
    }
    
    // Points faibles
    if (data.preuves === 'Aucune' || data.preuves === 'Très peu') {
      analysis.weaknesses.push('Manque de preuves documentées')
    }
    if (data.temoins === 'Non') {
      analysis.weaknesses.push('Absence de témoins')
    }
    
    // Recommandations
    if (score >= 60) {
      analysis.recommendations.push('Constituer un dossier complet pour les Prud\'hommes')
    }
    if (data.conseilJuridique === 'Non') {
      analysis.recommendations.push('Consulter notre service d\'analyse approfondie')
    }
    
    return NextResponse.json(analysis)
    
  } catch (error) {
    console.error('Erreur diagnostic:', error)
    return NextResponse.json(
      { error: 'Erreur lors du diagnostic' },
      { status: 500 }
    )
  }
}