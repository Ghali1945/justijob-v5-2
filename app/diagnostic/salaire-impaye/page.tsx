'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface FormData {
  // Étape 1 : Informations générales
  situationPro: string
  typeContrat: string
  anciennete: string
  salaireBrut: string
  
  // Étape 2 : Détails des salaires impayés
  moisImpaye: string
  elementsImpaye: string[]
  montantPrimes: string
  montantHeuresSup: string
  montant13eme: string
  montantAvantages: string
  montantRemboursements: string
  
  // Étape 3 : Circonstances et contexte
  delaiRetard: string
  raisonEmployeur: string
  contactsEmployeur: string
  autresSalaries: string
  difficultes: string[]
  
  // Étape 4 : Preuves et documents
  documents: string[]
  communicationsEcrites: string
  temoignages: string
  relances: string
  
  // Étape 5 : Réclamation et actions
  actionsDemarches: string[]
  objectifs: string[]
  urgence: string
  conseils: string
}

interface Scores {
  preuves: number
  montantAnciennete: number
  gravite: number
  contexte: number
}

interface Montants {
  salairesDus: number
  primes: number
  heuresSup: number
  congesPayes: number
  treizieme: number
  avantages: number
  remboursements: number
  interetsRetard: number
  dommagesMoraux: number
  total: number
}

