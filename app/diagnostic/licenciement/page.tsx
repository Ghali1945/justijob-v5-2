'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DiagnosticLicenciement() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showResults, setShowResults] = useState(false)
  
  const [formData, setFormData] = useState({
    // Informations générales
    typeLicenciement: '',
    anciennete: '',
    salaireBrut: '',
    age: '',
    effectifEntreprise: '',
    
    // Procédure
    convocationEntretien: '',
    delaiConvocation: '',
    entretienRealise: '',
    presenceAssistant: '',
    lettreRecue: '',
    delaiLettre: '',
    
    // Motif
    motifInvoque: '',
    motifPrecis: '',
    preuvesFournies: '',
    
    // Contexte
    avertissementsPrecedents: '',
    evaluationsPerformance: '',
    harcelement: '',
    discrimination: '',
    arretMaladie: '',
    
    // Preuves disponibles
    preuvesConvocation: false,
    preuvesEntretien: false,
    preuvesLettreLicenciement: false,
    preuvesContreMotif: false,
    preuvesTemoins: false,
    preuvesEmails: false,
    preuvesEvaluations: false,
    preuvesMedicales: false
  })

  const totalSteps = 5

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateScore = () => {
    let score = 0
    let details = {
      procedure: 0,
      motif: 0,
      preuves: 0,
      contexte: 0
    }

    // 1. VICES DE PROCÉDURE (25 points max)
    // Convocation
    if (formData.convocationEntretien === 'non') {
      details.procedure += 15 // Vice majeur
    } else if (formData.delaiConvocation === 'insuffisant') {
      details.procedure += 7
    } else if (formData.delaiConvocation === 'correct') {
      details.procedure += 2
    }
    
    // Entretien
    if (formData.entretienRealise === 'non') {
      details.procedure += 10 // Vice très grave
    }
    
    // Lettre
    if (formData.lettreRecue === 'non') {
      details.procedure += 15 // Vice majeur
    } else if (formData.delaiLettre === 'insuffisant') {
      details.procedure += 5
    }

    // 2. FAIBLESSE DU MOTIF (35 points max)
    // Type de motif
    if (formData.typeLicenciement === 'faute_grave') {
      // Faute grave = difficile à prouver
      if (formData.preuvesFournies === 'aucune') {
        details.motif += 30
      } else if (formData.preuvesFournies === 'peu') {
        details.motif += 20
      }
    } else if (formData.typeLicenciement === 'personnel') {
      if (formData.motifPrecis === 'non') {
        details.motif += 25
      }
      if (formData.preuvesFournies === 'aucune') {
        details.motif += 10
      }
    } else if (formData.typeLicenciement === 'economique') {
      // Vérifier validité économique
      if (formData.effectifEntreprise === '300+') {
        details.motif += 5 // Moins crédible dans grande entreprise
      }
    }
    
    // Précision du motif
    if (formData.motifPrecis === 'non') {
      details.motif += 10
    }
    
    // Avertissements préalables
    if (formData.avertissementsPrecedents === 'aucun' && 
        (formData.typeLicenciement === 'faute_simple' || formData.typeLicenciement === 'personnel')) {
      details.motif += 10
    }

    // 3. PREUVES DISPONIBLES (25 points max)
    const preuvesList = [
      formData.preuvesConvocation,
      formData.preuvesEntretien,
      formData.preuvesLettreLicenciement,
      formData.preuvesContreMotif,
      formData.preuvesTemoins,
      formData.preuvesEmails,
      formData.preuvesEvaluations,
      formData.preuvesMedicales
    ]
    const nombrePreuves = preuvesList.filter(p => p).length
    
    if (nombrePreuves >= 5) details.preuves = 25
    else if (nombrePreuves === 4) details.preuves = 20
    else if (nombrePreuves === 3) details.preuves = 15
    else if (nombrePreuves === 2) details.preuves = 10
    else if (nombrePreuves === 1) details.preuves = 5

    // 4. CONTEXTE AGGRAVANT (15 points max)
    if (formData.harcelement === 'oui') details.contexte += 8
    if (formData.discrimination === 'oui') details.contexte += 7
    if (formData.arretMaladie === 'recent') details.contexte += 5
    if (formData.evaluationsPerformance === 'positives') details.contexte += 5

    // Limiter chaque catégorie à son max
    details.procedure = Math.min(25, details.procedure)
    details.motif = Math.min(35, details.motif)
    details.preuves = Math.min(25, details.preuves)
    details.contexte = Math.min(15, details.contexte)

    // CALCUL TOTAL
    score = details.procedure + details.motif + details.preuves + details.contexte

    // Calcul des indemnités
    const anciennete = parseFloat(formData.anciennete) || 0
    const salaire = parseFloat(formData.salaireBrut) || 0
    const age = parseInt(formData.age) || 30
    
    let indemnites = {
      legale: 0,
      preavis: 0,
      congesPayes: 0,
      dommagesInterets: 0,
      total: 0
    }

    if (anciennete > 0 && salaire > 0) {
      // Indemnité légale de licenciement
      if (anciennete < 10) {
        indemnites.legale = (salaire / 12) * anciennete * 0.25
      } else {
        indemnites.legale = (salaire / 12) * (10 * 0.25 + (anciennete - 10) * 0.33)
      }

      // Préavis (approximatif)
      if (anciennete < 6/12) {
        indemnites.preavis = 0
      } else if (anciennete < 2) {
        indemnites.preavis = salaire
      } else {
        indemnites.preavis = salaire * 2
      }

      // Congés payés (estimé à 10%)
      indemnites.congesPayes = indemnites.preavis * 0.1

      // Dommages et intérêts (barème Macron simplifié)
      if (score >= 70) {
        // Licenciement sans cause
        if (anciennete >= 10) {
          indemnites.dommagesInterets = salaire * 4 // Moyenne haute
        } else if (anciennete >= 2) {
          indemnites.dommagesInterets = salaire * 3
        } else {
          indemnites.dommagesInterets = salaire * 1.5
        }
      } else if (score >= 50) {
        // Licenciement irrégulier
        if (anciennete >= 2) {
          indemnites.dommagesInterets = salaire * 1.5
        } else {
          indemnites.dommagesInterets = salaire * 0.5
        }
      }

      indemnites.total = indemnites.legale + indemnites.preavis + indemnites.congesPayes + indemnites.dommagesInterets
    }

    return { score: Math.min(100, score), details, indemnites }
  }

  const handleSubmit = () => {
    setShowResults(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const results = showResults ? calculateScore() : null

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold">
                  <span className="text-blue-600">JUSTI</span>
                  <span className="text-gray-900">JOB</span>
                </span>
              </Link>
              <Link href="/diagnostic">
                <button className="text-gray-600 hover:text-blue-600 font-medium">
                  ← Nouveau diagnostic
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Résultats */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Score principal */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-600 to-orange-600 rounded-full mb-6">
              <span className="text-4xl">📋</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Résultats de votre diagnostic
            </h1>
            <p className="text-gray-600 mb-8">
              Analyse de votre licenciement
            </p>

            {/* Score circulaire */}
            <div className="relative inline-flex items-center justify-center w-48 h-48 mb-8">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                <circle
                  cx="96" cy="96" r="88"
                  stroke="url(#gradient2)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(results.score / 100) * 552} 552`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute">
                <div className="text-5xl font-bold text-gray-900">{results.score}</div>
                <div className="text-sm text-gray-600">/100</div>
              </div>
            </div>

            {/* Interprétation */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-2">
                {results.score >= 75 ? '🎯 Licenciement très probablement sans cause réelle et sérieuse !' :
                 results.score >= 50 ? '⚠️ Licenciement irrégulier ou contestable' :
                 results.score >= 30 ? '⚖️ Licenciement à analyser avec un avocat' :
                 '📄 Licenciement apparemment régulier'}
              </h3>
              <p className="text-gray-700 text-sm">
                {results.score >= 75 ? 'Votre licenciement présente des vices importants. Vous avez d\'excellentes chances de succès aux prud\'hommes.' :
                 results.score >= 50 ? 'Votre licenciement comporte des irrégularités. Une action aux prud\'hommes peut être envisagée.' :
                 results.score >= 30 ? 'Votre situation nécessite une analyse approfondie par un avocat spécialisé.' :
                 'Votre licenciement semble respecter les procédures. Les chances de contestation sont limitées.'}
              </p>
            </div>

            {/* Indemnités estimées */}
            {results.indemnites.total > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="text-sm text-green-800 font-medium mb-4">
                  💰 Indemnités estimées
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="text-left">
                    <div className="text-gray-600">Indemnité légale</div>
                    <div className="font-bold text-gray-900">{Math.round(results.indemnites.legale).toLocaleString()} €</div>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-600">Préavis</div>
                    <div className="font-bold text-gray-900">{Math.round(results.indemnites.preavis).toLocaleString()} €</div>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-600">Congés payés</div>
                    <div className="font-bold text-gray-900">{Math.round(results.indemnites.congesPayes).toLocaleString()} €</div>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-600">Dommages & intérêts</div>
                    <div className="font-bold text-green-700">{Math.round(results.indemnites.dommagesInterets).toLocaleString()} €</div>
                  </div>
                </div>
                <div className="border-t border-green-300 pt-3">
                  <div className="text-sm text-green-800 mb-1">Total récupérable</div>
                  <div className="text-3xl font-bold text-green-900">
                    {Math.round(results.indemnites.total).toLocaleString()} €
                  </div>
                  <p className="text-xs text-green-700 mt-2">
                    Estimation basée sur le barème légal (montant indicatif)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Détails du score */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Détail de l'analyse juridique
            </h2>

            <div className="space-y-4">
              {/* Procédure */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">⚖️ Vices de procédure</span>
                  <span className="font-bold text-red-600">{results.details.procedure}/25</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all"
                    style={{ width: `${(results.details.procedure / 25) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {results.details.procedure >= 20 ? 'Vices majeurs de procédure identifiés' :
                   results.details.procedure >= 10 ? 'Irrégularités de procédure' :
                   results.details.procedure > 0 ? 'Procédure globalement respectée' :
                   'Procédure conforme'}
                </p>
              </div>

              {/* Motif */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">📄 Faiblesse du motif</span>
                  <span className="font-bold text-orange-600">{results.details.motif}/35</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all"
                    style={{ width: `${(results.details.motif / 35) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {results.details.motif >= 25 ? 'Motif très contestable' :
                   results.details.motif >= 15 ? 'Motif insuffisamment étayé' :
                   'Motif apparemment valable'}
                </p>
              </div>

              {/* Preuves */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">📁 Vos preuves</span>
                  <span className="font-bold text-blue-600">{results.details.preuves}/25</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${(results.details.preuves / 25) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {results.details.preuves >= 20 ? 'Excellent dossier de preuves' :
                   results.details.preuves >= 10 ? 'Preuves suffisantes' :
                   'Manque de preuves documentaires'}
                </p>
              </div>

              {/* Contexte */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">🎯 Éléments aggravants</span>
                  <span className="font-bold text-purple-600">{results.details.contexte}/15</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${(results.details.contexte / 15) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {results.details.contexte >= 10 ? 'Contexte très favorable à votre dossier' :
                   results.details.contexte >= 5 ? 'Quelques éléments favorables' :
                   'Contexte neutre'}
                </p>
              </div>
            </div>
          </div>

          {/* Recommandations */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📋 Recommandations personnalisées
            </h2>

            <div className="space-y-4">
              {/* Urgence */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-bold text-red-900 mb-2">
                  ⏰ Délai de recours : 12 MOIS
                </h3>
                <p className="text-sm text-red-800">
                  Vous avez 12 mois à compter de la notification de votre licenciement pour saisir
                  le conseil de prud'hommes. Ne tardez pas !
                </p>
              </div>

              {/* Actions prioritaires */}
              {results.score >= 50 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-bold text-green-900 mb-2">
                    ✅ Actions prioritaires
                  </h3>
                  <ul className="space-y-1 text-sm text-green-800">
                    <li>• Consultez un avocat spécialisé en droit du travail</li>
                    <li>• Rassemblez tous vos documents (convocation, lettre, contrat)</li>
                    <li>• Sollicitez des attestations de vos collègues</li>
                    <li>• Envisagez une saisine du conseil de prud'hommes</li>
                  </ul>
                </div>
              )}

              {/* Preuves manquantes */}
              {results.details.preuves < 15 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-bold text-yellow-900 mb-2">
                    ⚠️ Renforcez votre dossier
                  </h3>
                  <ul className="space-y-1 text-sm text-yellow-800">
                    {!formData.preuvesLettreLicenciement && <li>• Récupérez la lettre de licenciement</li>}
                    {!formData.preuvesEvaluations && <li>• Obtenez vos évaluations professionnelles</li>}
                    {!formData.preuvesTemoins && <li>• Sollicitez des témoignages de collègues</li>}
                    {!formData.preuvesContreMotif && <li>• Rassemblez les preuves contredisant le motif</li>}
                  </ul>
                </div>
              )}

              {/* Conseil juridique */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">
                  💡 Conseil juridique
                </h3>
                <p className="text-sm text-blue-800">
                  {results.score >= 75 ? 
                    'Votre dossier présente de sérieux vices. Une consultation avec un avocat est fortement recommandée pour évaluer précisément vos chances et les montants réclamables.' :
                   results.score >= 50 ?
                    'Votre situation mérite une analyse approfondie. Un avocat pourra vous conseiller sur l\'opportunité d\'engager une action.' :
                    'Même si votre licenciement semble régulier, une consultation juridique peut être utile pour vérifier tous les aspects.'}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Premium */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl shadow-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              🚀 Obtenez votre dossier juridique complet
            </h2>
            <p className="text-red-100 mb-6">
              Analyse détaillée avec jurisprudence applicable, stratégie prud'homale
              personnalisée, et calcul précis des indemnités
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">120€</div>
                <div className="text-sm text-red-100">Grand public</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">60€</div>
                <div className="text-sm text-red-100">Membres syndicats</div>
              </div>
            </div>

            <button className="bg-white text-red-600 font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all">
              🎯 Commander mon dossier
            </button>
          </div>

          {/* Boutons d'action */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => window.print()}
              className="bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              🖨️ Imprimer les résultats
            </button>
            <Link href="/contact">
              <button className="bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
                💬 Contacter un expert
              </button>
            </Link>
            <button
              onClick={() => {
                setShowResults(false)
                setCurrentStep(1)
              }}
              className="bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              🔄 Refaire le diagnostic
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                <span className="text-blue-600">JUSTI</span>
                <span className="text-gray-900">JOB</span>
              </span>
            </Link>
            <Link href="/diagnostic">
              <button className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-2">
                <span>←</span>
                <span>Retour</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold
                  ${step === currentStep ? 'bg-red-600 text-white' :
                    step < currentStep ? 'bg-green-600 text-white' :
                    'bg-gray-200 text-gray-600'}`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-orange-600 transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-600 text-center">
            Étape {currentStep} sur {totalSteps}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Titre de l'étape */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <span className="text-3xl">
                {currentStep === 1 ? '📋' :
                 currentStep === 2 ? '⚖️' :
                 currentStep === 3 ? '📄' :
                 currentStep === 4 ? '🎯' :
                 '📁'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStep === 1 && 'Informations générales'}
              {currentStep === 2 && 'Procédure de licenciement'}
              {currentStep === 3 && 'Motif invoqué'}
              {currentStep === 4 && 'Contexte et circonstances'}
              {currentStep === 5 && 'Preuves disponibles'}
            </h2>
            <p className="text-gray-600">
              {currentStep === 1 && 'Commençons par les informations essentielles'}
              {currentStep === 2 && 'Analysons le respect de la procédure légale'}
              {currentStep === 3 && 'Examinons le motif de votre licenciement'}
              {currentStep === 4 && 'Évaluons le contexte de votre situation'}
              {currentStep === 5 && 'Identifions vos documents et preuves'}
            </p>
          </div>

          {/* Questions - Étape 1 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de licenciement *
                </label>
                <select
                  value={formData.typeLicenciement}
                  onChange={(e) => handleChange('typeLicenciement', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Sélectionnez</option>
                  <option value="faute_grave">Licenciement pour faute grave</option>
                  <option value="faute_simple">Licenciement pour faute simple</option>
                  <option value="personnel">Licenciement pour motif personnel (non disciplinaire)</option>
                  <option value="economique">Licenciement économique</option>
                  <option value="inaptitude">Licenciement pour inaptitude</option>
                  <option value="ne_sais_pas">Je ne sais pas / Non précisé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ancienneté dans l'entreprise (en années) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.anciennete}
                  onChange={(e) => handleChange('anciennete', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Ex: 3.5"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  L'ancienneté impacte le montant des indemnités
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salaire mensuel brut (€) *
                </label>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={formData.salaireBrut}
                  onChange={(e) => handleChange('salaireBrut', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Ex: 2500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre âge
                </label>
                <input
                  type="number"
                  min="18"
                  max="70"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Ex: 35"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Effectif de l'entreprise *
                </label>
                <select
                  value={formData.effectifEntreprise}
                  onChange={(e) => handleChange('effectifEntreprise', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Sélectionnez</option>
                  <option value="1-10">Moins de 11 salariés</option>
                  <option value="11-50">11 à 50 salariés</option>
                  <option value="51-300">51 à 300 salariés</option>
                  <option value="300+">Plus de 300 salariés</option>
                </select>
              </div>
            </div>
          )}

          {/* Questions - Étape 2 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avez-vous reçu une convocation à un entretien préalable ? *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="convocationEntretien"
                      value="oui"
                      checked={formData.convocationEntretien === 'oui'}
                      onChange={(e) => handleChange('convocationEntretien', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="convocationEntretien"
                      value="non"
                      checked={formData.convocationEntretien === 'non'}
                      onChange={(e) => handleChange('convocationEntretien', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Non</p>
                      <p className="text-sm text-red-600">⚠️ Vice de procédure grave</p>
                    </div>
                  </label>
                </div>
              </div>

              {formData.convocationEntretien === 'oui' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Délai entre la convocation et l'entretien *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="delaiConvocation"
                          value="correct"
                          checked={formData.delaiConvocation === 'correct'}
                          onChange={(e) => handleChange('delaiConvocation', e.target.value)}
                        />
                        <div>
                          <p className="font-medium">5 jours ouvrables ou plus</p>
                          <p className="text-sm text-gray-600">Délai légal respecté</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="delaiConvocation"
                          value="insuffisant"
                          checked={formData.delaiConvocation === 'insuffisant'}
                          onChange={(e) => handleChange('delaiConvocation', e.target.value)}
                        />
                        <div>
                          <p className="font-medium">Moins de 5 jours ouvrables</p>
                          <p className="text-sm text-orange-600">⚠️ Irrégularité</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      L'entretien préalable a-t-il bien eu lieu ? *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="entretienRealise"
                          value="oui"
                          checked={formData.entretienRealise === 'oui'}
                          onChange={(e) => handleChange('entretienRealise', e.target.value)}
                        />
                        <div>
                          <p className="font-medium">Oui, j'ai assisté à l'entretien</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="entretienRealise"
                          value="non"
                          checked={formData.entretienRealise === 'non'}
                          onChange={(e) => handleChange('entretienRealise', e.target.value)}
                        />
                        <div>
                          <p className="font-medium">Non, pas d'entretien</p>
                          <p className="text-sm text-red-600">⚠️ Vice très grave</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avez-vous reçu la lettre de licenciement ? *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="lettreRecue"
                      value="oui"
                      checked={formData.lettreRecue === 'oui'}
                      onChange={(e) => handleChange('lettreRecue', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="lettreRecue"
                      value="non"
                      checked={formData.lettreRecue === 'non'}
                      onChange={(e) => handleChange('lettreRecue', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Non</p>
                      <p className="text-sm text-red-600">⚠️ Vice majeur</p>
                    </div>
                  </label>
                </div>
              </div>

              {formData.lettreRecue === 'oui' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Délai entre l'entretien et la lettre de licenciement *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="delaiLettre"
                        value="correct"
                        checked={formData.delaiLettre === 'correct'}
                        onChange={(e) => handleChange('delaiLettre', e.target.value)}
                      />
                      <div>
                        <p className="font-medium">2 jours ouvrables ou plus</p>
                        <p className="text-sm text-gray-600">Délai respecté</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="delaiLettre"
                        value="insuffisant"
                        checked={formData.delaiLettre === 'insuffisant'}
                        onChange={(e) => handleChange('delaiLettre', e.target.value)}
                      />
                      <div>
                        <p className="font-medium">Moins de 2 jours ouvrables</p>
                        <p className="text-sm text-orange-600">⚠️ Irrégularité</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Questions - Étape 3 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quel motif a été invoqué dans la lettre de licenciement ? *
                </label>
                <textarea
                  value={formData.motifInvoque}
                  onChange={(e) => handleChange('motifInvoque', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  rows="4"
                  placeholder="Copiez exactement le motif mentionné dans la lettre..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Le motif exact est crucial pour l'analyse
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Le motif est-il précis et circonstancié ? *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="motifPrecis"
                      value="oui"
                      checked={formData.motifPrecis === 'oui'}
                      onChange={(e) => handleChange('motifPrecis', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, avec dates, faits précis</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="motifPrecis"
                      value="non"
                      checked={formData.motifPrecis === 'non'}
                      onChange={(e) => handleChange('motifPrecis', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Non, motif vague ou général</p>
                      <p className="text-sm text-orange-600">⚠️ Faiblesse du motif</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  L'employeur a-t-il fourni des preuves du motif invoqué ? *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="preuvesFournies"
                      value="nombreuses"
                      checked={formData.preuvesFournies === 'nombreuses'}
                      onChange={(e) => handleChange('preuvesFournies', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, preuves nombreuses et objectives</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="preuvesFournies"
                      value="peu"
                      checked={formData.preuvesFournies === 'peu'}
                      onChange={(e) => handleChange('preuvesFournies', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Peu de preuves ou preuves faibles</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="preuvesFournies"
                      value="aucune"
                      checked={formData.preuvesFournies === 'aucune'}
                      onChange={(e) => handleChange('preuvesFournies', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Aucune preuve fournie</p>
                      <p className="text-sm text-green-600">✓ Favorable pour votre dossier</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aviez-vous reçu des avertissements avant ce licenciement ?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="avertissementsPrecedents"
                      value="oui_plusieurs"
                      checked={formData.avertissementsPrecedents === 'oui_plusieurs'}
                      onChange={(e) => handleChange('avertissementsPrecedents', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, plusieurs avertissements</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="avertissementsPrecedents"
                      value="oui_un"
                      checked={formData.avertissementsPrecedents === 'oui_un'}
                      onChange={(e) => handleChange('avertissementsPrecedents', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, un seul avertissement</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="avertissementsPrecedents"
                      value="aucun"
                      checked={formData.avertissementsPrecedents === 'aucun'}
                      onChange={(e) => handleChange('avertissementsPrecedents', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Aucun avertissement</p>
                      <p className="text-sm text-green-600">✓ Licenciement brutal</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Questions - Étape 4 */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vos évaluations professionnelles étaient-elles positives ?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="evaluationsPerformance"
                      value="positives"
                      checked={formData.evaluationsPerformance === 'positives'}
                      onChange={(e) => handleChange('evaluationsPerformance', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, toujours positives</p>
                      <p className="text-sm text-green-600">✓ Contredit le motif</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="evaluationsPerformance"
                      value="mixtes"
                      checked={formData.evaluationsPerformance === 'mixtes'}
                      onChange={(e) => handleChange('evaluationsPerformance', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Mitigées</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="evaluationsPerformance"
                      value="negatives"
                      checked={formData.evaluationsPerformance === 'negatives'}
                      onChange={(e) => handleChange('evaluationsPerformance', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Négatives</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="evaluationsPerformance"
                      value="aucune"
                      checked={formData.evaluationsPerformance === 'aucune'}
                      onChange={(e) => handleChange('evaluationsPerformance', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Pas d'évaluations</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avez-vous subi du harcèlement (moral ou sexuel) ?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="harcelement"
                      value="oui"
                      checked={formData.harcelement === 'oui'}
                      onChange={(e) => handleChange('harcelement', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui</p>
                      <p className="text-sm text-red-600">⚠️ Licenciement potentiellement nul</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="harcelement"
                      value="non"
                      checked={formData.harcelement === 'non'}
                      onChange={(e) => handleChange('harcelement', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Non</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pensez-vous avoir été victime de discrimination ?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="discrimination"
                      value="oui"
                      checked={formData.discrimination === 'oui'}
                      onChange={(e) => handleChange('discrimination', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui (âge, sexe, origine, état de santé...)</p>
                      <p className="text-sm text-red-600">⚠️ Licenciement potentiellement nul</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="discrimination"
                      value="non"
                      checked={formData.discrimination === 'non'}
                      onChange={(e) => handleChange('discrimination', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Non</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Étiez-vous en arrêt maladie récemment ?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="arretMaladie"
                      value="recent"
                      checked={formData.arretMaladie === 'recent'}
                      onChange={(e) => handleChange('arretMaladie', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, dans les 3 derniers mois</p>
                      <p className="text-sm text-orange-600">⚠️ Peut être un lien</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="arretMaladie"
                      value="ancien"
                      checked={formData.arretMaladie === 'ancien'}
                      onChange={(e) => handleChange('arretMaladie', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, mais il y a longtemps</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="arretMaladie"
                      value="non"
                      checked={formData.arretMaladie === 'non'}
                      onChange={(e) => handleChange('arretMaladie', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Non</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Questions - Étape 5 */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  💡 <strong>Important :</strong> Les documents officiels sont essentiels.
                  Cochez tous les éléments que vous possédez.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.preuvesConvocation}
                    onChange={(e) => handleChange('preuvesConvocation', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Lettre de convocation à l'entretien</p>
                    <p className="text-sm text-gray-600">Recommandé avec AR</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.preuvesEntretien}
                    onChange={(e) => handleChange('preuvesEntretien', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Compte-rendu de l'entretien</p>
                    <p className="text-sm text-gray-600">Notes prises pendant l'entretien</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.preuvesLettreLicenciement}
                    onChange={(e) => handleChange('preuvesLettreLicenciement', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Lettre de licenciement</p>
                    <p className="text-sm text-gray-600">Recommandé avec AR</p>
                    <span className="inline-block mt-1 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                      ⭐ Document essentiel
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.preuvesContreMotif}
                    onChange={(e) => handleChange('preuvesContreMotif', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Preuves contredisant le motif</p>
                    <p className="text-sm text-gray-600">Documents prouvant que le motif est faux</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.preuvesTemoins}
                    onChange={(e) => handleChange('preuvesTemoins', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Témoignages de collègues</p>
                    <p className="text-sm text-gray-600">Attestations écrites et signées</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.preuvesEmails}
                    onChange={(e) => handleChange('preuvesEmails', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Emails et correspondances</p>
                    <p className="text-sm text-gray-600">Échanges avec l'employeur</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.preuvesEvaluations}
                    onChange={(e) => handleChange('preuvesEvaluations', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Évaluations professionnelles</p>
                    <p className="text-sm text-gray-600">Entretiens annuels positifs</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.preuvesMedicales}
                    onChange={(e) => handleChange('preuvesMedicales', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Certificats médicaux</p>
                    <p className="text-sm text-gray-600">Si lien avec harcèlement/discrimination</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center pt-6 border-t">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
              >
                <span>←</span>
                <span>Retour</span>
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all flex items-center gap-2"
              >
                <span>Suivant</span>
                <span>→</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-xl transition-all flex items-center gap-2"
              >
                <span>✓</span>
                <span>Voir mes résultats</span>
              </button>
            )}
          </div>

          {/* Info sécurité */}
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>Données sécurisées</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>100% gratuit</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span>Résultats immédiats</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
