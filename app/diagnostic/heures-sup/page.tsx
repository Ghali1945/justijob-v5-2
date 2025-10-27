'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DiagnosticHeuresSup() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showResults, setShowResults] = useState(false)
  
  const [formData, setFormData] = useState({
    // Informations générales
    typeContrat: '',
    anciennete: '',
    secteur: '',
    conventionCollective: '',
    tauxHoraire: '',
    
    // Horaires contractuels
    horaireHebdo: '35',
    horairesMentionnes: '',
    
    // Heures supplémentaires
    periodeDebut: '',
    periodeFin: '',
    heuresSupMoyennes: '',
    frequence: '',
    
    // Majorations
    majorationEmployeur: '',
    recupProposee: '',
    
    // Preuves disponibles
    preuvesBadgeuse: false,
    preuvesEmails: false,
    preuvesPlannings: false,
    preuvesTemoins: false,
    preuvesComptesRendus: false,
    preuvesFichesPayee: false,
    
    // Réclamations
    reclamationFaite: '',
    reponseEmployeur: '',
    
    // Contexte
    effectifEntreprise: '',
    autresSalariesConcernes: ''
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
      preuves: 0,
      juridique: 0,
      montant: 0,
      solidite: 0
    }

    // 1. PREUVES (40 points max)
    const preuvesList = [
      formData.preuvesBadgeuse,
      formData.preuvesEmails,
      formData.preuvesPlannings,
      formData.preuvesTemoins,
      formData.preuvesComptesRendus,
      formData.preuvesFichesPayee
    ]
    const nombrePreuves = preuvesList.filter(p => p).length
    
    if (nombrePreuves >= 4) details.preuves = 40
    else if (nombrePreuves === 3) details.preuves = 30
    else if (nombrePreuves === 2) details.preuves = 20
    else if (nombrePreuves === 1) details.preuves = 10
    
    // Bonus pour badgeuse (preuve objective)
    if (formData.preuvesBadgeuse) details.preuves = Math.min(40, details.preuves + 5)
    
    // 2. SOLIDITÉ JURIDIQUE (30 points max)
    // Ancienneté (preuve de régularité)
    const anciennete = parseFloat(formData.anciennete) || 0
    if (anciennete >= 2) details.juridique += 10
    else if (anciennete >= 1) details.juridique += 5
    
    // Fréquence des heures sup
    if (formData.frequence === 'quotidien') details.juridique += 10
    else if (formData.frequence === 'hebdomadaire') details.juridique += 7
    else if (formData.frequence === 'mensuel') details.juridique += 4
    
    // Réclamation faite
    if (formData.reclamationFaite === 'oui_ecrit') details.juridique += 10
    else if (formData.reclamationFaite === 'oui_oral') details.juridique += 5
    
    // 3. MONTANT EN JEU (20 points max)
    const tauxHoraire = parseFloat(formData.tauxHoraire) || 0
    const heuresSupMoyennes = parseFloat(formData.heuresSupMoyennes) || 0
    
    // Calcul période en mois
    let periodeEnMois = 12 // par défaut 1 an
    if (formData.periodeDebut && formData.periodeFin) {
      const debut = new Date(formData.periodeDebut)
      const fin = new Date(formData.periodeFin)
      periodeEnMois = Math.max(1, Math.round((fin - debut) / (1000 * 60 * 60 * 24 * 30)))
    }
    
    // Calcul approximatif du montant
    let montantEstime = 0
    if (tauxHoraire > 0 && heuresSupMoyennes > 0) {
      // Simplifié: moyenne 25% de majoration
      const tauxMajore = tauxHoraire * 1.25
      if (formData.frequence === 'quotidien') {
        montantEstime = tauxMajore * heuresSupMoyennes * 20 * periodeEnMois
      } else if (formData.frequence === 'hebdomadaire') {
        montantEstime = tauxMajore * heuresSupMoyennes * 4 * periodeEnMois
      } else {
        montantEstime = tauxMajore * heuresSupMoyennes * periodeEnMois
      }
    }
    
    if (montantEstime >= 10000) details.montant = 20
    else if (montantEstime >= 5000) details.montant = 15
    else if (montantEstime >= 2000) details.montant = 10
    else if (montantEstime >= 1000) details.montant = 5
    
    // 4. CONTEXTE (10 points max)
    if (formData.autresSalariesConcernes === 'oui') details.solidite += 5
    if (formData.horairesMentionnes === 'non') details.solidite += 5
    
    // CALCUL TOTAL
    score = details.preuves + details.juridique + details.montant + details.solidite
    
    return { score: Math.min(100, score), details, montantEstime: Math.round(montantEstime) }
  }

  const handleSubmit = () => {
    setShowResults(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const results = showResults ? calculateScore() : null

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
              <span className="text-4xl">⏰</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Résultats de votre diagnostic
            </h1>
            <p className="text-gray-600 mb-8">
              Heures supplémentaires non payées
            </p>

            {/* Score circulaire */}
            <div className="relative inline-flex items-center justify-center w-48 h-48 mb-8">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(results.score / 100) * 552} 552`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-gray-900">{results.score}</div>
                <div className="text-sm text-gray-600">/100</div>
              </div>
            </div>

            {/* Interprétation */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-2">
                {results.score >= 75 ? '🎯 Excellent dossier !' :
                 results.score >= 50 ? '👍 Dossier solide' :
                 results.score >= 30 ? '⚠️ Dossier moyen' :
                 '⚠️ Dossier faible'}
              </h3>
              <p className="text-gray-700 text-sm">
                {results.score >= 75 ? 'Vos chances de succès aux prud\'hommes sont très élevées. Votre dossier présente de solides éléments de preuve.' :
                 results.score >= 50 ? 'Vous avez de bonnes chances de succès. Il serait judicieux de rassembler quelques preuves supplémentaires.' :
                 results.score >= 30 ? 'Votre dossier nécessite d\'être renforcé avec des preuves plus solides avant d\'engager une action.' :
                 'Votre dossier est actuellement trop fragile. Concentrez-vous sur la collecte de preuves objectives.'}
              </p>
            </div>

            {/* Montant estimé */}
            {results.montantEstime > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="text-sm text-green-800 font-medium mb-2">
                  💰 Montant estimé récupérable
                </div>
                <div className="text-3xl font-bold text-green-900">
                  {results.montantEstime.toLocaleString('fr-FR')} €
                </div>
                <p className="text-xs text-green-700 mt-2">
                  Estimation basée sur vos déclarations (montant indicatif)
                </p>
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
                  <span className="font-semibold text-gray-900">📄 Qualité des preuves</span>
                  <span className="font-bold text-blue-600">{results.details.preuves}/40</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${(results.details.preuves / 40) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {results.details.preuves >= 30 ? 'Excellentes preuves objectives' :
                   results.details.preuves >= 20 ? 'Preuves solides' :
                   results.details.preuves >= 10 ? 'Preuves insuffisantes' :
                   'Manque de preuves tangibles'}
                </p>
              </div>

              {/* Juridique */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">⚖️ Solidité juridique</span>
                  <span className="font-bold text-purple-600">{results.details.juridique}/30</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${(results.details.juridique / 30) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {results.details.juridique >= 20 ? 'Situation juridiquement solide' :
                   results.details.juridique >= 10 ? 'Situation juridique moyenne' :
                   'Contexte juridique à renforcer'}
                </p>
              </div>

              {/* Montant */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">💰 Enjeu financier</span>
                  <span className="font-bold text-green-600">{results.details.montant}/20</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${(results.details.montant / 20) * 100}%` }}
                  />
                </div>
              </div>

              {/* Contexte */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">🎯 Contexte favorable</span>
                  <span className="font-bold text-orange-600">{results.details.solidite}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all"
                    style={{ width: `${(results.details.solidite / 10) * 100}%` }}
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
              {/* Preuves à collecter */}
              {results.details.preuves < 30 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-bold text-yellow-900 mb-2">
                    ⚠️ Renforcez vos preuves
                  </h3>
                  <ul className="space-y-1 text-sm text-yellow-800">
                    {!formData.preuvesBadgeuse && <li>• Récupérez les données de badgeuse ou pointeuse</li>}
                    {!formData.preuvesEmails && <li>• Conservez vos emails mentionnant les heures de travail</li>}
                    {!formData.preuvesPlannings && <li>• Récupérez les plannings officiels</li>}
                    {!formData.preuvesTemoins && <li>• Sollicitez des témoignages de collègues</li>}
                  </ul>
                </div>
              )}

              {/* Réclamation */}
              {formData.reclamationFaite === 'non' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-bold text-blue-900 mb-2">
                    💡 Action recommandée
                  </h3>
                  <p className="text-sm text-blue-800">
                    Faites une réclamation écrite par lettre recommandée avec AR à votre employeur.
                    Cela renforcera considérablement votre dossier.
                  </p>
                </div>
              )}

              {/* Prescription */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-bold text-red-900 mb-2">
                  ⏰ Attention au délai de prescription !
                </h3>
                <p className="text-sm text-red-800">
                  Vous avez 3 ans pour réclamer vos heures supplémentaires. Au-delà, elles sont prescrites.
                  Ne tardez pas à agir !
                </p>
              </div>
            </div>
          </div>

          {/* Prochaines étapes */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              🚀 Prochaines étapes
            </h2>
            <p className="text-blue-100 mb-6">
              Obtenez un dossier juridique complet de 30 pages avec jurisprudence applicable,
              calculs détaillés et stratégie personnalisée
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">120€</div>
                <div className="text-sm text-blue-100">Grand public</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">60€</div>
                <div className="text-sm text-blue-100">Membres syndicats</div>
              </div>
            </div>

            <button className="bg-white text-blue-600 font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all">
              🎯 Obtenir mon dossier complet
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
                  ${step === currentStep ? 'bg-blue-600 text-white' :
                    step < currentStep ? 'bg-green-600 text-white' :
                    'bg-gray-200 text-gray-600'}`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-3xl">
                {currentStep === 1 ? '📋' :
                 currentStep === 2 ? '⏰' :
                 currentStep === 3 ? '💰' :
                 currentStep === 4 ? '📄' :
                 '✅'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStep === 1 && 'Informations générales'}
              {currentStep === 2 && 'Vos horaires de travail'}
              {currentStep === 3 && 'Heures supplémentaires effectuées'}
              {currentStep === 4 && 'Preuves disponibles'}
              {currentStep === 5 && 'Réclamations et contexte'}
            </h2>
            <p className="text-gray-600">
              {currentStep === 1 && 'Commençons par quelques informations sur votre contrat'}
              {currentStep === 2 && 'Détaillons vos horaires contractuels et réels'}
              {currentStep === 3 && 'Précisez les heures supplémentaires non payées'}
              {currentStep === 4 && 'Quels documents pouvez-vous fournir ?'}
              {currentStep === 5 && 'Avez-vous déjà réclamé vos heures ?'}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionnez</option>
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Interim">Intérim</option>
                  <option value="Apprentissage">Apprentissage</option>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 2.5"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Plus vous avez d'ancienneté, plus votre dossier est solide
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secteur d'activité
                </label>
                <input
                  type="text"
                  value={formData.secteur}
                  onChange={(e) => handleChange('secteur', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Commerce, Restauration, BTP..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Convention collective applicable (si vous la connaissez)
                </label>
                <input
                  type="text"
                  value={formData.conventionCollective}
                  onChange={(e) => handleChange('conventionCollective', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Métallurgie, Commerce de détail..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Certaines conventions prévoient des majorations plus avantageuses
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre taux horaire brut (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.tauxHoraire}
                  onChange={(e) => handleChange('tauxHoraire', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 15.50"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Regardez votre bulletin de salaire : Salaire brut / Nombre d'heures
                </p>
              </div>
            </div>
          )}

          {/* Questions - Étape 2 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée hebdomadaire de travail mentionnée dans votre contrat *
                </label>
                <select
                  value={formData.horaireHebdo}
                  onChange={(e) => handleChange('horaireHebdo', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="35">35 heures (temps plein)</option>
                  <option value="39">39 heures</option>
                  <option value="30">30 heures (temps partiel)</option>
                  <option value="25">25 heures (temps partiel)</option>
                  <option value="20">20 heures (temps partiel)</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Les horaires de travail sont-ils clairement mentionnés dans votre contrat ? *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="horairesMentionnes"
                      value="oui_precis"
                      checked={formData.horairesMentionnes === 'oui_precis'}
                      onChange={(e) => handleChange('horairesMentionnes', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, de manière précise</p>
                      <p className="text-sm text-gray-600">Horaires exacts (ex: 9h-12h / 14h-18h)</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="horairesMentionnes"
                      value="oui_vague"
                      checked={formData.horairesMentionnes === 'oui_vague'}
                      onChange={(e) => handleChange('horairesMentionnes', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, mais de manière vague</p>
                      <p className="text-sm text-gray-600">Seulement la durée hebdomadaire</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="horairesMentionnes"
                      value="non"
                      checked={formData.horairesMentionnes === 'non'}
                      onChange={(e) => handleChange('horairesMentionnes', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Non, rien n'est mentionné</p>
                      <p className="text-sm text-gray-600">⚠️ Situation favorable pour votre dossier</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Questions - Étape 3 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Début de la période concernée *
                  </label>
                  <input
                    type="date"
                    value={formData.periodeDebut}
                    onChange={(e) => handleChange('periodeDebut', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fin de la période concernée *
                  </label>
                  <input
                    type="date"
                    value={formData.periodeFin}
                    onChange={(e) => handleChange('periodeFin', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre moyen d'heures supplémentaires par occurrence *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.heuresSupMoyennes}
                  onChange={(e) => handleChange('heuresSupMoyennes', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 5"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Nombre d'heures au-delà de votre horaire contractuel
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fréquence des heures supplémentaires *
                </label>
                <select
                  value={formData.frequence}
                  onChange={(e) => handleChange('frequence', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionnez</option>
                  <option value="quotidien">Quotidiennement</option>
                  <option value="hebdomadaire">Chaque semaine</option>
                  <option value="mensuel">Quelques fois par mois</option>
                  <option value="occasionnel">Occasionnellement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ces heures ont-elles été payées par votre employeur ? *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="majorationEmployeur"
                      value="non"
                      checked={formData.majorationEmployeur === 'non'}
                      onChange={(e) => handleChange('majorationEmployeur', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Non, pas du tout</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="majorationEmployeur"
                      value="partiel"
                      checked={formData.majorationEmployeur === 'partiel'}
                      onChange={(e) => handleChange('majorationEmployeur', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, mais sans les majorations légales</p>
                      <p className="text-sm text-gray-600">Payées au taux normal</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="majorationEmployeur"
                      value="recup"
                      checked={formData.majorationEmployeur === 'recup'}
                      onChange={(e) => handleChange('majorationEmployeur', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Récupération proposée</p>
                      <p className="text-sm text-gray-600">Repos compensateur imposé</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Questions - Étape 4 */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  💡 <strong>Important :</strong> Plus vous avez de preuves objectives, plus votre dossier est solide.
                  Cochez tous les éléments que vous possédez ou pouvez obtenir.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.preuvesBadgeuse}
                    onChange={(e) => handleChange('preuvesBadgeuse', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Données de badgeuse ou pointeuse</p>
                    <p className="text-sm text-gray-600">Preuve objective de vos heures réelles</p>
                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      ⭐ Preuve très forte
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
                    <p className="font-medium text-gray-900">Emails envoyés/reçus en dehors des horaires</p>
                    <p className="text-sm text-gray-600">Preuves horodatées de votre présence</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.preuvesPlannings}
                    onChange={(e) => handleChange('preuvesPlannings', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Plannings et feuilles d'horaires</p>
                    <p className="text-sm text-gray-600">Documents de l'employeur</p>
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
                    checked={formData.preuvesComptesRendus}
                    onChange={(e) => handleChange('preuvesComptesRendus', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Comptes-rendus ou rapports</p>
                    <p className="text-sm text-gray-600">Documents prouvant vos tâches supplémentaires</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.preuvesFichesPayee}
                    onChange={(e) => handleChange('preuvesFichesPayee', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Bulletins de salaire</p>
                    <p className="text-sm text-gray-600">Montrant l'absence de paiement des heures sup</p>
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
                  Avez-vous déjà réclamé le paiement de ces heures supplémentaires ? *
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
                      <p className="font-medium">Oui, par écrit (email, courrier)</p>
                      <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        ✓ Renforce votre dossier
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
                    </div>
                  </label>
                </div>
              </div>

              {formData.reclamationFaite !== 'non' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quelle a été la réponse de votre employeur ?
                  </label>
                  <textarea
                    value={formData.reponseEmployeur}
                    onChange={(e) => handleChange('reponseEmployeur', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Décrivez la réponse de votre employeur..."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Effectif de votre entreprise *
                </label>
                <select
                  value={formData.effectifEntreprise}
                  onChange={(e) => handleChange('effectifEntreprise', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionnez</option>
                  <option value="1-10">1 à 10 salariés</option>
                  <option value="11-50">11 à 50 salariés</option>
                  <option value="51-300">51 à 300 salariés</option>
                  <option value="300+">Plus de 300 salariés</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  D'autres salariés sont-ils dans la même situation que vous ? *
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
                      <p className="text-sm text-gray-600">💡 Action collective possible = dossier plus fort</p>
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
                      <p className="font-medium">Non, je suis seul(e)</p>
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
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all flex items-center gap-2"
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
