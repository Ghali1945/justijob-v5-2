'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Types pour le formulaire
interface FormData {
  // ÉTAPE 1 : Période et situation
  dateDebut: string
  dateFin: string
  situation: string
  typeContrat: string
  tempsPartiel: string
  tauxTempsPartiel: string
  
  // ÉTAPE 2 : Congés acquis et pris
  joursAcquis: string
  joursPris: string
  joursRTT: string
  soldeAfficheBulletin: string
  methodeCPAcquis: string
  
  // ÉTAPE 3 : Salaire de référence
  salaireBrutMensuel: string
  primesRegulières: string
  treizièmeMois: string
  avantagesNature: string
  heuresSupHabituelles: string
  autresElements: string
  
  // ÉTAPE 4 : Contexte et preuves
  refusEmployeur: string
  detailsRefus: string
  preuvesDisponibles: string[]
  detailsPreuves: string
  indemnitePayee: string
  montantDejaPercu: string
  anciennete: string
  objectifs: string[]
}

interface Results {
  score: number
  joursNonPris: number
  methode1dixieme: number
  methodeMaintienSalaire: number
  methodeRetenue: string
  montantDu: number
  congesSurConges: number
  montantTotal: number
  montantNet: number
  categorie: string
  recommandations: string[]
  textesDeLoi: string[]
  procedureRecommandee: string[]
  delaisPrescription: string
  pointsVigilance: string[]
}

