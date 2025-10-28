'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface FormData {
  // Étape 1 : Type de situation
  typeSituation: string
  situationPro: string
  typeContrat: string
  anciennete: string
  poste: string
  auteurFaits: string
  auteurPoste: string
  
  // Étape 2 : Faits et circonstances
  natureFaits: string[]
  autresNatureFaits: string
  frequence: string
  duree: string
  dateDebut: string
  contexteDebut: string
  evolution: string
  caracteristiquesDiscrimination: string[]
  
  // Étape 3 : Impacts et conséquences
  impactSante: string[]
  arretsTravaill: string
  nombreArrets: string
  hospitalisations: string
  traitementMedical: string
  impactProfessionnel: string[]
  impactPsychologique: string[]
  autrePsycho: string
  
  // Étape 4 : Preuves disponibles
  preuves: string[]
  temoignages: string
  nombreTemoins: string
  emails: string
  certificatsMedicaux: string
  signalementsInternes: string
  dateSignalement: string
  autrePreuves: string
  
  // Étape 5 : Démarches et objectifs
  demarchesEffectuees: string[]
  reponseEmployeur: string
  situationActuelle: string
  dateLicenciement: string
  motifLicenciement: string
  objectifs: string[]
  urgence: string
  informationsComplementaires: string
}

interface Scores {
  graviteFaits: number
  preuves: number
  impact: number
  contexte: number
}

interface Montants {
  dommagesInteretsMoral: number
  dommagesInteretsProfessionnel: number
  indemniteRupture: number
  reparationCarriere: number
  total: number
}

