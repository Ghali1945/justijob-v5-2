'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface FormData {
  // Étape 1 : Informations générales
  situationPro: string
  typeContrat: string
  anciennete: string
  salaireBrut: string
  tauxHoraire: string
  heuresContractuelles: string
  statut: string
  
  // Étape 2 : Détails des heures supplémentaires
  periodeDebut: string
  periodeFin: string
  heuresMoyennesParSemaine: string
  totalHeuresNonPayees: string
  typesHeures: string[]
  heuresNuit: string
  heuresDimanche: string
  heuresJoursFeries: string
  heuresSupPayees: string
  tauxPayeIncorrect: string
  
  // Étape 3 : Circonstances et demandes
  demandeEmployeur: string
  pressionEmployeur: string
  refusPaiement: string
  raisonRefus: string
  reposCompensateur: string
  
  // Étape 4 : Preuves disponibles
  preuves: string[]
  badgeages: string
  plannings: string
  emails: string
  temoignages: string
  
  // Étape 5 : Objectifs et urgence
  objectifs: string[]
  situationActuelle: string
  urgence: string
  informationsComplementaires: string
}

interface Scores {
  preuves: number
  volumeHeures: number
  duree: number
  contexte: number
}

interface Montants {
  heuresSup25: number
  heuresSup50: number
  heuresNuit: number
  heuresDimanche: number
  heuresJoursFeries: number
  reposCompensateur: number
  dommagesInterets: number
  total: number
}

