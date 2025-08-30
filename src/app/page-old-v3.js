
// src/app/page.js - PROGRAMME COMPLET AVEC QUESTIONNAIRE EXPERT 
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Scale, CheckCircle, FileText, Clock, Users, Shield, 
  ArrowRight, Star, Zap, AlertTriangle, Send, Download,
  Euro, Calculator, Award, TrendingUp, Upload, Mail
} from 'lucide-react'

export default function Home() {
  const [showDiagnostic, setShowDiagnostic] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [score, setScore] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [email, setEmail] = useState('')
  const [syndicatCode, setSyndicatCode] = useState('')

  // État pour le questionnaire diagnostic
  const [diagnosticData, setDiagnosticData] = useState({
    typeContrat: '',
    anciennete: '',
    motifLicenciement: '',
    procedureRespecte: '',
    preuves: '',
    tentativesResolution: '',
    impactFinancier: '',
    impactPsychologique: '',
    temoins: '',
    conseilJuridique: ''
  })

  // Questions du diagnostic gratuit
  const questions = [
    {
      id: 'typeContrat',
      question: 'Quel est votre type de contrat ?',
      options: ['CDI', 'CDD', 'Intérim', 'Apprentissage']
    },
    {
      id: 'anciennete',
      question: 'Quelle est votre ancienneté dans l\'entreprise ?',
      options: ['Moins de 6 mois', '6 mois à 2 ans', '2 à 5 ans', 'Plus de 5 ans']
    },
    {
      id: 'motifLicenciement',
      question: 'Quel est le motif invoqué pour le licenciement ?',
      options: ['Faute grave', 'Insuffisance professionnelle', 'Motif économique', 'Inaptitude', 'Autre']
    },
    {
      id: 'procedureRespecte',
      question: 'La procédure de licenciement a-t-elle été respectée ?',
      options: ['Oui totalement', 'Partiellement', 'Non', 'Je ne sais pas']
    },
    {
      id: 'preuves',
      question: 'Disposez-vous de preuves écrites ?',
      options: ['Oui, nombreuses', 'Quelques-unes', 'Très peu', 'Aucune']
    },
    {
      id: 'tentativesResolution',
      question: 'Avez-vous tenté une résolution amiable ?',
      options: ['Oui, sans succès', 'En cours', 'Non', 'Pas applicable']
    },
    {
      id: 'impactFinancier',
      question: 'Quel est l\'impact financier estimé ?',
      options: ['Moins de 5000€', '5000€ à 15000€', '15000€ à 30000€', 'Plus de 30000€']
    },
    {
      id: 'impactPsychologique',
      question: 'Y a-t-il eu un impact sur votre santé ?',
      options: ['Oui, documenté médicalement', 'Oui, sans documentation', 'Léger', 'Non']
    },
    {
      id: 'temoins',
      question: 'Avez-vous des témoins prêts à témoigner ?',
      options: ['Oui, plusieurs', 'Un ou deux', 'Incertains', 'Non']
    },
    {
      id: 'conseilJuridique',
      question: 'Avez-vous déjà consulté un avocat ?',
      options: ['Oui', 'Non, mais je compte le faire', 'Non', 'J\'hésite']
    }
  ]

  // Calcul du score
  const calculateScore = () => {
    let points = 0
    const responses = diagnosticData

    // Système de scoring sophistiqué
    if (responses.typeContrat === 'CDI') points += 15
    else if (responses.typeContrat === 'CDD') points += 10
    
    if (responses.anciennete === 'Plus de 5 ans') points += 20
    else if (responses.anciennete === '2 à 5 ans') points += 15
    else if (responses.anciennete === '6 mois à 2 ans') points += 10
    
    if (responses.procedureRespecte === 'Non') points += 25
    else if (responses.procedureRespecte === 'Partiellement') points += 15
    
    if (responses.preuves === 'Oui, nombreuses') points += 20
    else if (responses.preuves === 'Quelques-unes') points += 10
    
    if (responses.impactFinancier === 'Plus de 30000€') points += 15
    else if (responses.impactFinancier === '15000€ à 30000€') points += 10
    
    if (responses.impactPsychologique === 'Oui, documenté médicalement') points += 15
    
    if (responses.temoins === 'Oui, plusieurs') points += 10

    return points
  }

  const handleDiagnosticSubmit = () => {
    const calculatedScore = calculateScore()
    setScore(calculatedScore)
    setShowDiagnostic(false)
  }

  const handlePayment = async (amount) => {
    // Simulation du paiement
    // En production : intégration Stripe/PayPal
    setPaymentCompleted(true)
  }

  const downloadQuestionnaire = () => {
    // Téléchargement du PDF
    const link = document.createElement('a')
    link.href = '/questionnaire-justijob.pdf'
    link.download = 'questionnaire-justijob.pdf'
    link.click()
  }

  // Section Hero
  const HeroSection = () => (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
      {/* Effets visuels */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 mr-2 text-yellow-400" />
            <span className="text-sm font-medium">Nouveau : Dossier complet Prud'hommes avec IA</span>
          </div>
          
          {/* Titre principal */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Défendez vos droits
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              avec l'IA juridique
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Évaluez vos chances aux Prud'hommes en 2 minutes.
            Obtenez un dossier complet préparé par notre IA experte.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => setShowDiagnostic(true)}
              className="group bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              <Scale className="w-5 h-5 mr-2" />
              Diagnostic gratuit
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => downloadQuestionnaire()}
              className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Télécharger le questionnaire
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <div className="text-3xl font-bold text-yellow-400">85%</div>
              <div className="text-sm text-blue-200">Taux de succès</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <div className="text-3xl font-bold text-yellow-400">2 min</div>
              <div className="text-sm text-blue-200">Diagnostic rapide</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <div className="text-3xl font-bold text-yellow-400">90€</div>
              <div className="text-sm text-blue-200">Dossier complet</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  // Modal Diagnostic
  const DiagnosticModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Diagnostic gratuit</h2>
            <button
              onClick={() => setShowDiagnostic(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentStep + 1} sur {questions.length}</span>
              <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Question */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6">
              {questions[currentStep].question}
            </h3>
            <div className="space-y-3">
              {questions[currentStep].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDiagnosticData({
                      ...diagnosticData,
                      [questions[currentStep].id]: option
                    })
                    if (currentStep < questions.length - 1) {
                      setCurrentStep(currentStep + 1)
                    } else {
                      handleDiagnosticSubmit()
                    }
                  }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    diagnosticData[questions[currentStep].id] === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              ← Précédent
            </button>
            
            {currentStep === questions.length - 1 && (
              <button
                onClick={handleDiagnosticSubmit}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:shadow-lg"
              >
                Voir les résultats
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // Section Résultats
  const ResultsSection = () => {
    const getScoreInterpretation = () => {
      if (score >= 80) return {
        level: 'Excellent',
        color: 'text-green-600',
        bg: 'bg-green-100',
        message: 'Vos chances de succès sont très élevées. Un dossier solide peut être constitué.',
        recommendation: 'Nous vous recommandons fortement de poursuivre avec notre dossier complet.'
      }
      if (score >= 60) return {
        level: 'Bon',
        color: 'text-blue-600',
        bg: 'bg-blue-100',
        message: 'Vous avez de bonnes chances de succès avec une préparation adéquate.',
        recommendation: 'Un dossier bien préparé augmentera significativement vos chances.'
      }
      if (score >= 40) return {
        level: 'Moyen',
        color: 'text-yellow-600',
        bg: 'bg-yellow-100',
        message: 'Votre dossier nécessite un renforcement sur certains points.',
        recommendation: 'Une analyse approfondie est nécessaire pour identifier les points à améliorer.'
      }
      return {
        level: 'À renforcer',
        color: 'text-orange-600',
        bg: 'bg-orange-100',
        message: 'Votre dossier présente des faiblesses qui nécessitent une attention particulière.',
        recommendation: 'Nous vous conseillons de rassembler plus de preuves avant de poursuivre.'
      }
    }

    const interpretation = getScoreInterpretation()

    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Score Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Résultats de votre diagnostic</h2>
              <div className={`inline-flex items-center ${interpretation.bg} ${interpretation.color} px-6 py-3 rounded-full`}>
                <Award className="w-6 h-6 mr-2" />
                <span className="text-xl font-bold">{interpretation.level}</span>
              </div>
            </div>
            
            {/* Score visuel */}
            <div className="relative mb-8">
              <div className="flex justify-between items-end h-40">
                {[20, 40, 60, 80, 100].map((val, i) => (
                  <div
                    key={i}
                    className={`w-12 rounded-t-lg transition-all duration-1000 ${
                      score >= val ? 'bg-gradient-to-t from-blue-500 to-indigo-500' : 'bg-gray-200'
                    }`}
                    style={{
                      height: `${val}%`,
                      transitionDelay: `${i * 100}ms`
                    }}
                  />
                ))}
              </div>
              <div className="text-center mt-4">
                <span className="text-4xl font-bold">{score}</span>
                <span className="text-xl text-gray-600">/100</span>
              </div>
            </div>
            
            {/* Interprétation */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 mb-4">{interpretation.message}</p>
              <p className="font-semibold text-gray-900">{interpretation.recommendation}</p>
            </div>
            
            {/* Points forts/faibles */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-bold text-green-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Points forts
                </h3>
                <ul className="space-y-2 text-sm text-green-700">
                  {score >= 60 && <li>• Ancienneté significative</li>}
                  {diagnosticData.preuves === 'Oui, nombreuses' && <li>• Preuves documentées</li>}
                  {diagnosticData.procedureRespecte === 'Non' && <li>• Procédure non respectée</li>}
                </ul>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="font-bold text-orange-800 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Points d'attention
                </h3>
                <ul className="space-y-2 text-sm text-orange-700">
                  {score < 60 && <li>• Renforcer les preuves</li>}
                  {!diagnosticData.temoins || diagnosticData.temoins === 'Non' && <li>• Rechercher des témoins</li>}
                  {diagnosticData.conseilJuridique === 'Non' && <li>• Consulter un expert</li>}
                </ul>
              </div>
            </div>
            
            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Passez à l'action avec notre dossier complet
              </h3>
              <p className="mb-6 text-blue-100">
                Obtenez un dossier de 30 pages préparé par notre IA juridique, 
                incluant tous les arguments, jurisprudences et stratégies pour maximiser vos chances.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowPayment(true)}
                  className="bg-white text-blue-600 px-6 py-4 rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  <span className="text-2xl">90€</span>
                  <span className="block text-sm font-normal">Tarif standard</span>
                </button>
                
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                  <input
                    type="text"
                    placeholder="Code syndicat"
                    value={syndicatCode}
                    onChange={(e) => setSyndicatCode(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg text-gray-900 mb-2"
                  />
                  <button
                    onClick={() => {
                      if (syndicatCode) {
                        setShowPayment(true)
                      }
                    }}
                    className="w-full bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-300"
                  >
                    45€ avec code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Section Workflow après paiement
  const WorkflowSection = () => (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
            <CheckCircle className="w-5 h-5 mr-2" />
            Paiement confirmé
          </div>
          <h2 className="text-3xl font-bold mb-4">Finalisons votre dossier</h2>
          <p className="text-gray-600">Suivez ces 3 étapes pour recevoir votre dossier complet</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Étape 1 */}
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">1. Téléchargez le questionnaire</h3>
            <p className="text-gray-600 mb-4">Questionnaire détaillé de 10 pages à remplir</p>
            <button
              onClick={downloadQuestionnaire}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Télécharger PDF
            </button>
          </div>
          
          {/* Étape 2 */}
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">2. Remplissez avec soin</h3>
            <p className="text-gray-600 mb-4">Prenez le temps de fournir tous les détails</p>
            <div className="text-sm text-gray-500">
              ⏱ Temps estimé : 30 minutes
            </div>
          </div>
          
          {/* Étape 3 */}
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">3. Uploadez vos documents</h3>
            <p className="text-gray-600 mb-4">Questionnaire + contrat + fiches de paie</p>
            <Link
              href="/upload"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
              Accéder à l'upload
            </Link>
          </div>
        </div>
        
        {/* Zone d'upload */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center">
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Upload sécurisé</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Vos documents sont cryptés et traités de manière confidentielle. 
            Notre IA analysera votre dossier et générera un rapport complet sous 24h.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input
              type="email"
              placeholder="Votre email pour recevoir le dossier"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-6 py-3 rounded-lg border-2 border-gray-300 w-full sm:w-auto"
            />
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Recevoir le lien d'upload
            </button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Sécurisé SSL
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Traitement 24h
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  // Section Features
  const FeaturesSection = () => (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pourquoi choisir JustiJob ?
          </h2>
          <p className="text-xl text-gray-600">
            La solution complète pour vos litiges professionnels
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Calculator className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Analyse IA précise</h3>
            <p className="text-gray-600">
              Notre IA analyse votre situation avec la jurisprudence récente pour maximiser vos chances
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Euro className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">10x moins cher</h3>
            <p className="text-gray-600">
              90€ au lieu de 1000€+ chez un avocat pour un dossier équivalent
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">85% de succès</h3>
            <p className="text-gray-600">
              Nos dossiers ont un taux de succès exceptionnel aux Prud'hommes
            </p>
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Scale className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold">JustiJob</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/syndicat/login" className="text-gray-600 hover:text-blue-600">
                Espace Syndicat
              </Link>
              <button
                onClick={() => setShowDiagnostic(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Diagnostic gratuit
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Contenu principal */}
      <main>
        <HeroSection />
        
        {/* Affichage conditionnel selon l'état */}
        {score !== null && !paymentCompleted && <ResultsSection />}
        {paymentCompleted && <WorkflowSection />}
        
        <FeaturesSection />
      </main>
      
      {/* Modales */}
      {showDiagnostic && <DiagnosticModal />}
      
      {/* Modal de paiement */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold mb-6">Finaliser votre commande</h3>
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span>Dossier complet Prud'hommes</span>
                <span className="font-bold">{syndicatCode ? '45€' : '90€'}</span>
              </div>
              {syndicatCode && (
                <div className="text-sm text-green-600">
                  Code syndicat appliqué : -50%
                </div>
              )}
            </div>
            <button
              onClick={() => handlePayment(syndicatCode ? 45 : 90)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:shadow-lg"
            >
              Payer maintenant
            </button>
            <button
              onClick={() => setShowPayment(false)}
              className="w-full mt-3 text-gray-600"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Scale className="w-6 h-6" />
                <span className="font-bold">JustiJob</span>
              </div>
              <p className="text-gray-400 text-sm">
                L'IA au service de vos droits
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/diagnostic">Diagnostic</Link></li>
                <li><Link href="/tarifs">Tarifs</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about">À propos</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/presse">Presse</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/mentions">Mentions légales</Link></li>
                <li><Link href="/cgv">CGV</Link></li>
                <li><Link href="/confidentialite">Confidentialité</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2025 JustiJob. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}