export default function DiagnosticHarcelement() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    typeSituation: '',
    situationPro: '',
    typeContrat: '',
    anciennete: '',
    poste: '',
    auteurFaits: '',
    auteurPoste: '',
    natureFaits: [],
    autresNatureFaits: '',
    frequence: '',
    duree: '',
    dateDebut: '',
    contexteDebut: '',
    evolution: '',
    caracteristiquesDiscrimination: [],
    impactSante: [],
    arretsTravaill: '',
    nombreArrets: '',
    hospitalisations: '',
    traitementMedical: '',
    impactProfessionnel: [],
    impactPsychologique: [],
    autrePsycho: '',
    preuves: [],
    temoignages: '',
    nombreTemoins: '',
    emails: '',
    certificatsMedicaux: '',
    signalementsInternes: '',
    dateSignalement: '',
    autrePreuves: '',
    demarchesEffectuees: [],
    reponseEmployeur: '',
    situationActuelle: '',
    dateLicenciement: '',
    motifLicenciement: '',
    objectifs: [],
    urgence: '',
    informationsComplementaires: ''
  })
  
  const [showResults, setShowResults] = useState(false)
  const [scores, setScores] = useState<Scores>({
    graviteFaits: 0,
    preuves: 0,
    impact: 0,
    contexte: 0
  })
  const [montants, setMontants] = useState<Montants>({
    dommagesInteretsMoral: 0,
    dommagesInteretsProfessionnel: 0,
    indemniteRupture: 0,
    reparationCarriere: 0,
    total: 0
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Sauvegarde automatique
  useEffect(() => {
    if (Object.keys(formData).some(key => {
      const value = formData[key as keyof FormData]
      return Array.isArray(value) ? value.length > 0 : value !== ''
    })) {
      localStorage.setItem('justijob_harcelement_draft', JSON.stringify(formData))
    }
  }, [formData])

  // Chargement au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('justijob_harcelement_draft')
    if (saved) {
      const shouldRestore = window.confirm(
        "📋 Un diagnostic en cours a été trouvé. Voulez-vous le reprendre ?"
      )
      if (shouldRestore) {
        setFormData(JSON.parse(saved))
      } else {
        localStorage.removeItem('justijob_harcelement_draft')
      }
    }
  }, [])

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
      if (!formData.typeSituation) {
        stepErrors.typeSituation = "⚠️ Le type de situation est requis"
      }
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
      }
      if (!formData.poste) {
        stepErrors.poste = "⚠️ Le poste est requis"
      }
      if (!formData.auteurFaits) {
        stepErrors.auteurFaits = "⚠️ L'auteur des faits est requis"
      }
    }

    if (step === 2) {
      if (formData.natureFaits.length === 0) {
        stepErrors.natureFaits = "⚠️ Sélectionnez au moins une nature de faits"
      }
      if (formData.natureFaits.includes('autres') && !formData.autresNatureFaits) {
        stepErrors.autresNatureFaits = "⚠️ Précisez la nature des autres faits"
      }
      if (!formData.frequence) {
        stepErrors.frequence = "⚠️ La fréquence est requise"
      }
      if (!formData.duree) {
        stepErrors.duree = "⚠️ La durée est requise"
      }
      if (!formData.dateDebut) {
        stepErrors.dateDebut = "⚠️ La date de début est requise"
      }
      if (!formData.contexteDebut) {
        stepErrors.contexteDebut = "⚠️ Le contexte de début est requis"
      }
      if (!formData.evolution) {
        stepErrors.evolution = "⚠️ L'évolution est requise"
      }
      if (formData.typeSituation === 'discrimination' && formData.caracteristiquesDiscrimination.length === 0) {
        stepErrors.caracteristiquesDiscrimination = "⚠️ Sélectionnez au moins un motif de discrimination"
      }
    }

    if (step === 3) {
      if (formData.impactSante.length === 0) {
        stepErrors.impactSante = "⚠️ Sélectionnez au moins un impact sur la santé"
      }
      if (!formData.arretsTravaill) {
        stepErrors.arretsTravaill = "⚠️ Indiquez si vous avez eu des arrêts de travail"
      }
      if (formData.arretsTravaill === 'oui' && !formData.nombreArrets) {
        stepErrors.nombreArrets = "⚠️ Le nombre d'arrêts est requis"
      }
      if (!formData.hospitalisations) {
        stepErrors.hospitalisations = "⚠️ Indiquez si vous avez été hospitalisé(e)"
      }
      if (!formData.traitementMedical) {
        stepErrors.traitementMedical = "⚠️ Indiquez si vous suivez un traitement"
      }
      if (formData.impactProfessionnel.length === 0) {
        stepErrors.impactProfessionnel = "⚠️ Sélectionnez au moins un impact professionnel"
      }
      if (formData.impactPsychologique.length === 0) {
        stepErrors.impactPsychologique = "⚠️ Sélectionnez au moins un impact psychologique"
      }
    }

    if (step === 4) {
      if (formData.preuves.length === 0) {
        stepErrors.preuves = "⚠️ Sélectionnez au moins un type de preuve"
      }
      if (formData.preuves.includes('temoignages') && !formData.temoignages) {
        stepErrors.temoignages = "⚠️ Précisez les témoignages disponibles"
      }
      if (formData.preuves.includes('temoignages') && formData.temoignages !== 'aucun' && !formData.nombreTemoins) {
        stepErrors.nombreTemoins = "⚠️ Le nombre de témoins est requis"
      }
      if (formData.preuves.includes('emails') && !formData.emails) {
        stepErrors.emails = "⚠️ Précisez les emails disponibles"
      }
      if (formData.preuves.includes('certificats_medicaux') && !formData.certificatsMedicaux) {
        stepErrors.certificatsMedicaux = "⚠️ Précisez les certificats médicaux"
      }
      if (formData.preuves.includes('signalements_internes') && !formData.signalementsInternes) {
        stepErrors.signalementsInternes = "⚠️ Précisez les signalements internes"
      }
    }

    if (step === 5) {
      if (formData.demarchesEffectuees.length === 0) {
        stepErrors.demarchesEffectuees = "⚠️ Indiquez les démarches effectuées (ou 'aucune')"
      }
      if (!formData.situationActuelle) {
        stepErrors.situationActuelle = "⚠️ La situation actuelle est requise"
      }
      if ((formData.situationActuelle === 'licencie' || formData.situationActuelle === 'demission') && !formData.dateLicenciement) {
        stepErrors.dateLicenciement = "⚠️ La date de rupture est requise"
      }
      if (formData.situationActuelle === 'licencie' && !formData.motifLicenciement) {
        stepErrors.motifLicenciement = "⚠️ Le motif de licenciement est requis"
      }
      if (formData.objectifs.length === 0) {
        stepErrors.objectifs = "⚠️ Sélectionnez au moins un objectif"
      }
      if (!formData.urgence) {
        stepErrors.urgence = "⚠️ Le niveau d'urgence est requis"
      }
    }

    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
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
    let graviteFaits = 0
    let preuvesScore = 0
    let impactScore = 0
    let contexteScore = 0

    // GRAVITÉ DES FAITS (35 points)
    // Nature des faits
    if (formData.natureFaits.includes('insultes_menaces')) graviteFaits += 4
    if (formData.natureFaits.includes('humiliations_publiques')) graviteFaits += 5
    if (formData.natureFaits.includes('isolement_mise_ecart')) graviteFaits += 4
    if (formData.natureFaits.includes('charges_travail_excessives')) graviteFaits += 3
    if (formData.natureFaits.includes('retrait_responsabilites')) graviteFaits += 3
    if (formData.natureFaits.includes('propos_discriminatoires')) graviteFaits += 5
    if (formData.natureFaits.includes('avances_sexuelles')) graviteFaits += 6
    if (formData.natureFaits.includes('agressions_physiques')) graviteFaits += 8

    // Fréquence
    if (formData.frequence === 'quotidienne') graviteFaits += 8
    else if (formData.frequence === 'hebdomadaire') graviteFaits += 6
    else if (formData.frequence === 'mensuelle') graviteFaits += 4
    else if (formData.frequence === 'occasionnelle') graviteFaits += 2

    // Durée
    const dureeVal = parseFloat(formData.duree)
    if (dureeVal >= 24) graviteFaits += 8
    else if (dureeVal >= 12) graviteFaits += 6
    else if (dureeVal >= 6) graviteFaits += 4
    else if (dureeVal >= 3) graviteFaits += 2

    // Évolution
    if (formData.evolution === 'aggravation') graviteFaits += 3
    else if (formData.evolution === 'stable') graviteFaits += 1

    graviteFaits = Math.min(graviteFaits, 35)

    // PREUVES (30 points)
    if (formData.preuves.includes('temoignages')) {
      if (formData.temoignages === 'ecrits_nombreux') preuvesScore += 10
      else if (formData.temoignages === 'ecrits_quelques') preuvesScore += 7
      else if (formData.temoignages === 'oraux') preuvesScore += 4
    }

    if (formData.preuves.includes('emails')) {
      if (formData.emails === 'nombreux_explicites') preuvesScore += 8
      else if (formData.emails === 'quelques') preuvesScore += 5
      else if (formData.emails === 'indices') preuvesScore += 3
    }

    if (formData.preuves.includes('certificats_medicaux')) {
      if (formData.certificatsMedicaux === 'plusieurs_detailles') preuvesScore += 7
      else if (formData.certificatsMedicaux === 'quelques') preuvesScore += 5
      else if (formData.certificatsMedicaux === 'un') preuvesScore += 3
    }

    if (formData.preuves.includes('signalements_internes')) {
      if (formData.signalementsInternes === 'plusieurs_traces') preuvesScore += 5
      else if (formData.signalementsInternes === 'un_trace') preuvesScore += 3
      else if (formData.signalementsInternes === 'verbal') preuvesScore += 1
    }

    if (formData.preuves.includes('enregistrements')) preuvesScore += 3
    if (formData.preuves.includes('captures_ecran')) preuvesScore += 2
    if (formData.preuves.includes('journal_bord')) preuvesScore += 2

    preuvesScore = Math.min(preuvesScore, 30)

    // IMPACT (20 points)
    // Impact santé
    if (formData.impactSante.includes('aucun')) impactScore += 0
    else {
      if (formData.impactSante.includes('stress_anxiete')) impactScore += 2
      if (formData.impactSante.includes('depression')) impactScore += 4
      if (formData.impactSante.includes('burn_out')) impactScore += 5
      if (formData.impactSante.includes('troubles_somatiques')) impactScore += 3
      if (formData.impactSante.includes('idees_suicidaires')) impactScore += 6
    }

    // Arrêts de travail
    if (formData.arretsTravaill === 'oui') {
      const nbArrets = parseInt(formData.nombreArrets)
      if (nbArrets >= 5) impactScore += 4
      else if (nbArrets >= 3) impactScore += 3
      else if (nbArrets >= 1) impactScore += 2
    }

    // Hospitalisation
    if (formData.hospitalisations === 'oui') impactScore += 3

    // Traitement médical
    if (formData.traitementMedical === 'oui') impactScore += 2

    // Impact professionnel
    if (formData.impactProfessionnel.length >= 4) impactScore += 3
    else if (formData.impactProfessionnel.length >= 2) impactScore += 2
    else if (formData.impactProfessionnel.length >= 1) impactScore += 1

    impactScore = Math.min(impactScore, 20)

    // CONTEXTE (15 points)
    // Auteur des faits
    if (formData.auteurFaits === 'hierarchie_directe') contexteScore += 5
    else if (formData.auteurFaits === 'direction') contexteScore += 6
    else if (formData.auteurFaits === 'collegue') contexteScore += 3
    else if (formData.auteurFaits === 'client_fournisseur') contexteScore += 2

    // Signalement interne
    if (formData.demarchesEffectuees.includes('signalement_interne')) {
      if (formData.reponseEmployeur === 'aucune' || formData.reponseEmployeur === 'minimisation') {
        contexteScore += 5
      } else if (formData.reponseEmployeur === 'enquete_incomplete') {
        contexteScore += 3
      }
    }

    // Situation actuelle
    if (formData.situationActuelle === 'licencie') {
      if (formData.motifLicenciement === 'apres_signalement' || formData.motifLicenciement === 'represailles') {
        contexteScore += 4
      }
    }

    contexteScore = Math.min(contexteScore, 15)

    return {
      graviteFaits,
      preuves: preuvesScore,
      impact: impactScore,
      contexte: contexteScore
    }
  }

  const calculateMontants = (scores: Scores) => {
    const totalScore = scores.graviteFaits + scores.preuves + scores.impact + scores.contexte
    const ancienneteVal = parseFloat(formData.anciennete) || 0

    let dommagesInteretsMoral = 0
    let dommagesInteretsProfessionnel = 0
    let indemniteRupture = 0
    let reparationCarriere = 0

    // DOMMAGES ET INTÉRÊTS MORAL
    // Base selon le score
    if (totalScore >= 80) {
      dommagesInteretsMoral = 30000
    } else if (totalScore >= 70) {
      dommagesInteretsMoral = 20000
    } else if (totalScore >= 60) {
      dommagesInteretsMoral = 15000
    } else if (totalScore >= 50) {
      dommagesInteretsMoral = 10000
    } else if (totalScore >= 40) {
      dommagesInteretsMoral = 7000
    } else {
      dommagesInteretsMoral = 5000
    }

    // Majoration selon gravité
    if (formData.natureFaits.includes('agressions_physiques')) {
      dommagesInteretsMoral += 10000
    }
    if (formData.natureFaits.includes('avances_sexuelles')) {
      dommagesInteretsMoral += 8000
    }
    if (formData.impactSante.includes('idees_suicidaires')) {
      dommagesInteretsMoral += 5000
    }
    if (formData.hospitalisations === 'oui') {
      dommagesInteretsMoral += 3000
    }

    // DOMMAGES ET INTÉRÊTS PROFESSIONNEL
    if (formData.impactProfessionnel.includes('perte_emploi')) {
      dommagesInteretsProfessionnel += 5000
    }
    if (formData.impactProfessionnel.includes('retrogradation')) {
      dommagesInteretsProfessionnel += 4000
    }
    if (formData.impactProfessionnel.includes('perte_clients')) {
      dommagesInteretsProfessionnel += 3000
    }
    if (formData.impactProfessionnel.includes('mutation_forcee')) {
      dommagesInteretsProfessionnel += 3000
    }

    // INDEMNITÉ DE RUPTURE
    if (formData.situationActuelle === 'licencie') {
      if (formData.motifLicenciement === 'apres_signalement' || formData.motifLicenciement === 'represailles') {
        // Licenciement nul = minimum 6 mois de salaire
        indemniteRupture = 6 * 2500 // Base 2500€/mois
        if (ancienneteVal >= 10) indemniteRupture += 5000
        else if (ancienneteVal >= 5) indemniteRupture += 3000
      } else if (formData.motifLicenciement === 'sans_cause') {
        indemniteRupture = Math.max(3 * 2500, ancienneteVal * 500)
      }
    }

    // RÉPARATION PRÉJUDICE DE CARRIÈRE
    if (ancienneteVal >= 10 && formData.impactProfessionnel.includes('perte_emploi')) {
      reparationCarriere = 8000
    } else if (ancienneteVal >= 5 && formData.impactProfessionnel.includes('perte_emploi')) {
      reparationCarriere = 5000
    } else if (formData.impactProfessionnel.includes('retrogradation')) {
      reparationCarriere = 4000
    }

    const total = dommagesInteretsMoral + dommagesInteretsProfessionnel + indemniteRupture + reparationCarriere

    return {
      dommagesInteretsMoral,
      dommagesInteretsProfessionnel,
      indemniteRupture,
      reparationCarriere,
      total
    }
  }

  const handleSubmit = () => {
    if (!validateStep(5)) {
      return
    }

    const calculatedScores = calculateScores()
    const calculatedMontants = calculateMontants(calculatedScores)

    setScores(calculatedScores)
    setMontants(calculatedMontants)
    setShowResults(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const restartDiagnostic = () => {
    setFormData({
      typeSituation: '',
      situationPro: '',
      typeContrat: '',
      anciennete: '',
      poste: '',
      auteurFaits: '',
      auteurPoste: '',
      natureFaits: [],
      autresNatureFaits: '',
      frequence: '',
      duree: '',
      dateDebut: '',
      contexteDebut: '',
      evolution: '',
      caracteristiquesDiscrimination: [],
      impactSante: [],
      arretsTravaill: '',
      nombreArrets: '',
      hospitalisations: '',
      traitementMedical: '',
      impactProfessionnel: [],
      impactPsychologique: [],
      autrePsycho: '',
      preuves: [],
      temoignages: '',
      nombreTemoins: '',
      emails: '',
      certificatsMedicaux: '',
      signalementsInternes: '',
      dateSignalement: '',
      autrePreuves: '',
      demarchesEffectuees: [],
      reponseEmployeur: '',
      situationActuelle: '',
      dateLicenciement: '',
      motifLicenciement: '',
      objectifs: [],
      urgence: '',
      informationsComplementaires: ''
    })
    setShowResults(false)
    setCurrentStep(1)
    setErrors({})
    localStorage.removeItem('justijob_harcelement_draft')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getStepCompletion = (step: number) => {
    let completed = 0
    let total = 0

    if (step === 1) {
      total = 7
      if (formData.typeSituation) completed++
      if (formData.situationPro) completed++
      if (formData.typeContrat) completed++
      if (formData.anciennete) completed++
      if (formData.poste) completed++
      if (formData.auteurFaits) completed++
      if (formData.auteurFaits !== '' && formData.auteurPoste) completed++
    } else if (step === 2) {
      total = 6 + (formData.typeSituation === 'discrimination' ? 1 : 0)
      if (formData.natureFaits.length > 0) completed++
      if (formData.frequence) completed++
      if (formData.duree) completed++
      if (formData.dateDebut) completed++
      if (formData.contexteDebut) completed++
      if (formData.evolution) completed++
      if (formData.typeSituation === 'discrimination' && formData.caracteristiquesDiscrimination.length > 0) completed++
    } else if (step === 3) {
      total = 7
      if (formData.impactSante.length > 0) completed++
      if (formData.arretsTravaill) completed++
      if (formData.hospitalisations) completed++
      if (formData.traitementMedical) completed++
      if (formData.impactProfessionnel.length > 0) completed++
      if (formData.impactPsychologique.length > 0) completed++
      if (formData.arretsTravaill === 'oui' && formData.nombreArrets) completed++
    } else if (step === 4) {
      total = 1 + formData.preuves.length
      if (formData.preuves.length > 0) completed++
      if (formData.preuves.includes('temoignages') && formData.temoignages) completed++
      if (formData.preuves.includes('emails') && formData.emails) completed++
      if (formData.preuves.includes('certificats_medicaux') && formData.certificatsMedicaux) completed++
      if (formData.preuves.includes('signalements_internes') && formData.signalementsInternes) completed++
    } else if (step === 5) {
      total = 4
      if (formData.demarchesEffectuees.length > 0) completed++
      if (formData.situationActuelle) completed++
      if (formData.objectifs.length > 0) completed++
      if (formData.urgence) completed++
    }

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { completed, total, percentage }
  }

  const totalScore = scores.graviteFaits + scores.preuves + scores.impact + scores.contexte

  const getRecommendations = () => {
    const recs = []
    const score = totalScore

    // Urgence médicale
    if (formData.impactSante.includes('idees_suicidaires') || formData.impactSante.includes('burn_out')) {
      recs.push({
        title: "🚨 URGENCE MÉDICALE ABSOLUE",
        description: "Votre santé est en danger. Consultez IMMÉDIATEMENT votre médecin traitant ou les urgences psychiatriques. Le 3114 est le numéro national de prévention du suicide (24h/24)."
      })
    }

    // Arrêt de travail
    if (formData.situationActuelle === 'en_poste' && score >= 50) {
      recs.push({
        title: "🏥 PROTECTION DE VOTRE SANTÉ",
        description: "Demandez un arrêt de travail à votre médecin. Consultez un médecin du travail qui pourra constater les faits et préconiser un aménagement de poste ou une inaptitude."
      })
    }

    // Signalement interne
    if (!formData.demarchesEffectuees.includes('signalement_interne') && formData.situationActuelle === 'en_poste') {
      recs.push({
        title: "📝 SIGNALEMENT INTERNE URGENT",
        description: "Envoyez un courrier recommandé avec AR à votre employeur décrivant précisément les faits de harcèlement/discrimination. L'employeur a obligation de protéger votre santé (Art. L1152-4 et L4121-1)."
      })
    }

    // Alerte RH/CSE
    if (formData.situationActuelle === 'en_poste') {
      recs.push({
        title: "🛡️ ALERTE CSE ET INSPECTION DU TRAVAIL",
        description: "Alertez le CSE (Comité Social et Économique) et l'Inspection du Travail (DREETS). Le harcèlement moral/sexuel et la discrimination sont des délits pénaux."
      })
    }

    // Constitution du dossier
    if (scores.preuves < 20) {
      recs.push({
        title: "📄 CONSTITUEZ VOTRE DOSSIER DE PREUVES",
        description: "Rassemblez TOUS les éléments : certificats médicaux, témoignages écrits de collègues, emails, SMS, notes manuscrites datées. Tenez un journal des faits avec dates et témoins."
      })
    }

    // Témoignages
    if (!formData.preuves.includes('temoignages') || formData.temoignages === 'aucun') {
      recs.push({
        title: "👥 RECHERCHEZ DES TÉMOINS",
        description: "Contactez d'anciens ou actuels collègues susceptibles d'avoir été témoins. Les témoignages écrits sont essentiels. D'autres victimes du même auteur renforcent considérablement votre dossier."
      })
    }

    // Avocat spécialisé
    if (score >= 50 || montants.total >= 10000) {
      recs.push({
        title: "⚖️ CONSULTATION AVOCAT SPÉCIALISÉ URGENTE",
        description: "Votre dossier présente des enjeux importants. Un avocat spécialisé en droit du travail est INDISPENSABLE. L'aide juridictionnelle peut financer vos frais si vos revenus sont faibles."
      })
    }

    // Prise d'acte ou licenciement
    if (formData.situationActuelle === 'en_poste' && score >= 60 && formData.reponseEmployeur === 'aucune') {
      recs.push({
        title: "💼 ENVISAGEZ UNE PRISE D'ACTE",
        description: "Si l'employeur ne réagit pas malgré vos signalements, vous pouvez prendre acte de la rupture du contrat aux torts de l'employeur. Consultez IMPÉRATIVEMENT un avocat avant."
      })
    }

    // Dépôt plainte pénale
    if (formData.natureFaits.includes('agressions_physiques') || formData.natureFaits.includes('avances_sexuelles')) {
      recs.push({
        title: "👮 DÉPÔT DE PLAINTE PÉNALE",
        description: "Les agressions physiques et le harcèlement sexuel sont des DÉLITS pénaux. Déposez plainte au commissariat avec certificat médical initial (ITT). Faites-vous accompagner par une association."
      })
    }

    // Médecine du travail
    if (!formData.demarchesEffectuees.includes('medecine_travail')) {
      recs.push({
        title: "🩺 VISITE MÉDICALE URGENTE",
        description: "Demandez une visite médicale auprès du médecin du travail. Il peut constater l'impact sur votre santé, préconiser un aménagement de poste, ou prononcer une inaptitude."
      })
    }

    // Défenseur des droits
    if (formData.typeSituation === 'discrimination') {
      recs.push({
        title: "🏛️ SAISIR LE DÉFENSEUR DES DROITS",
        description: "Pour les cas de discrimination, le Défenseur des droits est une autorité indépendante gratuite qui peut enquêter et vous accompagner. Saisissez-le en ligne ou par courrier."
      })
    }

    // Associations d'aide
    recs.push({
      title: "🤝 ACCOMPAGNEMENT PSYCHOLOGIQUE",
      description: "Contactez une association spécialisée (AIVI, France Victimes, Planning Familial pour harcèlement sexuel). Elles offrent un soutien psychologique et juridique gratuit."
    })

    // Prescription
    if (formData.dateDebut) {
      const debut = new Date(formData.dateDebut)
      const maintenant = new Date()
      const moisEcoules = (maintenant.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24 * 30)
      
      if (moisEcoules >= 30) {
        recs.push({
          title: "⏰ ATTENTION PRESCRIPTION",
          description: "Vous approchez des 5 ans de prescription pour l'action civile. Pour l'action pénale, c'est 6 ans. Agissez rapidement pour ne pas perdre vos droits."
        })
      }
    }

    return recs
  }

  return (
    <>
      {showResults ? (
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
              🛡️ Résultats de votre diagnostic : Harcèlement et Discrimination
            </h2>
            <p className="text-gray-600">
              Analyse complète de votre situation et estimation des recours possibles
            </p>
          </div>

          {/* Score global */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-2xl">
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
                {totalScore >= 70 ? "Excellentes chances d'obtenir réparation devant les Prud'hommes" :
                 totalScore >= 50 ? "Bonnes chances avec renforcement des preuves" :
                 totalScore >= 30 ? "Dossier à consolider avant toute action" :
                 "Situation préoccupante nécessitant un accompagnement urgent"}
              </p>
            </div>

            {/* Détail des scores */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="text-3xl font-bold text-red-600">{scores.graviteFaits}/35</div>
                <div className="text-sm font-medium text-gray-700 mt-2">Gravité des faits</div>
                <div className="text-xs text-gray-500 mt-1">
                  {scores.graviteFaits >= 25 ? "Très grave" :
                   scores.graviteFaits >= 18 ? "Grave" :
                   scores.graviteFaits >= 10 ? "Modéré" : "Léger"}
                </div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600">{scores.preuves}/30</div>
                <div className="text-sm font-medium text-gray-700 mt-2">Preuves disponibles</div>
                <div className="text-xs text-gray-500 mt-1">
                  {scores.preuves >= 20 ? "Excellent" :
                   scores.preuves >= 12 ? "Bon" :
                   scores.preuves >= 6 ? "Moyen" : "À renforcer"}
                </div>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-3xl font-bold text-orange-600">{scores.impact}/20</div>
                <div className="text-sm font-medium text-gray-700 mt-2">Impact constaté</div>
                <div className="text-xs text-gray-500 mt-1">
                  {scores.impact >= 15 ? "Très important" :
                   scores.impact >= 10 ? "Important" :
                   scores.impact >= 5 ? "Modéré" : "Faible"}
                </div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600">{scores.contexte}/15</div>
                <div className="text-sm font-medium text-gray-700 mt-2">Contexte aggravant</div>
                <div className="text-xs text-gray-500 mt-1">
                  {scores.contexte >= 10 ? "Très aggravant" :
                   scores.contexte >= 6 ? "Aggravant" : "Neutre"}
                </div>
              </div>
            </div>
          </div>

          {/* Montants estimés */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              💶 Réparations estimées
            </h3>

            <div className="space-y-4 mb-6">
              {montants.dommagesInteretsMoral > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">Dommages et intérêts - Préjudice moral</div>
                    <div className="text-sm text-gray-600">Souffrance psychologique et atteinte à la dignité</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {montants.dommagesInteretsMoral.toLocaleString('fr-FR')} €
                  </div>
                </div>
              )}

              {montants.dommagesInteretsProfessionnel > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">Dommages et intérêts - Préjudice professionnel</div>
                    <div className="text-sm text-gray-600">Impact sur la carrière et les revenus</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {montants.dommagesInteretsProfessionnel.toLocaleString('fr-FR')} €
                  </div>
                </div>
              )}

              {montants.indemniteRupture > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">Indemnités de rupture</div>
                    <div className="text-sm text-gray-600">Licenciement nul ou sans cause réelle et sérieuse</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {montants.indemniteRupture.toLocaleString('fr-FR')} €
                  </div>
                </div>
              )}

              {montants.reparationCarriere > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">Réparation préjudice de carrière</div>
                    <div className="text-sm text-gray-600">Perte de chances et évolution professionnelle</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {montants.reparationCarriere.toLocaleString('fr-FR')} €
                  </div>
                </div>
              )}
            </div>

            <div className="border-t-2 border-gray-300 pt-6">
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold text-gray-800">TOTAL ESTIMÉ</div>
                <div className="text-4xl font-bold text-green-600">
                  {montants.total.toLocaleString('fr-FR')} €
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                ⚖️ Ces montants sont des estimations basées sur la jurisprudence. Les juges prud'homaux apprécient souverainement le montant des dommages et intérêts.
              </p>
            </div>
          </div>

          {/* Analyse détaillée */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              🔍 Analyse détaillée de votre situation
            </h3>

            <div className="space-y-6">
              {/* Type de situation */}
              <div>
                <h4 className="font-bold text-gray-800 mb-2">📋 Type de situation</h4>
                <p className="text-gray-700">
                  {formData.typeSituation === 'harcelement_moral' && "Harcèlement moral (Art. L1152-1 du Code du travail)"}
                  {formData.typeSituation === 'harcelement_sexuel' && "Harcèlement sexuel (Art. L1153-1 du Code du travail)"}
                  {formData.typeSituation === 'discrimination' && "Discrimination (Art. L1132-1 du Code du travail)"}
                  {formData.typeSituation === 'mixte' && "Situation mixte (harcèlement ET discrimination)"}
                </p>
              </div>

              {/* Nature des faits */}
              <div>
                <h4 className="font-bold text-gray-800 mb-2">⚠️ Nature des faits constatés</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {formData.natureFaits.includes('insultes_menaces') && <li>Insultes et menaces répétées</li>}
                  {formData.natureFaits.includes('humiliations_publiques') && <li>Humiliations publiques</li>}
                  {formData.natureFaits.includes('isolement_mise_ecart') && <li>Isolement et mise à l'écart</li>}
                  {formData.natureFaits.includes('charges_travail_excessives') && <li>Charges de travail excessives</li>}
                  {formData.natureFaits.includes('retrait_responsabilites') && <li>Retrait de responsabilités</li>}
                  {formData.natureFaits.includes('propos_discriminatoires') && <li>Propos discriminatoires</li>}
                  {formData.natureFaits.includes('avances_sexuelles') && <li>Avances sexuelles non désirées</li>}
                  {formData.natureFaits.includes('agressions_physiques') && <li>⚠️ AGRESSIONS PHYSIQUES</li>}
                </ul>
              </div>

              {/* Fréquence et durée */}
              <div>
                <h4 className="font-bold text-gray-800 mb-2">📊 Fréquence et durée</h4>
                <p className="text-gray-700">
                  Fréquence : <span className="font-semibold">
                    {formData.frequence === 'quotidienne' && 'Quotidienne (très grave)'}
                    {formData.frequence === 'hebdomadaire' && 'Hebdomadaire (grave)'}
                    {formData.frequence === 'mensuelle' && 'Mensuelle'}
                    {formData.frequence === 'occasionnelle' && 'Occasionnelle'}
                  </span>
                  <br />
                  Durée : <span className="font-semibold">{formData.duree} mois</span>
                </p>
              </div>

              {/* Impact santé */}
              {formData.impactSante.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">🏥 Impact sur la santé</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {formData.impactSante.includes('stress_anxiete') && <li>Stress et anxiété</li>}
                    {formData.impactSante.includes('depression') && <li>État dépressif</li>}
                    {formData.impactSante.includes('burn_out') && <li>Burn-out / Épuisement professionnel</li>}
                    {formData.impactSante.includes('troubles_somatiques') && <li>Troubles somatiques</li>}
                    {formData.impactSante.includes('idees_suicidaires') && <li className="text-red-600 font-bold">⚠️ IDÉES SUICIDAIRES</li>}
                  </ul>
                  {formData.arretsTravaill === 'oui' && (
                    <p className="text-gray-700 mt-2">
                      Nombre d'arrêts de travail : <span className="font-semibold">{formData.nombreArrets}</span>
                    </p>
                  )}
                  {formData.hospitalisations === 'oui' && (
                    <p className="text-red-600 font-semibold mt-1">⚠️ Hospitalisation(s)</p>
                  )}
                </div>
              )}

              {/* Preuves */}
              <div>
                <h4 className="font-bold text-gray-800 mb-2">📄 Preuves disponibles</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {formData.preuves.includes('temoignages') && (
                    <li>
                      Témoignages - 
                      {formData.temoignages === 'ecrits_nombreux' && ' Nombreux témoignages écrits (excellent)'}
                      {formData.temoignages === 'ecrits_quelques' && ' Quelques témoignages écrits'}
                      {formData.temoignages === 'oraux' && ' Témoignages oraux'}
                    </li>
                  )}
                  {formData.preuves.includes('emails') && <li>Emails et messages</li>}
                  {formData.preuves.includes('certificats_medicaux') && <li>Certificats médicaux</li>}
                  {formData.preuves.includes('signalements_internes') && <li>Signalements internes</li>}
                  {formData.preuves.includes('enregistrements') && <li>Enregistrements audio/vidéo</li>}
                  {formData.preuves.includes('captures_ecran') && <li>Captures d'écran</li>}
                  {formData.preuves.includes('journal_bord') && <li>Journal de bord</li>}
                </ul>
              </div>

              {/* Points de vigilance */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                  ⚠️ Points de vigilance
                </h4>
                <ul className="text-yellow-900 space-y-1 text-sm">
                  {scores.preuves < 15 && (
                    <li>• Vos preuves doivent être renforcées pour optimiser vos chances</li>
                  )}
                  {formData.impactSante.includes('idees_suicidaires') && (
                    <li className="font-bold">• URGENCE : Votre santé mentale nécessite un suivi médical immédiat</li>
                  )}
                  {formData.reponseEmployeur === 'aucune' && (
                    <li>• L'absence de réaction de l'employeur aggrave sa responsabilité</li>
                  )}
                  {formData.situationActuelle === 'licencie' && formData.motifLicenciement === 'apres_signalement' && (
                    <li className="font-bold">• Le licenciement après signalement peut être qualifié de NUL</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Recommandations */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              💡 Recommandations personnalisées
            </h3>

            <div className="space-y-4">
              {getRecommendations().map((rec, index) => (
                <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                  <h4 className="font-bold text-blue-900 mb-2">{rec.title}</h4>
                  <p className="text-blue-800 text-sm">{rec.description}</p>
                </div>
              ))}
            </div>

            {/* Informations légales importantes */}
            <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-2 border-red-200">
              <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">⚖️</span>
                Textes de loi applicables
              </h4>
              <div className="space-y-2 text-sm text-red-900">
                {formData.typeSituation === 'harcelement_moral' && (
                  <p><strong>Harcèlement moral :</strong> Art. L1152-1 à L1152-6 du Code du travail - Délit pénal : Art. 222-33-2 du Code pénal (2 ans d'emprisonnement et 30 000€ d'amende)</p>
                )}
                {formData.typeSituation === 'harcelement_sexuel' && (
                  <p><strong>Harcèlement sexuel :</strong> Art. L1153-1 à L1153-6 du Code du travail - Délit pénal : Art. 222-33 du Code pénal (2 ans d'emprisonnement et 30 000€ d'amende)</p>
                )}
                {formData.typeSituation === 'discrimination' && (
                  <p><strong>Discrimination :</strong> Art. L1132-1 à L1132-4 du Code du travail - Délit pénal : Art. 225-1 à 225-4 du Code pénal (3 ans d'emprisonnement et 45 000€ d'amende)</p>
                )}
                <p><strong>Obligation de sécurité de l'employeur :</strong> Art. L4121-1 (l'employeur doit prendre toutes les mesures pour protéger la santé physique et mentale des salariés)</p>
                <p><strong>Protection contre les représailles :</strong> Le salarié victime ou témoin de harcèlement/discrimination ne peut être sanctionné, licencié ou discriminé (Art. L1152-2, L1153-3, L1132-3)</p>
              </div>
            </div>
          </div>

          {/* Numéros d'urgence */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              🆘 Numéros d'urgence et d'aide
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="font-bold text-xl mb-1">3114</div>
                <div className="text-sm">Prévention du suicide (24h/24)</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="font-bold text-xl mb-1">116 006</div>
                <div className="text-sm">France Victimes (aide aux victimes)</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="font-bold text-xl mb-1">3919</div>
                <div className="text-sm">Violences Femmes Info (9h-22h)</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="font-bold text-xl mb-1">08 842 846 37</div>
                <div className="text-sm">Défenseur des droits</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={restartDiagnostic}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
            >
              🔄 Nouveau diagnostic
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              🖨️ Imprimer le rapport
            </button>
          </div>
        </div>
      </div>
      ) : (
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
            🛡️ Diagnostic : Harcèlement et Discrimination
          </h2>
          <p className="text-gray-600">
            Évaluez votre situation et vos droits
          </p>
        </div>

        {/* Avertissement sensible */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
          <h3 className="text-red-800 font-bold text-lg mb-3 flex items-center gap-2">
            <span className="text-2xl">🆘</span>
            Si vous êtes en danger immédiat
          </h3>
          <p className="text-red-700 mb-3">
            Si vous êtes en situation de danger, contactez immédiatement :
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-lg">
              <div className="font-bold text-red-600">3114</div>
              <div className="text-sm text-gray-600">Prévention du suicide (24h/24)</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="font-bold text-red-600">116 006</div>
              <div className="text-sm text-gray-600">France Victimes</div>
            </div>
          </div>
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
              {currentStep > 1 ? '✓' : '1'} Type
            </span>
            <span className={currentStep >= 2 ? 'text-blue-600 font-semibold' : ''}>
              {currentStep > 2 ? '✓' : '2'} Faits
            </span>
            <span className={currentStep >= 3 ? 'text-blue-600 font-semibold' : ''}>
              {currentStep > 3 ? '✓' : '3'} Impact
            </span>
            <span className={currentStep >= 4 ? 'text-blue-600 font-semibold' : ''}>
              {currentStep > 4 ? '✓' : '4'} Preuves
            </span>
            <span className={currentStep >= 5 ? 'text-blue-600 font-semibold' : ''}>
              5 Objectifs
            </span>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* ÉTAPE 1 : Type de situation */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📋 Type de situation et informations générales
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quel type de situation rencontrez-vous ? *
                </label>
                <select
                  value={formData.typeSituation}
                  onChange={(e) => handleInputChange('typeSituation', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.typeSituation ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="harcelement_moral">Harcèlement moral</option>
                  <option value="harcelement_sexuel">Harcèlement sexuel</option>
                  <option value="discrimination">Discrimination</option>
                  <option value="mixte">Situation mixte (harcèlement ET discrimination)</option>
                </select>
                {errors.typeSituation && (
                  <p className="text-red-500 text-sm mt-1">{errors.typeSituation}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  ℹ️ Le harcèlement moral = agissements répétés ayant pour objet ou effet une dégradation des conditions de travail. Le harcèlement sexuel = propos ou comportements à connotation sexuelle non désirés. La discrimination = traitement défavorable basé sur un critère prohibé (sexe, âge, origine...).
                </p>
              </div>

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
                  <option value="arret_travail">En arrêt de travail</option>
                  <option value="licencie">J'ai été licencié(e)</option>
                  <option value="demission">J'ai démissionné</option>
                  <option value="rupture_conventionnelle">Rupture conventionnelle</option>
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
                  <option value="stage">Stage</option>
                  <option value="apprentissage">Apprentissage</option>
                  <option value="autre">Autre</option>
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
                  step="0.5"
                  value={formData.anciennete}
                  onChange={(e) => handleInputChange('anciennete', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.anciennete ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 2.5"
                />
                {errors.anciennete && (
                  <p className="text-red-500 text-sm mt-1">{errors.anciennete}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre poste/fonction *
                </label>
                <input
                  type="text"
                  value={formData.poste}
                  onChange={(e) => handleInputChange('poste', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.poste ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Commercial, Secrétaire, Technicien..."
                />
                {errors.poste && (
                  <p className="text-red-500 text-sm mt-1">{errors.poste}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qui est l'auteur des faits ? *
                </label>
                <select
                  value={formData.auteurFaits}
                  onChange={(e) => handleInputChange('auteurFaits', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.auteurFaits ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="hierarchie_directe">Mon supérieur hiérarchique direct</option>
                  <option value="direction">La direction / Le dirigeant</option>
                  <option value="collegue">Un ou plusieurs collègues</option>
                  <option value="client_fournisseur">Un client ou fournisseur</option>
                  <option value="plusieurs">Plusieurs personnes</option>
                </select>
                {errors.auteurFaits && (
                  <p className="text-red-500 text-sm mt-1">{errors.auteurFaits}</p>
                )}
              </div>

              {formData.auteurFaits && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Précisez le poste de l'auteur (facultatif)
                  </label>
                  <input
                    type="text"
                    value={formData.auteurPoste}
                    onChange={(e) => handleInputChange('auteurPoste', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Manager, Directeur commercial..."
                  />
                </div>
              )}
            </div>
          )}

          {/* ÉTAPE 2 : Faits et circonstances */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                ⚠️ Description des faits et circonstances
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quels types de faits avez-vous subis ? * (plusieurs choix possibles)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'insultes_menaces', label: 'Insultes, menaces, propos blessants' },
                    { value: 'humiliations_publiques', label: 'Humiliations publiques devant collègues' },
                    { value: 'isolement_mise_ecart', label: 'Isolement, mise à l\'écart du groupe' },
                    { value: 'charges_travail_excessives', label: 'Charges de travail excessives ou impossibles' },
                    { value: 'retrait_responsabilites', label: 'Retrait de responsabilités / placardisation' },
                    { value: 'propos_discriminatoires', label: 'Propos discriminatoires (sexistes, racistes...)' },
                    { value: 'avances_sexuelles', label: 'Avances sexuelles non désirées / chantage' },
                    { value: 'agressions_physiques', label: '⚠️ Agressions physiques' },
                    { value: 'autres', label: 'Autres (précisez)' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.natureFaits.includes(option.value)}
                        onChange={() => handleCheckboxChange('natureFaits', option.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.natureFaits && (
                  <p className="text-red-500 text-sm mt-1">{errors.natureFaits}</p>
                )}
              </div>

              {formData.natureFaits.includes('autres') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Précisez les autres faits *
                  </label>
                  <textarea
                    value={formData.autresNatureFaits}
                    onChange={(e) => handleInputChange('autresNatureFaits', e.target.value)}
                    rows={3}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.autresNatureFaits ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Décrivez les autres faits..."
                  />
                  {errors.autresNatureFaits && (
                    <p className="text-red-500 text-sm mt-1">{errors.autresNatureFaits}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  À quelle fréquence ces faits se produisent-ils ? *
                </label>
                <select
                  value={formData.frequence}
                  onChange={(e) => handleInputChange('frequence', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.frequence ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="quotidienne">Quotidienne (tous les jours)</option>
                  <option value="hebdomadaire">Hebdomadaire (plusieurs fois par semaine)</option>
                  <option value="mensuelle">Mensuelle (plusieurs fois par mois)</option>
                  <option value="occasionnelle">Occasionnelle (quelques fois)</option>
                </select>
                {errors.frequence && (
                  <p className="text-red-500 text-sm mt-1">{errors.frequence}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  ℹ️ Le caractère répété est essentiel pour qualifier le harcèlement
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Depuis combien de temps cela dure-t-il ? * (en mois)
                </label>
                <input
                  type="number"
                  value={formData.duree}
                  onChange={(e) => handleInputChange('duree', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.duree ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 6"
                />
                {errors.duree && (
                  <p className="text-red-500 text-sm mt-1">{errors.duree}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date approximative du début *
                </label>
                <input
                  type="month"
                  value={formData.dateDebut}
                  onChange={(e) => handleInputChange('dateDebut', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.dateDebut ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dateDebut && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateDebut}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment la situation a-t-elle débuté ? *
                </label>
                <select
                  value={formData.contexteDebut}
                  onChange={(e) => handleInputChange('contexteDebut', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.contexteDebut ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="changement_hierarchie">Après changement de hiérarchie</option>
                  <option value="refus_avances">Après refus d'avances sexuelles</option>
                  <option value="conflit_professionnel">Après un conflit professionnel</option>
                  <option value="grossesse_conge">Après annonce grossesse/congé parental</option>
                  <option value="arret_maladie">Après un arrêt maladie</option>
                  <option value="reclamation_droits">Après réclamation de mes droits</option>
                  <option value="sans_raison">Sans raison apparente</option>
                  <option value="autre">Autre contexte</option>
                </select>
                {errors.contexteDebut && (
                  <p className="text-red-500 text-sm mt-1">{errors.contexteDebut}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment la situation a-t-elle évolué ? *
                </label>
                <select
                  value={formData.evolution}
                  onChange={(e) => handleInputChange('evolution', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.evolution ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="aggravation">Aggravation progressive</option>
                  <option value="stable">Stable dans le temps</option>
                  <option value="amelioration">Amélioration récente</option>
                  <option value="arret">Arrêt des faits</option>
                </select>
                {errors.evolution && (
                  <p className="text-red-500 text-sm mt-1">{errors.evolution}</p>
                )}
              </div>

              {formData.typeSituation === 'discrimination' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sur quel(s) critère(s) êtes-vous discriminé(e) ? * (plusieurs choix possibles)
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'sexe', label: 'Sexe (homme/femme)' },
                      { value: 'grossesse', label: 'Grossesse / Maternité' },
                      { value: 'orientation_sexuelle', label: 'Orientation sexuelle' },
                      { value: 'identite_genre', label: 'Identité de genre' },
                      { value: 'age', label: 'Âge (jeune ou senior)' },
                      { value: 'origine', label: 'Origine ethnique / Nationalité' },
                      { value: 'religion', label: 'Religion / Convictions' },
                      { value: 'handicap', label: 'Handicap / État de santé' },
                      { value: 'apparence', label: 'Apparence physique' },
                      { value: 'syndicat', label: 'Activités syndicales' },
                      { value: 'autre', label: 'Autre critère' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.caracteristiquesDiscrimination.includes(option.value)}
                          onChange={() => handleCheckboxChange('caracteristiquesDiscrimination', option.value)}
                          className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.caracteristiquesDiscrimination && (
                    <p className="text-red-500 text-sm mt-1">{errors.caracteristiquesDiscrimination}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ÉTAPE 3 : Impacts et conséquences */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                🏥 Impacts sur votre santé et votre vie professionnelle
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quel impact sur votre santé ? * (plusieurs choix possibles)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'stress_anxiete', label: 'Stress, anxiété' },
                    { value: 'depression', label: 'État dépressif' },
                    { value: 'burn_out', label: 'Burn-out / Épuisement professionnel' },
                    { value: 'troubles_somatiques', label: 'Troubles somatiques (maux de tête, dos, ventre...)' },
                    { value: 'troubles_sommeil', label: 'Troubles du sommeil' },
                    { value: 'troubles_alimentaires', label: 'Troubles alimentaires' },
                    { value: 'idees_suicidaires', label: '⚠️ Idées suicidaires' },
                    { value: 'aucun', label: 'Aucun impact constaté' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.impactSante.includes(option.value)}
                        onChange={() => handleCheckboxChange('impactSante', option.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.impactSante && (
                  <p className="text-red-500 text-sm mt-1">{errors.impactSante}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avez-vous eu des arrêts de travail liés à cette situation ? *
                </label>
                <select
                  value={formData.arretsTravaill}
                  onChange={(e) => handleInputChange('arretsTravaill', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.arretsTravaill ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>
                {errors.arretsTravaill && (
                  <p className="text-red-500 text-sm mt-1">{errors.arretsTravaill}</p>
                )}
              </div>

              {formData.arretsTravaill === 'oui' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre total d'arrêts de travail *
                  </label>
                  <input
                    type="number"
                    value={formData.nombreArrets}
                    onChange={(e) => handleInputChange('nombreArrets', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.nombreArrets ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 3"
                  />
                  {errors.nombreArrets && (
                    <p className="text-red-500 text-sm mt-1">{errors.nombreArrets}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avez-vous été hospitalisé(e) ? *
                </label>
                <select
                  value={formData.hospitalisations}
                  onChange={(e) => handleInputChange('hospitalisations', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.hospitalisations ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>
                {errors.hospitalisations && (
                  <p className="text-red-500 text-sm mt-1">{errors.hospitalisations}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suivez-vous un traitement médical lié à cette situation ? *
                </label>
                <select
                  value={formData.traitementMedical}
                  onChange={(e) => handleInputChange('traitementMedical', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.traitementMedical ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="oui">Oui (antidépresseurs, anxiolytiques...)</option>
                  <option value="non">Non</option>
                </select>
                {errors.traitementMedical && (
                  <p className="text-red-500 text-sm mt-1">{errors.traitementMedical}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quels impacts professionnels ? * (plusieurs choix possibles)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'baisse_performance', label: 'Baisse de performance / motivation' },
                    { value: 'mise_ecart_projets', label: 'Mise à l\'écart de projets importants' },
                    { value: 'retrogradation', label: 'Rétrogradation / Perte de responsabilités' },
                    { value: 'mutation_forcee', label: 'Mutation forcée' },
                    { value: 'perte_primes', label: 'Perte de primes / avantages' },
                    { value: 'entrave_carriere', label: 'Entrave à l\'évolution de carrière' },
                    { value: 'perte_clients', label: 'Perte de clients / contacts professionnels' },
                    { value: 'perte_emploi', label: 'Perte de l\'emploi' },
                    { value: 'aucun', label: 'Aucun impact professionnel' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.impactProfessionnel.includes(option.value)}
                        onChange={() => handleCheckboxChange('impactProfessionnel', option.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.impactProfessionnel && (
                  <p className="text-red-500 text-sm mt-1">{errors.impactProfessionnel}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Impacts psychologiques ? * (plusieurs choix possibles)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'perte_confiance', label: 'Perte de confiance en soi' },
                    { value: 'isolement_social', label: 'Isolement social' },
                    { value: 'peur_travailler', label: 'Peur d\'aller travailler' },
                    { value: 'cauchemars', label: 'Cauchemars / Flashbacks' },
                    { value: 'irritabilite', label: 'Irritabilité / Colère' },
                    { value: 'pleurs_frequents', label: 'Pleurs fréquents' },
                    { value: 'stress_post_traumatique', label: 'État de stress post-traumatique' },
                    { value: 'autre', label: 'Autre (précisez)' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.impactPsychologique.includes(option.value)}
                        onChange={() => handleCheckboxChange('impactPsychologique', option.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.impactPsychologique && (
                  <p className="text-red-500 text-sm mt-1">{errors.impactPsychologique}</p>
                )}
              </div>

              {formData.impactPsychologique.includes('autre') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Précisez les autres impacts psychologiques
                  </label>
                  <textarea
                    value={formData.autrePsycho}
                    onChange={(e) => handleInputChange('autrePsycho', e.target.value)}
                    rows={2}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Décrivez..."
                  />
                </div>
              )}
            </div>
          )}

          {/* ÉTAPE 4 : Preuves disponibles */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📄 Preuves et éléments disponibles
              </h3>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  💡 <strong>Important :</strong> Plus vous avez de preuves concrètes, plus votre dossier sera solide. Les témoignages écrits, certificats médicaux et emails sont particulièrement importants.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quelles preuves disposez-vous ? * (plusieurs choix possibles)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'temoignages', label: 'Témoignages de collègues' },
                    { value: 'emails', label: 'Emails, SMS, messages' },
                    { value: 'certificats_medicaux', label: 'Certificats médicaux' },
                    { value: 'signalements_internes', label: 'Signalements internes (RH, direction, CSE)' },
                    { value: 'enregistrements', label: 'Enregistrements audio/vidéo' },
                    { value: 'captures_ecran', label: 'Captures d\'écran' },
                    { value: 'journal_bord', label: 'Journal de bord / Notes datées' },
                    { value: 'aucune', label: 'Aucune preuve pour le moment' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.preuves.includes(option.value)}
                        onChange={() => handleCheckboxChange('preuves', option.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.preuves && (
                  <p className="text-red-500 text-sm mt-1">{errors.preuves}</p>
                )}
              </div>

              {formData.preuves.includes('temoignages') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nature des témoignages *
                  </label>
                  <select
                    value={formData.temoignages}
                    onChange={(e) => handleInputChange('temoignages', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.temoignages ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="ecrits_nombreux">Nombreux témoignages écrits et signés</option>
                    <option value="ecrits_quelques">Quelques témoignages écrits</option>
                    <option value="oraux">Témoignages oraux uniquement</option>
                    <option value="aucun">Pas encore de témoignages</option>
                  </select>
                  {errors.temoignages && (
                    <p className="text-red-500 text-sm mt-1">{errors.temoignages}</p>
                  )}
                </div>
              )}

              {formData.preuves.includes('temoignages') && formData.temoignages !== 'aucun' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre approximatif de témoins *
                  </label>
                  <input
                    type="number"
                    value={formData.nombreTemoins}
                    onChange={(e) => handleInputChange('nombreTemoins', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.nombreTemoins ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 3"
                  />
                  {errors.nombreTemoins && (
                    <p className="text-red-500 text-sm mt-1">{errors.nombreTemoins}</p>
                  )}
                </div>
              )}

              {formData.preuves.includes('emails') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nature des emails/messages *
                  </label>
                  <select
                    value={formData.emails}
                    onChange={(e) => handleInputChange('emails', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.emails ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="nombreux_explicites">Nombreux emails/SMS explicites (insultes, menaces)</option>
                    <option value="quelques">Quelques messages pertinents</option>
                    <option value="indices">Indices indirects (ton, mise à l'écart)</option>
                  </select>
                  {errors.emails && (
                    <p className="text-red-500 text-sm mt-1">{errors.emails}</p>
                  )}
                </div>
              )}

              {formData.preuves.includes('certificats_medicaux') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificats médicaux *
                  </label>
                  <select
                    value={formData.certificatsMedicaux}
                    onChange={(e) => handleInputChange('certificatsMedicaux', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.certificatsMedicaux ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="plusieurs_detailles">Plusieurs certificats détaillés (lien avec travail mentionné)</option>
                    <option value="quelques">Quelques certificats</option>
                    <option value="un">Un seul certificat</option>
                  </select>
                  {errors.certificatsMedicaux && (
                    <p className="text-red-500 text-sm mt-1">{errors.certificatsMedicaux}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    ℹ️ Les certificats médicaux établissant le lien entre votre état de santé et le travail sont essentiels
                  </p>
                </div>
              )}

              {formData.preuves.includes('signalements_internes') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Signalements internes *
                  </label>
                  <select
                    value={formData.signalementsInternes}
                    onChange={(e) => handleInputChange('signalementsInternes', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.signalementsInternes ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="plusieurs_traces">Plusieurs signalements avec traces écrites (AR)</option>
                    <option value="un_trace">Un signalement avec trace écrite</option>
                    <option value="verbal">Signalement verbal uniquement</option>
                  </select>
                  {errors.signalementsInternes && (
                    <p className="text-red-500 text-sm mt-1">{errors.signalementsInternes}</p>
                  )}
                </div>
              )}

              {formData.preuves.includes('signalements_internes') && formData.signalementsInternes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date du premier signalement (approximative)
                  </label>
                  <input
                    type="month"
                    value={formData.dateSignalement}
                    onChange={(e) => handleInputChange('dateSignalement', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Autres preuves ou précisions (facultatif)
                </label>
                <textarea
                  value={formData.autrePreuves}
                  onChange={(e) => handleInputChange('autrePreuves', e.target.value)}
                  rows={3}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Documents administratifs, rapports d'inspection, etc."
                />
              </div>
            </div>
          )}

          {/* ÉTAPE 5 : Démarches et objectifs */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                🎯 Démarches effectuées et vos objectifs
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quelles démarches avez-vous déjà effectuées ? * (plusieurs choix possibles)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'signalement_interne', label: 'Signalement interne (RH, direction)' },
                    { value: 'medecine_travail', label: 'Consultation médecin du travail' },
                    { value: 'inspection_travail', label: 'Signalement Inspection du Travail' },
                    { value: 'plainte_penale', label: 'Dépôt de plainte pénale' },
                    { value: 'cse', label: 'Alerte CSE/Délégués' },
                    { value: 'defenseur_droits', label: 'Saisine Défenseur des droits' },
                    { value: 'avocat', label: 'Consultation d\'un avocat' },
                    { value: 'association', label: 'Contact association d\'aide aux victimes' },
                    { value: 'aucune', label: 'Aucune démarche pour le moment' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.demarchesEffectuees.includes(option.value)}
                        onChange={() => handleCheckboxChange('demarchesEffectuees', option.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.demarchesEffectuees && (
                  <p className="text-red-500 text-sm mt-1">{errors.demarchesEffectuees}</p>
                )}
              </div>

              {formData.demarchesEffectuees.includes('signalement_interne') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quelle a été la réponse de l'employeur ?
                  </label>
                  <select
                    value={formData.reponseEmployeur}
                    onChange={(e) => handleInputChange('reponseEmployeur', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="aucune">Aucune réponse / Ignoré</option>
                    <option value="minimisation">Minimisation des faits</option>
                    <option value="enquete_incomplete">Enquête incomplète ou biaisée</option>
                    <option value="enquete_serieuse">Enquête sérieuse en cours</option>
                    <option value="mesures_prises">Mesures correctrices prises</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quelle est votre situation actuelle ? *
                </label>
                <select
                  value={formData.situationActuelle}
                  onChange={(e) => handleInputChange('situationActuelle', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.situationActuelle ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="en_poste">Toujours en poste (situation en cours)</option>
                  <option value="arret_travail">En arrêt de travail</option>
                  <option value="licencie">J'ai été licencié(e)</option>
                  <option value="demission">J'ai démissionné</option>
                  <option value="rupture_conventionnelle">Rupture conventionnelle</option>
                  <option value="prise_acte">Prise d'acte de la rupture</option>
                </select>
                {errors.situationActuelle && (
                  <p className="text-red-500 text-sm mt-1">{errors.situationActuelle}</p>
                )}
              </div>

              {(formData.situationActuelle === 'licencie' || formData.situationActuelle === 'demission' || formData.situationActuelle === 'prise_acte') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de la rupture *
                    </label>
                    <input
                      type="month"
                      value={formData.dateLicenciement}
                      onChange={(e) => handleInputChange('dateLicenciement', e.target.value)}
                      className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.dateLicenciement ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.dateLicenciement && (
                      <p className="text-red-500 text-sm mt-1">{errors.dateLicenciement}</p>
                    )}
                  </div>

                  {formData.situationActuelle === 'licencie' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Motif du licenciement *
                      </label>
                      <select
                        value={formData.motifLicenciement}
                        onChange={(e) => handleInputChange('motifLicenciement', e.target.value)}
                        className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.motifLicenciement ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">-- Sélectionnez --</option>
                        <option value="apres_signalement">Licenciement survenu après mon signalement</option>
                        <option value="represailles">Licenciement pour représailles</option>
                        <option value="inaptitude">Inaptitude médicale</option>
                        <option value="faute">Pour faute (grave, lourde)</option>
                        <option value="insuffisance_pro">Insuffisance professionnelle</option>
                        <option value="economique">Motif économique</option>
                        <option value="sans_cause">Sans cause réelle et sérieuse</option>
                        <option value="autre">Autre motif</option>
                      </select>
                      {errors.motifLicenciement && (
                        <p className="text-red-500 text-sm mt-1">{errors.motifLicenciement}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        ℹ️ Un licenciement après signalement de harcèlement peut être qualifié de NUL (Art. L1152-2)
                      </p>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quels sont vos objectifs ? * (plusieurs choix possibles)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'reparation_prejudice', label: 'Obtenir réparation du préjudice moral' },
                    { value: 'sanctions_auteur', label: 'Faire sanctionner l\'auteur des faits' },
                    { value: 'reconnaissance_faits', label: 'Faire reconnaître les faits' },
                    { value: 'maintien_emploi', label: 'Conserver mon emploi' },
                    { value: 'changement_poste', label: 'Changer de poste/service' },
                    { value: 'rupture_torts_employeur', label: 'Rupture aux torts de l\'employeur' },
                    { value: 'indemnites_licenciement', label: 'Contester le licenciement et obtenir des indemnités' },
                    { value: 'plainte_penale', label: 'Porter plainte au pénal' },
                    { value: 'accompagnement', label: 'Être accompagné(e) dans mes démarches' }
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
                  Niveau d'urgence *
                </label>
                <select
                  value={formData.urgence}
                  onChange={(e) => handleInputChange('urgence', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.urgence ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="critique">🚨 Critique (danger immédiat pour ma santé)</option>
                  <option value="tres_urgent">Très urgent (situation insupportable)</option>
                  <option value="urgent">Urgent (besoin d'aide rapide)</option>
                  <option value="normal">Normal (besoin d'information et conseil)</option>
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
                  value={formData.informationsComplementaires}
                  onChange={(e) => handleInputChange('informationsComplementaires', e.target.value)}
                  rows={4}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ajoutez toute information importante pour votre diagnostic..."
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
      )}
    </>
  )
}
