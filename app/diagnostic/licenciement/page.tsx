'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DiagnosticLicenciementOptimise() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showResults, setShowResults] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  
  const [formData, setFormData] = useState({
    // Informations générales
    typeLicenciement: '',
    anciennete: '',
    salaireBrut: '',
    age: '',
    effectifEntreprise: '',
    statut: '', // NOUVEAU : employé/cadre/agent_maitrise
    
    // Procédure
    convocationEntretien: '',
    delaiConvocation: '',
    entretienRealise: '',
    presenceAssistant: '',
    lettreRecue: '',
    delaiLettre: '',
    motifLettrePrecis: '', // NOUVEAU
    
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
    protectionSpeciale: '', // NOUVEAU : enceinte, salarié protégé, etc.
    
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

  // SAUVEGARDE AUTOMATIQUE
  useEffect(() => {
    if (Object.keys(formData).some(key => formData[key])) {
      localStorage.setItem('justijob_licenciement_draft', JSON.stringify(formData))
    }
  }, [formData])

  // CHARGEMENT SAUVEGARDE
  useEffect(() => {
    const saved = localStorage.getItem('justijob_licenciement_draft')
    if (saved) {
      try {
        const parsedData = JSON.parse(saved)
        const hasSavedData = Object.values(parsedData).some(val => 
          val !== '' && val !== false && val !== null && val !== undefined
        )
        
        if (hasSavedData) {
          const shouldRestore = window.confirm(
            "📋 Un diagnostic en cours a été trouvé. Voulez-vous le reprendre ?"
          )
          if (shouldRestore) {
            setFormData(parsedData)
          } else {
            localStorage.removeItem('justijob_licenciement_draft')
          }
        }
      } catch (e) {
        console.error('Erreur chargement sauvegarde:', e)
      }
    }
  }, [])

  // VALIDATION PAR ÉTAPE
  const validateStep = (step) => {
    const stepErrors = {}

    switch(step) {
      case 1:
        if (!formData.typeLicenciement) {
          stepErrors.typeLicenciement = "⚠️ Veuillez sélectionner le type de licenciement"
        }
        if (!formData.anciennete) {
          stepErrors.anciennete = "⚠️ L'ancienneté est requise"
        } else if (parseFloat(formData.anciennete) < 0) {
          stepErrors.anciennete = "⚠️ L'ancienneté doit être positive"
        } else if (parseFloat(formData.anciennete) > 50) {
          stepErrors.anciennete = "⚠️ Vérifiez l'ancienneté (maximum 50 ans)"
        }
        if (!formData.salaireBrut) {
          stepErrors.salaireBrut = "⚠️ Le salaire brut est requis"
        } else if (parseFloat(formData.salaireBrut) < 0) {
          stepErrors.salaireBrut = "⚠️ Le salaire doit être positif"
        } else if (parseFloat(formData.salaireBrut) < 1000) {
          stepErrors.salaireBrut = "⚠️ Le salaire semble trop faible (minimum SMIC)"
        }
        if (!formData.statut) {
          stepErrors.statut = "⚠️ Le statut est requis"
        }
        if (!formData.effectifEntreprise) {
          stepErrors.effectifEntreprise = "⚠️ L'effectif de l'entreprise est requis"
        }
        break

      case 2:
        if (!formData.convocationEntretien) {
          stepErrors.convocationEntretien = "⚠️ Cette information est requise"
        }
        if (formData.convocationEntretien === 'oui' && !formData.delaiConvocation) {
          stepErrors.delaiConvocation = "⚠️ Précisez le délai de convocation"
        }
        if (!formData.entretienRealise) {
          stepErrors.entretienRealise = "⚠️ Cette information est requise"
        }
        if (!formData.lettreRecue) {
          stepErrors.lettreRecue = "⚠️ Cette information est requise"
        }
        if (formData.lettreRecue === 'oui' && !formData.delaiLettre) {
          stepErrors.delaiLettre = "⚠️ Précisez le délai de la lettre"
        }
        break

      case 3:
        if (!formData.motifInvoque) {
          stepErrors.motifInvoque = "⚠️ Le motif invoqué est requis"
        }
        if (!formData.motifPrecis) {
          stepErrors.motifPrecis = "⚠️ Cette information est requise"
        }
        if (!formData.preuvesFournies) {
          stepErrors.preuvesFournies = "⚠️ Cette information est requise"
        }
        break

      case 4:
        if (!formData.avertissementsPrecedents) {
          stepErrors.avertissementsPrecedents = "⚠️ Cette information est requise"
        }
        if (!formData.evaluationsPerformance) {
          stepErrors.evaluationsPerformance = "⚠️ Cette information est requise"
        }
        if (!formData.harcelement) {
          stepErrors.harcelement = "⚠️ Cette information est requise"
        }
        if (!formData.discrimination) {
          stepErrors.discrimination = "⚠️ Cette information est requise"
        }
        break

      case 5:
        // Pas de validation obligatoire pour les preuves
        // Mais on peut avertir si aucune preuve
        const hasAnyProof = Object.keys(formData).some(key => 
          key.startsWith('preuves') && formData[key] === true
        )
        if (!hasAnyProof) {
          stepErrors.preuves = "⚠️ Recommandé : Cochez au moins une preuve disponible"
        }
        break
    }

    return stepErrors
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Marquer le champ comme touché
    setTouched(prev => ({ ...prev, [field]: true }))
    
    // Valider en temps réel
    if (errors[field]) {
      const stepErrors = validateStep(currentStep)
      setErrors(stepErrors)
    }
  }

  const nextStep = () => {
    const stepErrors = validateStep(currentStep)
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      // Marquer tous les champs de l'étape comme touchés
      Object.keys(stepErrors).forEach(key => {
        setTouched(prev => ({ ...prev, [key]: true }))
      })
      // Scroll vers le haut pour voir les erreurs
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    
    setErrors({})
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors({})
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // CALCULS JURIDIQUES OPTIMISÉS
  const calculateScore = () => {
    let score = 0
    let details = {
      procedure: 0,
      motif: 0,
      preuves: 0,
      contexte: 0
    }

    // 1. VICES DE PROCÉDURE (25 points max)
    if (formData.convocationEntretien === 'non') {
      details.procedure += 15 // Vice majeur
    } else if (formData.delaiConvocation === 'insuffisant') {
      details.procedure += 7
    } else if (formData.delaiConvocation === 'correct') {
      details.procedure += 2
    }
    
    if (formData.entretienRealise === 'non') {
      details.procedure += 10 // Vice très grave
    }
    
    if (formData.lettreRecue === 'non') {
      details.procedure += 15 // Vice majeur
    } else if (formData.delaiLettre === 'insuffisant') {
      details.procedure += 5
    } else if (formData.delaiLettre === 'tardif') {
      details.procedure += 6
    }

    // 2. FAIBLESSE DU MOTIF (35 points max)
    if (formData.motifPrecis === 'non') {
      details.motif += 20 // Motif imprécis = vice grave
    } else if (formData.motifPrecis === 'partiellement') {
      details.motif += 10
    }
    
    if (formData.preuvesFournies === 'aucune') {
      details.motif += 15 // Pas de preuves = très contestable
    } else if (formData.preuvesFournies === 'insuffisantes') {
      details.motif += 10
    } else if (formData.preuvesFournies === 'partielles') {
      details.motif += 5
    }
    
    if (formData.motifInvoque === 'insuffisance_pro' || 
        formData.motifInvoque === 'faute_simple') {
      details.motif += 5 // Plus facilement contestable
    }

    // 3. VOS PREUVES (25 points max)
    const nombrePreuves = [
      formData.preuvesConvocation,
      formData.preuvesEntretien,
      formData.preuvesLettreLicenciement,
      formData.preuvesContreMotif,
      formData.preuvesTemoins,
      formData.preuvesEmails,
      formData.preuvesEvaluations,
      formData.preuvesMedicales
    ].filter(p => p).length
    
    if (nombrePreuves >= 6) details.preuves = 25
    else if (nombrePreuves === 5) details.preuves = 20
    else if (nombrePreuves === 4) details.preuves = 15
    else if (nombrePreuves === 3) details.preuves = 10
    else if (nombrePreuves === 2) details.preuves = 5

    // 4. CONTEXTE AGGRAVANT (15 points max)
    if (formData.harcelement === 'oui') details.contexte += 8
    if (formData.discrimination === 'oui') details.contexte += 7
    if (formData.arretMaladie === 'recent') details.contexte += 5
    if (formData.evaluationsPerformance === 'positives') details.contexte += 5
    if (formData.protectionSpeciale === 'enceinte' || 
        formData.protectionSpeciale === 'salarie_protege') {
      details.contexte += 10 // Protection renforcée
    }

    // Limiter chaque catégorie à son max
    details.procedure = Math.min(25, details.procedure)
    details.motif = Math.min(35, details.motif)
    details.preuves = Math.min(25, details.preuves)
    details.contexte = Math.min(15, details.contexte)

    score = details.procedure + details.motif + details.preuves + details.contexte

    // CALCUL INDEMNITÉS OPTIMISÉ
    const anciennete = parseFloat(formData.anciennete) || 0
    const salaire = parseFloat(formData.salaireBrut) || 0
    const age = parseInt(formData.age) || 30
    const statut = formData.statut || 'employe'
    const typeLicenciement = formData.typeLicenciement
    
    let indemnites = {
      legale: 0,
      preavis: 0,
      congesPayes: 0,
      dommagesInterets: 0,
      total: 0
    }

    if (anciennete > 0 && salaire > 0) {
      // 1. INDEMNITÉ LÉGALE DE LICENCIEMENT (précise)
      if (anciennete >= 8/12) { // Seuil légal : 8 mois minimum
        if (anciennete < 10) {
          // Jusqu'à 10 ans : 1/4 de mois par année
          indemnites.legale = (salaire * anciennete) / 4
        } else {
          // Après 10 ans : 1/4 pour les 10 premières + 1/3 au-delà
          indemnites.legale = (salaire * 10) / 4 + (salaire * (anciennete - 10)) / 3
        }
      }

      // 2. INDEMNITÉ DE PRÉAVIS (selon statut et ancienneté)
      const isFauteGrave = typeLicenciement === 'faute_grave' || typeLicenciement === 'faute_lourde'
      
      if (!isFauteGrave) {
        if (statut === 'cadre') {
          // Cadres
          if (anciennete < 2) {
            indemnites.preavis = salaire * 2 // 2 mois
          } else {
            indemnites.preavis = salaire * 3 // 3 mois
          }
        } else if (statut === 'agent_maitrise') {
          // Agents de maîtrise
          if (anciennete < 2) {
            indemnites.preavis = salaire * 1.5 // 1.5 mois
          } else {
            indemnites.preavis = salaire * 2 // 2 mois
          }
        } else {
          // Employés
          if (anciennete < 6/12) {
            indemnites.preavis = 0
          } else if (anciennete < 2) {
            indemnites.preavis = salaire * 1 // 1 mois
          } else {
            indemnites.preavis = salaire * 2 // 2 mois
          }
        }
      }

      // 3. CONGÉS PAYÉS (10% du préavis)
      indemnites.congesPayes = indemnites.preavis * 0.10

      // 4. DOMMAGES ET INTÉRÊTS (Barème Macron précis 2024)
      if (score >= 70) {
        // Licenciement sans cause réelle et sérieuse
        // Barème selon ancienneté
        if (anciennete < 1) {
          indemnites.dommagesInterets = salaire * 1 // 1 mois
        } else if (anciennete < 2) {
          indemnites.dommagesInterets = salaire * 1.5 // 1.5 mois
        } else if (anciennete < 3) {
          indemnites.dommagesInterets = salaire * 2 // 2 mois
        } else if (anciennete < 5) {
          indemnites.dommagesInterets = salaire * 2.5 // 2.5 mois
        } else if (anciennete < 10) {
          indemnites.dommagesInterets = salaire * 3 // 3 mois
        } else if (anciennete < 20) {
          indemnites.dommagesInterets = salaire * 4 // 4 mois
        } else {
          indemnites.dommagesInterets = salaire * 5 // 5 mois
        }
        
        // Majoration si salarié de + de 50 ans
        if (age >= 50) {
          indemnites.dommagesInterets *= 1.2
        }
        
        // Majoration si protection spéciale
        if (formData.protectionSpeciale === 'enceinte' || 
            formData.protectionSpeciale === 'salarie_protege') {
          indemnites.dommagesInterets *= 1.5
        }
        
      } else if (score >= 50) {
        // Licenciement irrégulier (vice de procédure uniquement)
        if (anciennete >= 2) {
          indemnites.dommagesInterets = salaire * 1 // Maximum 1 mois
        } else {
          indemnites.dommagesInterets = salaire * 0.5 // Maximum 0.5 mois
        }
      }

      // Total
      indemnites.total = indemnites.legale + indemnites.preavis + 
                         indemnites.congesPayes + indemnites.dommagesInterets
    }

    return { 
      score: Math.min(100, score), 
      details, 
      indemnites 
    }
  }

  const handleSubmit = () => {
    const stepErrors = validateStep(currentStep)
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    
    setShowResults(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const results = showResults ? calculateScore() : null

  // Calcul du taux de complétion de l'étape
  const getStepCompletion = (step) => {
    let completed = 0
    let total = 0

    switch(step) {
      case 1:
        total = 5
        if (formData.typeLicenciement) completed++
        if (formData.anciennete) completed++
        if (formData.salaireBrut) completed++
        if (formData.statut) completed++
        if (formData.effectifEntreprise) completed++
        break
      case 2:
        total = 4
        if (formData.convocationEntretien) completed++
        if (formData.entretienRealise) completed++
        if (formData.lettreRecue) completed++
        if (formData.delaiConvocation || formData.convocationEntretien === 'non') completed++
        break
      case 3:
        total = 3
        if (formData.motifInvoque) completed++
        if (formData.motifPrecis) completed++
        if (formData.preuvesFournies) completed++
        break
      case 4:
        total = 4
        if (formData.avertissementsPrecedents) completed++
        if (formData.evaluationsPerformance) completed++
        if (formData.harcelement) completed++
        if (formData.discrimination) completed++
        break
      case 5:
        total = 8
        const preuves = [
          formData.preuvesConvocation, formData.preuvesEntretien,
          formData.preuvesLettreLicenciement, formData.preuvesContreMotif,
          formData.preuvesTemoins, formData.preuvesEmails,
          formData.preuvesEvaluations, formData.preuvesMedicales
        ]
        completed = preuves.filter(p => p).length
        break
    }

    return { completed, total, percentage: Math.round((completed / total) * 100) }
  }

  const currentStepCompletion = getStepCompletion(currentStep)

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
              Analyse complète de votre licenciement
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
              <div className="absolute inset-0 flex flex-col items-center justify-center">
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
                  💰 Indemnités estimées (calculs conformes au Code du travail)
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="text-left">
                    <div className="text-gray-600">Indemnité légale</div>
                    <div className="font-bold text-gray-900">{Math.round(results.indemnites.legale).toLocaleString()} €</div>
                    <div className="text-xs text-gray-500">
                      {parseFloat(formData.anciennete) >= 8/12 ? '✓ Ancienneté suffisante' : '✗ Ancienneté < 8 mois'}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-600">Préavis</div>
                    <div className="font-bold text-gray-900">{Math.round(results.indemnites.preavis).toLocaleString()} €</div>
                    <div className="text-xs text-gray-500">
                      {formData.statut === 'cadre' ? 'Cadre: 2-3 mois' : 
                       formData.statut === 'agent_maitrise' ? 'AM: 1.5-2 mois' : 'Employé: 1-2 mois'}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-600">Congés payés (10%)</div>
                    <div className="font-bold text-gray-900">{Math.round(results.indemnites.congesPayes).toLocaleString()} €</div>
                    <div className="text-xs text-gray-500">Sur préavis</div>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-600">Dommages & intérêts</div>
                    <div className="font-bold text-green-700">{Math.round(results.indemnites.dommagesInterets).toLocaleString()} €</div>
                    <div className="text-xs text-gray-500">
                      {results.score >= 70 ? 'Sans cause réelle' : results.score >= 50 ? 'Irrégularité' : 'Non applicable'}
                    </div>
                  </div>
                </div>
                <div className="border-t border-green-300 pt-3">
                  <div className="text-sm text-green-800 mb-1">Total récupérable estimé</div>
                  <div className="text-3xl font-bold text-green-900">
                    {Math.round(results.indemnites.total).toLocaleString()} €
                  </div>
                  <p className="text-xs text-green-700 mt-2">
                    ✓ Calculs conformes au Code du travail et barème Macron 2024
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
                    {results.score >= 70 && <li>• Votre dossier est solide : n'hésitez pas à agir</li>}
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
                    {!formData.preuvesEmails && <li>• Conservez tous les emails pertinents</li>}
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

            <button 
              onClick={() => router.push('/paiement')}
              className="bg-white text-red-600 font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all"
            >
              🎯 Commander mon dossier complet
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
                localStorage.removeItem('justijob_licenciement_draft')
              }}
              className="bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              🔄 Nouveau diagnostic
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
                {step < currentStep ? '✓' : step}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-orange-600 transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Étape {currentStep} sur {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-700">
              Complétion : {currentStepCompletion.percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Affichage des erreurs globales */}
      {Object.keys(errors).length > 0 && (
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-red-600 text-xl">⚠️</span>
              <div>
                <h3 className="font-bold text-red-900 mb-1">
                  Veuillez corriger les erreurs suivantes :
                </h3>
                <ul className="text-sm text-red-800 space-y-1">
                  {Object.values(errors).map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                    errors.typeLicenciement && touched.typeLicenciement ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Sélectionnez</option>
                  <option value="faute_grave">Licenciement pour faute grave</option>
                  <option value="faute_lourde">Licenciement pour faute lourde</option>
                  <option value="faute_simple">Licenciement pour faute simple</option>
                  <option value="personnel">Licenciement pour motif personnel (non disciplinaire)</option>
                  <option value="economique">Licenciement économique</option>
                  <option value="inaptitude">Licenciement pour inaptitude</option>
                  <option value="insuffisance_pro">Insuffisance professionnelle</option>
                  <option value="ne_sais_pas">Je ne sais pas / Non précisé</option>
                </select>
                {errors.typeLicenciement && touched.typeLicenciement && (
                  <p className="text-red-600 text-sm mt-1">{errors.typeLicenciement}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre statut *
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) => handleChange('statut', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                    errors.statut && touched.statut ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Sélectionnez</option>
                  <option value="employe">Employé</option>
                  <option value="agent_maitrise">Agent de maîtrise</option>
                  <option value="cadre">Cadre</option>
                </select>
                {errors.statut && touched.statut && (
                  <p className="text-red-600 text-sm mt-1">{errors.statut}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  ℹ️ Le statut détermine la durée du préavis
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ancienneté dans l'entreprise (en années) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={formData.anciennete}
                  onChange={(e) => handleChange('anciennete', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                    errors.anciennete && touched.anciennete ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 3.5"
                  required
                />
                {errors.anciennete && touched.anciennete && (
                  <p className="text-red-600 text-sm mt-1">{errors.anciennete}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  ℹ️ L'ancienneté impacte les indemnités (seuil minimum : 8 mois)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salaire mensuel brut (€) *
                </label>
                <input
                  type="number"
                  step="50"
                  min="0"
                  value={formData.salaireBrut}
                  onChange={(e) => handleChange('salaireBrut', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                    errors.salaireBrut && touched.salaireBrut ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 2500"
                  required
                />
                {errors.salaireBrut && touched.salaireBrut && (
                  <p className="text-red-600 text-sm mt-1">{errors.salaireBrut}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  ℹ️ Base de calcul pour toutes les indemnités
                </p>
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
                <p className="text-xs text-gray-500 mt-1">
                  ℹ️ Majoration des indemnités si + de 50 ans
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Effectif de l'entreprise *
                </label>
                <select
                  value={formData.effectifEntreprise}
                  onChange={(e) => handleChange('effectifEntreprise', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                    errors.effectifEntreprise && touched.effectifEntreprise ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Sélectionnez</option>
                  <option value="1-10">Moins de 11 salariés</option>
                  <option value="11-50">11 à 50 salariés</option>
                  <option value="51-300">51 à 300 salariés</option>
                  <option value="300+">Plus de 300 salariés</option>
                </select>
                {errors.effectifEntreprise && touched.effectifEntreprise && (
                  <p className="text-red-600 text-sm mt-1">{errors.effectifEntreprise}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Protection spéciale
                </label>
                <select
                  value={formData.protectionSpeciale}
                  onChange={(e) => handleChange('protectionSpeciale', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Aucune protection spéciale</option>
                  <option value="enceinte">Femme enceinte / Congé maternité</option>
                  <option value="salarie_protege">Salarié protégé (délégué, élu CSE, syndicaliste)</option>
                  <option value="at_mp">Victime AT/MP</option>
                  <option value="handicap">Travailleur handicapé</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  ℹ️ Majoration importante si protection renforcée
                </p>
              </div>
            </div>
          )}

          {/* Questions - Étape 2 : Procédure */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avez-vous reçu une convocation à un entretien préalable ? *
                </label>
                <div className="space-y-2">
                  <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    errors.convocationEntretien && touched.convocationEntretien ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="convocationEntretien"
                      value="oui"
                      checked={formData.convocationEntretien === 'oui'}
                      onChange={(e) => handleChange('convocationEntretien', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Oui, j'ai reçu une convocation écrite</p>
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
                      <p className="font-medium">Non, aucune convocation</p>
                      <p className="text-sm text-red-600">⚠️ Vice de procédure grave</p>
                    </div>
                  </label>
                </div>
                {errors.convocationEntretien && touched.convocationEntretien && (
                  <p className="text-red-600 text-sm mt-1">{errors.convocationEntretien}</p>
                )}
              </div>

              {formData.convocationEntretien === 'oui' && (
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
                        <p className="text-sm text-gray-600">✓ Délai légal respecté</p>
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
                        <p className="text-sm text-orange-600">⚠️ Irrégularité de procédure</p>
                      </div>
                    </label>
                  </div>
                  {errors.delaiConvocation && touched.delaiConvocation && (
                    <p className="text-red-600 text-sm mt-1">{errors.delaiConvocation}</p>
                  )}
                </div>
              )}

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
                      <p className="font-medium">Oui, l'entretien a eu lieu</p>
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
                      <p className="text-sm text-red-600">⚠️ Vice de procédure très grave</p>
                    </div>
                  </label>
                </div>
                {errors.entretienRealise && touched.entretienRealise && (
                  <p className="text-red-600 text-sm mt-1">{errors.entretienRealise}</p>
                )}
              </div>

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
                {errors.lettreRecue && touched.lettreRecue && (
                  <p className="text-red-600 text-sm mt-1">{errors.lettreRecue}</p>
                )}
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
                        <p className="font-medium">Entre 2 jours et 1 mois</p>
                        <p className="text-sm text-gray-600">✓ Délai légal respecté</p>
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
                        <p className="font-medium">Moins de 2 jours</p>
                        <p className="text-sm text-orange-600">⚠️ Irrégularité</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="delaiLettre"
                        value="tardif"
                        checked={formData.delaiLettre === 'tardif'}
                        onChange={(e) => handleChange('delaiLettre', e.target.value)}
                      />
                      <div>
                        <p className="font-medium">Plus de 1 mois</p>
                        <p className="text-sm text-orange-600">⚠️ Irrégularité (délai excessif)</p>
                      </div>
                    </label>
                  </div>
                  {errors.delaiLettre && touched.delaiLettre && (
                    <p className="text-red-600 text-sm mt-1">{errors.delaiLettre}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Questions - Étape 3 : Motif */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quel est le motif principal invoqué dans la lettre de licenciement ? *
                </label>
                <select
                  value={formData.motifInvoque}
                  onChange={(e) => handleChange('motifInvoque', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                    errors.motifInvoque && touched.motifInvoque ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Sélectionnez</option>
                  <option value="faute_grave">Faute grave</option>
                  <option value="faute_lourde">Faute lourde</option>
                  <option value="faute_simple">Faute simple</option>
                  <option value="insuffisance_pro">Insuffisance professionnelle</option>
                  <option value="economique">Motif économique</option>
                  <option value="inaptitude">Inaptitude</option>
                  <option value="autre">Autre motif</option>
                </select>
                {errors.motifInvoque && touched.motifInvoque && (
                  <p className="text-red-600 text-sm mt-1">{errors.motifInvoque}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Le motif est-il précis et circonstancié dans la lettre ? *
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
                      <p className="font-medium">Oui, très précis (dates, faits, circonstances)</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="motifPrecis"
                      value="partiellement"
                      checked={formData.motifPrecis === 'partiellement'}
                      onChange={(e) => handleChange('motifPrecis', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Partiellement précis</p>
                      <p className="text-sm text-orange-600">⚠️ Peut être contestable</p>
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
                      <p className="text-sm text-red-600">⚠️ Vice grave (motif imprécis)</p>
                    </div>
                  </label>
                </div>
                {errors.motifPrecis && touched.motifPrecis && (
                  <p className="text-red-600 text-sm mt-1">{errors.motifPrecis}</p>
                )}
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
                      <p className="font-medium">Oui, nombreuses preuves</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="preuvesFournies"
                      value="partielles"
                      checked={formData.preuvesFournies === 'partielles'}
                      onChange={(e) => handleChange('preuvesFournies', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Quelques preuves partielles</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="preuvesFournies"
                      value="insuffisantes"
                      checked={formData.preuvesFournies === 'insuffisantes'}
                      onChange={(e) => handleChange('preuvesFournies', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Preuves insuffisantes</p>
                      <p className="text-sm text-orange-600">⚠️ Motif contestable</p>
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
                      <p className="text-sm text-red-600">⚠️ Motif très contestable</p>
                    </div>
                  </label>
                </div>
                {errors.preuvesFournies && touched.preuvesFournies && (
                  <p className="text-red-600 text-sm mt-1">{errors.preuvesFournies}</p>
                )}
              </div>
            </div>
          )}

          {/* Questions - Étape 4 : Contexte */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avez-vous reçu des avertissements ou sanctions avant ce licenciement ? *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="avertissementsPrecedents"
                      value="oui"
                      checked={formData.avertissementsPrecedents === 'oui'}
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
                      value="un_seul"
                      checked={formData.avertissementsPrecedents === 'un_seul'}
                      onChange={(e) => handleChange('avertissementsPrecedents', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Un seul avertissement</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="avertissementsPrecedents"
                      value="non"
                      checked={formData.avertissementsPrecedents === 'non'}
                      onChange={(e) => handleChange('avertissementsPrecedents', e.target.value)}
                    />
                    <div>
                      <p className="font-medium">Aucun avertissement</p>
                      <p className="text-sm text-green-600">✓ Favorable à votre dossier</p>
                    </div>
                  </label>
                </div>
                {errors.avertissementsPrecedents && touched.avertissementsPrecedents && (
                  <p className="text-red-600 text-sm mt-1">{errors.avertissementsPrecedents}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vos évaluations professionnelles étaient-elles positives ? *
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
                      <p className="text-sm text-green-600">✓ Très favorable</p>
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
                      <p className="font-medium">Pas d'évaluation</p>
                    </div>
                  </label>
                </div>
                {errors.evaluationsPerformance && touched.evaluationsPerformance && (
                  <p className="text-red-600 text-sm mt-1">{errors.evaluationsPerformance}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Étiez-vous victime de harcèlement moral ou sexuel ? *
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
                      <p className="text-sm text-green-600">✓ Contexte aggravant pour l'employeur</p>
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
                {errors.harcelement && touched.harcelement && (
                  <p className="text-red-600 text-sm mt-1">{errors.harcelement}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pensez-vous être victime de discrimination ? *
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
                      <p className="font-medium">Oui (âge, sexe, origine, santé, etc.)</p>
                      <p className="text-sm text-green-600">✓ Contexte aggravant</p>
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
                {errors.discrimination && touched.discrimination && (
                  <p className="text-red-600 text-sm mt-1">{errors.discrimination}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Étiez-vous en arrêt maladie au moment du licenciement ?
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
                      <p className="font-medium">Oui, en arrêt récent</p>
                      <p className="text-sm text-green-600">✓ Élément favorable</p>
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
                      <p className="font-medium">Arrêt ancien (> 6 mois)</p>
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

          {/* Questions - Étape 5 : Preuves */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  ℹ️ Cochez tous les documents et preuves que vous possédez. Plus vous avez de preuves, 
                  plus votre dossier sera solide.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.preuvesConvocation}
                    onChange={(e) => handleChange('preuvesConvocation', e.target.checked)}
                    className="w-5 h-5 text-red-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Convocation à l'entretien préalable</p>
                    <p className="text-sm text-gray-600">Lettre recommandée ou remise en main propre</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.preuvesEntretien}
                    onChange={(e) => handleChange('preuvesEntretien', e.target.checked)}
                    className="w-5 h-5 text-red-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Notes ou compte-rendu de l'entretien</p>
                    <p className="text-sm text-gray-600">Vos notes personnelles prises pendant l'entretien</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.preuvesLettreLicenciement}
                    onChange={(e) => handleChange('preuvesLettreLicenciement', e.target.checked)}
                    className="w-5 h-5 text-red-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Lettre de licenciement</p>
                    <p className="text-sm text-gray-600">Document officiel notifiant le licenciement</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.preuvesContreMotif}
                    onChange={(e) => handleChange('preuvesContreMotif', e.target.checked)}
                    className="w-5 h-5 text-red-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Preuves contredisant le motif invoqué</p>
                    <p className="text-sm text-gray-600">Documents prouvant que le motif est faux ou exagéré</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.preuvesTemoins}
                    onChange={(e) => handleChange('preuvesTemoins', e.target.checked)}
                    className="w-5 h-5 text-red-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Témoignages de collègues</p>
                    <p className="text-sm text-gray-600">Attestations écrites de témoins</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.preuvesEmails}
                    onChange={(e) => handleChange('preuvesEmails', e.target.checked)}
                    className="w-5 h-5 text-red-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Emails professionnels pertinents</p>
                    <p className="text-sm text-gray-600">Correspondances en lien avec le licenciement</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.preuvesEvaluations}
                    onChange={(e) => handleChange('preuvesEvaluations', e.target.checked)}
                    className="w-5 h-5 text-red-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Évaluations professionnelles</p>
                    <p className="text-sm text-gray-600">Entretiens annuels, feedbacks positifs</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.preuvesMedicales}
                    onChange={(e) => handleChange('preuvesMedicales', e.target.checked)}
                    className="w-5 h-5 text-red-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Certificats médicaux</p>
                    <p className="text-sm text-gray-600">Arrêts maladie, certificats liés au stress/harcèlement</p>
                  </div>
                </label>
              </div>

              {errors.preuves && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-900">{errors.preuves}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>←</span>
              <span>Précédent</span>
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                <span>Suivant</span>
                <span>→</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold hover:shadow-lg transition-all"
              >
                <span>🎯</span>
                <span>Voir mes résultats</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