export default function DiagnosticHeuresSupplementaires() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    situationPro: '',
    typeContrat: '',
    anciennete: '',
    salaireBrut: '',
    tauxHoraire: '',
    heuresContractuelles: '',
    statut: '',
    periodeDebut: '',
    periodeFin: '',
    heuresMoyennesParSemaine: '',
    totalHeuresNonPayees: '',
    typesHeures: [],
    heuresNuit: '',
    heuresDimanche: '',
    heuresJoursFeries: '',
    heuresSupPayees: '',
    tauxPayeIncorrect: '',
    demandeEmployeur: '',
    pressionEmployeur: '',
    refusPaiement: '',
    raisonRefus: '',
    reposCompensateur: '',
    preuves: [],
    badgeages: '',
    plannings: '',
    emails: '',
    temoignages: '',
    objectifs: [],
    situationActuelle: '',
    urgence: '',
    informationsComplementaires: ''
  })
  
  const [showResults, setShowResults] = useState(false)
  const [scores, setScores] = useState<Scores>({
    preuves: 0,
    volumeHeures: 0,
    duree: 0,
    contexte: 0
  })
  const [montants, setMontants] = useState<Montants>({
    heuresSup25: 0,
    heuresSup50: 0,
    heuresNuit: 0,
    heuresDimanche: 0,
    heuresJoursFeries: 0,
    reposCompensateur: 0,
    dommagesInterets: 0,
    total: 0
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Sauvegarde automatique
  useEffect(() => {
    if (Object.keys(formData).some(key => {
      const value = formData[key as keyof FormData]
      return Array.isArray(value) ? value.length > 0 : value !== ''
    })) {
      localStorage.setItem('justijob_heures_draft', JSON.stringify(formData))
    }
  }, [formData])

  // Chargement au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('justijob_heures_draft')
    if (saved) {
      const shouldRestore = window.confirm(
        "📋 Un diagnostic en cours a été trouvé. Voulez-vous le reprendre ?"
      )
      if (shouldRestore) {
        setFormData(JSON.parse(saved))
      } else {
        localStorage.removeItem('justijob_heures_draft')
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
      }
      if (!formData.tauxHoraire) {
        stepErrors.tauxHoraire = "⚠️ Le taux horaire est requis"
      } else if (parseFloat(formData.tauxHoraire) < 7) {
        stepErrors.tauxHoraire = "⚠️ Le taux horaire semble trop faible (minimum SMIC horaire)"
      }
      if (!formData.heuresContractuelles) {
        stepErrors.heuresContractuelles = "⚠️ Les heures contractuelles sont requises"
      } else if (parseInt(formData.heuresContractuelles) < 1 || parseInt(formData.heuresContractuelles) > 48) {
        stepErrors.heuresContractuelles = "⚠️ Les heures doivent être entre 1 et 48 par semaine"
      }
      if (!formData.statut) {
        stepErrors.statut = "⚠️ Le statut est requis"
      }
    }

    if (step === 2) {
      if (!formData.periodeDebut) {
        stepErrors.periodeDebut = "⚠️ La date de début de période est requise"
      }
      if (!formData.periodeFin) {
        stepErrors.periodeFin = "⚠️ La date de fin de période est requise"
      }
      if (formData.periodeDebut && formData.periodeFin) {
        const debut = new Date(formData.periodeDebut)
        const fin = new Date(formData.periodeFin)
        if (fin < debut) {
          stepErrors.periodeFin = "⚠️ La date de fin doit être après la date de début"
        }
        const diffYears = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24 * 365)
        if (diffYears > 3) {
          stepErrors.periodeFin = "⚠️ La période ne peut dépasser 3 ans (prescription)"
        }
      }
      if (!formData.heuresMoyennesParSemaine) {
        stepErrors.heuresMoyennesParSemaine = "⚠️ Le nombre d'heures moyennes par semaine est requis"
      } else if (parseFloat(formData.heuresMoyennesParSemaine) < 35) {
        stepErrors.heuresMoyennesParSemaine = "⚠️ Le nombre d'heures doit être supérieur à 35h (durée légale)"
      } else if (parseFloat(formData.heuresMoyennesParSemaine) > 60) {
        stepErrors.heuresMoyennesParSemaine = "⚠️ Vérifiez le nombre d'heures (maximum 60h autorisé)"
      }
      if (!formData.totalHeuresNonPayees) {
        stepErrors.totalHeuresNonPayees = "⚠️ Le total des heures non payées est requis"
      } else if (parseFloat(formData.totalHeuresNonPayees) < 1) {
        stepErrors.totalHeuresNonPayees = "⚠️ Le nombre d'heures doit être au moins 1"
      } else if (parseFloat(formData.totalHeuresNonPayees) > 5000) {
        stepErrors.totalHeuresNonPayees = "⚠️ Vérifiez le nombre total d'heures"
      }
      if (formData.typesHeures.length === 0) {
        stepErrors.typesHeures = "⚠️ Sélectionnez au moins un type d'heures"
      }
      
      // Validations conditionnelles
      if (formData.typesHeures.includes('heures_nuit') && !formData.heuresNuit) {
        stepErrors.heuresNuit = "⚠️ Nombre d'heures de nuit requis"
      }
      if (formData.typesHeures.includes('heures_dimanche') && !formData.heuresDimanche) {
        stepErrors.heuresDimanche = "⚠️ Nombre d'heures dimanche requis"
      }
      if (formData.typesHeures.includes('heures_feries') && !formData.heuresJoursFeries) {
        stepErrors.heuresJoursFeries = "⚠️ Nombre d'heures jours fériés requis"
      }
    }

    if (step === 3) {
      if (!formData.demandeEmployeur) {
        stepErrors.demandeEmployeur = "⚠️ Indiquez si les heures ont été demandées par l'employeur"
      }
      if (!formData.pressionEmployeur) {
        stepErrors.pressionEmployeur = "⚠️ Indiquez s'il y a eu pression de l'employeur"
      }
      if (!formData.refusPaiement) {
        stepErrors.refusPaiement = "⚠️ Indiquez si l'employeur refuse le paiement"
      }
      if (formData.refusPaiement === 'oui' && !formData.raisonRefus) {
        stepErrors.raisonRefus = "⚠️ La raison du refus est requise"
      }
      if (!formData.reposCompensateur) {
        stepErrors.reposCompensateur = "⚠️ Indiquez si vous avez bénéficié de repos compensateur"
      }
    }

    if (step === 4) {
      if (formData.preuves.length === 0) {
        stepErrors.preuves = "⚠️ Sélectionnez au moins un type de preuve disponible"
      }
      if (formData.preuves.includes('badgeages') && !formData.badgeages) {
        stepErrors.badgeages = "⚠️ Précisez la disponibilité des badgeages"
      }
      if (formData.preuves.includes('plannings') && !formData.plannings) {
        stepErrors.plannings = "⚠️ Précisez la disponibilité des plannings"
      }
      if (formData.preuves.includes('emails') && !formData.emails) {
        stepErrors.emails = "⚠️ Précisez la disponibilité des emails"
      }
      if (formData.preuves.includes('temoignages') && !formData.temoignages) {
        stepErrors.temoignages = "⚠️ Précisez la disponibilité des témoignages"
      }
    }

    if (step === 5) {
      if (formData.objectifs.length === 0) {
        stepErrors.objectifs = "⚠️ Sélectionnez au moins un objectif"
      }
      if (!formData.situationActuelle) {
        stepErrors.situationActuelle = "⚠️ La situation actuelle est requise"
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
    let volumeHeures = 0
    let duree = 0
    let contexte = 0

    // Score PREUVES (40 points max)
    const preuvesWeight = {
      badgeages: 12,      // Preuve la plus forte
      plannings: 8,
      emails: 6,
      temoignages: 4,
      photos: 3,
      notes: 2,
      aucune: 0
    }
    formData.preuves.forEach(preuve => {
      preuves += preuvesWeight[preuve as keyof typeof preuvesWeight] || 0
    })

    // Qualité des badgeages (bonus +5)
    if (formData.badgeages === 'complets') preuves += 5
    else if (formData.badgeages === 'partiels') preuves += 2

    // Plannings (bonus +3)
    if (formData.plannings === 'signes') preuves += 3
    else if (formData.plannings === 'non_signes') preuves += 1

    // Emails (bonus +3)
    if (formData.emails === 'nombreux') preuves += 3
    else if (formData.emails === 'quelques') preuves += 1

    // Témoignages (bonus +2)
    if (formData.temoignages === 'plusieurs_ecrits') preuves += 2
    else if (formData.temoignages === 'un_ecrit') preuves += 1

    // Limiter à 40 points max
    preuves = Math.min(preuves, 40)

    // Score VOLUME HEURES (25 points max)
    const totalHeures = parseFloat(formData.totalHeuresNonPayees) || 0
    if (totalHeures >= 500) volumeHeures = 25
    else if (totalHeures >= 300) volumeHeures = 20
    else if (totalHeures >= 150) volumeHeures = 15
    else if (totalHeures >= 75) volumeHeures = 10
    else if (totalHeures >= 35) volumeHeures = 5
    else volumeHeures = 2

    // Score DURÉE (20 points max)
    if (formData.periodeDebut && formData.periodeFin) {
      const debut = new Date(formData.periodeDebut)
      const fin = new Date(formData.periodeFin)
      const mois = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24 * 30)
      
      if (mois >= 24) duree = 20      // 2 ans et +
      else if (mois >= 12) duree = 15 // 1-2 ans
      else if (mois >= 6) duree = 10  // 6-12 mois
      else if (mois >= 3) duree = 5   // 3-6 mois
      else duree = 2                   // < 3 mois
    }

    // Score CONTEXTE (15 points max)
    // Demande employeur (5 points)
    if (formData.demandeEmployeur === 'oui_ecrit') contexte += 5
    else if (formData.demandeEmployeur === 'oui_oral') contexte += 3
    else if (formData.demandeEmployeur === 'implicite') contexte += 1

    // Refus de paiement (5 points)
    if (formData.refusPaiement === 'oui') {
      if (formData.raisonRefus === 'aucune' || formData.raisonRefus === 'heures_non_demandees') {
        contexte += 5 // Refus injustifié
      } else if (formData.raisonRefus === 'pas_autorisees') {
        contexte += 3
      }
    }

    // Pression employeur (3 points)
    if (formData.pressionEmployeur === 'forte') contexte += 3
    else if (formData.pressionEmployeur === 'moyenne') contexte += 2
    else if (formData.pressionEmployeur === 'faible') contexte += 1

    // Repos compensateur (2 points si non accordé)
    if (formData.reposCompensateur === 'non') contexte += 2

    return { preuves, volumeHeures, duree, contexte }
  }

  const calculateMontants = () => {
    const tauxHoraire = parseFloat(formData.tauxHoraire) || 0
    const totalHeures = parseFloat(formData.totalHeuresNonPayees) || 0
    const heuresContractuelles = parseInt(formData.heuresContractuelles) || 35

    let montantsCalc: Montants = {
      heuresSup25: 0,
      heuresSup50: 0,
      heuresNuit: 0,
      heuresDimanche: 0,
      heuresJoursFeries: 0,
      reposCompensateur: 0,
      dommagesInterets: 0,
      total: 0
    }

    // 1. Calcul heures supplémentaires 25% et 50%
    // Les 8 premières heures au-delà de 35h sont à 25%
    // Au-delà, c'est 50%
    
    const heuresMoyennes = parseFloat(formData.heuresMoyennesParSemaine) || heuresContractuelles
    const heuresSupParSemaine = Math.max(0, heuresMoyennes - heuresContractuelles)
    
    if (heuresSupParSemaine > 0) {
      const heuresSup25ParSemaine = Math.min(heuresSupParSemaine, 8)
      const heuresSup50ParSemaine = Math.max(0, heuresSupParSemaine - 8)
      
      // Calculer le nombre de semaines dans la période
      if (formData.periodeDebut && formData.periodeFin) {
        const debut = new Date(formData.periodeDebut)
        const fin = new Date(formData.periodeFin)
        const semaines = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24 * 7)
        
        const totalHeuresSup25 = heuresSup25ParSemaine * semaines
        const totalHeuresSup50 = heuresSup50ParSemaine * semaines
        
        // Calcul avec majorations
        montantsCalc.heuresSup25 = totalHeuresSup25 * tauxHoraire * 1.25
        montantsCalc.heuresSup50 = totalHeuresSup50 * tauxHoraire * 1.50
      }
    }

    // 2. Heures de nuit (21h-6h) : majoration +25% minimum
    if (formData.typesHeures.includes('heures_nuit') && formData.heuresNuit) {
      const heuresNuit = parseFloat(formData.heuresNuit)
      montantsCalc.heuresNuit = heuresNuit * tauxHoraire * 1.25
    }

    // 3. Heures dimanche : majoration +100% (double paye)
    if (formData.typesHeures.includes('heures_dimanche') && formData.heuresDimanche) {
      const heuresDimanche = parseFloat(formData.heuresDimanche)
      montantsCalc.heuresDimanche = heuresDimanche * tauxHoraire * 2.00
    }

    // 4. Heures jours fériés : majoration +100% (double paye)
    if (formData.typesHeures.includes('heures_feries') && formData.heuresJoursFeries) {
      const heuresFeries = parseFloat(formData.heuresJoursFeries)
      montantsCalc.heuresJoursFeries = heuresFeries * tauxHoraire * 2.00
    }

    // 5. Repos compensateur équivalent
    // 1h sup à 25% = 1h15 de repos
    // 1h sup à 50% = 1h30 de repos
    if (formData.periodeDebut && formData.periodeFin) {
      const debut = new Date(formData.periodeDebut)
      const fin = new Date(formData.periodeFin)
      const semaines = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24 * 7)
      
      const heuresMoyennes = parseFloat(formData.heuresMoyennesParSemaine) || heuresContractuelles
      const heuresSupParSemaine = Math.max(0, heuresMoyennes - heuresContractuelles)
      
      const heuresSup25ParSemaine = Math.min(heuresSupParSemaine, 8)
      const heuresSup50ParSemaine = Math.max(0, heuresSupParSemaine - 8)
      
      const totalHeuresSup25 = heuresSup25ParSemaine * semaines
      const totalHeuresSup50 = heuresSup50ParSemaine * semaines
      
      const reposCompensateur25 = totalHeuresSup25 * 1.25 // 1h25 de repos par heure
      const reposCompensateur50 = totalHeuresSup50 * 1.50 // 1h30 de repos par heure
      
      const totalHeuresRepos = reposCompensateur25 + reposCompensateur50
      montantsCalc.reposCompensateur = totalHeuresRepos * tauxHoraire
    }

    // 6. Dommages et intérêts si dissimulation/refus
    const scoreTotal = scores.preuves + scores.volumeHeures + scores.duree + scores.contexte
    const salaire = parseFloat(formData.salaireBrut) || 0
    
    if (scoreTotal >= 70) {
      // Dissimulation grave ou refus injustifié
      if (formData.refusPaiement === 'oui' && 
          (formData.raisonRefus === 'aucune' || formData.raisonRefus === 'heures_non_demandees')) {
        montantsCalc.dommagesInterets = salaire * 6 // 6 mois (jurisprudence)
      } else {
        montantsCalc.dommagesInterets = salaire * 3 // 3 mois
      }
    } else if (scoreTotal >= 50) {
      montantsCalc.dommagesInterets = salaire * 1.5 // 1.5 mois
    } else if (scoreTotal >= 30) {
      montantsCalc.dommagesInterets = salaire * 0.5 // 0.5 mois
    }

    // Total
    montantsCalc.total = montantsCalc.heuresSup25 + 
                         montantsCalc.heuresSup50 + 
                         montantsCalc.heuresNuit + 
                         montantsCalc.heuresDimanche + 
                         montantsCalc.heuresJoursFeries + 
                         montantsCalc.dommagesInterets

    return montantsCalc
  }

  const handleSubmit = () => {
    if (validateStep(5)) {
      const calculatedScores = calculateScores()
      setScores(calculatedScores)
      
      // Calculer les montants
      setTimeout(() => {
        const tempMontants = calculateMontants()
        
        // Recalculer les dommages avec les bons scores
        const scoreTotal = calculatedScores.preuves + calculatedScores.volumeHeures + 
                           calculatedScores.duree + calculatedScores.contexte
        const salaire = parseFloat(formData.salaireBrut) || 0
        
        if (scoreTotal >= 70) {
          if (formData.refusPaiement === 'oui' && 
              (formData.raisonRefus === 'aucune' || formData.raisonRefus === 'heures_non_demandees')) {
            tempMontants.dommagesInterets = salaire * 6
          } else {
            tempMontants.dommagesInterets = salaire * 3
          }
        } else if (scoreTotal >= 50) {
          tempMontants.dommagesInterets = salaire * 1.5
        } else if (scoreTotal >= 30) {
          tempMontants.dommagesInterets = salaire * 0.5
        }
        
        tempMontants.total = tempMontants.heuresSup25 + 
                             tempMontants.heuresSup50 + 
                             tempMontants.heuresNuit + 
                             tempMontants.heuresDimanche + 
                             tempMontants.heuresJoursFeries + 
                             tempMontants.dommagesInterets
        
        setMontants(tempMontants)
      }, 100)
      
      setShowResults(true)
      localStorage.removeItem('justijob_heures_draft')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const resetForm = () => {
    setFormData({
      situationPro: '',
      typeContrat: '',
      anciennete: '',
      salaireBrut: '',
      tauxHoraire: '',
      heuresContractuelles: '',
      statut: '',
      periodeDebut: '',
      periodeFin: '',
      heuresMoyennesParSemaine: '',
      totalHeuresNonPayees: '',
      typesHeures: [],
      heuresNuit: '',
      heuresDimanche: '',
      heuresJoursFeries: '',
      heuresSupPayees: '',
      tauxPayeIncorrect: '',
      demandeEmployeur: '',
      pressionEmployeur: '',
      refusPaiement: '',
      raisonRefus: '',
      reposCompensateur: '',
      preuves: [],
      badgeages: '',
      plannings: '',
      emails: '',
      temoignages: '',
      objectifs: [],
      situationActuelle: '',
      urgence: '',
      informationsComplementaires: ''
    })
    setCurrentStep(1)
    setShowResults(false)
    setErrors({})
    localStorage.removeItem('justijob_heures_draft')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getStepCompletion = (step: number) => {
    let completed = 0
    let total = 0

    if (step === 1) {
      total = 7
      if (formData.situationPro) completed++
      if (formData.typeContrat) completed++
      if (formData.anciennete) completed++
      if (formData.salaireBrut) completed++
      if (formData.tauxHoraire) completed++
      if (formData.heuresContractuelles) completed++
      if (formData.statut) completed++
    } else if (step === 2) {
      total = 5 + formData.typesHeures.length
      if (formData.periodeDebut) completed++
      if (formData.periodeFin) completed++
      if (formData.heuresMoyennesParSemaine) completed++
      if (formData.totalHeuresNonPayees) completed++
      if (formData.typesHeures.length > 0) completed++
      if (formData.typesHeures.includes('heures_nuit') && formData.heuresNuit) completed++
      if (formData.typesHeures.includes('heures_dimanche') && formData.heuresDimanche) completed++
      if (formData.typesHeures.includes('heures_feries') && formData.heuresJoursFeries) completed++
    } else if (step === 3) {
      total = 5
      if (formData.demandeEmployeur) completed++
      if (formData.pressionEmployeur) completed++
      if (formData.refusPaiement) completed++
      if (formData.refusPaiement === 'oui' && formData.raisonRefus) completed++
      else if (formData.refusPaiement === 'non') completed++
      if (formData.reposCompensateur) completed++
    } else if (step === 4) {
      total = 1 + formData.preuves.length
      if (formData.preuves.length > 0) completed++
      if (formData.preuves.includes('badgeages') && formData.badgeages) completed++
      if (formData.preuves.includes('plannings') && formData.plannings) completed++
      if (formData.preuves.includes('emails') && formData.emails) completed++
      if (formData.preuves.includes('temoignages') && formData.temoignages) completed++
    } else if (step === 5) {
      total = 3
      if (formData.objectifs.length > 0) completed++
      if (formData.situationActuelle) completed++
      if (formData.urgence) completed++
    }

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { completed, total, percentage }
  }

  const totalScore = scores.preuves + scores.volumeHeures + scores.duree + scores.contexte

  const getRecommendations = () => {
    const recs = []
    const score = totalScore

    // Prescription
    if (formData.periodeDebut) {
      const debut = new Date(formData.periodeDebut)
      const maintenant = new Date()
      const moisEcoules = (maintenant.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24 * 30)
      
      if (moisEcoules >= 30) {
        recs.push({
          title: "🚨 ATTENTION PRESCRIPTION",
          description: "Vous approchez des 3 ans de prescription pour les heures supplémentaires (Art. L3171-4). Agissez IMMÉDIATEMENT pour ne pas perdre vos droits sur les heures les plus anciennes."
        })
      } else if (moisEcoules >= 24) {
        recs.push({
          title: "⏰ DÉLAI DE PRESCRIPTION",
          description: "Vous avez moins d'un an avant la prescription des premières heures non payées. Engagez rapidement une procédure prud'homale."
        })
      }
    }

    // Renforcement des preuves
    if (scores.preuves < 20) {
      recs.push({
        title: "📄 RENFORCEZ VOS PREUVES",
        description: "Rassemblez un maximum de preuves : badgeages, plannings signés, emails demandant les heures, attestations de collègues. Les badgeages sont la preuve la plus forte."
      })
    }

    // Badgeages
    if (!formData.preuves.includes('badgeages')) {
      recs.push({
        title: "🎫 RÉCUPÉREZ VOS BADGEAGES",
        description: "Demandez IMMÉDIATEMENT une copie de l'historique de vos badgeages à l'employeur (par courrier AR). C'est la preuve la plus forte et l'employeur a l'obligation de les conserver."
      })
    }

    // Mise en demeure
    if (formData.refusPaiement === 'oui') {
      recs.push({
        title: "📧 MISE EN DEMEURE URGENTE",
        description: "Envoyez une mise en demeure par lettre recommandée avec AR réclamant le paiement des heures supplémentaires sous 8 jours. Détaillez le nombre d'heures et les montants dus."
      })
    }

    // Inspection du travail
    if (score >= 50 && formData.refusPaiement === 'oui') {
      recs.push({
        title: "🏛️ SAISIR L'INSPECTION DU TRAVAIL",
        description: "Signalez immédiatement la situation à l'Inspection du Travail (DREETS). Le non-paiement des heures supplémentaires est un délit pénal (Art. L8223-1)."
      })
    }

    // Conseil juridique
    if (score >= 60 || montants.total >= 5000) {
      recs.push({
        title: "⚖️ CONSULTEZ UN AVOCAT SPÉCIALISÉ",
        description: "Votre dossier présente des enjeux importants (montant élevé et/ou preuves solides). Un avocat spécialisé en droit du travail maximisera vos chances de récupération."
      })
    }

    // Dissimulation grave
    if (formData.refusPaiement === 'oui' && formData.raisonRefus === 'aucune' && score >= 70) {
      recs.push({
        title: "🚨 DISSIMULATION D'HEURES",
        description: "Le refus de paiement sans justification constitue une dissimulation d'heures travaillées. Vous pouvez demander jusqu'à 6 mois de salaire en dommages et intérêts. Consultez un avocat."
      })
    }

    // Calcul heures
    recs.push({
      title: "🧮 CALCUL PRÉCIS DES HEURES",
      description: "Établissez un décompte précis : nb d'heures par semaine × nb de semaines sur la période. Préparez un tableau Excel détaillé semaine par semaine si possible."
      })
    }

    // Repos compensateur
    if (formData.reposCompensateur === 'non') {
      recs.push({
        title: "⏸️ REPOS COMPENSATEUR",
        description: "Vous pouvez demander soit le paiement des heures, soit le repos compensateur équivalent (1h25 pour 25%, 1h30 pour 50%). Le choix vous appartient."
      })
    }

    // Accompagnement syndical
    recs.push({
      title: "🤝 ACCOMPAGNEMENT SYNDICAL",
      description: "Contactez un syndicat (CGT, CFDT, FO...). Ils connaissent bien ces situations et peuvent vous accompagner gratuitement aux Prud'hommes."
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
              ⏰ Résultats de votre diagnostic : Heures supplémentaires
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
                <div className="text-3xl font-bold text-blue-600">{scores.preuves}/40</div>
                <div className="text-sm font-medium text-gray-700 mt-2">Preuves disponibles</div>
                <div className="text-xs text-gray-500 mt-1">
                  {scores.preuves >= 30 ? "Excellent" :
                   scores.preuves >= 20 ? "Bon" :
                   scores.preuves >= 10 ? "Moyen" : "À renforcer"}
                </div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600">{scores.volumeHeures}/25</div>
                <div className="text-sm font-medium text-gray-700 mt-2">Volume d'heures</div>
                <div className="text-xs text-gray-500 mt-1">
                  {scores.volumeHeures >= 20 ? "Élevé" :
                   scores.volumeHeures >= 10 ? "Moyen" : "Faible"}
                </div>
              </div>
              
              <div className="text-center p-4 bg-indigo-50 rounded-xl">
                <div className="text-3xl font-bold text-indigo-600">{scores.duree}/20</div>
                <div className="text-sm font-medium text-gray-700 mt-2">Durée de la période</div>
                <div className="text-xs text-gray-500 mt-1">
                  {scores.duree >= 15 ? "Longue" :
                   scores.duree >= 10 ? "Moyenne" : "Courte"}
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
              {montants.heuresSup25 > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">Heures supplémentaires (25%)</div>
                    <div className="text-sm text-gray-600">
                      8 premières heures au-delà de {formData.heuresContractuelles}h
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {montants.heuresSup25.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </div>
                </div>
              )}

              {montants.heuresSup50 > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">Heures supplémentaires (50%)</div>
                    <div className="text-sm text-gray-600">
                      Au-delà de {parseInt(formData.heuresContractuelles) + 8}h par semaine
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {montants.heuresSup50.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </div>
                </div>
              )}

              {montants.heuresNuit > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">Heures de nuit (21h-6h)</div>
                    <div className="text-sm text-gray-600">
                      Majoration +25% minimum
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {montants.heuresNuit.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </div>
                </div>
              )}

              {montants.heuresDimanche > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">Heures dimanche</div>
                    <div className="text-sm text-gray-600">
                      Majoration +100% (double paye)
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {montants.heuresDimanche.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </div>
                </div>
              )}

              {montants.heuresJoursFeries > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">Heures jours fériés</div>
                    <div className="text-sm text-gray-600">
                      Majoration +100% (double paye)
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {montants.heuresJoursFeries.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </div>
                </div>
              )}

              {montants.dommagesInterets > 0 && (
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <div>
                    <div className="font-semibold text-purple-800">Dommages et intérêts</div>
                    <div className="text-sm text-purple-600">
                      Pour dissimulation ou refus injustifié de paiement
                    </div>
                  </div>
                  <div className="text-xl font-bold text-purple-800">
                    {montants.dommagesInterets.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
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

            {montants.reposCompensateur > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2">💡 Alternative : Repos compensateur</h4>
                <p className="text-sm text-blue-700">
                  Au lieu du paiement, vous pouvez demander un repos compensateur équivalent à environ <strong>{(montants.reposCompensateur / parseFloat(formData.tauxHoraire)).toFixed(0)} heures</strong> de repos payé 
                  (valeur estimée : {montants.reposCompensateur.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€).
                </p>
              </div>
            )}

            <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Important :</strong> Ces montants sont des <strong>estimations</strong> basées sur les informations fournies. 
                Les montants réellement obtenus dépendront des preuves apportées et de la décision du Conseil de Prud'hommes.
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
                <strong>Prescription :</strong> Vous avez 3 ans à compter de la date où les heures supplémentaires 
                auraient dû être payées pour saisir les Prud'hommes (Art. L3171-4). Au-delà, vos droits sont perdus.
              </p>
              <p>
                <strong>Majorations légales :</strong> Les heures supplémentaires donnent lieu à une majoration 
                de salaire de 25% pour les 8 premières heures, puis 50% au-delà (Art. L3121-22).
              </p>
              <p>
                <strong>Heures de nuit :</strong> Période 21h-6h avec majoration minimum +25% 
                (peut être supérieure selon convention collective).
              </p>
              <p>
                <strong>Dimanche et jours fériés :</strong> Majoration minimum +100% (double paye), 
                sauf dispositions conventionnelles plus favorables.
              </p>
              <p>
                <strong>Charge de la preuve :</strong> Il appartient au salarié de prouver qu'il a effectué 
                des heures au-delà de la durée contractuelle. Conservez tous vos badgeages, plannings, emails.
              </p>
              <p>
                <strong>Délit pénal :</strong> La dissimulation d'heures travaillées est un délit pénal 
                passible d'amende (Art. L8223-1). Signalez à l'Inspection du Travail.
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
            ⏰ Diagnostic : Heures supplémentaires
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
              5 Objectifs
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
                  <option value="fin_cdd">Fin de CDD/Intérim</option>
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
                  placeholder="Ex: 2.5"
                />
                {errors.anciennete && (
                  <p className="text-red-500 text-sm mt-1">{errors.anciennete}</p>
                )}
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
                  placeholder="Ex: 2200"
                />
                {errors.salaireBrut && (
                  <p className="text-red-500 text-sm mt-1">{errors.salaireBrut}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taux horaire brut (en €) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.tauxHoraire}
                  onChange={(e) => handleInputChange('tauxHoraire', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.tauxHoraire ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 14.50"
                />
                {errors.tauxHoraire && (
                  <p className="text-red-500 text-sm mt-1">{errors.tauxHoraire}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  ℹ️ Si inconnu, divisez votre salaire brut par 151,67 heures (base légale mensuelle)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre d'heures contractuelles par semaine *
                </label>
                <input
                  type="number"
                  value={formData.heuresContractuelles}
                  onChange={(e) => handleInputChange('heuresContractuelles', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.heuresContractuelles ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 35"
                />
                {errors.heuresContractuelles && (
                  <p className="text-red-500 text-sm mt-1">{errors.heuresContractuelles}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  ℹ️ La durée légale est 35 heures par semaine
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut/Catégorie professionnelle *
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) => handleInputChange('statut', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.statut ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="employe">Employé</option>
                  <option value="ouvrier">Ouvrier</option>
                  <option value="agent_maitrise">Agent de maîtrise</option>
                  <option value="technicien">Technicien</option>
                  <option value="cadre">Cadre</option>
                </select>
                {errors.statut && (
                  <p className="text-red-500 text-sm mt-1">{errors.statut}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  ℹ️ Attention : les cadres dirigeants et certains cadres autonomes ne sont pas éligibles aux heures supplémentaires
                </p>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : Détails des heures supplémentaires */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                ⏰ Détails des heures supplémentaires
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début de la période *
                  </label>
                  <input
                    type="date"
                    value={formData.periodeDebut}
                    onChange={(e) => handleInputChange('periodeDebut', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.periodeDebut ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.periodeDebut && (
                    <p className="text-red-500 text-sm mt-1">{errors.periodeDebut}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin de la période *
                  </label>
                  <input
                    type="date"
                    value={formData.periodeFin}
                    onChange={(e) => handleInputChange('periodeFin', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.periodeFin ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.periodeFin && (
                    <p className="text-red-500 text-sm mt-1">{errors.periodeFin}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    ℹ️ Maximum 3 ans (prescription)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre moyen d'heures travaillées par semaine *
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.heuresMoyennesParSemaine}
                  onChange={(e) => handleInputChange('heuresMoyennesParSemaine', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.heuresMoyennesParSemaine ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 45"
                />
                {errors.heuresMoyennesParSemaine && (
                  <p className="text-red-500 text-sm mt-1">{errors.heuresMoyennesParSemaine}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  ℹ️ Au-delà de vos heures contractuelles ({formData.heuresContractuelles}h)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total estimé d'heures supplémentaires non payées *
                </label>
                <input
                  type="number"
                  value={formData.totalHeuresNonPayees}
                  onChange={(e) => handleInputChange('totalHeuresNonPayees', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.totalHeuresNonPayees ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 300"
                />
                {errors.totalHeuresNonPayees && (
                  <p className="text-red-500 text-sm mt-1">{errors.totalHeuresNonPayees}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  ℹ️ Estimation approximative si vous ne connaissez pas le nombre exact
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quels types d'heures supplémentaires avez-vous effectués ? * (plusieurs choix possibles)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'heures_jour', label: 'Heures en journée (normales)' },
                    { value: 'heures_nuit', label: 'Heures de nuit (21h-6h)' },
                    { value: 'heures_dimanche', label: 'Heures le dimanche' },
                    { value: 'heures_feries', label: 'Heures les jours fériés' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.typesHeures.includes(option.value)}
                        onChange={() => handleCheckboxChange('typesHeures', option.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.typesHeures && (
                  <p className="text-red-500 text-sm mt-1">{errors.typesHeures}</p>
                )}
              </div>

              {/* Champs conditionnels */}
              {formData.typesHeures.includes('heures_nuit') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre d'heures de nuit (21h-6h) *
                  </label>
                  <input
                    type="number"
                    value={formData.heuresNuit}
                    onChange={(e) => handleInputChange('heuresNuit', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.heuresNuit ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 50"
                  />
                  {errors.heuresNuit && (
                    <p className="text-red-500 text-sm mt-1">{errors.heuresNuit}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    ℹ️ Majoration +25% minimum (peut être supérieure selon convention collective)
                  </p>
                </div>
              )}

              {formData.typesHeures.includes('heures_dimanche') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre d'heures le dimanche *
                  </label>
                  <input
                    type="number"
                    value={formData.heuresDimanche}
                    onChange={(e) => handleInputChange('heuresDimanche', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.heuresDimanche ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 30"
                  />
                  {errors.heuresDimanche && (
                    <p className="text-red-500 text-sm mt-1">{errors.heuresDimanche}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    ℹ️ Majoration +100% (double paye)
                  </p>
                </div>
              )}

              {formData.typesHeures.includes('heures_feries') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre d'heures les jours fériés *
                  </label>
                  <input
                    type="number"
                    value={formData.heuresJoursFeries}
                    onChange={(e) => handleInputChange('heuresJoursFeries', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.heuresJoursFeries ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 20"
                  />
                  {errors.heuresJoursFeries && (
                    <p className="text-red-500 text-sm mt-1">{errors.heuresJoursFeries}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    ℹ️ Majoration +100% (double paye)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ÉTAPE 3 : Circonstances */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📝 Circonstances et demandes
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ces heures supplémentaires ont-elles été demandées par votre employeur ? *
                </label>
                <select
                  value={formData.demandeEmployeur}
                  onChange={(e) => handleInputChange('demandeEmployeur', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.demandeEmployeur ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="oui_ecrit">Oui, par écrit (email, planning signé)</option>
                  <option value="oui_oral">Oui, oralement</option>
                  <option value="implicite">Demande implicite (charge de travail impossible en 35h)</option>
                  <option value="non">Non, de ma propre initiative</option>
                </select>
                {errors.demandeEmployeur && (
                  <p className="text-red-500 text-sm mt-1">{errors.demandeEmployeur}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avez-vous subi une pression de votre employeur pour effectuer ces heures ? *
                </label>
                <select
                  value={formData.pressionEmployeur}
                  onChange={(e) => handleInputChange('pressionEmployeur', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.pressionEmployeur ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="forte">Oui, pression forte (menaces, sanctions)</option>
                  <option value="moyenne">Oui, pression moyenne</option>
                  <option value="faible">Oui, pression faible (encouragement)</option>
                  <option value="aucune">Non, aucune pression</option>
                </select>
                {errors.pressionEmployeur && (
                  <p className="text-red-500 text-sm mt-1">{errors.pressionEmployeur}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  L'employeur refuse-t-il de payer ces heures supplémentaires ? *
                </label>
                <select
                  value={formData.refusPaiement}
                  onChange={(e) => handleInputChange('refusPaiement', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.refusPaiement ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="oui">Oui, refus explicite</option>
                  <option value="non">Non, pas de refus</option>
                  <option value="ignore">Il ignore mes demandes</option>
                </select>
                {errors.refusPaiement && (
                  <p className="text-red-500 text-sm mt-1">{errors.refusPaiement}</p>
                )}
              </div>

              {formData.refusPaiement === 'oui' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quelle raison l'employeur donne-t-il pour refuser le paiement ? *
                  </label>
                  <select
                    value={formData.raisonRefus}
                    onChange={(e) => handleInputChange('raisonRefus', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.raisonRefus ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="aucune">Aucune raison donnée</option>
                    <option value="heures_non_demandees">Les heures n'ont pas été demandées</option>
                    <option value="pas_autorisees">Les heures n'étaient pas autorisées</option>
                    <option value="deja_payees">Les heures sont déjà payées dans le salaire</option>
                    <option value="difficultes">Difficultés financières de l'entreprise</option>
                    <option value="autre">Autre raison</option>
                  </select>
                  {errors.raisonRefus && (
                    <p className="text-red-500 text-sm mt-1">{errors.raisonRefus}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avez-vous bénéficié d'un repos compensateur pour ces heures ? *
                </label>
                <select
                  value={formData.reposCompensateur}
                  onChange={(e) => handleInputChange('reposCompensateur', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.reposCompensateur ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="oui_total">Oui, pour toutes les heures</option>
                  <option value="oui_partiel">Oui, partiellement</option>
                  <option value="non">Non, aucun repos compensateur</option>
                  <option value="ne_sais_pas">Je ne sais pas</option>
                </select>
                {errors.reposCompensateur && (
                  <p className="text-red-500 text-sm mt-1">{errors.reposCompensateur}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  ℹ️ Le repos compensateur équivaut à 1h25 pour les heures à 25%, 1h30 pour les heures à 50%
                </p>
              </div>
            </div>
          )}

          {/* ÉTAPE 4 : Preuves */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📄 Preuves disponibles
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quels types de preuves possédez-vous ? * (plusieurs choix possibles)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'badgeages', label: 'Badgeages / Pointeuse (PREUVE LA PLUS FORTE)' },
                    { value: 'plannings', label: 'Plannings de travail' },
                    { value: 'emails', label: 'Emails professionnels montrant vos horaires' },
                    { value: 'temoignages', label: 'Témoignages de collègues' },
                    { value: 'photos', label: 'Photos / captures d\'écran' },
                    { value: 'notes', label: 'Notes personnelles détaillées' },
                    { value: 'aucune', label: 'Aucune preuve matérielle' }
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

              {/* Champs conditionnels selon preuves sélectionnées */}
              {formData.preuves.includes('badgeages') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Disponibilité des badgeages *
                  </label>
                  <select
                    value={formData.badgeages}
                    onChange={(e) => handleInputChange('badgeages', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.badgeages ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="complets">Badgeages complets sur toute la période</option>
                    <option value="partiels">Badgeages partiels (quelques mois)</option>
                    <option value="a_obtenir">À obtenir auprès de l'employeur</option>
                  </select>
                  {errors.badgeages && (
                    <p className="text-red-500 text-sm mt-1">{errors.badgeages}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    ℹ️ L'employeur a l'obligation de conserver les badgeages pendant 1 an minimum
                  </p>
                </div>
              )}

              {formData.preuves.includes('plannings') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    État des plannings *
                  </label>
                  <select
                    value={formData.plannings}
                    onChange={(e) => handleInputChange('plannings', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.plannings ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="signes">Plannings signés par l'employeur</option>
                    <option value="non_signes">Plannings non signés</option>
                    <option value="captures">Captures d'écran de plannings numériques</option>
                  </select>
                  {errors.plannings && (
                    <p className="text-red-500 text-sm mt-1">{errors.plannings}</p>
                  )}
                </div>
              )}

              {formData.preuves.includes('emails') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nature des emails *
                  </label>
                  <select
                    value={formData.emails}
                    onChange={(e) => handleInputChange('emails', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.emails ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="nombreux">Nombreux emails (demandes, confirmations)</option>
                    <option value="quelques">Quelques emails pertinents</option>
                    <option value="peu">Peu d'emails (indices indirects)</option>
                  </select>
                  {errors.emails && (
                    <p className="text-red-500 text-sm mt-1">{errors.emails}</p>
                  )}
                </div>
              )}

              {formData.preuves.includes('temoignages') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de témoignages *
                  </label>
                  <select
                    value={formData.temoignages}
                    onChange={(e) => handleInputChange('temoignages', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.temoignages ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="plusieurs_ecrits">Plusieurs témoignages écrits</option>
                    <option value="un_ecrit">Un témoignage écrit</option>
                    <option value="oraux">Témoignages oraux uniquement</option>
                  </select>
                  {errors.temoignages && (
                    <p className="text-red-500 text-sm mt-1">{errors.temoignages}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ÉTAPE 5 : Objectifs */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                🎯 Vos objectifs et situation
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quels sont vos objectifs ? * (plusieurs choix possibles)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'paiement', label: 'Obtenir le paiement des heures supplémentaires' },
                    { value: 'repos', label: 'Obtenir le repos compensateur équivalent' },
                    { value: 'dommages', label: 'Obtenir des dommages et intérêts (dissimulation)' },
                    { value: 'regularisation', label: 'Faire régulariser ma situation' },
                    { value: 'sanctions', label: 'Faire sanctionner l\'employeur' },
                    { value: 'maintien_emploi', label: 'Conserver mon emploi' }
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
                  Situation actuelle avec l'employeur *
                </label>
                <select
                  value={formData.situationActuelle}
                  onChange={(e) => handleInputChange('situationActuelle', e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.situationActuelle ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="bonnes_relations">Bonnes relations, dialogue possible</option>
                  <option value="relations_tendues">Relations tendues</option>
                  <option value="conflit">Conflit ouvert</option>
                  <option value="rupture">Rupture de contrat (démission/licenciement)</option>
                </select>
                {errors.situationActuelle && (
                  <p className="text-red-500 text-sm mt-1">{errors.situationActuelle}</p>
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
                  <option value="tres_urgent">Très urgent (proche de la prescription)</option>
                  <option value="urgent">Urgent (besoin financier immédiat)</option>
                  <option value="normal">Normal (récupération de mes droits)</option>
                  <option value="pas_urgent">Pas urgent (vérification / information)</option>
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
