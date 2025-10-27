'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DiagnosticSalaireImpaye() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showResults, setShowResults] = useState(false)
  
  const [formData, setFormData] = useState({
    // Informations générales
    typeContrat: '',
    anciennete: '',
    salaireBrut: '',
    dernierJourTravaille: '',
    toujoursSalarie: '',
    
    // Détails du non-paiement
    moisImpaye: '',
    elementsImpaye: [],
    montantTotal: '',
    datePaiementPrevue: '',
    delaiRetard: '',
    
    // Contexte
    raisonEmployeur: '',
    situationEntreprise: '',
    autresSalariesConcernes: '',
    
    // Preuves
    preuvesContrat: false,
    preuvesBulletins: false,
    preuvesEmails: false,
    preuvesRelevesBancaires: false,
    preuvesMiseEnDemeure: false,
    preuvesTemoins: false,
    preuvesJustificatifsPresence: false,
    
    // Réclamations
    reclamationFaite: '',
    reponseEmployeur: '',
    ruptureContrat: '',
    conseilPrudhommes: ''
  })

  const totalSteps = 5

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleElement = (element) => {
    const current = formData.elementsImpaye || []
    if (current.includes(element)) {
      setFormData(prev => ({
        ...prev,
        elementsImpaye: current.filter(e => e !== element)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        elementsImpaye: [...current, element]
      }))
    }
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
      preuves: 0,
      montantAnciennete: 0,
      gravite: 0,
      contexte: 0
    }

    // 1. PREUVES DOCUMENTAIRES (35 points max)
    const preuvesList = [
      formData.preuvesContrat,
      formData.preuvesBulletins,
      formData.preuvesEmails,
      formData.preuvesRelevesBancaires,
      formData.preuvesMiseEnDemeure,
      formData.preuvesTemoins,
      formData.preuvesJustificatifsPresence
    ]
    const nombrePreuves = preuvesList.filter(p => p).length
    
    if (nombrePreuves >= 5) details.preuves = 35
    else if (nombrePreuves === 4) details.preuves = 28
    else if (nombrePreuves === 3) details.preuves = 21
    else if (nombrePreuves === 2) details.preuves = 14
    else if (nombrePreuves === 1) details.preuves = 7

    // Bonus pour preuves critiques
    if (formData.preuvesContrat) details.preuves = Math.min(35, details.preuves + 3)
    if (formData.preuvesBulletins) details.preuves = Math.min(35, details.preuves + 3)
    if (formData.preuvesMiseEnDemeure) details.preuves = Math.min(35, details.preuves + 4)

    // 2. MONTANT ET ANCIENNETÉ (25 points max)
    const anciennete = parseFloat(formData.anciennete) || 0
    const montantTotal = parseFloat(formData.montantTotal) || 0
    
    // Ancienneté
    if (anciennete >= 2) details.montantAnciennete += 10
    else if (anciennete >= 1) details.montantAnciennete += 7
    else if (anciennete >= 0.5) details.montantAnciennete += 4
    
    // Montant
    if (montantTotal >= 10000) details.montantAnciennete += 15
    else if (montantTotal >= 5000) details.montantAnciennete += 12
    else if (montantTotal >= 3000) details.montantAnciennete += 9
    else if (montantTotal >= 1500) details.montantAnciennete += 6
    else if (montantTotal > 0) details.montantAnciennete += 3

    // 3. GRAVITÉ DU MANQUEMENT (25 points max)
    // Nombre de mois impayés
    const moisImpaye = parseFloat(formData.moisImpaye) || 0
    if (moisImpaye >= 3) details.gravite += 15
    else if (moisImpaye >= 2) details.gravite += 10
    else if (moisImpaye >= 1) details.gravite += 5
    
    // Délai de retard
    if (formData.delaiRetard === 'plus_3_mois') details.gravite += 10
    else if (formData.delaiRetard === '1_3_mois') details.gravite += 7
    else if (formData.delaiRetard === 'moins_1_mois') details.gravite += 4

    // 4. CONTEXTE FAVORABLE (15 points max)
    // Réclamation effectuée
    if (formData.reclamationFaite === 'oui_ecrit') details.contexte += 8
    else if (formData.reclamationFaite === 'oui_oral') details.contexte += 4
    
    // Autres salariés concernés
    if (formData.autresSalariesConcernes === 'oui') details.contexte += 5
    
    // Toujours salarié (peut prouver le travail effectué)
    if (formData.toujoursSalarie === 'oui') details.contexte += 2

    // Limiter chaque catégorie à son max
    details.preuves = Math.min(35, details.preuves)
    details.montantAnciennete = Math.min(25, details.montantAnciennete)
    details.gravite = Math.min(25, details.gravite)
    details.contexte = Math.min(15, details.contexte)

    // CALCUL TOTAL
    score = details.preuves + details.montantAnciennete + details.gravite + details.contexte

    // CALCUL DES SOMMES DUES
    // montantTotal et moisImpaye déjà déclarés plus haut
    const datePaiement = formData.datePaiementPrevue ? new Date(formData.datePaiementPrevue) : new Date()
    const aujourdhui = new Date()
    const joursRetard = Math.max(0, Math.floor((aujourdhui - datePaiement) / (1000 * 60 * 60 * 24)))
    
    let sommes = {
      salaireDu: montantTotal,
      interetsLegaux: 0,
      dommagesInterets: 0,
      total: 0
    }

    if (montantTotal > 0 && joursRetard > 0) {
      // Intérêts légaux (taux 2024 : ~4.3% pour professionnels)
      const tauxInteret = 0.043
      sommes.interetsLegaux = (montantTotal * tauxInteret * joursRetard) / 365
      
      // Dommages et intérêts (selon gravité)
      if (score >= 70) {
        // Manquement grave
        if (moisImpaye >= 3) {
          sommes.dommagesInterets = montantTotal * 0.3 // 30% du salaire dû
        } else if (moisImpaye >= 2) {
          sommes.dommagesInterets = montantTotal * 0.2
        } else {
          sommes.dommagesInterets = montantTotal * 0.1
        }
      } else if (score >= 50) {
        sommes.dommagesInterets = montantTotal * 0.05
      }

      sommes.total = sommes.salaireDu + sommes.interetsLegaux + sommes.dommagesInterets
    }

    return { score: Math.min(100, score), details, sommes, joursRetard }
  }

  const handleSubmit = () => {
    setShowResults(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const results = showResults ? calculateScore() : null

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-6">
              <span className="text-4xl">💰</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Résultats de votre diagnostic
            </h1>
            <p className="text-gray-600 mb-8">
              Salaire impayé - Analyse de votre situation
            </p>

            {/* Score circulaire */}
            <div className="relative inline-flex items-center justify-center w-48 h-48 mb-8">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                <circle
                  cx="96" cy="96" r="88"
                  stroke="url(#gradient3)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(results.score / 100) * 552} 552`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-gray-900">{results.score}</div>
                <div className="text-sm text-gray-600">/100</div>
              </div>
            </div>

            {/* Interprétation */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-2">
                {results.score >= 75 ? '🎯 Dossier très solide !' :
                 results.score >= 50 ? '👍 Dossier recevable' :
                 results.score >= 30 ? '⚠️ Dossier à renforcer' :
                 '📋 Dossier faible'}
              </h3>
              <p className="text-gray-700 text-sm">
                {results.score >= 75 ? 'Votre dossier est excellent. Le non-paiement du salaire est caractérisé et vous avez les preuves nécessaires.' :
                 results.score >= 50 ? 'Votre dossier présente des éléments solides. Une action aux prud\'hommes est envisageable.' :
                 results.score >= 30 ? 'Votre dossier nécessite d\'être renforcé avec des preuves supplémentaires.' :
                 'Votre dossier manque de preuves documentaires. Rassemblez plus d\'éléments avant d\'agir.'}
              </p>
            </div>

            {/* Sommes dues */}
            {results.sommes.total > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="text-sm text-green-800 font-medium mb-4">
                  💰 Sommes récupérables estimées
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div className="text-left">
                    <div className="text-gray-600">Salaire dû</div>
                    <div className="font-bold text-gray-900 text-lg">{Math.round(results.sommes.salaireDu).toLocaleString()} €</div>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-600">Intérêts légaux</div>
                    <div className="font-bold text-gray-900 text-lg">{Math.round(results.sommes.interetsLegaux).toLocaleString()} €</div>
                    <div className="text-xs text-gray-500">{results.joursRetard} jours de retard</div>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-600">Dommages & intérêts</div>
                    <div className="font-bold text-green-700 text-lg">{Math.round(results.sommes.dommagesInterets).toLocaleString()} €</div>
                  </div>
                </div>
                <div className="border-t border-green-300 pt-3">
                  <div className="text-sm text-green-800 mb-1">Total récupérable</div>
                  <div className="text-4xl font-bold text-green-900">
                    {Math.round(results.sommes.total).toLocaleString()} €
                  </div>
                  <p className="text-xs text-green-700 mt-2">
                    Estimation basée sur vos déclarations (montant indicatif)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Détails du score */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Détail de l'analyse
            </h2>

            <div className="space-y-4">
              {/* Preuves */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">📄 Preuves documentaires</span>
                  <span className="font-bold text-green-600">{results.details.preuves}/35</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${(results.details.preuves / 35) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {results.details.preuves >= 28 ? 'Excellentes preuves' :
                   results.details.preuves >= 21 ? 'Preuves solides' :
                   results.details.preuves >= 14 ? 'Preuves suffisantes' :
                   'Manque de preuves'}
                </p>
              </div>

              {/* Montant et ancienneté */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">💼 Montant et ancienneté</span>
                  <span className="font-bold text-blue-600">{results.details.montantAnciennete}/25</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${(results.details.montantAnciennete / 25) * 100}%` }}
                  />
                </div>
              </div>

              {/* Gravité */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">⚠️ Gravité du manquement</span>
                  <span className="font-bold text-red-600">{results.details.gravite}/25</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all"
                    style={{ width: `${(results.details.gravite / 25) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {results.details.gravite >= 20 ? 'Manquement très grave' :
                   results.details.gravite >= 10 ? 'Manquement grave' :
                   'Retard léger'}
                </p>
              </div>

              {/* Contexte */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">🎯 Contexte favorable</span>
                  <span className="font-bold text-purple-600">{results.details.contexte}/15</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${(results.details.contexte / 15) * 100}%` }}
                  />
                </div>
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
                  ⏰ Action immédiate requise !
                </h3>
                <p className="text-sm text-red-800">
                  Le non-paiement du salaire est une faute grave de l'employeur. Vous êtes en droit de :
                </p>
                <ul className="text-sm text-red-800 mt-2 space-y-1">
                  <li>• Réclamer immédiatement votre salaire par lettre recommandée avec AR</li>
                  <li>• Cesser le travail si le retard dépasse 15 jours (prise d'acte)</li>
                  <li>• Saisir le conseil de prud'hommes en référé (procédure d'urgence)</li>
                </ul>
              </div>

              {/* Preuves manquantes */}
              {results.details.preuves < 25 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-bold text-yellow-900 mb-2">
                    ⚠️ Renforcez votre dossier
                  </h3>
                  <ul className="space-y-1 text-sm text-yellow-800">
                    {!formData.preuvesContrat && <li>• Récupérez votre contrat de travail</li>}
                    {!formData.preuvesBulletins && <li>• Obtenez vos bulletins de salaire</li>}
                    {!formData.preuvesRelevesBancaires && <li>• Imprimez vos relevés bancaires (absence de virement)</li>}
                    {!formData.preuvesMiseEnDemeure && <li>• Envoyez une mise en demeure par LRAR</li>}
                  </ul>
                </div>
              )}

              {/* Prescription */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">
                  📅 Délai de prescription : 3 ANS
                </h3>
                <p className="text-sm text-blue-800">
                  Vous avez 3 ans à compter de la date d'exigibilité du salaire pour agir.
                  Ne tardez pas, chaque jour compte !
                </p>
              </div>

              {/* Conseil juridique */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-bold text-green-900 mb-2">
                  💡 Démarches recommandées
                </h3>
                <ol className="text-sm text-green-800 space-y-2">
                  <li><strong>1. Mise en demeure</strong> : Envoyez une lettre LRAR réclamant le paiement sous 8 jours</li>
                  <li><strong>2. Référé prud'homal</strong> : Saisissez le juge en urgence (2-3 semaines)</li>
                  <li><strong>3. Prise d'acte</strong> : Si retard &gt; 15 jours, vous pouvez rompre le contrat aux torts de l'employeur</li>
                  <li><strong>4. Contactez un avocat</strong> : Le non-paiement justifie souvent une aide juridictionnelle</li>
                </ol>
              </div>
            </div>
          </div>

          {/* CTA Premium */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              🚀 Obtenez votre dossier juridique complet
            </h2>
            <p className="text-green-100 mb-6">
              Modèle de mise en demeure, requête prud'homale, calculs détaillés
              et stratégie personnalisée pour récupérer vos salaires
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">120€</div>
                <div className="text-sm text-green-100">Grand public</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">60€</div>
                <div className="text-sm text-green-100">Membres syndicats</div>
              </div>
            </div>

            <button className="bg-white text-green-600 font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all">
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
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
                  ${step === currentStep ? 'bg-green-600 text-white' :
                    step < currentStep ? 'bg-green-600 text-white' :
                    'bg-gray-200 text-gray-600'}`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-500"
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <span className="text-3xl">
                {currentStep === 1 ? '📋' :
                 currentStep === 2 ? '💰' :
                 currentStep === 3 ? '🏢' :
                 currentStep === 4 ? '📄' :
                 '✅'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStep === 1 && 'Informations générales'}
              {currentStep === 2 && 'Détails du non-paiement'}
              {currentStep === 3 && 'Contexte et circonstances'}
              {currentStep === 4 && 'Preuves disponibles'}
              {currentStep === 5 && 'Réclamations effectuées'}
            </h2>
            <p className="text-gray-600">
              {currentStep === 1 && 'Commençons par votre situation professionnelle'}
              {currentStep === 2 && 'Précisez les salaires non payés'}
              {currentStep === 3 && 'Comprenons la situation de l\'entreprise'}
              {currentStep === 4 && 'Quels documents pouvez-vous fournir ?'}
              {currentStep === 5 && 'Avez-vous déjà agi ?'}
            </p>
          </div>

          {/* Questions - Étape 1 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de contrat *
                </label>
                <select
                  value={formData.typeContrat}
                  onChange={(e) => handleChange('typeContrat', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Sélectionnez</option>
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Interim">Intérim</option>
                  <option value="Apprentissage">Apprentissage</option>
                  <option value="Stage">Stage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ancienneté dans l'entreprise (en années) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.anciennete}
                  onChange={(e) => handleChange('anciennete', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: 1.5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salaire mensuel brut habituel (€) *
                </label>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={formData.salaireBrut}
                  onChange={(e) => handleChange('salaireBrut', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: 2000"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Salaire de base avant le non-paiement
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Êtes-vous toujours salarié de cette entreprise ? *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="toujoursSalarie"
                      value="oui"
                      checked={formData.toujoursSalarie === 'oui'}
                      onChange={(e) => handleChange('toujoursSalarie', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, je travaille toujours</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="toujoursSalarie"
                      value="non"
                      checked={formData.toujoursSalarie === 'non'}
                      onChange={(e) => handleChange('toujoursSalarie', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Non, j'ai quitté l'entreprise</p>
                    </div>
                  </label>
                </div>
              </div>

              {formData.toujoursSalarie === 'non' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dernier jour travaillé
                  </label>
                  <input
                    type="date"
                    value={formData.dernierJourTravaille}
                    onChange={(e) => handleChange('dernierJourTravaille', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* Questions - Étape 2 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Combien de mois de salaire n'ont pas été payés ? *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.moisImpaye}
                  onChange={(e) => handleChange('moisImpaye', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: 2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quels éléments n'ont pas été payés ? *
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Cochez tous les éléments concernés
                </p>
                <div className="space-y-2">
                  {[
                    { id: 'salaire_base', label: 'Salaire de base' },
                    { id: 'primes', label: 'Primes' },
                    { id: 'heures_sup', label: 'Heures supplémentaires' },
                    { id: 'indemnites', label: 'Indemnités diverses' },
                    { id: 'conges', label: 'Indemnité de congés payés' },
                    { id: 'treizieme', label: '13ème mois' }
                  ].map((element) => (
                    <label
                      key={element.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        checked={formData.elementsImpaye?.includes(element.id)}
                        onChange={() => toggleElement(element.id)}
                      />
                      <span className="font-medium text-gray-900">{element.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant total non payé (€) *
                </label>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={formData.montantTotal}
                  onChange={(e) => handleChange('montantTotal', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: 4000"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Total de toutes les sommes dues (brut)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date à laquelle le salaire aurait dû être payé *
                </label>
                <input
                  type="date"
                  value={formData.datePaiementPrevue}
                  onChange={(e) => handleChange('datePaiementPrevue', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Date habituelle de versement du salaire
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Délai de retard *
                </label>
                <select
                  value={formData.delaiRetard}
                  onChange={(e) => handleChange('delaiRetard', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Sélectionnez</option>
                  <option value="moins_1_mois">Moins d'1 mois</option>
                  <option value="1_3_mois">Entre 1 et 3 mois</option>
                  <option value="plus_3_mois">Plus de 3 mois</option>
                </select>
              </div>
            </div>
          )}

          {/* Questions - Étape 3 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quelle raison a invoqué votre employeur ?
                </label>
                <textarea
                  value={formData.raisonEmployeur}
                  onChange={(e) => handleChange('raisonEmployeur', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows="3"
                  placeholder="Ex: Difficultés financières, problème de trésorerie..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Situation de l'entreprise *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="situationEntreprise"
                      value="normale"
                      checked={formData.situationEntreprise === 'normale'}
                      onChange={(e) => handleChange('situationEntreprise', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Entreprise en activité normale</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="situationEntreprise"
                      value="difficultes"
                      checked={formData.situationEntreprise === 'difficultes'}
                      onChange={(e) => handleChange('situationEntreprise', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Difficultés financières</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="situationEntreprise"
                      value="procedure"
                      checked={formData.situationEntreprise === 'procedure'}
                      onChange={(e) => handleChange('situationEntreprise', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Procédure collective (redressement, liquidation)</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="situationEntreprise"
                      value="ne_sais_pas"
                      checked={formData.situationEntreprise === 'ne_sais_pas'}
                      onChange={(e) => handleChange('situationEntreprise', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Je ne sais pas</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  D'autres salariés sont-ils dans la même situation ? *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="autresSalariesConcernes"
                      value="oui"
                      checked={formData.autresSalariesConcernes === 'oui'}
                      onChange={(e) => handleChange('autresSalariesConcernes', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, plusieurs collègues</p>
                      <p className="text-sm text-gray-600">💡 Action collective possible</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="autresSalariesConcernes"
                      value="non"
                      checked={formData.autresSalariesConcernes === 'non'}
                      onChange={(e) => handleChange('autresSalariesConcernes', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Non, je suis le seul</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="autresSalariesConcernes"
                      value="ne_sais_pas"
                      checked={formData.autresSalariesConcernes === 'ne_sais_pas'}
                      onChange={(e) => handleChange('autresSalariesConcernes', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Je ne sais pas</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Questions - Étape 4 */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-900">
                  💡 <strong>Important :</strong> Les preuves sont essentielles pour récupérer votre salaire.
                  Cochez tous les documents que vous possédez.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.preuvesContrat}
                    onChange={(e) => handleChange('preuvesContrat', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Contrat de travail</p>
                    <p className="text-sm text-gray-600">Original ou copie signée</p>
                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      ⭐ Preuve essentielle
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.preuvesBulletins}
                    onChange={(e) => handleChange('preuvesBulletins', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Bulletins de salaire</p>
                    <p className="text-sm text-gray-600">Derniers mois avant le non-paiement</p>
                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      ⭐ Preuve essentielle
                    </span>
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
                    <p className="font-medium text-gray-900">Emails et courriers</p>
                    <p className="text-sm text-gray-600">Échanges avec l'employeur sur le non-paiement</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.preuvesRelevesBancaires}
                    onChange={(e) => handleChange('preuvesRelevesBancaires', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Relevés bancaires</p>
                    <p className="text-sm text-gray-600">Prouvant l'absence de virement</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.preuvesMiseEnDemeure}
                    onChange={(e) => handleChange('preuvesMiseEnDemeure', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Mise en demeure</p>
                    <p className="text-sm text-gray-600">Lettre LRAR réclamant le paiement</p>
                    <span className="inline-block mt-1 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      💪 Renforce beaucoup le dossier
                    </span>
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
                    <p className="text-sm text-gray-600">Attestations écrites</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.preuvesJustificatifsPresence}
                    onChange={(e) => handleChange('preuvesJustificatifsPresence', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Justificatifs de présence</p>
                    <p className="text-sm text-gray-600">Badgeuse, emails horodatés, plannings</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Questions - Étape 5 */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avez-vous déjà réclamé votre salaire à l'employeur ? *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="reclamationFaite"
                      value="oui_ecrit"
                      checked={formData.reclamationFaite === 'oui_ecrit'}
                      onChange={(e) => handleChange('reclamationFaite', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, par écrit (email, courrier LRAR)</p>
                      <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        ✓ Très favorable
                      </span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="reclamationFaite"
                      value="oui_oral"
                      checked={formData.reclamationFaite === 'oui_oral'}
                      onChange={(e) => handleChange('reclamationFaite', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, mais seulement oralement</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="reclamationFaite"
                      value="non"
                      checked={formData.reclamationFaite === 'non'}
                      onChange={(e) => handleChange('reclamationFaite', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Non, pas encore</p>
                      <p className="text-sm text-orange-600">⚠️ À faire rapidement par LRAR</p>
                    </div>
                  </label>
                </div>
              </div>

              {formData.reclamationFaite !== 'non' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quelle a été la réponse de l'employeur ?
                  </label>
                  <textarea
                    value={formData.reponseEmployeur}
                    onChange={(e) => handleChange('reponseEmployeur', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    rows="3"
                    placeholder="Décrivez la réponse de votre employeur..."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avez-vous rompu votre contrat de travail ? *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="ruptureContrat"
                      value="non"
                      checked={formData.ruptureContrat === 'non'}
                      onChange={(e) => handleChange('ruptureContrat', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Non, je travaille toujours</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="ruptureContrat"
                      value="prise_acte"
                      checked={formData.ruptureContrat === 'prise_acte'}
                      onChange={(e) => handleChange('ruptureContrat', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, j'ai pris acte de la rupture</p>
                      <p className="text-sm text-gray-600">Rupture aux torts de l'employeur</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="ruptureContrat"
                      value="demission"
                      checked={formData.ruptureContrat === 'demission'}
                      onChange={(e) => handleChange('ruptureContrat', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, j'ai démissionné</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="ruptureContrat"
                      value="licencie"
                      checked={formData.ruptureContrat === 'licencie'}
                      onChange={(e) => handleChange('ruptureContrat', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, j'ai été licencié</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Envisagez-vous de saisir le conseil de prud'hommes ? *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="conseilPrudhommes"
                      value="oui"
                      checked={formData.conseilPrudhommes === 'oui'}
                      onChange={(e) => handleChange('conseilPrudhommes', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, je vais saisir les prud'hommes</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="conseilPrudhommes"
                      value="refere"
                      checked={formData.conseilPrudhommes === 'refere'}
                      onChange={(e) => handleChange('conseilPrudhommes', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, en référé (procédure d'urgence)</p>
                      <p className="text-sm text-green-600">✓ Recommandé pour salaire impayé</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="conseilPrudhommes"
                      value="ne_sais_pas"
                      checked={formData.conseilPrudhommes === 'ne_sais_pas'}
                      onChange={(e) => handleChange('conseilPrudhommes', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Je ne sais pas encore</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center gap-4">
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
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <span>Suivant</span>
                  <span>→</span>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="w-full px-8 py-5 bg-red-600 text-white rounded-xl font-bold text-xl shadow-2xl hover:bg-red-700 hover:scale-105 transition-all flex items-center justify-center gap-3 border-4 border-red-800"
                  style={{ fontSize: '20px' }}
                >
                  <span className="text-2xl">✓</span>
                  <span>VOIR MES RÉSULTATS</span>
                </button>
              )}
            </div>
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
