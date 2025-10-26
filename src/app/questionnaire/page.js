'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Home, CheckCircle, Upload, Save, Send, AlertTriangle, FileText, User, Briefcase, Scale, Shield, Clock, ChevronRight } from 'lucide-react'

export default function QuestionnairePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  
  const [currentSection, setCurrentSection] = useState(1)
  const [isValid, setIsValid] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // 🔥 NOUVEAU : Vérification du paiement Stripe
  const [loading, setLoading] = useState(true)
  const [paymentVerified, setPaymentVerified] = useState(false)
  const [customerInfo, setCustomerInfo] = useState(null)
  const [syndicatInfo, setSyndicatInfo] = useState(null)
  const [error, setError] = useState(null)

  // 🔥 NOUVEAU : Vérifier le paiement au chargement
  useEffect(() => {
    if (!sessionId) {
      setError('Accès non autorisé. Veuillez effectuer un paiement.')
      setLoading(false)
      setTimeout(() => router.push('/paiement'), 3000)
      return
    }

    verifyPayment()
  }, [sessionId])

  const verifyPayment = async () => {
    try {
      const response = await fetch(`/api/payment/verify-payment?session_id=${sessionId}`)
      const data = await response.json()

      if (data.verified) {
        setPaymentVerified(true)
        setCustomerInfo({
          email: data.customerEmail,
          name: data.customerName,
          amount: data.amount,
          paymentDate: data.paymentDate
        })
        
        if (data.syndicatInfo) {
          setSyndicatInfo(data.syndicatInfo)
        }
      } else {
        setError('Paiement non vérifié. Veuillez contacter le support.')
        setTimeout(() => router.push('/paiement'), 3000)
      }
    } catch (err) {
      console.error('Erreur vérification:', err)
      setError('Erreur de vérification. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const [formData, setFormData] = useState({
    // Section 1: Informations personnelles
    nom: '',
    prenom: '',
    dateNaissance: '',
    adresse: '',
    codePostal: '',
    ville: '',
    telephone: '',
    email: '',
    
    // Section 2: Informations professionnelles
    employeur: '',
    adresseEmployeur: '',
    dateEmbauche: '',
    dateFin: '',
    poste: '',
    salaireBrut: '',
    convention: '',
    typeContrat: '',
    
    // Section 3: Nature du litige
    typeLitige: [],
    description: '',
    montantPrejudice: '',
    
    // Section 4: Preuves et documents
    documents: [],
    temoins: [],
    
    // Section 5: Procédures déjà engagées
    proceduresEngagees: '',
    mediationTentee: false,
    inspectionTravail: false,
    
    // Section 6: Attentes et objectifs
    objectifs: [],
    disponibilite: '',
    avocat: false
  })

  const sections = [
    { id: 1, title: 'Informations personnelles', icon: User },
    { id: 2, title: 'Situation professionnelle', icon: Briefcase },
    { id: 3, title: 'Nature du litige', icon: AlertTriangle },
    { id: 4, title: 'Preuves et témoins', icon: FileText },
    { id: 5, title: 'Procédures en cours', icon: Scale },
    { id: 6, title: 'Vos attentes', icon: CheckCircle }
  ]

  const handleSubmit = async () => {
    setShowSuccess(true)
    // Appel API pour générer le dossier avec Claude
    try {
      const response = await fetch('/api/generate-dossier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sessionId,
          customerInfo,
          syndicatInfo
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        // Rediriger vers la page de téléchargement
        router.push(`/telecharger-dossier?id=${result.dossierId}`)
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleSave = () => {
    // Sauvegarder en localStorage avec session_id
    localStorage.setItem(`questionnaire-draft-${sessionId}`, JSON.stringify(formData))
    alert('Questionnaire sauvegardé ! Vous pouvez reprendre plus tard.')
  }

  // 🔥 NOUVEAU : Écran de chargement pendant vérification
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Vérification de votre paiement...</p>
        </div>
      </div>
    )
  }

  // 🔥 NOUVEAU : Écran d'erreur si paiement non vérifié
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">Redirection automatique...</p>
        </div>
      </div>
    )
  }

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
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
              >
                <Save className="w-4 h-4" />
                <span className="hidden md:inline">Sauvegarder</span>
              </button>
              
              {/* 🔥 NOUVEAU : Badge Premium avec montant payé */}
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full text-sm font-bold shadow-md">
                  ⭐ PREMIUM
                </div>
                {/* 🔥 NOUVEAU : Badge syndicat si applicable */}
                {syndicatInfo && (
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    🏢 {syndicatInfo.syndicatName}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* 🔥 NOUVEAU : Info paiement sous le header */}
          {customerInfo && (
            <div className="pb-3 border-t pt-2">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Client : {customerInfo.name}</span>
                <span>Paiement vérifié : {customerInfo.amount}€</span>
                {syndicatInfo && (
                  <span className="text-green-600 font-medium">
                    Tarif syndical appliqué (-50%)
                  </span>
                )}
              </div>
            </div>
          )}
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
            <Link href="/diagnostic" className="hover:text-blue-600 transition-colors">
              Diagnostic
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/paiement" className="hover:text-blue-600 transition-colors">
              Paiement
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-blue-600 font-semibold">Questionnaire expert</span>
          </nav>
        </div>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Questionnaire Expert Prud'hommes
            </h1>
            <p className="text-lg text-gray-600">
              Remplissez ce questionnaire pour générer votre dossier complet avec l'Agent IA Claude d'Anthropic
            </p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              🤖 Analyse et génération par Claude AI
            </div>
            
            {/* 🔥 NOUVEAU : Info syndicat si applicable */}
            {syndicatInfo && (
              <div className="mt-3 inline-block bg-green-50 border border-green-200 rounded-lg px-6 py-3">
                <p className="text-sm text-green-800">
                  ✅ Commande enregistrée pour le syndicat <strong>{syndicatInfo.syndicatName}</strong>
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Code promo : {syndicatInfo.promoCode} • Réduction : {syndicatInfo.discount}%
                </p>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <div
                    key={section.id}
                    className={`flex flex-col items-center cursor-pointer ${
                      section.id === currentSection ? 'text-blue-600' : 
                      section.id < currentSection ? 'text-green-600' : 'text-gray-400'
                    }`}
                    onClick={() => setCurrentSection(section.id)}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      section.id === currentSection ? 'bg-blue-600 text-white' : 
                      section.id < currentSection ? 'bg-green-600 text-white' : 'bg-gray-200'
                    }`}>
                      {section.id < currentSection ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className="text-xs text-center hidden md:block">{section.title}</span>
                  </div>
                )
              })}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentSection / 6) * 100}%` }}
              />
            </div>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Section 1: Informations personnelles */}
            {currentSection === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Informations personnelles
                </h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nom}
                        onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Votre nom"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.prenom}
                        onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Votre prénom"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de naissance *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dateNaissance}
                      onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse complète *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.adresse}
                      onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Numéro et rue"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.codePostal}
                        onChange={(e) => setFormData({...formData, codePostal: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="75001"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ville *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.ville}
                        onChange={(e) => setFormData({...formData, ville: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Paris"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.telephone}
                        onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="votre@email.fr"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      💡 Conseil de Claude AI
                    </h3>
                    <p className="text-sm text-gray-700">
                      Vos coordonnées doivent correspondre exactement à celles de vos documents officiels (carte d'identité, contrat de travail). 
                      Claude analysera tous les détails pour assurer la cohérence de votre dossier.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Situation professionnelle */}
            {currentSection === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Situation professionnelle
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'employeur *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.employeur}
                      onChange={(e) => setFormData({...formData, employeur: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nom de l'entreprise"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse de l'employeur *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.adresseEmployeur}
                      onChange={(e) => setFormData({...formData, adresseEmployeur: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Adresse complète de l'entreprise"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date d'embauche *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.dateEmbauche}
                        onChange={(e) => setFormData({...formData, dateEmbauche: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de fin (si applicable)
                      </label>
                      <input
                        type="date"
                        value={formData.dateFin}
                        onChange={(e) => setFormData({...formData, dateFin: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poste occupé *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.poste}
                      onChange={(e) => setFormData({...formData, poste: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Intitulé exact du poste"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salaire brut mensuel *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.salaireBrut}
                        onChange={(e) => setFormData({...formData, salaireBrut: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="2500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de contrat *
                      </label>
                      <select
                        required
                        value={formData.typeContrat}
                        onChange={(e) => setFormData({...formData, typeContrat: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionnez...</option>
                        <option value="CDI">CDI</option>
                        <option value="CDD">CDD</option>
                        <option value="Intérim">Intérim</option>
                        <option value="Alternance">Alternance</option>
                        <option value="Stage">Stage</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Convention collective applicable
                    </label>
                    <input
                      type="text"
                      value={formData.convention}
                      onChange={(e) => setFormData({...formData, convention: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Convention collective de la métallurgie"
                    />
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      💡 Conseil de Claude AI
                    </h3>
                    <p className="text-sm text-gray-700">
                      L'exactitude de vos dates et montants est cruciale. Claude utilisera ces informations 
                      pour calculer précisément vos indemnités et vérifier le respect de vos droits.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Nature du litige */}
            {currentSection === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Nature du litige
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Type de litige * (plusieurs choix possibles)
                    </label>
                    <div className="space-y-3">
                      {[
                        'Licenciement abusif',
                        'Harcèlement moral',
                        'Harcèlement sexuel',
                        'Discrimination',
                        'Heures supplémentaires non payées',
                        'Salaires impayés',
                        'Accident du travail',
                        'Modification du contrat',
                        'Non-respect des repos',
                        'Autre'
                      ].map((type) => (
                        <label key={type} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                          <input
                            type="checkbox"
                            checked={formData.typeLitige.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({...formData, typeLitige: [...formData.typeLitige, type]})
                              } else {
                                setFormData({...formData, typeLitige: formData.typeLitige.filter(t => t !== type)})
                              }
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm font-medium">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description détaillée de la situation * (minimum 100 caractères)
                    </label>
                    <textarea
                      required
                      minLength={100}
                      rows={8}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Décrivez précisément les faits, avec dates, lieux, personnes présentes, témoins éventuels..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.description.length} / 100 caractères minimum
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Montant estimé du préjudice (€)
                    </label>
                    <input
                      type="number"
                      value={formData.montantPrejudice}
                      onChange={(e) => setFormData({...formData, montantPrejudice: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Estimation si vous en avez une"
                    />
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      💡 Conseil de Claude AI
                    </h3>
                    <p className="text-sm text-gray-700">
                      Plus votre description est précise et factuelle, plus Claude pourra construire 
                      un dossier solide avec des arguments juridiques pertinents et adaptés.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Preuves et témoins */}
            {currentSection === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Preuves et témoins
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Documents à votre disposition
                    </label>
                    <div className="space-y-3">
                      {[
                        'Contrat de travail',
                        'Bulletins de salaire',
                        'Emails',
                        'SMS',
                        'Courriers recommandés',
                        'Attestations médicales',
                        'Certificats de travail',
                        'Planning de travail',
                        'Notes de service',
                        'Témoignages écrits'
                      ].map((doc) => (
                        <label key={doc} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                          <input
                            type="checkbox"
                            checked={formData.documents.includes(doc)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({...formData, documents: [...formData.documents, doc]})
                              } else {
                                setFormData({...formData, documents: formData.documents.filter(d => d !== doc)})
                              }
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm font-medium">{doc}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Témoins potentiels
                    </label>
                    <textarea
                      rows={4}
                      value={formData.temoins.join('\n')}
                      onChange={(e) => setFormData({...formData, temoins: e.target.value.split('\n').filter(t => t.trim())})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nom et fonction de chaque témoin (un par ligne)&#10;Ex: Jean Dupont - Collègue de travail&#10;Marie Martin - Responsable RH"
                    />
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <h3 className="font-semibold text-amber-900 mb-2">
                      📎 Upload de documents
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Vous pourrez uploader vos documents après la génération du dossier. 
                      Pour l'instant, indiquez simplement ceux que vous possédez.
                    </p>
                    <p className="text-xs text-gray-600">
                      Claude analysera ensuite vos documents et les intégrera dans votre dossier final.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 5: Procédures en cours */}
            {currentSection === 5 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Procédures déjà engagées
                </h2>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={formData.mediationTentee}
                        onChange={(e) => setFormData({...formData, mediationTentee: e.target.checked})}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div>
                        <p className="font-medium">Médiation ou conciliation tentée</p>
                        <p className="text-sm text-gray-600">Avez-vous essayé de résoudre le conflit à l'amiable ?</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={formData.inspectionTravail}
                        onChange={(e) => setFormData({...formData, inspectionTravail: e.target.checked})}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div>
                        <p className="font-medium">Saisine de l'inspection du travail</p>
                        <p className="text-sm text-gray-600">Avez-vous contacté l'inspection du travail ?</p>
                      </div>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Détails des procédures engagées
                    </label>
                    <textarea
                      value={formData.proceduresEngagees}
                      onChange={(e) => setFormData({...formData, proceduresEngagees: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="Décrivez les démarches entreprises, dates, résultats..."
                    />
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      💡 Conseil de Claude AI
                    </h3>
                    <p className="text-sm text-gray-700">
                      Mentionnez toutes les tentatives de résolution amiable. 
                      Les juges apprécient les efforts de conciliation préalables.
                      Claude analysera ces éléments pour renforcer votre dossier.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 6: Attentes et objectifs */}
            {currentSection === 6 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Vos attentes et objectifs
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Que souhaitez-vous obtenir ? (plusieurs choix possibles)
                    </label>
                    <div className="space-y-3">
                      {[
                        'Indemnités de licenciement',
                        'Dommages et intérêts',
                        'Rappel de salaire',
                        'Réintégration dans l\'entreprise',
                        'Certificat de travail rectifié',
                        'Attestation Pôle Emploi',
                        'Reconnaissance du préjudice',
                        'Excuses de l\'employeur'
                      ].map((objectif) => (
                        <label key={objectif} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                          <input
                            type="checkbox"
                            checked={formData.objectifs.includes(objectif)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({...formData, objectifs: [...formData.objectifs, objectif]})
                              } else {
                                setFormData({...formData, objectifs: formData.objectifs.filter(o => o !== objectif)})
                              }
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm font-medium">{objectif}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Disponibilité pour les audiences
                    </label>
                    <select
                      value={formData.disponibilite}
                      onChange={(e) => setFormData({...formData, disponibilite: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="flexible">Flexible - Je peux m'adapter</option>
                      <option value="semaine">En semaine uniquement</option>
                      <option value="limite">Disponibilité limitée</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={formData.avocat}
                        onChange={(e) => setFormData({...formData, avocat: e.target.checked})}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div>
                        <p className="font-medium">Je souhaite être assisté par un avocat</p>
                        <p className="text-sm text-gray-600">Nous pouvons vous mettre en relation avec nos partenaires</p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="font-semibold text-green-900 mb-2">
                      ✅ Dernière étape !
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                      En validant, l'Agent IA Claude d'Anthropic va analyser vos réponses et générer :
                    </p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Votre requête CPH personnalisée</li>
                      <li>• Le calcul détaillé de vos indemnités</li>
                      <li>• Les arguments juridiques adaptés avec jurisprudence</li>
                      <li>• La liste complète des pièces à fournir</li>
                      <li>• Un guide de procédure étape par étape</li>
                      <li>• L'estimation de vos chances de succès</li>
                    </ul>
                    
                    {/* 🔥 NOUVEAU : Info syndicat dans le dossier */}
                    {syndicatInfo && (
                      <div className="mt-4 pt-4 border-t border-green-300">
                        <p className="text-sm font-medium text-green-900">
                          📊 Statistiques {syndicatInfo.syndicatName} incluses dans le dossier
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              {currentSection > 1 && (
                <button
                  onClick={() => setCurrentSection(currentSection - 1)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium"
                >
                  ← Précédent
                </button>
              )}
              
              {currentSection < 6 ? (
                <button
                  onClick={() => setCurrentSection(currentSection + 1)}
                  className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Suivant
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  Générer mon dossier avec Claude AI
                  <Send className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Sécurité et confiance */}
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Données chiffrées</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Sauvegarde automatique</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Conforme RGPD</span>
            </div>
          </div>

          {/* Info Claude AI */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              🤖 Analyse et génération du dossier par l'Agent IA Claude d'Anthropic
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Technologie de pointe en intelligence artificielle juridique
            </p>
            {/* 🔥 NOUVEAU : Info session */}
            <p className="text-xs text-gray-400 mt-2">
              Session : {sessionId?.substring(0, 20)}... • Paiement vérifié ✅
            </p>
          </div>
        </div>
      </div>

      {/* Bouton flottant mobile */}
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
