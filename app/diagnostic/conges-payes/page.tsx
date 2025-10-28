'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface FormData {
  // Étape 1 : Informations générales
  situationPro: string
  typeContrat: string
  anciennete: string
  salaireBrut: string
  
  // Étape 2 : Gestion des congés payés
  congesAcquis: string
  congesPris: string
  periodeAcquisition: string
  datesSortie: string
  
  // Étape 3 : Problématique
  natureLitige: string[]
  montantConteste: string
  refusEmployeur: string
  preuves: string[]
  
  // Étape 4 : Calcul et indemnisation
  dateDepart: string
  modeCalcul: string
  primesIncluses: string
  
  // Étape 5 : Réclamation
  demarchesDeja: string[]
  objectifs: string[]
  urgence: string
  detailsSituation: string
}

interface Scores {
  preuves: number
  montant: number
  droit: number
  contexte: number
}

interface Calculs {
  joursAcquisTotal: number
  joursPris: number
  joursRestants: number
  indemniteCP: number
  indemniteCompensatrice: number
  dommagesInterets: number
  total: number
}

export default function DiagnosticCongesPayes() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    situationPro: '',
    typeContrat: '',
    anciennete: '',
    salaireBrut: '',
    congesAcquis: '',
    congesPris: '',
    periodeAcquisition: '',
    datesSortie: '',
    natureLitige: [],
    montantConteste: '',
    refusEmployeur: '',
    preuves: [],
    dateDepart: '',
    modeCalcul: '',
    primesIncluses: '',
    demarchesDeja: [],
    objectifs: [],
    urgence: '',
    detailsSituation: ''
  })
  
  const [scores, setScores] = useState<Scores>({
    preuves: 0,
    montant: 0,
    droit: 0,
    contexte: 0
  })
  
  const [calculs, setCalculs] = useState<Calculs>({
    joursAcquisTotal: 0,
    joursPris: 0,
    joursRestants: 0,
    indemniteCP: 0,
    indemniteCompensatrice: 0,
    dommagesInterets: 0,
    total: 0
  })
  
  const [showResults, setShowResults] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  const totalSteps = 5

  // Sauvegarde automatique dans localStorage
  useEffect(() => {
    const saved = localStorage.getItem('diagnostic_conges_payes')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setFormData(data.formData || formData)
        setCurrentStep(data.currentStep || 1)
      } catch (e) {
        console.error('Erreur chargement données:', e)
      }
    }
  }, [])

  useEffect(() => {
    if (!showResults) {
      localStorage.setItem('diagnostic_conges_payes', JSON.stringify({
        formData,
        currentStep,
        timestamp: new Date().toISOString()
      }))
    }
  }, [formData, currentStep, showResults])

  // Validation du formulaire par étape
  const isStepValid = (step: number): boolean => {
    switch(step) {
      case 1:
        return !!(formData.situationPro && formData.typeContrat && 
                 formData.anciennete && formData.salaireBrut)
      case 2:
        return !!(formData.congesAcquis && formData.congesPris)
      case 3:
        return formData.natureLitige.length > 0
      case 4:
        return !!(formData.modeCalcul)
      case 5:
        return formData.objectifs.length > 0
      default:
        return false
    }
  }

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const currentValues = prev[field] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      return { ...prev, [field]: newValues }
    })
  }

  const handleNext = () => {
    if (currentStep < totalSteps && isStepValid(currentStep)) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const calculateScore = (): number => {
    let scoreProbleme = 0
    let scoreMontant = 0
    let scorePreuves = 0
    let scoreContexte = 0

    // Score problème (30 points)
    if (formData.natureLitige.includes('conges_refuses')) scoreProbleme += 10
    if (formData.natureLitige.includes('calcul_incorrect')) scoreProbleme += 8
    if (formData.natureLitige.includes('cp_non_payes')) scoreProbleme += 12
    if (formData.natureLitige.includes('report_refuse')) scoreProbleme += 5
    if (formData.natureLitige.includes('prise_imposee')) scoreProbleme += 7
    
    scoreProbleme = Math.min(scoreProbleme, 30)

    // Score montant (25 points)
    const montant = parseFloat(formData.montantConteste) || 0
    if (montant >= 5000) scoreMontant = 25
    else if (montant >= 3000) scoreMontant = 20
    else if (montant >= 1500) scoreMontant = 15
    else if (montant >= 500) scoreMontant = 10
    else if (montant > 0) scoreMontant = 5

    // Score preuves (25 points)
    const nbPreuves = formData.preuves.length
    if (nbPreuves >= 5) scorePreuves = 25
    else if (nbPreuves === 4) scorePreuves = 20
    else if (nbPreuves === 3) scorePreuves = 15
    else if (nbPreuves === 2) scorePreuves = 10
    else if (nbPreuves === 1) scorePreuves = 5

    // Score contexte (20 points)
    const anciennete = parseInt(formData.anciennete) || 0
    if (anciennete >= 10) scoreContexte += 8
    else if (anciennete >= 5) scoreContexte += 5
    else scoreContexte += 2

    if (formData.refusEmployeur === 'ecrit') scoreContexte += 7
    else if (formData.refusEmployeur === 'oral') scoreContexte += 4

    if (formData.demarchesDeja.includes('medecine_travail')) scoreContexte += 3
    if (formData.demarchesDeja.includes('inspection')) scoreContexte += 5

    setScores({
      preuves: scorePreuves,
      montant: scoreMontant,
      droit: scoreProbleme,
      contexte: scoreContexte
    })

    return scoreProbleme + scoreMontant + scorePreuves + scoreContexte
  }

  const calculerIndemnites = () => {
    const salaireBrut = parseFloat(formData.salaireBrut) || 0
    const anciennete = parseInt(formData.anciennete) || 0
    const congesAcquis = parseFloat(formData.congesAcquis) || 0
    const congesPris = parseFloat(formData.congesPris) || 0
    
    // Calcul des jours restants
    const joursRestants = Math.max(0, congesAcquis - congesPris)
    
    // Calcul de l'indemnité de CP (10% du salaire brut)
    const indemniteCP = (salaireBrut * 0.10) * (joursRestants / 25)
    
    // Calcul de l'indemnité compensatrice
    const salaireJournalier = salaireBrut / 21.67 // Moyenne mensuelle
    const indemniteCompensatrice = salaireJournalier * joursRestants
    
    // Prise en compte du mode de calcul le plus favorable
    const indemnitePrincipale = Math.max(indemniteCP, indemniteCompensatrice)
    
    // Dommages et intérêts selon la gravité
    let dommagesInterets = 0
    if (formData.natureLitige.includes('cp_non_payes')) {
      dommagesInterets = salaireBrut * 0.5 // 0.5 mois de salaire
    }
    if (formData.natureLitige.includes('conges_refuses')) {
      dommagesInterets += salaireBrut * 0.3
    }
    
    const total = indemnitePrincipale + dommagesInterets
    
    setCalculs({
      joursAcquisTotal: congesAcquis,
      joursPris: congesPris,
      joursRestants: joursRestants,
      indemniteCP: indemniteCP,
      indemniteCompensatrice: indemniteCompensatrice,
      dommagesInterets: dommagesInterets,
      total: total
    })
  }

  const handleSubmit = () => {
    setIsCalculating(true)
    
    setTimeout(() => {
      calculateScore()
      calculerIndemnites()
      setShowResults(true)
      setIsCalculating(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 2000)
  }

  const handleRestart = () => {
    setFormData({
      situationPro: '',
      typeContrat: '',
      anciennete: '',
      salaireBrut: '',
      congesAcquis: '',
      congesPris: '',
      periodeAcquisition: '',
      datesSortie: '',
      natureLitige: [],
      montantConteste: '',
      refusEmployeur: '',
      preuves: [],
      dateDepart: '',
      modeCalcul: '',
      primesIncluses: '',
      demarchesDeja: [],
      objectifs: [],
      urgence: '',
      detailsSituation: ''
    })
    setCurrentStep(1)
    setShowResults(false)
    setScores({ preuves: 0, montant: 0, droit: 0, contexte: 0 })
    setCalculs({
      joursAcquisTotal: 0,
      joursPris: 0,
      joursRestants: 0,
      indemniteCP: 0,
      indemniteCompensatrice: 0,
      dommagesInterets: 0,
      total: 0
    })
    localStorage.removeItem('diagnostic_conges_payes')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getScoreColor = (score: number): string => {
    if (score >= 75) return 'text-red-600'
    if (score >= 50) return 'text-orange-500'
    if (score >= 30) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getScoreBgColor = (score: number): string => {
    if (score >= 75) return 'bg-red-50 border-red-200'
    if (score >= 50) return 'bg-orange-50 border-orange-200'
    if (score >= 30) return 'bg-yellow-50 border-yellow-200'
    return 'bg-green-50 border-green-200'
  }

  const getScoreLabel = (score: number): string => {
    if (score >= 75) return 'Situation très grave'
    if (score >= 50) return 'Situation préoccupante'
    if (score >= 30) return 'Situation à surveiller'
    return 'Situation gérable'
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Header avec fond blanc et texte sombre */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/diagnostic" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">J</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">JustiJob</h1>
                  <p className="text-xs text-gray-600">Diagnostic Congés Payés</p>
                </div>
              </Link>
              
              <button
                onClick={handleRestart}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Recommencer
              </button>
            </div>
          </div>
        </header>

        {/* Résultats */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Score global */}
          <div className={`mb-8 p-8 rounded-2xl border-2 ${getScoreBgColor(totalScore)}`}>
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Résultats de votre diagnostic
              </h2>
              <p className="text-gray-600">Analyse complète de votre situation</p>
            </div>
            
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <svg className="transform -rotate-90 w-48 h-48">
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
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(totalScore / 100) * 552.92} 552.92`}
                    className={getScoreColor(totalScore)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold ${getScoreColor(totalScore)}`}>
                    {totalScore}
                  </span>
                  <span className="text-gray-600 text-sm mt-1">/ 100</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className={`text-2xl font-bold mb-2 ${getScoreColor(totalScore)}`}>
                {getScoreLabel(totalScore)}
              </p>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {totalScore >= 75 && "Votre situation présente des violations graves. Une action juridique rapide est fortement recommandée."}
                {totalScore >= 50 && totalScore < 75 && "Votre situation nécessite une attention particulière. Consultez un avocat pour évaluer vos options."}
                {totalScore >= 30 && totalScore < 50 && "Votre situation peut être résolue, mais nécessite une action. Documentez tout soigneusement."}
                {totalScore < 30 && "Votre situation semble gérable. Continuez à documenter et suivre l'évolution."}
              </p>
            </div>
          </div>

          {/* Détails des scores */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">📊 Détail des scores</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Nature du litige</span>
                    <span className="text-sm font-semibold">{scores.droit}/30</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${(scores.droit / 30) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Montant en jeu</span>
                    <span className="text-sm font-semibold">{scores.montant}/25</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${(scores.montant / 25) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Solidité des preuves</span>
                    <span className="text-sm font-semibold">{scores.preuves}/25</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{ width: `${(scores.preuves / 25) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Contexte & ancienneté</span>
                    <span className="text-sm font-semibold">{scores.contexte}/20</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full transition-all"
                      style={{ width: `${(scores.contexte / 20) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Calculs d'indemnités */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">💰 Estimation des indemnités</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Jours acquis</span>
                  <span className="font-semibold text-gray-900">{calculs.joursAcquisTotal} j</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Jours pris</span>
                  <span className="font-semibold text-gray-900">{calculs.joursPris} j</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-blue-600">Jours restants</span>
                  <span className="font-bold text-blue-600">{calculs.joursRestants} j</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Indemnité 10%</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(calculs.indemniteCP)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Indemnité maintien</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(calculs.indemniteCompensatrice)}</span>
                </div>
                {calculs.dommagesInterets > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Dommages et intérêts</span>
                    <span className="font-semibold text-orange-600">{formatCurrency(calculs.dommagesInterets)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-300">
                  <span className="text-base font-bold text-gray-900">TOTAL ESTIMÉ</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency(calculs.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommandations */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">💡</span>
              Recommandations personnalisées
            </h3>
            
            <div className="space-y-6">
              {/* Actions immédiates */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Actions immédiates
                </h4>
                <ul className="space-y-2 ml-4">
                  <li className="text-gray-700 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Envoyez une mise en demeure écrite (LRAR) réclamant vos congés payés ou leur indemnisation</span>
                  </li>
                  <li className="text-gray-700 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Rassemblez tous vos bulletins de paie, contrat de travail et relevés de congés</span>
                  </li>
                  {formData.natureLitige.includes('cp_non_payes') && (
                    <li className="text-gray-700 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Contactez l'inspection du travail pour signaler le non-paiement des congés</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Démarches juridiques */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Démarches juridiques
                </h4>
                <ul className="space-y-2 ml-4">
                  {totalScore >= 50 ? (
                    <>
                      <li className="text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Consultation avocat spécialisé en droit du travail recommandée (sous 30 jours)</span>
                      </li>
                      <li className="text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Préparez un dossier complet pour saisine du Conseil de Prud'hommes</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Tentez d'abord une résolution amiable par courrier recommandé</span>
                      </li>
                      <li className="text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Si échec, consultez un avocat pour évaluer l'opportunité d'une action</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Délais */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Délais à respecter
                </h4>
                <div className="ml-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-gray-700 text-sm">
                    <strong>⚠️ Important :</strong> Vous disposez de <strong>3 ans</strong> à compter de la fin de la période d'acquisition 
                    des congés pour réclamer vos congés payés ou leur indemnisation (Art. L. 3245-1 du Code du travail).
                  </p>
                </div>
              </div>

              {/* Preuves à conserver */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Preuves essentielles
                </h4>
                <ul className="space-y-2 ml-4">
                  <li className="text-gray-700 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Tous les bulletins de paie montrant l'acquisition et la prise de congés</span>
                  </li>
                  <li className="text-gray-700 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Récapitulatifs de congés émis par l'employeur</span>
                  </li>
                  <li className="text-gray-700 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Demandes de congés et réponses de l'employeur (emails, courriers)</span>
                  </li>
                  <li className="text-gray-700 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Planning des congés de l'entreprise</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Références légales */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-3">📚</span>
              Références légales
            </h3>
            <div className="space-y-3 text-sm">
              <p className="text-gray-700">
                <strong>Art. L. 3141-1 et suivants</strong> : Droit aux congés payés (2,5 jours ouvrables par mois de travail effectif)
              </p>
              <p className="text-gray-700">
                <strong>Art. L. 3141-22 et suivants</strong> : Indemnité de congés payés (méthode du maintien de salaire ou règle du 1/10)
              </p>
              <p className="text-gray-700">
                <strong>Art. L. 3141-26</strong> : Indemnité compensatrice en cas de rupture du contrat
              </p>
              <p className="text-gray-700">
                <strong>Art. L. 3245-1</strong> : Prescription de 3 ans pour les actions en paiement de congés payés
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleRestart}
              className="flex-1 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              🔄 Nouveau diagnostic
            </button>
            <button
              className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              onClick={() => window.print()}
            >
              📄 Télécharger le rapport
            </button>
          </div>
        </main>

        {/* Footer avec fond sombre et texte blanc */}
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">
                ⚖️ Ce diagnostic est fourni à titre informatif. Il ne remplace pas les conseils d'un avocat.
              </p>
              <p className="text-sm text-gray-400">
                Pour un accompagnement personnalisé, consultez un avocat spécialisé en droit du travail.
              </p>
              <p className="text-xs text-gray-500 mt-4">
                © 2025 JustiJob - Tous droits réservés
              </p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header avec fond blanc et texte sombre */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/diagnostic" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">J</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">JustiJob</h1>
                <p className="text-xs text-gray-600">Diagnostic Congés Payés</p>
              </div>
            </Link>
            
            <Link 
              href="/diagnostic"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Retour
            </Link>
          </div>
        </div>
      </header>

      {/* Barre de progression */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Étape {currentStep} sur {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          
          {/* Étape 1 : Informations générales */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  📋 Informations générales
                </h2>
                <p className="text-gray-600">
                  Commençons par vos informations professionnelles
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quelle est votre situation professionnelle actuelle ? *
                </label>
                <select
                  value={formData.situationPro}
                  onChange={(e) => handleInputChange('situationPro', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="en_poste">En poste</option>
                  <option value="demission">Démission en cours</option>
                  <option value="licencie">Licencié(e)</option>
                  <option value="rupture_conv">Rupture conventionnelle</option>
                  <option value="fin_cdd">Fin de CDD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de contrat *
                </label>
                <select
                  value={formData.typeContrat}
                  onChange={(e) => handleInputChange('typeContrat', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="cdi">CDI</option>
                  <option value="cdd">CDD</option>
                  <option value="interim">Intérim</option>
                  <option value="apprentissage">Apprentissage</option>
                  <option value="professionnalisation">Professionnalisation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ancienneté dans l'entreprise (en années) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.anciennete}
                  onChange={(e) => handleInputChange('anciennete', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 5.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salaire brut mensuel (€) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.salaireBrut}
                  onChange={(e) => handleInputChange('salaireBrut', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 2500"
                />
              </div>
            </div>
          )}

          {/* Étape 2 : Gestion des congés payés */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  🏖️ Gestion de vos congés payés
                </h2>
                <p className="text-gray-600">
                  Détails sur vos congés payés acquis et pris
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de jours de congés payés acquis (solde total) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.congesAcquis}
                  onChange={(e) => handleInputChange('congesAcquis', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 25"
                />
                <p className="mt-2 text-sm text-gray-500">
                  💡 Rappel : 2,5 jours ouvrables par mois travaillé (30 jours par an pour une année complète)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de jours de congés payés pris *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.congesPris}
                  onChange={(e) => handleInputChange('congesPris', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Période d'acquisition de référence
                </label>
                <select
                  value={formData.periodeAcquisition}
                  onChange={(e) => handleInputChange('periodeAcquisition', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="1juin_31mai">1er juin N-1 au 31 mai N (légal)</option>
                  <option value="1jan_31dec">1er janvier au 31 décembre</option>
                  <option value="autre">Autre période conventionnelle</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  💡 Par défaut : période du 1er juin au 31 mai de l'année suivante
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de sortie de l'entreprise (si applicable)
                </label>
                <input
                  type="date"
                  value={formData.datesSortie}
                  onChange={(e) => handleInputChange('datesSortie', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Étape 3 : Problématique */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ⚠️ Nature du litige
                </h2>
                <p className="text-gray-600">
                  Quel est le problème concernant vos congés payés ?
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Sélectionnez tous les problèmes rencontrés *
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'conges_refuses', label: 'Congés refusés sans motif valable' },
                    { value: 'calcul_incorrect', label: 'Calcul incorrect des congés acquis' },
                    { value: 'cp_non_payes', label: 'Congés payés non payés à la sortie' },
                    { value: 'report_refuse', label: 'Report de congés refusé' },
                    { value: 'prise_imposee', label: 'Dates de congés imposées' },
                    { value: 'solde_conteste', label: 'Solde de congés contesté par l\'employeur' }
                  ].map(item => (
                    <label key={item.value} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.natureLitige.includes(item.value)}
                        onChange={() => handleCheckboxChange('natureLitige', item.value)}
                        className="mt-1 mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant total contesté (estimation en €)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.montantConteste}
                  onChange={(e) => handleInputChange('montantConteste', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 2500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  L'employeur a-t-il refusé formellement ?
                </label>
                <select
                  value={formData.refusEmployeur}
                  onChange={(e) => handleInputChange('refusEmployeur', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="ecrit">Oui, par écrit (email, courrier)</option>
                  <option value="oral">Oui, oralement</option>
                  <option value="silence">Non-réponse / silence</option>
                  <option value="non">Non, pas de refus</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quelles preuves possédez-vous ?
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'bulletins_paie', label: 'Bulletins de paie' },
                    { value: 'recap_conges', label: 'Récapitulatif de congés' },
                    { value: 'demandes_conges', label: 'Demandes de congés écrites' },
                    { value: 'emails', label: 'Emails / courriers' },
                    { value: 'planning', label: 'Planning de l\'entreprise' },
                    { value: 'contrat', label: 'Contrat de travail' }
                  ].map(item => (
                    <label key={item.value} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.preuves.includes(item.value)}
                        onChange={() => handleCheckboxChange('preuves', item.value)}
                        className="mt-1 mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Étape 4 : Calcul et indemnisation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  💰 Calcul et indemnisation
                </h2>
                <p className="text-gray-600">
                  Comment calculer vos droits aux congés payés
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>ℹ️ Information :</strong> L'indemnité de congés payés est calculée selon la méthode 
                  la plus favorable entre :
                </p>
                <ul className="mt-2 space-y-1 text-sm text-gray-700 ml-4">
                  <li>• <strong>Maintien de salaire</strong> : salaire habituel</li>
                  <li>• <strong>Règle du 1/10</strong> : 10% de la rémunération brute perçue pendant la période de référence</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quel mode de calcul utilise votre employeur ? *
                </label>
                <select
                  value={formData.modeCalcul}
                  onChange={(e) => handleInputChange('modeCalcul', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="maintien">Maintien de salaire</option>
                  <option value="dixieme">Règle du 1/10</option>
                  <option value="inconnu">Je ne sais pas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Les primes sont-elles incluses dans le calcul ?
                </label>
                <select
                  value={formData.primesIncluses}
                  onChange={(e) => handleInputChange('primesIncluses', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="oui">Oui, toutes les primes</option>
                  <option value="partiel">Certaines primes seulement</option>
                  <option value="non">Non, aucune prime</option>
                  <option value="inconnu">Je ne sais pas</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  💡 Les primes liées au travail effectif doivent être prises en compte dans le calcul
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de départ de l'entreprise
                </label>
                <input
                  type="date"
                  value={formData.dateDepart}
                  onChange={(e) => handleInputChange('dateDepart', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Si vous avez quitté ou allez quitter l'entreprise
                </p>
              </div>
            </div>
          )}

          {/* Étape 5 : Réclamation */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  🎯 Votre réclamation
                </h2>
                <p className="text-gray-600">
                  Dernières informations pour finaliser votre diagnostic
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Avez-vous déjà entrepris des démarches ?
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'courrier_employeur', label: 'Courrier à l\'employeur' },
                    { value: 'medecine_travail', label: 'Médecine du travail' },
                    { value: 'inspection', label: 'Inspection du travail' },
                    { value: 'syndicat', label: 'Syndicat' },
                    { value: 'avocat', label: 'Consultation avocat' },
                    { value: 'prudhommes', label: 'Saisine Prud\'hommes' }
                  ].map(item => (
                    <label key={item.value} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.demarchesDeja.includes(item.value)}
                        onChange={() => handleCheckboxChange('demarchesDeja', item.value)}
                        className="mt-1 mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quels sont vos objectifs ? *
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'paiement_cp', label: 'Obtenir le paiement de mes congés payés' },
                    { value: 'regularisation', label: 'Régularisation du solde de congés' },
                    { value: 'prise_conges', label: 'Pouvoir prendre mes congés' },
                    { value: 'dommages', label: 'Dommages et intérêts pour le préjudice subi' }
                  ].map(item => (
                    <label key={item.value} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.objectifs.includes(item.value)}
                        onChange={() => handleCheckboxChange('objectifs', item.value)}
                        className="mt-1 mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau d'urgence
                </label>
                <select
                  value={formData.urgence}
                  onChange={(e) => handleInputChange('urgence', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="immediat">Immédiat (départ imminent)</option>
                  <option value="court_terme">Court terme (1-3 mois)</option>
                  <option value="moyen_terme">Moyen terme (3-6 mois)</option>
                  <option value="pas_urgent">Pas urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Détails supplémentaires (optionnel)
                </label>
                <textarea
                  value={formData.detailsSituation}
                  onChange={(e) => handleInputChange('detailsSituation', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Précisez tout élément important pour votre situation..."
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                ← Précédent
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isStepValid(currentStep)
                    ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Suivant →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid(currentStep) || isCalculating}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isStepValid(currentStep) && !isCalculating
                    ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isCalculating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyse en cours...
                  </span>
                ) : (
                  '✨ Générer mon diagnostic'
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer avec fond sombre et texte blanc */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">
              ⚖️ Ce diagnostic est fourni à titre informatif. Il ne remplace pas les conseils d'un avocat.
            </p>
            <p className="text-sm text-gray-400">
              Pour un accompagnement personnalisé, consultez un avocat spécialisé en droit du travail.
            </p>
            <p className="text-xs text-gray-500 mt-4">
              © 2025 JustiJob - Tous droits réservés
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
