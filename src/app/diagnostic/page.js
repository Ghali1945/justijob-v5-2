
'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle, Shield, FileText, Upload, Euro, ChevronRight, Scale, TrendingUp, Users, Lock, ArrowLeft, Home, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Composant Questionnaire Modal (copié depuis page.js de l'accueil)
const QuestionnaireModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    nom: '', prenom: '', dateNaissance: '', adresse: '', telephone: '', email: '',
    raisonSociale: '', adresseEmployeur: '', secteurActivite: '', effectif: '',
    typeContrat: '', dateEmbauche: '', poste: '', salaire: '',
    typeProbleme: '', circonstances: '', temoins: '',
    contratTravail: false, fichesPayee: false, correspondances: false,
    autresElements: ''
  })

  const steps = ['Informations', 'Employeur', 'Contrat', 'Litige', 'Finalisation']

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header du modal */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Questionnaire JustiJob Complet</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step} className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                index + 1 === currentStep ? 'bg-blue-600 text-white' :
                index + 1 < currentStep ? 'bg-green-600 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-300"
                 style={{ width: `${(currentStep / 5) * 100}%` }} />
          </div>
        </div>

        {/* Contenu du formulaire */}
        <div className="p-6">
          {/* Étape 1: Informations personnelles */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Informations Personnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                  <input type="text" value={formData.nom} onChange={(e) => handleInputChange('nom', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                  <input type="text" value={formData.prenom} onChange={(e) => handleInputChange('prenom', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                  <input type="date" value={formData.dateNaissance} onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                  <input type="tel" value={formData.telephone} onChange={(e) => handleInputChange('telephone', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète *</label>
                  <textarea value={formData.adresse} onChange={(e) => handleInputChange('adresse', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" required />
                </div>
              </div>
            </div>
          )}

          {/* Étape 2: Informations employeur */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Informations sur l'Employeur</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Raison sociale de l'entreprise *</label>
                  <input type="text" value={formData.raisonSociale} onChange={(e) => handleInputChange('raisonSociale', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse de l'entreprise *</label>
                  <textarea value={formData.adresseEmployeur} onChange={(e) => handleInputChange('adresseEmployeur', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secteur d'activité</label>
                  <input type="text" value={formData.secteurActivite} onChange={(e) => handleInputChange('secteurActivite', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Effectif de l'entreprise</label>
                  <select value={formData.effectif} onChange={(e) => handleInputChange('effectif', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Sélectionner</option>
                    <option value="1-10">1-10 salariés</option>
                    <option value="11-50">11-50 salariés</option>
                    <option value="51-250">51-250 salariés</option>
                    <option value="250+">Plus de 250 salariés</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Contrat de travail */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Informations sur votre Contrat</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de contrat *</label>
                  <select value={formData.typeContrat} onChange={(e) => handleInputChange('typeContrat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Sélectionner</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Intérim">Intérim</option>
                    <option value="Stage">Stage</option>
                    <option value="Apprentissage">Apprentissage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date d'embauche *</label>
                  <input type="date" value={formData.dateEmbauche} onChange={(e) => handleInputChange('dateEmbauche', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Poste occupé *</label>
                  <input type="text" value={formData.poste} onChange={(e) => handleInputChange('poste', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salaire mensuel brut *</label>
                  <input type="number" value={formData.salaire} onChange={(e) => handleInputChange('salaire', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>
            </div>
          )}

          {/* Étape 4: Nature du litige */}
          {currentStep === 4 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Nature de votre Litige</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quel est votre problème principal ? *</label>
                  <select value={formData.typeProbleme} onChange={(e) => handleInputChange('typeProbleme', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Sélectionner</option>
                    <option value="licenciement-abusif">Licenciement abusif</option>
                    <option value="harcelement">Harcèlement (moral/sexuel)</option>
                    <option value="discrimination">Discrimination</option>
                    <option value="salaire-non-paye">Salaire non payé</option>
                    <option value="heures-sup">Heures supplémentaires non payées</option>
                    <option value="rupture-conventionnelle">Rupture conventionnelle forcée</option>
                    <option value="modification-contrat">Modification du contrat imposée</option>
                    <option value="accident-travail">Accident du travail</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Décrivez les circonstances détaillées *</label>
                  <textarea value={formData.circonstances} onChange={(e) => handleInputChange('circonstances', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           rows="6" placeholder="Décrivez précisément ce qui s'est passé, quand, où, avec qui..." required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Y a-t-il des témoins ?</label>
                  <textarea value={formData.temoins} onChange={(e) => handleInputChange('temoins', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           rows="3" placeholder="Noms des témoins et leur rôle..." />
                </div>
              </div>
            </div>
          )}

          {/* Étape 5: Finalisation */}
          {currentStep === 5 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Documents et Finalisation</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Quels documents pouvez-vous fournir ?</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'contratTravail', label: 'Contrat de travail' },
                      { key: 'fichesPayee', label: 'Fiches de paie' },
                      { key: 'correspondances', label: 'Correspondances avec employeur' },
                    ].map((doc) => (
                      <label key={doc.key} className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData[doc.key]}
                               onChange={(e) => handleInputChange(doc.key, e.target.checked)}
                               className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">{doc.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Informations complémentaires</label>
                  <textarea value={formData.autresElements} onChange={(e) => handleInputChange('autresElements', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           rows="4" placeholder="Tout autre élément important pour votre dossier..." />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-blue-900 mb-2">Étapes suivantes</h4>
                  <ol className="text-sm text-blue-800 space-y-2">
                    <li>1. Votre questionnaire sera analysé par notre IA</li>
                    <li>2. Vous recevrez un score de chances de succès</li>
                    <li>3. Upload de vos documents sur notre plateforme sécurisée</li>
                    <li>4. Recevez votre dossier prud'hommes sous 24h</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center px-6 py-4 border-t">
          {currentStep > 1 ? (
            <button onClick={prevStep} className="px-6 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200">
              Précédent
            </button>
          ) : <div></div>}

          {currentStep < 5 ? (
            <button onClick={nextStep} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
              Suivant
            </button>
          ) : (
            <button onClick={() => {
              alert('Questionnaire envoyé ! Vous allez recevoir votre dossier complet par email sous 24h.');
              onClose();
            }} className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200">
              Envoyer le Questionnaire Complet
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DiagnosticGratuit() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showResults, setShowResults] = useState(false)
  const [hasPromoCode, setHasPromoCode] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false)

  const [formData, setFormData] = useState({
    // Étape 1: Type de problème
    typeProbleme: '',
    urgence: '',

    // Étape 2: Situation
    anciennete: '',
    salaire: '',
    typeContrat: '',
    convention: '',

    // Étape 3: Préjudices
    heuresSupNonPayees: false,
    congesNonPris: false,
    primeNonVersee: false,
    licenciementAbusif: false,
    harcelement: false,
    discrimination: false,

    // Étape 4: Preuves
    contratTravail: false,
    bulletinsSalaire: false,
    courriersEchanges: false,
    temoignages: false,
    preuvesMedicales: false,
    enregistrements: false
  })

  const [score, setScore] = useState(null)

  const calculateScore = () => {
    let points = 0
    let maxPoints = 100

    // Points selon le type de problème (20 points max)
    if (formData.licenciementAbusif) points += 20
    else if (formData.heuresSupNonPayees) points += 15
    else if (formData.harcelement || formData.discrimination) points += 18
    else if (formData.primeNonVersee || formData.congesNonPris) points += 10

    // Points selon les preuves (40 points max)
    if (formData.contratTravail) points += 10
    if (formData.bulletinsSalaire) points += 10
    if (formData.courriersEchanges) points += 8
    if (formData.temoignages) points += 7
    if (formData.preuvesMedicales) points += 5

    // Points selon l'ancienneté (20 points max)
    const anciennete = parseInt(formData.anciennete) || 0
    if (anciennete > 10) points += 20
    else if (anciennete > 5) points += 15
    else if (anciennete > 2) points += 10
    else if (anciennete > 1) points += 5

    // Points selon urgence (20 points max)
    if (formData.urgence === 'immediate') points += 20
    else if (formData.urgence === 'mois') points += 15
    else if (formData.urgence === 'trimestre') points += 10

    return Math.min(points, maxPoints)
  }

  const handleDiagnostic = () => {
    const calculatedScore = calculateScore()
    setScore(calculatedScore)
    setShowResults(true)
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreMessage = (score) => {
    if (score >= 70) return {
      title: 'Excellent dossier !',
      message: 'Votre dossier présente de très bonnes chances de succès aux prud\'hommes.',
      action: 'Constituez votre dossier complet dès maintenant'
    }
    if (score >= 50) return {
      title: 'Dossier solide',
      message: 'Votre situation mérite d\'être défendue, mais nécessite d\'être renforcée.',
      action: 'Complétez votre dossier avec nos conseils'
    }
    return {
      title: 'Dossier à renforcer',
      message: 'Des éléments manquent pour garantir le succès de votre démarche.',
      action: 'Découvrez comment améliorer votre dossier'
    }
  }

  const problemTypes = [
    { value: 'licenciement', label: 'Licenciement', icon: '⚖️' },
    { value: 'heures-sup', label: 'Heures supplémentaires', icon: '⏰' },
    { value: 'harcelement', label: 'Harcèlement', icon: '🚫' },
    { value: 'discrimination', label: 'Discrimination', icon: '⛔' },
    { value: 'salaire', label: 'Problème de salaire', icon: '💰' },
    { value: 'conges', label: 'Congés payés', icon: '🏖️' },
    { value: 'autre', label: 'Autre litige', icon: '📋' }
  ]

  if (showResults) {
    const scoreMessage = getScoreMessage(score)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Header avec navigation */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Retour accueil</span>
                </button>

                <div className="h-6 w-px bg-gray-300 hidden sm:block" />

                <span className="text-xl font-bold text-blue-600 hidden sm:inline">
                  JustiJob
                </span>
                <span className="text-sm text-gray-500 hidden md:inline">
                  by Claude AI
                </span>
              </div>

              <nav className="flex items-center space-x-4">
                <Link href="/calculateurs" className="text-sm text-gray-600 hover:text-blue-600 hidden md:inline">
                  Calculateurs
                </Link>
                <Link href="/urgence" className="text-sm text-gray-600 hover:text-blue-600 hidden md:inline">
                  Guide
                </Link>
                <button
                  onClick={() => {setShowResults(false); setCurrentStep(1); setScore(null)}}
                  className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200"
                >
                  Refaire le test
                </button>
              </nav>
            </div>
          </div>
        </header>

        <div className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header résultats */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Résultats de votre diagnostic
              </h1>
              <p className="text-gray-600">
                Analyse réalisée par l'Agent IA Claude d'Anthropic
              </p>
            </div>

            {/* Score */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gray-100 mb-4">
                  <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
                    {score}
                  </span>
                  <span className="text-gray-600 text-xl ml-1">/100</span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {scoreMessage.title}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {scoreMessage.message}
                </p>
              </div>

              {/* Analyse détaillée */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Analyse de votre dossier :</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Points forts</p>
                      <p className="text-sm text-gray-600">
                        {formData.bulletinsSalaire && "Bulletins de salaire disponibles • "}
                        {formData.contratTravail && "Contrat de travail • "}
                        {parseInt(formData.anciennete) > 2 && `${formData.anciennete} ans d'ancienneté`}
                      </p>
                    </div>
                  </div>

                  {score < 70 && (
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Points à améliorer</p>
                        <p className="text-sm text-gray-600">
                          {!formData.temoignages && "Témoignages manquants • "}
                          {!formData.courriersEchanges && "Échanges écrits à rassembler • "}
                          {!formData.preuvesMedicales && formData.harcelement && "Certificat médical recommandé"}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Estimation des indemnités</p>
                      <p className="text-sm text-gray-600">
                        Entre {score * 100}€ et {score * 500}€ selon les préjudices retenus
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions CORRIGÉES */}
              {score >= 50 ? (
                <div className="mt-8 space-y-4">
                  {/* Option payante */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-2">
                          Constituez votre dossier prud'hommes avec Claude AI
                        </h3>
                        <ul className="space-y-2 text-sm opacity-90 mb-4">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Questionnaire personnalisé selon votre situation
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Liste complète des pièces à fournir
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Dossier complet généré par l'IA Claude
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Arguments juridiques personnalisés
                          </li>
                        </ul>

                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-2xl font-bold">90€</p>
                            <p className="text-xs opacity-75">ou 2x 45€</p>
                          </div>
                          <div className="h-12 w-px bg-white/30"></div>
                          <div>
                            <p className="text-2xl font-bold">45€</p>
                            <p className="text-xs opacity-75">avec code syndicat</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      {/* BOUTON CORRIGÉ - Ouvre le questionnaire modal au lieu de rediriger */}
                      <button
                        onClick={() => setIsQuestionnaireOpen(true)}
                        className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Obtenir mon dossier complet
                      </button>

                      {/* Toggle code promo */}
                      <button
                        onClick={() => setHasPromoCode(!hasPromoCode)}
                        className="w-full text-white/90 text-sm hover:text-white transition-colors"
                      >
                        {hasPromoCode ? 'Masquer' : 'J\'ai'} un code syndicat
                      </button>

                      {hasPromoCode && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            placeholder="CODE-SYNDICAT"
                            className="flex-1 px-4 py-2 rounded-lg text-gray-900 placeholder-gray-400"
                          />
                          <button 
                            onClick={() => setIsQuestionnaireOpen(true)}
                            className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                            Appliquer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Garanties */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">Données sécurisées</p>
                      <p className="text-xs text-gray-600">Conformité RGPD</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">Dossier complet</p>
                      <p className="text-xs text-gray-600">Prêt pour le CPH</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">+5000 dossiers</p>
                      <p className="text-xs text-gray-600">Salariés accompagnés</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-8 p-6 bg-orange-50 border border-orange-200 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Comment améliorer votre dossier ?
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Rassemblez tous vos bulletins de salaire</li>
                    <li>• Collectez les échanges écrits (emails, courriers)</li>
                    <li>• Recherchez des témoins de votre situation</li>
                    <li>• Consultez un médecin si nécessaire</li>
                  </ul>
                  <button
                    onClick={() => {setShowResults(false); setCurrentStep(1)}}
                    className="mt-4 text-orange-600 font-medium hover:text-orange-700"
                  >
                    Refaire le diagnostic
                  </button>
                </div>
              )}

              {/* Ressources gratuites */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-semibold text-gray-900 mb-4">Ressources gratuites</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link href="/urgence" className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Guide prud'hommes</p>
                      <p className="text-sm text-gray-600">Procédure complète</p>
                    </div>
                  </Link>
                  <Link href="/calculateurs" className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Scale className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Calculateurs</p>
                      <p className="text-sm text-gray-600">Estimez vos droits</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questionnaire Modal */}
        <QuestionnaireModal 
          isOpen={isQuestionnaireOpen} 
          onClose={() => setIsQuestionnaireOpen(false)} 
        />
      </div>
    )
  }

  // Le reste du code du formulaire de diagnostic reste identique
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header avec navigation */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Retour accueil</span>
              </Link>

              <div className="h-6 w-px bg-gray-300 hidden sm:block" />

              <span className="text-xl font-bold text-blue-600 hidden sm:inline">
                JustiJob
              </span>
              <span className="text-sm text-gray-500 hidden md:inline">
                by Claude AI
              </span>
            </div>

            <nav className="flex items-center space-x-4">
              <Link href="/calculateurs" className="text-sm text-gray-600 hover:text-blue-600 hidden md:inline">
                Calculateurs
              </Link>
              <Link href="/urgence" className="text-sm text-gray-600 hover:text-blue-600 hidden md:inline">
                Guide urgence
              </Link>
              <Link href="/" className="p-2 rounded-lg hover:bg-gray-100 md:hidden">
                <Home className="w-5 h-5" />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Fil d'Ariane */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Accueil
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-blue-600 font-semibold">Diagnostic gratuit</span>
          </nav>
        </div>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Diagnostic Gratuit
            </h1>
            <p className="text-lg text-gray-600">
              Évaluez vos chances de succès aux prud'hommes en 2 minutes
            </p>
            <div className="mt-4 space-y-2">
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-1" />
                100% Gratuit • Sans engagement
              </div>
              <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium ml-2">
                🤖 Analyse par Claude AI (Anthropic)
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Étape 1: Type de problème */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Quel est votre problème principal ?
                </h2>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {problemTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.typeProbleme === type.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="typeProbleme"
                        value={type.value}
                        checked={formData.typeProbleme === type.value}
                        onChange={(e) => setFormData({...formData, typeProbleme: e.target.value})}
                        className="sr-only"
                      />
                      <span className="text-2xl">{type.icon}</span>
                      <span className="font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dans quel délai souhaitez-vous agir ?
                  </label>
                  <select
                    value={formData.urgence}
                    onChange={(e) => setFormData({...formData, urgence: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="immediate">Immédiatement (urgent)</option>
                    <option value="mois">Dans le mois</option>
                    <option value="trimestre">Dans les 3 mois</option>
                    <option value="plus">Plus tard</option>
                  </select>
                </div>
              </div>
            )}

            {/* Étapes 2, 3, 4 - gardent le code existant */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Votre situation professionnelle
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ancienneté dans l'entreprise (années)
                    </label>
                    <input
                      type="number"
                      value={formData.anciennete}
                      onChange={(e) => setFormData({...formData, anciennete: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salaire mensuel brut (€)
                    </label>
                    <input
                      type="number"
                      value={formData.salaire}
                      onChange={(e) => setFormData({...formData, salaire: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="2500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de contrat
                    </label>
                    <select
                      value={formData.typeContrat}
                      onChange={(e) => setFormData({...formData, typeContrat: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="interim">Intérim</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Convention collective
                    </label>
                    <select
                      value={formData.convention}
                      onChange={(e) => setFormData({...formData, convention: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="syntec">Syntec</option>
                      <option value="metallurgie">Métallurgie</option>
                      <option value="batiment">Bâtiment</option>
                      <option value="commerce">Commerce</option>
                      <option value="restauration">HCR</option>
                      <option value="autre">Autre / Je ne sais pas</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Étapes 3 et 4 - code existant conservé pour économiser l'espace */}
            
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Quels préjudices avez-vous subis ?
                </h2>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={formData.heuresSupNonPayees}
                      onChange={(e) => setFormData({...formData, heuresSupNonPayees: e.target.checked})}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Heures supplémentaires non payées</p>
                      <p className="text-sm text-gray-600">Travail non rémunéré au-delà de 35h</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={formData.congesNonPris}
                      onChange={(e) => setFormData({...formData, congesNonPris: e.target.checked})}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Congés payés non pris ou non payés</p>
                      <p className="text-sm text-gray-600">Jours de congés dus non soldés</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={formData.primeNonVersee}
                      onChange={(e) => setFormData({...formData, primeNonVersee: e.target.checked})}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Prime ou bonus non versé</p>
                      <p className="text-sm text-gray-600">Prime d'ancienneté, 13ème mois, etc.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={formData.licenciementAbusif}
                      onChange={(e) => setFormData({...formData, licenciementAbusif: e.target.checked})}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Licenciement sans cause réelle et sérieuse</p>
                      <p className="text-sm text-gray-600">Licenciement abusif ou injustifié</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={formData.harcelement}
                      onChange={(e) => setFormData({...formData, harcelement: e.target.checked})}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Harcèlement moral ou sexuel</p>
                      <p className="text-sm text-gray-600">Comportements répétés dégradants</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={formData.discrimination}
                      onChange={(e) => setFormData({...formData, discrimination: e.target.checked})}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Discrimination</p>
                      <p className="text-sm text-gray-600">Traitement défavorable illégal</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Étape 4: Preuves */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Quelles preuves possédez-vous ?
                </h2>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={formData.contratTravail}
                      onChange={(e) => setFormData({...formData, contratTravail: e.target.checked})}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Contrat de travail</p>
                      <p className="text-sm text-gray-600">Original ou copie</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={formData.bulletinsSalaire}
                      onChange={(e) => setFormData({...formData, bulletinsSalaire: e.target.checked})}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Bulletins de salaire</p>
                      <p className="text-sm text-gray-600">12 derniers mois minimum</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={formData.courriersEchanges}
                      onChange={(e) => setFormData({...formData, courriersEchanges: e.target.checked})}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Courriers et emails échangés</p>
                      <p className="text-sm text-gray-600">Correspondances avec l'employeur</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={formData.temoignages}
                      onChange={(e) => setFormData({...formData, temoignages: e.target.checked})}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Témoignages de collègues</p>
                      <p className="text-sm text-gray-600">Attestations écrites</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={formData.preuvesMedicales}
                      onChange={(e) => setFormData({...formData, preuvesMedicales: e.target.checked})}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Certificats médicaux</p>
                      <p className="text-sm text-gray-600">En cas de souffrance au travail</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={formData.enregistrements}
                      onChange={(e) => setFormData({...formData, enregistrements: e.target.checked})}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Autres preuves</p>
                      <p className="text-sm text-gray-600">Photos, enregistrements, etc.</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium"
                >
                  ← Retour
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Suivant
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleDiagnostic}
                  className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  Voir mes résultats
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Sécurité */}
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Données sécurisées</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Conformité RGPD</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>+5000 salariés aidés</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton flottant retour mobile */}
      <Link
        href="/"
        className="fixed bottom-6 left-6 bg-white shadow-lg rounded-full p-4 hover:shadow-xl transition-all z-30 md:hidden"
        aria-label="Retour à l'accueil"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </Link>
    </div>
  )
}