export default function DiagnosticSalairesImpaye() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    situationPro: '',
    typeContrat: '',
    anciennete: '',
    salaireBrut: '',
    moisImpaye: '',
    elementsImpaye: [],
    montantPrimes: '',
    montantHeuresSup: '',
    montant13eme: '',
    montantAvantages: '',
    montantRemboursements: '',
    delaiRetard: '',
    raisonEmployeur: '',
    contactsEmployeur: '',
    autresSalaries: '',
    difficultes: [],
    documents: [],
    communicationsEcrites: '',
    temoignages: '',
    relances: '',
    actionsDemarches: [],
    objectifs: [],
    urgence: '',
    conseils: ''
  })
  
  const [showResults, setShowResults] = useState(false)
  const [scores, setScores] = useState<Scores>({
    preuves: 0,
    montantAnciennete: 0,
    gravite: 0,
    contexte: 0
  })
  const [montants, setMontants] = useState<Montants>({
    salairesDus: 0,
    primes: 0,
    heuresSup: 0,
    congesPayes: 0,
    treizieme: 0,
    avantages: 0,
    remboursements: 0,
    interetsRetard: 0,
    dommagesMoraux: 0,
    total: 0
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Sauvegarde automatique
  useEffect(() => {
    if (Object.keys(formData).some(key => {
      const value = formData[key as keyof FormData]
      return Array.isArray(value) ? value.length > 0 : value !== ''
    })) {
      localStorage.setItem('justijob_salaires_draft', JSON.stringify(formData))
    }
  }, [formData])

  // Chargement au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('justijob_salaires_draft')
    if (saved) {
      const shouldRestore = window.confirm(
        "📋 Un diagnostic en cours a été trouvé. Voulez-vous le reprendre ?"
      )
      if (shouldRestore) {
        setFormData(JSON.parse(saved))
      } else {
        localStorage.removeItem('justijob_salaires_draft')
      }
    }
  }, [])

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Effacer l'erreur si le champ est corrigé
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (field: keyof FormData, value: string) => {
    const currentValues = formData[field] as string[]
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    handleInputChange(field, newValues)
  }

  const validateStep = (step: number): boolean => {
    const stepErrors: {[key: string]: string} = {}

    if (step === 1) {
      if (!formData.situationPro) {
        stepErrors.situationPro = "⚠️ La situation professionnelle est requise"
      }
      if (!formData.typeContrat) {
        stepErrors.typeContrat = "⚠️ Le type de contrat est requis"
      }
      if (!formData.anciennete) {
        stepErrors.anciennete = "⚠️ L'ancienneté est requise"
      } else if (parseFloat(formData.anciennete) < 0) {
        stepErrors.anciennete = "⚠️ L'ancienneté doit être positive"
      } else if (parseFloat(formData.anciennete) > 50) {
        stepErrors.anciennete = "⚠️ Vérifiez l'ancienneté (maximum 50 ans)"
      }
      if (!formData.salaireBrut) {
        stepErrors.salaireBrut = "⚠️ Le salaire brut mensuel est requis"
      } else if (parseFloat(formData.salaireBrut) < 1000) {
        stepErrors.salaireBrut = "⚠️ Le salaire semble trop faible (minimum SMIC)"
      } else if (parseFloat(formData.salaireBrut) > 50000) {
        stepErrors.salaireBrut = "⚠️ Vérifiez le salaire (maximum 50 000€)"
      }
    }

    if (step === 2) {
      if (!formData.moisImpaye) {
        stepErrors.moisImpaye = "⚠️ Le nombre de mois impayés est requis"
      } else if (parseInt(formData.moisImpaye) < 1) {
        stepErrors.moisImpaye = "⚠️ Le nombre de mois doit être au moins 1"
      } else if (parseInt(formData.moisImpaye) > 36) {
        stepErrors.moisImpaye = "⚠️ Le nombre de mois ne peut dépasser 36 (prescription de 3 ans)"
      }
      if (formData.elementsImpaye.length === 0) {
        stepErrors.elementsImpaye = "⚠️ Sélectionnez au moins un élément impayé"
      }
      
      // Validation des montants des éléments sélectionnés
      if (formData.elementsImpaye.includes('primes') && !formData.montantPrimes) {
        stepErrors.montantPrimes = "⚠️ Montant des primes requis"
      }
      if (formData.elementsImpaye.includes('heures_sup') && !formData.montantHeuresSup) {
        stepErrors.montantHeuresSup = "⚠️ Montant des heures sup requises"
      }
      if (formData.elementsImpaye.includes('13eme') && !formData.montant13eme) {
        stepErrors.montant13eme = "⚠️ Montant du 13ème mois requis"
      }
      if (formData.elementsImpaye.includes('avantages') && !formData.montantAvantages) {
        stepErrors.montantAvantages = "⚠️ Montant des avantages requis"
      }
      if (formData.elementsImpaye.includes('remboursements') && !formData.montantRemboursements) {
        stepErrors.montantRemboursements = "⚠️ Montant des remboursements requis"
      }
    }

    if (step === 3) {
      if (!formData.delaiRetard) {
        stepErrors.delaiRetard = "⚠️ Le délai de retard est requis"
      } else if (parseInt(formData.delaiRetard) < 0) {
        stepErrors.delaiRetard = "⚠️ Le délai doit être positif"
      } else if (parseInt(formData.delaiRetard) > 36) {
        stepErrors.delaiRetard = "⚠️ Le délai ne peut dépasser 36 mois"
      }
      if (!formData.raisonEmployeur) {
        stepErrors.raisonEmployeur = "⚠️ La raison de l'employeur est requise"
      }
      if (!formData.contactsEmployeur) {
        stepErrors.contactsEmployeur = "⚠️ Les contacts avec l'employeur sont requis"
      }
      if (!formData.autresSalaries) {
        stepErrors.autresSalaries = "⚠️ Indiquez si d'autres salariés sont concernés"
      }
      if (formData.difficultes.length === 0) {
        stepErrors.difficultes = "⚠️ Sélectionnez au moins une difficulté rencontrée"
      }
    }

    if (step === 4) {
      if (formData.documents.length === 0) {
        stepErrors.documents = "⚠️ Sélectionnez au moins un document disponible"
      }
      if (!formData.communicationsEcrites) {
        stepErrors.communicationsEcrites = "⚠️ Les communications écrites sont requises"
      }
      if (!formData.temoignages) {
        stepErrors.temoignages = "⚠️ Indiquez si vous avez des témoignages"
      }
      if (!formData.relances) {
        stepErrors.relances = "⚠️ Les relances effectuées sont requises"
      }
    }

    if (step === 5) {
      if (formData.actionsDemarches.length === 0) {
        stepErrors.actionsDemarches = "⚠️ Sélectionnez au moins une action entreprise"
      }
      if (formData.objectifs.length === 0) {
        stepErrors.objectifs = "⚠️ Sélectionnez au moins un objectif"
      }
      if (!formData.urgence) {
        stepErrors.urgence = "⚠️ Le niveau d'urgence est requis"
      }
    }

    setErrors(stepErrors)
    
    if (Object.keys(stepErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return false
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const calculateScores = () => {
    let preuves = 0
    let montantAnciennete = 0
    let gravite = 0
    let contexte = 0

    // Score PREUVES (35 points max)
    // Documents (20 points)
    const docsWeight = {
      contrats: 4,
      fiches_paie: 5,
      courriers: 3,
      emails: 3,
      releves: 3,
      attestations: 2
    }
    formData.documents.forEach(doc => {
      preuves += docsWeight[doc as keyof typeof docsWeight] || 0
    })

    // Communications écrites (8 points)
    if (formData.communicationsEcrites === 'nombreuses') preuves += 8
    else if (formData.communicationsEcrites === 'quelques') preuves += 5
    else if (formData.communicationsEcrites === 'une') preuves += 2

    // Témoignages (4 points)
    if (formData.temoignages === 'plusieurs') preuves += 4
    else if (formData.temoignages === 'un') preuves += 2

    // Relances (3 points)
    if (formData.relances === 'multiples_ecrites') preuves += 3
    else if (formData.relances === 'quelques') preuves += 2
    else if (formData.relances === 'une') preuves += 1

    // Score MONTANT ET ANCIENNETÉ (25 points max)
    const moisImpaye = parseInt(formData.moisImpaye) || 0
    const anciennete = parseFloat(formData.anciennete) || 0

    // Montant impayé (15 points)
    if (moisImpaye >= 6) montantAnciennete += 15
    else if (moisImpaye >= 4) montantAnciennete += 12
    else if (moisImpaye >= 2) montantAnciennete += 8
    else montantAnciennete += 4

    // Ancienneté (10 points)
    if (anciennete >= 10) montantAnciennete += 10
    else if (anciennete >= 5) montantAnciennete += 7
    else if (anciennete >= 2) montantAnciennete += 5
    else if (anciennete >= 1) montantAnciennete += 3
    else montantAnciennete += 1

    // Score GRAVITÉ (25 points max)
    const delai = parseInt(formData.delaiRetard) || 0
    
    // Délai de retard (10 points)
    if (delai >= 6) gravite += 10
    else if (delai >= 4) gravite += 8
    else if (delai >= 2) gravite += 5
    else gravite += 2

    // Raison employeur (8 points)
    if (formData.raisonEmployeur === 'aucune') gravite += 8
    else if (formData.raisonEmployeur === 'difficultes_non_prouvees') gravite += 5
    else if (formData.raisonEmployeur === 'difficultes_prouvees') gravite += 2

    // Difficultes subies (7 points)
    const difficultesWeight = {
      impossibilite_loyer: 2,
      dettes: 2,
      credit_refus: 1,
      situation_familiale: 1,
      stress_anxiete: 1
    }
    formData.difficultes.forEach(diff => {
      gravite += difficultesWeight[diff as keyof typeof difficultesWeight] || 0
    })

    // Score CONTEXTE FAVORABLE (15 points max)
    // Autres salariés concernés (5 points)
    if (formData.autresSalaries === 'oui_plusieurs') contexte += 5
    else if (formData.autresSalaries === 'oui_un') contexte += 3
    else if (formData.autresSalaries === 'non') contexte += 0

    // Type de contrat (5 points)
    if (formData.typeContrat === 'cdi') contexte += 5
    else if (formData.typeContrat === 'cdd') contexte += 3
    else contexte += 1

    // Actions déjà entreprises (5 points)
    if (formData.actionsDemarches.includes('mise_demeure')) contexte += 2
    if (formData.actionsDemarches.includes('inspection_travail')) contexte += 2
    if (formData.actionsDemarches.includes('conseil_prudhommes')) contexte += 1

    return { preuves, montantAnciennete, gravite, contexte }
  }

  const calculateMontants = () => {
    const salaire = parseFloat(formData.salaireBrut) || 0
    const moisImpaye = parseInt(formData.moisImpaye) || 0
    const delaiMois = parseInt(formData.delaiRetard) || 0

    let montantsCalc: Montants = {
      salairesDus: 0,
      primes: 0,
      heuresSup: 0,
      congesPayes: 0,
      treizieme: 0,
      avantages: 0,
      remboursements: 0,
      interetsRetard: 0,
      dommagesMoraux: 0,
      total: 0
    }

    // 1. Salaires de base impayés
    montantsCalc.salairesDus = salaire * moisImpaye

    // 2. Autres éléments impayés
    if (formData.elementsImpaye.includes('primes')) {
      montantsCalc.primes = parseFloat(formData.montantPrimes) || (salaire * 0.10 * moisImpaye)
    }
    if (formData.elementsImpaye.includes('heures_sup')) {
      montantsCalc.heuresSup = parseFloat(formData.montantHeuresSup) || (salaire * 0.15 * moisImpaye)
    }
    if (formData.elementsImpaye.includes('conges_payes')) {
      montantsCalc.congesPayes = salaire * 0.10 * moisImpaye
    }
    if (formData.elementsImpaye.includes('13eme')) {
      montantsCalc.treizieme = parseFloat(formData.montant13eme) || (salaire * moisImpaye / 12)
    }
    if (formData.elementsImpaye.includes('avantages')) {
      montantsCalc.avantages = parseFloat(formData.montantAvantages) || (salaire * 0.05 * moisImpaye)
    }
    if (formData.elementsImpaye.includes('remboursements')) {
      montantsCalc.remboursements = parseFloat(formData.montantRemboursements) || (200 * moisImpaye)
    }

    // 3. Intérêts de retard (10% par an, soit 0.833% par mois)
    const montantBase = montantsCalc.salairesDus + montantsCalc.primes + 
                        montantsCalc.heuresSup + montantsCalc.congesPayes + 
                        montantsCalc.treizieme + montantsCalc.avantages + 
                        montantsCalc.remboursements
    
    const tauxInteretMensuel = 0.10 / 12 // 10% annuel = 0.833% mensuel
    montantsCalc.interetsRetard = montantBase * tauxInteretMensuel * delaiMois

    // 4. Dommages et intérêts pour préjudice moral
    const scoreTotal = scores.preuves + scores.montantAnciennete + scores.gravite + scores.contexte
    
    if (scoreTotal >= 70) {
      // Préjudice élevé
      if (formData.difficultes.includes('impossibilite_loyer') || 
          formData.difficultes.includes('dettes')) {
        montantsCalc.dommagesMoraux = salaire * 2 // 2 mois
      } else if (formData.difficultes.includes('credit_refus') || 
                 formData.difficultes.includes('stress_anxiete')) {
        montantsCalc.dommagesMoraux = salaire * 1.5 // 1.5 mois
      } else {
        montantsCalc.dommagesMoraux = salaire * 1 // 1 mois
      }
    } else if (scoreTotal >= 50) {
      // Préjudice moyen
      montantsCalc.dommagesMoraux = salaire * 0.5 // 0.5 mois
    } else if (scoreTotal >= 30) {
      // Préjudice faible
      montantsCalc.dommagesMoraux = salaire * 0.25 // 0.25 mois
    }

    // Total
    montantsCalc.total = montantsCalc.salairesDus + montantsCalc.primes + 
                         montantsCalc.heuresSup + montantsCalc.congesPayes + 
                         montantsCalc.treizieme + montantsCalc.avantages + 
                         montantsCalc.remboursements + montantsCalc.interetsRetard + 
                         montantsCalc.dommagesMoraux

    return montantsCalc
  }

  const handleSubmit = () => {
    if (validateStep(5)) {
      const calculatedScores = calculateScores()
      setScores(calculatedScores)
      
      // Calculer les montants après avoir mis à jour les scores
      const tempMontants = calculateMontants()
      
      // Recalculer les dommages avec les bons scores
      const scoreTotal = calculatedScores.preuves + calculatedScores.montantAnciennete + 
                         calculatedScores.gravite + calculatedScores.contexte
      const salaire = parseFloat(formData.salaireBrut) || 0
      
      if (scoreTotal >= 70) {
        if (formData.difficultes.includes('impossibilite_loyer') || 
            formData.difficultes.includes('dettes')) {
          tempMontants.dommagesMoraux = salaire * 2
        } else if (formData.difficultes.includes('credit_refus') || 
                   formData.difficultes.includes('stress_anxiete')) {
          tempMontants.dommagesMoraux = salaire * 1.5
        } else {
          tempMontants.dommagesMoraux = salaire * 1
        }
      } else if (scoreTotal >= 50) {
        tempMontants.dommagesMoraux = salaire * 0.5
      } else if (scoreTotal >= 30) {
        tempMontants.dommagesMoraux = salaire * 0.25
      }
      
      tempMontants.total = tempMontants.salairesDus + tempMontants.primes + 
                           tempMontants.heuresSup + tempMontants.congesPayes + 
                           tempMontants.treizieme + tempMontants.avantages + 
                           tempMontants.remboursements + tempMontants.interetsRetard + 
                           tempMontants.dommagesMoraux
      
      setMontants(tempMontants)
      setShowResults(true)
      localStorage.removeItem('justijob_salaires_draft')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const resetForm = () => {
    setFormData({
      situationPro: '',
      typeContrat: '',
      anciennete: '',
      salaireBrut: '',
      moisImpaye: '',
      elementsImpaye: [],
      montantPrimes: '',
      montantHeuresSup: '',
      montant13eme: '',
      montantAvantages: '',
      montantRemboursements: '',
      delaiRetard: '',
      raisonEmployeur: '',
      contactsEmployeur: '',
      autresSalaries: '',
      difficultes: [],
      documents: [],
      communicationsEcrites: '',
      temoignages: '',
      relances: '',
      actionsDemarches: [],
      objectifs: [],
      urgence: '',
      conseils: ''
    })
    setCurrentStep(1)
    setShowResults(false)
    setErrors({})
    localStorage.removeItem('justijob_salaires_draft')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getStepCompletion = (step: number) => {
    let completed = 0
    let total = 0

    if (step === 1) {
      total = 4
      if (formData.situationPro) completed++
      if (formData.typeContrat) completed++
      if (formData.anciennete) completed++
      if (formData.salaireBrut) completed++
    } else if (step === 2) {
      total = 2 + formData.elementsImpaye.length
      if (formData.moisImpaye) completed++
      if (formData.elementsImpaye.length > 0) completed++
      if (formData.elementsImpaye.includes('primes') && formData.montantPrimes) completed++
      if (formData.elementsImpaye.includes('heures_sup') && formData.montantHeuresSup) completed++
      if (formData.elementsImpaye.includes('13eme') && formData.montant13eme) completed++
      if (formData.elementsImpaye.includes('avantages') && formData.montantAvantages) completed++
      if (formData.elementsImpaye.includes('remboursements') && formData.montantRemboursements) completed++
    } else if (step === 3) {
      total = 5
      if (formData.delaiRetard) completed++
      if (formData.raisonEmployeur) completed++
      if (formData.contactsEmployeur) completed++
      if (formData.autresSalaries) completed++
      if (formData.difficultes.length > 0) completed++
    } else if (step === 4) {
      total = 4
      if (formData.documents.length > 0) completed++
      if (formData.communicationsEcrites) completed++
      if (formData.temoignages) completed++
      if (formData.relances) completed++
    } else if (step === 5) {
      total = 3
      if (formData.actionsDemarches.length > 0) completed++
      if (formData.objectifs.length > 0) completed++
      if (formData.urgence) completed++
    }

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { completed, total, percentage }
  }

  const totalScore = scores.preuves + scores.montantAnciennete + scores.gravite + scores.contexte

  const getRecommendations = () => {
    const recs = []
    const score = totalScore

    // Recommandations urgentes
    if (formData.urgence === 'tres_urgent' || parseInt(formData.delaiRetard) >= 6) {
      recs.push({
        title: "🚨 ACTION URGENTE",
        description: "Envoyez immédiatement une mise en demeure avec AR pour stopper la prescription (3 ans pour les salaires). Consultez un avocat spécialisé en droit du travail sans délai."
      })
    }

    // Prescription
    const delai = parseInt(formData.delaiRetard) || 0
    if (delai >= 30) {
      recs.push({
        title: "⚠️ ATTENTION PRESCRIPTION",
        description: "Vous approchez des 3 ans de prescription pour les salaires impayés (Art. L3245-1). Agissez MAINTENANT pour ne pas perdre vos droits."
      })
    } else if (delai >= 24) {
      recs.push({
        title: "⏰ DÉLAI DE PRESCRIPTION",
        description: "Vous avez moins d'un an avant la prescription des salaires les plus anciens. Engagez rapidement une procédure prud'homale."
      })
    }

    // Renforcement des preuves
    if (scores.preuves < 20) {
      recs.push({
        title: "📄 RENFORCEZ VOS PREUVES",
        description: "Rassemblez un maximum de documents : fiches de paie, contrat, emails, SMS, relevés bancaires. Demandez des attestations de collègues. Plus vous avez de preuves, plus votre dossier est solide."
      })
    }

    // Mise en demeure
    if (!formData.actionsDemarches.includes('mise_demeure')) {
      recs.push({
        title: "📧 ENVOYEZ UNE MISE EN DEMEURE",
        description: "Envoyez une mise en demeure par lettre recommandée avec AR réclamant le paiement des sommes dues sous 8 jours. C'est une étape OBLIGATOIRE avant toute action judiciaire."
      })
    }

    // Procédure collective
    if (formData.autresSalaries === 'oui_plusieurs') {
      recs.push({
        title: "👥 PROCÉDURE COLLECTIVE",
        description: "Plusieurs salariés sont concernés. Coordonnez-vous pour une action collective aux Prud'hommes ou contactez ensemble l'Inspection du Travail. Vous serez plus forts ensemble."
      })
    }

    // Inspection du travail
    if (!formData.actionsDemarches.includes('inspection_travail') && score >= 50) {
      recs.push({
        title: "🏛️ CONTACTEZ L'INSPECTION DU TRAVAIL",
        description: "Signalez la situation à l'Inspection du Travail (DREETS). Ils peuvent effectuer un contrôle et mettre en demeure l'employeur de régulariser."
      })
    }

    // Conseil juridique
    if (score >= 60 || montants.total >= 10000) {
      recs.push({
        title: "⚖️ CONSULTEZ UN AVOCAT SPÉCIALISÉ",
        description: "Votre dossier présente des enjeux importants. Un avocat spécialisé en droit du travail pourra vous défendre efficacement aux Prud'hommes et maximiser vos chances de récupérer l'intégralité des sommes dues."
      })
    }

    // Aide juridictionnelle
    if (formData.difficultes.includes('dettes') || formData.difficultes.includes('impossibilite_loyer')) {
      recs.push({
        title: "💰 AIDE JURIDICTIONNELLE",
        description: "Vu votre situation financière difficile, vous pouvez demander l'aide juridictionnelle pour bénéficier d'un avocat gratuit ou à tarif réduit. Renseignez-vous auprès du tribunal des Prud'hommes."
      })
    }

    // Accompagnement syndical
    recs.push({
      title: "🤝 ACCOMPAGNEMENT SYNDICAL",
      description: "Contactez un syndicat (CGT, CFDT, FO...). Ils peuvent vous accompagner gratuitement dans vos démarches et devant les Prud'hommes."
    })

    return recs
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                JustiJob
              </h1>
            </Link>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              💰 Résultats de votre diagnostic : Salaires impayés
            </h2>
            <p className="text-gray-600">
              Analyse complète de votre situation et estimation des montants récupérables
            </p>
          </div>

          {/* Score global */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl">
                <div className="text-center">
                  <div className="text-5xl font-bold">{totalScore}</div>
                  <div className="text-sm">/ 100</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mt-6 mb-2">
                {totalScore >= 70 ? "🟢 Dossier SOLIDE" :
                 totalScore >= 50 ? "🟡 Dossier MOYEN" :
                 totalScore >= 30 ? "🟠 Dossier FRAGILE" :
                 "🔴 Dossier FAIBLE"}
              </h3>
              <p className="text-gray-600">
                {totalScore >= 70 ? "Excellentes chances de récupérer l'intégralité des sommes" :
                 totalScore >= 50 ? "Bonnes chances de récupérer une partie importante" :
                 totalScore >= 30 ? "Il faudra renforcer vos preuves" :
                 "Dossier à consolider avant toute action"}
              </p>
            </div>

            {/* Détail des scores */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600">{scores.preuves}/35</div>
                <div className="text-sm font-medium text-gray-700 mt-2">Preuves documentaires</div>
                <div className="text-xs text-gray-500 mt-1">
                  {scores.preuves >= 25 ? "Excellent" :
                   scores.preuves >= 15 ? "Bon" :
                   scores.preuves >= 10 ? "Moyen" : "À renforcer"}
                </div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600">{scores.montantAnciennete}/25</div>
                <div className="text-sm font-medium text-gray-700 mt-2">Montant & ancienneté</div>
                <div className="text-xs text-gray-500 mt-1">
                  {scores.montantAnciennete >= 18 ? "Élevé" :
                   scores.montantAnciennete >= 12 ? "Moyen" : "Faible"}
                </div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="text-3xl font-bold text-red-600">{scores.gravite}/25</div>
                <div className="text-sm font-medium text-gray-700 mt-2">Gravité du manquement</div>
                <div className="text-xs text-gray-500 mt-1">
                  {scores.gravite >= 18 ? "Grave" :
                   scores.gravite >= 12 ? "Moyen" : "Faible"}
                </div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600">{scores.contexte}/15</div>
                <div className="text-sm font-medium text-gray-700 mt-2">Contexte favorable</div>
                <div className="text-xs text-gray-500 mt-1">
                  {scores.contexte >= 10 ? "Favorable" :
                   scores.contexte >= 6 ? "Moyen" : "Défavorable"}
                </div>
              </div>
            </div>
          </div>

          {/* Montants estimés */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              💶 Montants récupérables estimés
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-800">Salaires de base impayés</div>
                  <div className="text-sm text-gray-600">
                    {formData.moisImpaye} mois × {parseFloat(formData.salaireBrut).toLocaleString()}€
                  </div>
                </div>
                <div className="text-xl font-bold text-gray-800">
                  {montants.salairesDus.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </div>
              </div>

              {montants.primes > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">Primes impayées</div>
                    <div className="text-sm text-gray-600">Montant déclaré ou estimé</div>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {montants.primes.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </div>
                </div>
              )}

              {montants.heuresSup > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">Heures supplémentaires</div>
                    <div className="text-sm text-gray-600">Montant déclaré ou estimé</div>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {montants.heuresSup.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </div>
                </div>
              )}

              {montants.congesPayes > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">Congés payés non pris</div>
                    <div className="text-sm text-gray-600">10% des salaires de base</div>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {montants.congesPayes.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </div>
                </div>
              )}

              {montants.treizieme > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">13ème mois</div>
                    <div className="text-sm text-gray-600">Montant déclaré ou proratisé</div>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {montants.treizieme.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </div>
                </div>
              )}

              {montants.avantages > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">Avantages en nature</div>
                    <div className="text-sm text-gray-600">Montant déclaré ou estimé</div>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {montants.avantages.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </div>
                </div>
              )}

              {montants.remboursements > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">Remboursements de frais</div>
                    <div className="text-sm text-gray-600">Montant déclaré ou estimé</div>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {montants.remboursements.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div>
                  <div className="font-semibold text-blue-800">Intérêts de retard</div>
                  <div className="text-sm text-blue-600">
                    10% par an sur {parseInt(formData.delaiRetard)} mois de retard (Art. L3245-1)
                  </div>
                </div>
                <div className="text-xl font-bold text-blue-800">
                  {montants.interetsRetard.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </div>
              </div>

              {montants.dommagesMoraux > 0 && (
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <div>
                    <div className="font-semibold text-purple-800">Dommages et intérêts</div>
                    <div className="text-sm text-purple-600">
                      Préjudice moral lié aux difficultés subies
                    </div>
                  </div>
                  <div className="text-xl font-bold text-purple-800">
                    {montants.dommagesMoraux.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </div>
                </div>
              )}
            </div>

            <div className="border-t-2 border-gray-200 pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold text-gray-800">TOTAL ESTIMÉ</div>
                  <div className="text-sm text-gray-600 mt-1">
                    ✅ Conforme au Code du travail 2024
                  </div>
                </div>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {montants.total.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Important :</strong> Ces montants sont des <strong>estimations</strong> basées sur les informations fournies. 
                Les montants réellement obtenus dépendront des preuves apportées, de la décision du Conseil de Prud'hommes, 
                et de la capacité financière de l'employeur. Un avocat spécialisé pourra affiner cette estimation.
              </p>
            </div>
          </div>

          {/* Recommandations */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              💡 Recommandations personnalisées
            </h3>
            <div className="space-y-4">
              {getRecommendations().map((rec, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-bold text-gray-800 mb-2">{rec.title}</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Informations légales */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white mb-8">
            <h3 className="text-2xl font-bold mb-4">⚖️ Informations légales importantes</h3>
            <div className="space-y-3 text-sm">
              <p>
                <strong>Prescription :</strong> Vous avez 3 ans à compter de la date d'exigibilité du salaire pour saisir 
                les Prud'hommes (Art. L3245-1 du Code du travail). Au-delà, vos droits sont perdus.
              </p>
              <p>
                <strong>Mise en demeure obligatoire :</strong> Avant toute action judiciaire, vous devez envoyer une 
                mise en demeure par lettre recommandée avec AR demandant le paiement sous 8 jours.
              </p>
              <p>
                <strong>Intérêts de retard :</strong> Le taux légal est de 10% par an (Art. L3245-1). Les intérêts courent 
                à compter de la réception de la mise en demeure.
              </p>
              <p>
                <strong>Tribunal compétent :</strong> Conseil de Prud'hommes du lieu où le travail est (ou était) exécuté, 
                ou du lieu où l'employeur est établi.
              </p>
              <p>
                <strong>Gratuité :</strong> La procédure prud'homale est gratuite. Vous pouvez vous défendre seul ou être 
                assisté gratuitement par un syndicat.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetForm}
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg border-2 border-gray-200"
            >
              🔄 Nouveau diagnostic
            </button>
            <Link href="/">
              <button className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 shadow-lg">
                🏠 Retour à l'accueil
              </button>
            </Link>
            <button
              onClick={() => window.print()}
              className="px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg"
            >
              🖨️ Imprimer le rapport
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              JustiJob
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            💰 Diagnostic : Salaires impayés
          </h2>
          <p className="text-gray-600">
            Analysez votre situation et estimez vos droits
          </p>
        </div>

        {/* Messages d'erreur */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
            <h3 className="text-red-800 font-bold text-lg mb-3 flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              Veuillez corriger les erreurs suivantes :
            </h3>
            <ul className="space-y-2">
              {Object.values(errors).map((error, i) => (
                <li key={i} className="text-red-700 flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Progression */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Étape {currentStep} sur 5
            </span>
            <span className="text-sm font-medium text-gray-600">
              Complétion : {getStepCompletion(currentStep).percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span className={currentStep >= 1 ? 'text-blue-600 font-semibold' : ''}>
              {currentStep > 1 ? '✓' : '1'} Infos
            </span>
            <span className={currentStep >= 2 ? 'text-blue-600 font-semibold' : ''}>
              {currentStep > 2 ? '✓' : '2'} Détails
            </span>
            <span className={currentStep >= 3 ? 'text-blue-600 font-semibold' : ''}>
              {currentStep > 3 ? '✓' : '3'} Contexte
            </span>
            <span className={currentStep >= 4 ? 'text-blue-600 font-semibold' : ''}>
              {currentStep > 4 ? '✓' : '4'} Preuves
            </span>
            <span className={currentStep >= 5 ? 'text-blue-600 font-semibold' : ''}>
              5 Actions
            </span>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* ÉTAPE 1 : Informations générales */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📋 Informations générales
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quelle est votre situation professionnelle actuelle ? *
                </label>
                <select
                  value={formData.situationPro}
                  onChange={(e) => handleInputChange('situationPro', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.situationPro ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="en_poste">Toujours en poste</option>
                  <option value="demission">J'ai démissionné</option>
                  <option value="licencie">J'ai été licencié(e)</option>
                  <option value="rupture_conventionnelle">Rupture conventionnelle</option>
                  <option value="fin_cdd">Fin de CDD</option>
                </select>
                {errors.situationPro && (
                  <p className="text-red-500 text-sm mt-1">{errors.situationPro}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de contrat *
                </label>
                <select
                  value={formData.typeContrat}
                  onChange={(e) => handleInputChange('typeContrat', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.typeContrat ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="cdi">CDI</option>
                  <option value="cdd">CDD</option>
                  <option value="interim">Intérim</option>
                  <option value="apprentissage">Apprentissage</option>
                  <option value="stage">Stage</option>
                </select>
                {errors.typeContrat && (
                  <p className="text-red-500 text-sm mt-1">{errors.typeContrat}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ancienneté dans l'entreprise (en années) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.anciennete}
                  onChange={(e) => handleInputChange('anciennete', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.anciennete ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 3.5"
                />
                {errors.anciennete && (
                  <p className="text-red-500 text-sm mt-1">{errors.anciennete}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  ℹ️ L'ancienneté impacte les délais de prescription (3 ans pour les salaires)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salaire brut mensuel (en €) *
                </label>
                <input
                  type="number"
                  value={formData.salaireBrut}
                  onChange={(e) => handleInputChange('salaireBrut', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.salaireBrut ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 2500"
                />
                {errors.salaireBrut && (
                  <p className="text-red-500 text-sm mt-1">{errors.salaireBrut}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  ℹ️ Indiquez votre salaire brut mensuel habituel (hors primes exceptionnelles)
                </p>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : Détails des salaires impayés */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                💶 Détails des salaires impayés
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de mois de salaire impayés (total ou partiel) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="36"
                  value={formData.moisImpaye}
                  onChange={(e) => handleInputChange('moisImpaye', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.moisImpaye ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 3"
                />
                {errors.moisImpaye && (
                  <p className="text-red-500 text-sm mt-1">{errors.moisImpaye}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  ℹ️ Maximum 36 mois (prescription de 3 ans - Art. L3245-1)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quels éléments de rémunération sont impayés ? * (plusieurs choix possibles)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'salaire_base', label: 'Salaire de base' },
                    { value: 'primes', label: 'Primes (performance, ancienneté, etc.)' },
                    { value: 'heures_sup', label: 'Heures supplémentaires' },
                    { value: 'conges_payes', label: 'Indemnités de congés payés' },
                    { value: '13eme', label: '13ème mois' },
                    { value: 'avantages', label: 'Avantages en nature (véhicule, logement, etc.)' },
                    { value: 'remboursements', label: 'Remboursements de frais professionnels' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.elementsImpaye.includes(option.value)}
                        onChange={() => handleCheckboxChange('elementsImpaye', option.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.elementsImpaye && (
                  <p className="text-red-500 text-sm mt-1">{errors.elementsImpaye}</p>
                )}
              </div>

              {/* Champs conditionnels selon les éléments sélectionnés */}
              {formData.elementsImpaye.includes('primes') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant total des primes impayées (en €) *
                  </label>
                  <input
                    type="number"
                    value={formData.montantPrimes}
                    onChange={(e) => handleInputChange('montantPrimes', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.montantPrimes ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 1500"
                  />
                  {errors.montantPrimes && (
                    <p className="text-red-500 text-sm mt-1">{errors.montantPrimes}</p>
                  )}
                </div>
              )}

              {formData.elementsImpaye.includes('heures_sup') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant total des heures supplémentaires impayées (en €) *
                  </label>
                  <input
                    type="number"
                    value={formData.montantHeuresSup}
                    onChange={(e) => handleInputChange('montantHeuresSup', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.montantHeuresSup ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 800"
                  />
                  {errors.montantHeuresSup && (
                    <p className="text-red-500 text-sm mt-1">{errors.montantHeuresSup}</p>
                  )}
                </div>
              )}

              {formData.elementsImpaye.includes('13eme') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant du 13ème mois impayé (en €) *
                  </label>
                  <input
                    type="number"
                    value={formData.montant13eme}
                    onChange={(e) => handleInputChange('montant13eme', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.montant13eme ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 2500"
                  />
                  {errors.montant13eme && (
                    <p className="text-red-500 text-sm mt-1">{errors.montant13eme}</p>
                  )}
                </div>
              )}

              {formData.elementsImpaye.includes('avantages') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant des avantages en nature impayés (en €) *
                  </label>
                  <input
                    type="number"
                    value={formData.montantAvantages}
                    onChange={(e) => handleInputChange('montantAvantages', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.montantAvantages ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 400"
                  />
                  {errors.montantAvantages && (
                    <p className="text-red-500 text-sm mt-1">{errors.montantAvantages}</p>
                  )}
                </div>
              )}

              {formData.elementsImpaye.includes('remboursements') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant total des remboursements impayés (en €) *
                  </label>
                  <input
                    type="number"
                    value={formData.montantRemboursements}
                    onChange={(e) => handleInputChange('montantRemboursements', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.montantRemboursements ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 300"
                  />
                  {errors.montantRemboursements && (
                    <p className="text-red-500 text-sm mt-1">{errors.montantRemboursements}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ÉTAPE 3 : Circonstances et contexte */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📅 Circonstances et contexte
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Depuis combien de temps les salaires sont-ils en retard ? (en mois) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="36"
                  value={formData.delaiRetard}
                  onChange={(e) => handleInputChange('delaiRetard', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.delaiRetard ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 6"
                />
                {errors.delaiRetard && (
                  <p className="text-red-500 text-sm mt-1">{errors.delaiRetard}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  ℹ️ Le délai impacte les intérêts de retard (10% par an)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quelle raison l'employeur a-t-il donnée pour justifier le non-paiement ? *
                </label>
                <select
                  value={formData.raisonEmployeur}
                  onChange={(e) => handleInputChange('raisonEmployeur', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.raisonEmployeur ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="aucune">Aucune raison donnée</option>
                  <option value="difficultes_non_prouvees">Difficultés financières non prouvées</option>
                  <option value="difficultes_prouvees">Difficultés financières prouvées (procédure collective)</option>
                  <option value="contestation">Contestation du montant dû</option>
                  <option value="erreur_paie">Erreur dans la comptabilité/paie</option>
                  <option value="autre">Autre raison</option>
                </select>
                {errors.raisonEmployeur && (
                  <p className="text-red-500 text-sm mt-1">{errors.raisonEmployeur}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avez-vous eu des contacts avec l'employeur concernant ces impayés ? *
                </label>
                <select
                  value={formData.contactsEmployeur}
                  onChange={(e) => handleInputChange('contactsEmployeur', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.contactsEmployeur ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="nombreux_ecrits">Nombreux contacts par écrit</option>
                  <option value="quelques_ecrits">Quelques contacts par écrit</option>
                  <option value="oraux">Contacts oraux uniquement</option>
                  <option value="aucun">Aucun contact (employeur injoignable)</option>
                </select>
                {errors.contactsEmployeur && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactsEmployeur}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  D'autres salariés sont-ils concernés par ces impayés ? *
                </label>
                <select
                  value={formData.autresSalaries}
                  onChange={(e) => handleInputChange('autresSalaries', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.autresSalaries ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="oui_plusieurs">Oui, plusieurs collègues</option>
                  <option value="oui_un">Oui, un ou deux collègues</option>
                  <option value="non">Non, je suis le/la seul(e)</option>
                  <option value="ne_sais_pas">Je ne sais pas</option>
                </select>
                {errors.autresSalaries && (
                  <p className="text-red-500 text-sm mt-1">{errors.autresSalaries}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quelles difficultés avez-vous rencontrées à cause de ces impayés ? * (plusieurs choix possibles)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'impossibilite_loyer', label: 'Impossibilité de payer le loyer/crédit immobilier' },
                    { value: 'dettes', label: 'Accumulation de dettes' },
                    { value: 'credit_refus', label: 'Refus de crédit bancaire' },
                    { value: 'situation_familiale', label: 'Impact sur la situation familiale' },
                    { value: 'stress_anxiete', label: 'Stress, anxiété, problèmes de santé' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.difficultes.includes(option.value)}
                        onChange={() => handleCheckboxChange('difficultes', option.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.difficultes && (
                  <p className="text-red-500 text-sm mt-1">{errors.difficultes}</p>
                )}
              </div>
            </div>
          )}

          {/* ÉTAPE 4 : Preuves et documents */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📄 Preuves et documents disponibles
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quels documents possédez-vous ? * (plusieurs choix possibles)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'contrats', label: 'Contrat de travail' },
                    { value: 'fiches_paie', label: 'Fiches de paie (complètes ou partielles)' },
                    { value: 'courriers', label: 'Courriers de l\'employeur' },
                    { value: 'emails', label: 'Emails avec l\'employeur' },
                    { value: 'releves', label: 'Relevés bancaires (montrant l\'absence de versement)' },
                    { value: 'attestations', label: 'Attestations de collègues' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.documents.includes(option.value)}
                        onChange={() => handleCheckboxChange('documents', option.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.documents && (
                  <p className="text-red-500 text-sm mt-1">{errors.documents}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avez-vous des communications écrites avec l'employeur au sujet des impayés ? *
                </label>
                <select
                  value={formData.communicationsEcrites}
                  onChange={(e) => handleInputChange('communicationsEcrites', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.communicationsEcrites ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="nombreuses">Oui, nombreuses (emails, courriers AR)</option>
                  <option value="quelques">Oui, quelques-unes</option>
                  <option value="une">Oui, une seule</option>
                  <option value="non">Non, aucune trace écrite</option>
                </select>
                {errors.communicationsEcrites && (
                  <p className="text-red-500 text-sm mt-1">{errors.communicationsEcrites}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avez-vous des témoignages de collègues confirmant les impayés ? *
                </label>
                <select
                  value={formData.temoignages}
                  onChange={(e) => handleInputChange('temoignages', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.temoignages ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="plusieurs">Oui, plusieurs témoignages écrits</option>
                  <option value="un">Oui, un témoignage écrit</option>
                  <option value="oraux">Oui, mais seulement oraux</option>
                  <option value="non">Non, aucun témoignage</option>
                </select>
                {errors.temoignages && (
                  <p className="text-red-500 text-sm mt-1">{errors.temoignages}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avez-vous effectué des relances auprès de l'employeur ? *
                </label>
                <select
                  value={formData.relances}
                  onChange={(e) => handleInputChange('relances', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.relances ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="multiples_ecrites">Oui, multiples relances écrites (AR)</option>
                  <option value="quelques">Oui, quelques relances</option>
                  <option value="une">Oui, une seule relance</option>
                  <option value="non">Non, aucune relance formelle</option>
                </select>
                {errors.relances && (
                  <p className="text-red-500 text-sm mt-1">{errors.relances}</p>
                )}
              </div>
            </div>
          )}

          {/* ÉTAPE 5 : Réclamation et actions */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                ⚖️ Réclamation et prochaines étapes
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quelles démarches avez-vous déjà entreprises ? * (plusieurs choix possibles)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'mise_demeure', label: 'Envoi d\'une mise en demeure (AR)' },
                    { value: 'inspection_travail', label: 'Saisine de l\'Inspection du Travail' },
                    { value: 'conseil_prudhommes', label: 'Saisine du Conseil de Prud\'hommes' },
                    { value: 'syndicat', label: 'Contact avec un syndicat' },
                    { value: 'avocat', label: 'Consultation d\'un avocat' },
                    { value: 'aucune', label: 'Aucune démarche formelle pour l\'instant' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.actionsDemarches.includes(option.value)}
                        onChange={() => handleCheckboxChange('actionsDemarches', option.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.actionsDemarches && (
                  <p className="text-red-500 text-sm mt-1">{errors.actionsDemarches}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quels sont vos objectifs ? * (plusieurs choix possibles)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'recuperation_totale', label: 'Récupérer l\'intégralité des sommes dues' },
                    { value: 'interets', label: 'Obtenir les intérêts de retard' },
                    { value: 'dommages', label: 'Obtenir des dommages et intérêts' },
                    { value: 'sanctions', label: 'Faire sanctionner l\'employeur' },
                    { value: 'maintien_emploi', label: 'Conserver mon emploi' },
                    { value: 'rupture_torts', label: 'Obtenir une rupture aux torts de l\'employeur' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.objectifs.includes(option.value)}
                        onChange={() => handleCheckboxChange('objectifs', option.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.objectifs && (
                  <p className="text-red-500 text-sm mt-1">{errors.objectifs}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quel est le niveau d'urgence de votre situation ? *
                </label>
                <select
                  value={formData.urgence}
                  onChange={(e) => handleInputChange('urgence', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.urgence ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="tres_urgent">Très urgent (situation financière critique)</option>
                  <option value="urgent">Urgent (difficultés importantes)</option>
                  <option value="normal">Normal (je veux récupérer mes droits)</option>
                  <option value="pas_urgent">Pas urgent (simple vérification)</option>
                </select>
                {errors.urgence && (
                  <p className="text-red-500 text-sm mt-1">{errors.urgence}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Informations complémentaires (facultatif)
                </label>
                <textarea
                  value={formData.conseils}
                  onChange={(e) => handleInputChange('conseils', e.target.value)}
                  rows={4}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ajoutez toute information que vous jugez utile pour votre diagnostic..."
                />
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
              >
                ← Précédent
              </button>
            )}
            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Suivant →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                🎯 Obtenir mon diagnostic
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