export default function DiagnosticCongesPayes() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<Results | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    // ÉTAPE 1
    dateDebut: '',
    dateFin: '',
    situation: '',
    typeContrat: '',
    tempsPartiel: 'non',
    tauxTempsPartiel: '100',
    
    // ÉTAPE 2
    joursAcquis: '',
    joursPris: '',
    joursRTT: '0',
    soldeAfficheBulletin: '',
    methodeCPAcquis: 'calcul',
    
    // ÉTAPE 3
    salaireBrutMensuel: '',
    primesRegulières: '0',
    treizièmeMois: 'non',
    avantagesNature: '0',
    heuresSupHabituelles: '0',
    autresElements: '0',
    
    // ÉTAPE 4
    refusEmployeur: '',
    detailsRefus: '',
    preuvesDisponibles: [],
    detailsPreuves: '',
    indemnitePayee: '',
    montantDejaPercu: '0',
    anciennete: '',
    objectifs: []
  })

  // Sauvegarde automatique
  useEffect(() => {
    const saved = localStorage.getItem('diagnostic_conges_payes')
    if (saved) {
      const data = JSON.parse(saved)
      setFormData(data.formData || formData)
      setCurrentStep(data.currentStep || 1)
    }
  }, [])

  useEffect(() => {
    if (currentStep > 0) {
      localStorage.setItem('diagnostic_conges_payes', JSON.stringify({
        formData,
        currentStep,
        lastUpdate: new Date().toISOString()
      }))
    }
  }, [formData, currentStep])

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayValue = (field: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof FormData] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      return { ...prev, [field]: newArray }
    })
  }

  // Validation des étapes
  const validateStep = (step: number): boolean => {
    switch(step) {
      case 1:
        return !!(
          formData.dateDebut &&
          formData.dateFin &&
          formData.situation &&
          formData.typeContrat &&
          formData.tauxTempsPartiel
        )
      
      case 2:
        if (formData.methodeCPAcquis === 'calcul') {
          return !!(formData.joursAcquis && formData.joursPris)
        }
        return !!(formData.soldeAfficheBulletin)
      
      case 3:
        return !!(formData.salaireBrutMensuel)
      
      case 4:
        return !!(
          formData.refusEmployeur &&
          formData.preuvesDisponibles.length > 0 &&
          formData.indemnitePayee &&
          formData.anciennete &&
          formData.objectifs.length > 0
        )
      
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        calculateResults()
      }
    } else {
      alert('Veuillez remplir tous les champs obligatoires')
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Fonction de calcul des résultats
  const calculateResults = () => {
    // Calcul durée en mois
    const debut = new Date(formData.dateDebut)
    const fin = new Date(formData.dateFin)
    const moisTravailles = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    
    // Jours de CP non pris
    const joursAcquis = formData.methodeCPAcquis === 'calcul' 
      ? parseFloat(formData.joursAcquis) 
      : parseFloat(formData.soldeAfficheBulletin)
    const joursPris = parseFloat(formData.joursPris || '0')
    const joursNonPris = joursAcquis - joursPris
    
    // Salaire de référence
    const salaireBrut = parseFloat(formData.salaireBrutMensuel)
    const primes = parseFloat(formData.primesRegulières || '0')
    const heuresSup = parseFloat(formData.heuresSupHabituelles || '0')
    const avantages = parseFloat(formData.avantagesNature || '0')
    const autres = parseFloat(formData.autresElements || '0')
    
    let salaireReference = salaireBrut + primes + heuresSup + avantages + autres
    
    // Ajout 13ème mois proratisé
    if (formData.treizièmeMois === 'oui') {
      salaireReference += salaireBrut / 12
    }
    
    // Ajustement temps partiel
    const tauxTP = parseFloat(formData.tauxTempsPartiel) / 100
    salaireReference = salaireReference * tauxTP
    
    // MÉTHODE 1 : 1/10ème (Art. L3141-24)
    const salairePeriode = salaireReference * moisTravailles
    const methode1dixieme = (salairePeriode / 10) * (joursNonPris / 25)
    
    // MÉTHODE 2 : Maintien de salaire (Art. L3141-22)
    const salaireJournalier = salaireReference / 21.67 // Jours ouvrés moyens par mois
    const methodeMaintienSalaire = salaireJournalier * joursNonPris
    
    // Méthode la plus favorable
    const montantDu = Math.max(methode1dixieme, methodeMaintienSalaire)
    const methodeRetenue = montantDu === methode1dixieme ? 'Méthode du 1/10ème' : 'Méthode du maintien de salaire'
    
    // Congés payés sur congés payés (+10%)
    const congesSurConges = montantDu * 0.10
    
    // Montant total avant déduction
    const montantTotal = montantDu + congesSurConges
    
    // Déduction montants déjà perçus
    const dejaPercu = parseFloat(formData.montantDejaPercu || '0')
    const montantNet = Math.max(0, montantTotal - dejaPercu)
    
    // SCORING (sur 100 points)
    let score = 0
    
    // 1. Calcul précis et documenté (40 points)
    if (formData.methodeCPAcquis === 'bulletin' && formData.soldeAfficheBulletin) {
      score += 20 // Solde sur bulletin = preuve forte
    } else if (formData.joursAcquis) {
      score += 15 // Calcul manuel
    }
    
    if (formData.preuvesDisponibles.includes('bulletins')) score += 10
    if (formData.preuvesDisponibles.includes('attestation')) score += 10
    
    // 2. Preuves solides (30 points)
    if (formData.preuvesDisponibles.includes('emails_refus')) score += 10
    if (formData.preuvesDisponibles.includes('demandes_ecrites')) score += 8
    if (formData.preuvesDisponibles.includes('temoignages')) score += 5
    if (formData.preuvesDisponibles.includes('planning')) score += 4
    if (formData.refusEmployeur === 'oui' && formData.detailsRefus) score += 3
    
    // 3. Délai de prescription OK (20 points)
    const anciennete = parseInt(formData.anciennete)
    if (anciennete <= 1) {
      score += 20 // Moins d'1 an = excellent
    } else if (anciennete <= 2) {
      score += 15 // 1-2 ans = bon
    } else if (anciennete <= 3) {
      score += 10 // 2-3 ans = correct
    } else {
      score += 0 // Plus de 3 ans = prescrit
    }
    
    // 4. Contexte favorable (10 points)
    if (formData.situation === 'rupture') score += 5 // Rupture = indemnité due automatiquement
    if (joursNonPris >= 10) score += 3 // Montant significatif
    if (formData.indemnitePayee === 'non') score += 2 // Rien payé = créance claire
    
    // Catégorisation
    let categorie = ''
    if (score >= 80) categorie = 'EXCELLENT - Dossier très solide'
    else if (score >= 60) categorie = 'BON - Bonnes chances de succès'
    else if (score >= 40) categorie = 'MOYEN - Dossier à renforcer'
    else categorie = 'FAIBLE - Preuves insuffisantes'
    
    // Recommandations personnalisées
    const recommandations: string[] = []
    
    if (score >= 70) {
      recommandations.push('🎯 Votre dossier est solide. Vous pouvez procéder avec confiance.')
    }
    
    if (formData.indemnitePayee === 'non') {
      recommandations.push('📝 Envoyez une mise en demeure en recommandé avec AR réclamant le paiement de l\'indemnité compensatrice de congés payés.')
    } else if (formData.indemnitePayee === 'partiel') {
      recommandations.push('📝 Réclamez le complément d\'indemnité compensatrice avec calcul détaillé.')
    }
    
    if (!formData.preuvesDisponibles.includes('bulletins')) {
      recommandations.push('📄 Demandez vos bulletins de salaire à l\'employeur (obligation légale Art. R3243-4).')
    }
    
    if (!formData.preuvesDisponibles.includes('attestation')) {
      recommandations.push('📋 Demandez une attestation de solde de tout compte mentionnant les CP.')
    }
    
    if (formData.refusEmployeur === 'oui' && !formData.preuvesDisponibles.includes('emails_refus')) {
      recommandations.push('✉️ Rassemblez tous les emails ou courriers prouvant les refus de congés.')
    }
    
    if (anciennete > 2 && anciennete <= 3) {
      recommandations.push('⚠️ URGENT : Vous approchez de la prescription de 3 ans. Agissez rapidement !')
    }
    
    if (anciennete > 3) {
      recommandations.push('🚨 ATTENTION : Délai de prescription dépassé pour certains CP (3 ans). Seuls les CP des 3 dernières années sont réclamables.')
    }
    
    if (montantNet > 3000) {
      recommandations.push('⚖️ Montant significatif : consultez un avocat spécialisé en droit du travail pour optimiser votre stratégie.')
    }
    
    if (formData.situation === 'rupture') {
      recommandations.push('💼 En cas de rupture, l\'indemnité compensatrice est due automatiquement et doit figurer sur le solde de tout compte.')
    }
    
    if (score < 50) {
      recommandations.push('🔍 Renforcez votre dossier en rassemblant plus de preuves documentaires avant d\'engager une procédure.')
    }
    
    if (formData.situation === 'en_poste') {
      recommandations.push('📅 Si toujours en poste, demandez d\'abord à poser vos CP. La réclamation pécuniaire n\'est possible qu\'en cas de refus ou rupture.')
    }
    
    recommandations.push('🤝 Privilégiez d\'abord une solution amiable avant d\'engager une procédure prud\'homale.')
    
    // Textes de loi applicables
    const textesDeLoi = [
      'Article L3141-1 Code du travail : Droit aux congés payés (2.5 jours ouvrables par mois)',
      'Article L3141-22 Code du travail : Indemnité de congés payés (maintien de salaire)',
      'Article L3141-24 Code du travail : Méthode du 1/10ème de la rémunération brute',
      'Article L3141-26 Code du travail : Indemnité compensatrice en cas de rupture du contrat',
      'Article L3141-28 Code du travail : Interdiction de remplacer les CP par une indemnité (sauf rupture)',
      'Article L3245-1 Code du travail : Prescription de 3 ans pour réclamer les CP non pris',
      'Article R3243-4 Code du travail : Mention obligatoire du solde de CP sur le bulletin'
    ]
    
    // Procédure recommandée
    const procedureRecommandee = [
      '1️⃣ Rassembler toutes les preuves (bulletins, emails, attestations)',
      '2️⃣ Calculer précisément le montant dû avec les deux méthodes légales',
      '3️⃣ Envoyer une mise en demeure en recommandé avec AR',
      '4️⃣ Délai de réponse : 15 jours minimum',
      '5️⃣ Si refus ou absence de réponse : saisir le Conseil de prud\'hommes',
      '6️⃣ Possibilité de référé prud\'homal si créance non sérieusement contestable'
    ]
    
    // Points de vigilance
    const pointsVigilance = [
      '⚠️ La prescription est de 3 ans à compter de la date où les CP auraient dû être pris',
      '⚠️ En cas de temps partiel, les droits à CP sont proportionnels',
      '⚠️ Les CP acquis ne peuvent être remplacés par une indemnité que lors de la rupture',
      '⚠️ L\'employeur ne peut imposer des dates de CP sans respecter un délai de prévenance',
      '⚠️ Le refus abusif de poser des CP peut constituer une faute de l\'employeur'
    ]
    
    if (anciennete > 3) {
      pointsVigilance.push('🚨 CRITIQUE : Prescription dépassée pour les CP de plus de 3 ans')
    }

    setResults({
      score,
      joursNonPris,
      methode1dixieme,
      methodeMaintienSalaire,
      methodeRetenue,
      montantDu,
      congesSurConges,
      montantTotal,
      montantNet,
      categorie,
      recommandations,
      textesDeLoi,
      procedureRecommandee,
      delaisPrescription: anciennete <= 3 ? 'Dans les délais ✅' : 'DÉPASSÉ ⚠️',
      pointsVigilance
    })
    
    setShowResults(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetDiagnostic = () => {
    localStorage.removeItem('diagnostic_conges_payes')
    setFormData({
      dateDebut: '',
      dateFin: '',
      situation: '',
      typeContrat: '',
      tempsPartiel: 'non',
      tauxTempsPartiel: '100',
      joursAcquis: '',
      joursPris: '',
      joursRTT: '0',
      soldeAfficheBulletin: '',
      methodeCPAcquis: 'calcul',
      salaireBrutMensuel: '',
      primesRegulières: '0',
      treizièmeMois: 'non',
      avantagesNature: '0',
      heuresSupHabituelles: '0',
      autresElements: '0',
      refusEmployeur: '',
      detailsRefus: '',
      preuvesDisponibles: [],
      detailsPreuves: '',
      indemnitePayee: '',
      montantDejaPercu: '0',
      anciennete: '',
      objectifs: []
    })
    setCurrentStep(1)
    setShowResults(false)
    setResults(null)
  }

  // Affichage des résultats
  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">
                  <span className="text-blue-600">JUSTI</span>
                  <span className="text-gray-900">JOB</span>
                </span>
              </div>
              <button
                onClick={() => router.push('/diagnostic')}
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                ← Retour aux diagnostics
              </button>
            </div>
          </div>
        </header>

        {/* Résultats */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Score principal */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-2xl p-8 text-white mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-4">
                <span className="text-5xl">🏖️</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Résultats du Diagnostic</h1>
              <p className="text-xl text-blue-100 mb-6">Congés Payés Non Pris</p>
              
              <div className="flex justify-center items-center gap-8 mb-6">
                <div>
                  <div className="text-5xl font-bold">{results.score}/100</div>
                  <div className="text-sm text-blue-100">Score de solidité</div>
                </div>
                <div className="h-16 w-px bg-white/30"></div>
                <div>
                  <div className="text-4xl font-bold">{results.joursNonPris}</div>
                  <div className="text-sm text-blue-100">Jours non pris</div>
                </div>
              </div>
              
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                <div className="text-sm text-blue-100 mb-1">Catégorie du dossier</div>
                <div className="text-2xl font-bold">{results.categorie}</div>
              </div>
            </div>
          </div>

          {/* Montants détaillés */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">💰</span>
              Calcul des Montants Dus
            </h2>
            
            <div className="space-y-6">
              {/* Deux méthodes de calcul */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-sm text-blue-600 font-semibold mb-2">Méthode du 1/10ème</div>
                  <div className="text-sm text-gray-600 mb-2">Article L3141-24</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {results.methode1dixieme.toFixed(2)} €
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-sm text-green-600 font-semibold mb-2">Maintien de salaire</div>
                  <div className="text-sm text-gray-600 mb-2">Article L3141-22</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {results.methodeMaintienSalaire.toFixed(2)} €
                  </div>
                </div>
              </div>

              {/* Méthode retenue */}
              <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-4 text-white">
                <div className="text-sm font-semibold mb-1">✅ Méthode la plus favorable retenue :</div>
                <div className="text-xl font-bold">{results.methodeRetenue}</div>
              </div>

              {/* Détail du calcul */}
              <div className="border-t pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Indemnité compensatrice de base</span>
                    <span className="font-semibold text-lg">{results.montantDu.toFixed(2)} €</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-green-600">
                    <span>+ Congés payés sur congés payés (10%)</span>
                    <span className="font-semibold">+ {results.congesSurConges.toFixed(2)} €</span>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-gray-700">Montant total brut</span>
                    <span className="font-bold text-xl">{results.montantTotal.toFixed(2)} €</span>
                  </div>
                  
                  {parseFloat(formData.montantDejaPercu) > 0 && (
                    <>
                      <div className="flex justify-between items-center text-red-600">
                        <span>- Montant déjà perçu</span>
                        <span className="font-semibold">- {parseFloat(formData.montantDejaPercu).toFixed(2)} €</span>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                        <span className="font-bold text-gray-900">Montant net à réclamer</span>
                        <span className="font-bold text-2xl text-blue-600">{results.montantNet.toFixed(2)} €</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Délai de prescription */}
          <div className={`rounded-2xl shadow-xl p-6 mb-8 ${
            parseInt(formData.anciennete) <= 3 
              ? 'bg-green-50 border-2 border-green-500' 
              : 'bg-red-50 border-2 border-red-500'
          }`}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span>⏰</span>
              <span>Délai de Prescription</span>
            </h3>
            <div className="mb-2">
              <span className="text-2xl font-bold">{results.delaisPrescription}</span>
            </div>
            <p className="text-sm text-gray-700">
              {parseInt(formData.anciennete) <= 3 
                ? `Vos congés non pris datent de moins de 3 ans. Vous êtes dans les délais légaux pour les réclamer.`
                : `⚠️ ATTENTION : Les congés payés de plus de 3 ans sont prescrits. Seuls les CP des 3 dernières années peuvent être réclamés.`
              }
            </p>
          </div>

          {/* Recommandations */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">💡</span>
              Recommandations Personnalisées
            </h2>
            <div className="space-y-3">
              {results.recommandations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <span className="text-2xl flex-shrink-0">{rec.split(' ')[0]}</span>
                  <p className="text-gray-700 flex-1">{rec.substring(rec.indexOf(' ') + 1)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Procédure recommandée */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">📋</span>
              Procédure Recommandée
            </h2>
            <div className="space-y-3">
              {results.procedureRecommandee.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="flex-1 text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Points de vigilance */}
          <div className="bg-orange-50 border-2 border-orange-500 rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              Points de Vigilance
            </h2>
            <div className="space-y-3">
              {results.pointsVigilance.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-orange-600 flex-shrink-0 mt-0.5">{point.split(' ')[0]}</span>
                  <p className="text-gray-700">{point.substring(point.indexOf(' ') + 1)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Textes de loi */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">⚖️</span>
              Cadre Juridique Applicable
            </h2>
            <div className="space-y-3">
              {results.textesDeLoi.map((texte, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-blue-600">
                      {texte.split(':')[0]}
                    </span>
                    {texte.includes(':') && ': ' + texte.split(':')[1]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
              <span className="text-3xl">📄</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">
              Besoin d'un Dossier Juridique Complet ?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Obtenez un dossier de 30 pages avec jurisprudence, modèles de courriers,
              stratégie personnalisée et accompagnement par un avocat partenaire
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="bg-white/20 px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">120€</div>
                <div className="text-sm text-blue-100">Grand public</div>
              </div>
              <div className="bg-white/20 px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">60€</div>
                <div className="text-sm text-blue-100">Membres syndicats</div>
              </div>
            </div>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
              Obtenir mon dossier complet
            </button>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4">
            <button
              onClick={resetDiagnostic}
              className="flex-1 bg-gray-600 text-white py-4 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
            >
              Nouveau diagnostic
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Imprimer les résultats
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Formulaire par étapes
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                <span className="text-blue-600">JUSTI</span>
                <span className="text-gray-900">JOB</span>
              </span>
            </div>
            <button
              onClick={() => router.push('/diagnostic')}
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              ← Retour
            </button>
          </div>
        </div>
      </header>

      {/* Progression */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Période</span>
            <span>Congés</span>
            <span>Salaire</span>
            <span>Contexte</span>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* ÉTAPE 1 */}
          {currentStep === 1 && (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <span className="text-3xl">🏖️</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Diagnostic Congés Payés Non Pris
                </h2>
                <p className="text-gray-600">
                  Étape 1/4 : Période et situation professionnelle
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date de début de période *
                    </label>
                    <input
                      type="date"
                      value={formData.dateDebut}
                      onChange={(e) => updateFormData('dateDebut', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Date d'embauche ou début de période concernée</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date de fin de période *
                    </label>
                    <input
                      type="date"
                      value={formData.dateFin}
                      onChange={(e) => updateFormData('dateFin', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Aujourd'hui ou date de départ</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Situation actuelle *
                  </label>
                  <select
                    value={formData.situation}
                    onChange={(e) => updateFormData('situation', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="en_poste">Toujours en poste</option>
                    <option value="rupture">Contrat rompu (démission, licenciement, fin CDD)</option>
                    <option value="preavis">En période de préavis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type de contrat *
                  </label>
                  <select
                    value={formData.typeContrat}
                    onChange={(e) => updateFormData('typeContrat', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="cdi">CDI</option>
                    <option value="cdd">CDD</option>
                    <option value="interim">Intérim</option>
                    <option value="apprentissage">Apprentissage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Temps de travail *
                  </label>
                  <select
                    value={formData.tempsPartiel}
                    onChange={(e) => {
                      updateFormData('tempsPartiel', e.target.value)
                      if (e.target.value === 'non') {
                        updateFormData('tauxTempsPartiel', '100')
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    <option value="non">Temps plein</option>
                    <option value="oui">Temps partiel</option>
                  </select>
                </div>

                {formData.tempsPartiel === 'oui' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Taux de temps partiel (en %) *
                    </label>
                    <input
                      type="number"
                      value={formData.tauxTempsPartiel}
                      onChange={(e) => updateFormData('tauxTempsPartiel', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                      placeholder="Ex: 80 pour 80%"
                      min="1"
                      max="99"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ex: 80% pour un temps partiel à 4 jours/semaine
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ÉTAPE 2 */}
          {currentStep === 2 && (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Congés Acquis et Pris
                </h2>
                <p className="text-gray-600">
                  Étape 2/4 : Décompte des jours de congés
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Comment connaissez-vous vos CP acquis ? *
                  </label>
                  <select
                    value={formData.methodeCPAcquis}
                    onChange={(e) => updateFormData('methodeCPAcquis', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    <option value="calcul">Je calcule (2.5 jours par mois travaillé)</option>
                    <option value="bulletin">Indiqué sur mon bulletin de salaire</option>
                  </select>
                </div>

                {formData.methodeCPAcquis === 'calcul' ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre de jours de CP acquis *
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.joursAcquis}
                        onChange={(e) => updateFormData('joursAcquis', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                        placeholder="Ex: 25"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Calcul : 2.5 jours ouvrables par mois travaillé (30 jours/an pour temps plein)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre de jours de CP pris *
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.joursPris}
                        onChange={(e) => updateFormData('joursPris', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                        placeholder="Ex: 15"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Solde de CP affiché sur bulletin *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.soldeAfficheBulletin}
                      onChange={(e) => updateFormData('soldeAfficheBulletin', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                      placeholder="Ex: 10"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Regardez la ligne "Solde CP" ou "CP N-1" sur votre dernier bulletin
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jours de RTT (si applicable)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.joursRTT}
                    onChange={(e) => updateFormData('joursRTT', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Les RTT sont un droit distinct des CP et se calculent différemment
                  </p>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <p className="font-semibold text-blue-900 mb-1">Bon à savoir</p>
                      <p className="text-sm text-blue-800">
                        Les congés payés ne peuvent pas être remplacés par une indemnité, 
                        SAUF en cas de rupture du contrat de travail (démission, licenciement, fin CDD).
                        L'employeur doit alors verser une indemnité compensatrice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 */}
          {currentStep === 3 && (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <span className="text-3xl">💶</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Salaire de Référence
                </h2>
                <p className="text-gray-600">
                  Étape 3/4 : Éléments de rémunération pour le calcul
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Salaire brut mensuel *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salaireBrutMensuel}
                    onChange={(e) => updateFormData('salaireBrutMensuel', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="Ex: 2500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Salaire de base avant prélèvements
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Primes régulières mensualisées (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.primesRegulières}
                    onChange={(e) => updateFormData('primesRegulières', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Primes d'ancienneté, prime de performance mensuelle, etc.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    13ème mois
                  </label>
                  <select
                    value={formData.treizièmeMois}
                    onChange={(e) => updateFormData('treizièmeMois', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    <option value="non">Non</option>
                    <option value="oui">Oui</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Avantages en nature (€/mois)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.avantagesNature}
                    onChange={(e) => updateFormData('avantagesNature', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Véhicule de fonction, logement, tickets restaurant, etc.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Heures supplémentaires habituelles (€/mois)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.heuresSupHabituelles}
                    onChange={(e) => updateFormData('heuresSupHabituelles', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Montant moyen mensuel des heures supplémentaires
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Autres éléments de rémunération (€/mois)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.autresElements}
                    onChange={(e) => updateFormData('autresElements', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>

                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚖️</span>
                    <div>
                      <p className="font-semibold text-green-900 mb-1">Méthode de calcul légale</p>
                      <p className="text-sm text-green-800">
                        L'indemnité de congés payés se calcule selon la méthode la plus favorable 
                        entre : (1) le 1/10ème de la rémunération brute totale de la période de référence, 
                        ou (2) le maintien du salaire habituel pendant les congés.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 4 */}
          {currentStep === 4 && (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <span className="text-3xl">📁</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Contexte et Preuves
                </h2>
                <p className="text-gray-600">
                  Étape 4/4 : Situation et documents disponibles
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Depuis combien de temps les CP ne sont pas payés/pris ? *
                  </label>
                  <select
                    value={formData.anciennete}
                    onChange={(e) => updateFormData('anciennete', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="0">Moins de 6 mois</option>
                    <option value="1">6 mois à 1 an</option>
                    <option value="2">1 à 2 ans</option>
                    <option value="3">2 à 3 ans</option>
                    <option value="4">Plus de 3 ans ⚠️</option>
                  </select>
                  <p className="text-xs text-red-600 mt-1">
                    ⚠️ Attention : La prescription est de 3 ans pour les congés payés
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    L'employeur a-t-il refusé que vous posiez vos CP ? *
                  </label>
                  <select
                    value={formData.refusEmployeur}
                    onChange={(e) => updateFormData('refusEmployeur', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="oui">Oui, refus explicite ou absence de réponse</option>
                    <option value="non">Non, je n'ai pas demandé à les poser</option>
                    <option value="impossible">Impossible de les poser (surcharge, planning)</option>
                  </select>
                </div>

                {formData.refusEmployeur === 'oui' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Détails sur les refus
                    </label>
                    <textarea
                      value={formData.detailsRefus}
                      onChange={(e) => updateFormData('detailsRefus', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                      placeholder="Décrivez les circonstances : dates, motifs invoqués par l'employeur..."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Preuves disponibles * (plusieurs choix possibles)
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'bulletins', label: 'Bulletins de salaire mentionnant le solde de CP' },
                      { value: 'attestation', label: 'Attestation employeur ou certificat de travail' },
                      { value: 'emails_refus', label: 'Emails/courriers de refus de l\'employeur' },
                      { value: 'demandes_ecrites', label: 'Demandes écrites de congés' },
                      { value: 'temoignages', label: 'Témoignages de collègues' },
                      { value: 'planning', label: 'Planning ou registre des absences' },
                      { value: 'journal', label: 'Journal personnel / cahier de suivi' }
                    ].map((preuve) => (
                      <label key={preuve.value} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.preuvesDisponibles.includes(preuve.value)}
                          onChange={() => toggleArrayValue('preuvesDisponibles', preuve.value)}
                          className="w-5 h-5 text-blue-600"
                        />
                        <span className="text-gray-700">{preuve.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Précisions sur vos preuves
                  </label>
                  <textarea
                    value={formData.detailsPreuves}
                    onChange={(e) => updateFormData('detailsPreuves', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="Décrivez vos documents : nombre de bulletins, dates des emails, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Avez-vous reçu une indemnité compensatrice ? *
                  </label>
                  <select
                    value={formData.indemnitePayee}
                    onChange={(e) => updateFormData('indemnitePayee', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="non">Non, aucune indemnité reçue</option>
                    <option value="partiel">Oui, mais montant insuffisant</option>
                    <option value="oui">Oui, montant complet reçu</option>
                  </select>
                </div>

                {(formData.indemnitePayee === 'partiel' || formData.indemnitePayee === 'oui') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Montant déjà perçu (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.montantDejaPercu}
                      onChange={(e) => updateFormData('montantDejaPercu', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Vos objectifs * (plusieurs choix possibles)
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'recuperation_totale', label: 'Récupération du montant total dû' },
                      { value: 'regularisation', label: 'Régularisation à l\'amiable' },
                      { value: 'mise_en_demeure', label: 'Envoi d\'une mise en demeure' },
                      { value: 'prudhommes', label: 'Saisine du Conseil de prud\'hommes si nécessaire' },
                      { value: 'information', label: 'Comprendre mes droits et le montant dû' }
                    ].map((objectif) => (
                      <label key={objectif.value} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.objectifs.includes(objectif.value)}
                          onChange={() => toggleArrayValue('objectifs', objectif.value)}
                          className="w-5 h-5 text-blue-600"
                        />
                        <span className="text-gray-700">{objectif.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div className="flex gap-4 mt-8 pt-6 border-t">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                ← Étape précédente
              </button>
            )}
            <button
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
              className={`flex-1 py-4 rounded-xl font-semibold transition-colors ${
                validateStep(currentStep)
                  ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentStep === 4 ? 'Voir les résultats →' : 'Étape suivante →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
