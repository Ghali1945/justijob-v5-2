
'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Award, Euro, AlertCircle, Calculator, Download, ArrowRight, CheckCircle, Info, Briefcase, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function PrimeAncienneteCalculator() {
  const [formData, setFormData] = useState({
    salaireBrut: '',
    dateEntree: '',
    convention: 'syntec',
    classification: 'cadre',
    coefficient: '',
    salaireMini: '',
    primesIncluses: false,
    tempsPartiel: '100'
  })

  const [resultats, setResultats] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [compareMode, setCompareMode] = useState(false)

  // Barèmes par convention collective
  const conventions = {
    'syntec': {
      nom: 'Syntec',
      bareme: [
        { annees: 2, taux: 2 },
        { annees: 3, taux: 3 },
        { annees: 4, taux: 4 },
        { annees: 5, taux: 5 },
        { annees: 6, taux: 6 },
        { annees: 7, taux: 7 },
        { annees: 8, taux: 8 },
        { annees: 9, taux: 9 },
        { annees: 10, taux: 10 },
        { annees: 11, taux: 11 },
        { annees: 12, taux: 12 },
        { annees: 13, taux: 13 },
        { annees: 14, taux: 14 },
        { annees: 15, taux: 15 },
        { annees: 20, taux: 20 }
      ],
      base: 'salaire_mini',
      plafond: 20
    },
    'metallurgie': {
      nom: 'Métallurgie',
      bareme: [
        { annees: 3, taux: 3 },
        { annees: 5, taux: 5 },
        { annees: 8, taux: 8 },
        { annees: 10, taux: 10 },
        { annees: 12, taux: 12 },
        { annees: 15, taux: 15 },
        { annees: 18, taux: 17 },
        { annees: 20, taux: 18 }
      ],
      base: 'salaire_reel',
      plafond: 18
    },
    'batiment': {
      nom: 'Bâtiment',
      bareme: [
        { annees: 2, taux: 2 },
        { annees: 4, taux: 4 },
        { annees: 6, taux: 6 },
        { annees: 8, taux: 8 },
        { annees: 10, taux: 10 },
        { annees: 12, taux: 12 },
        { annees: 15, taux: 15 }
      ],
      base: 'salaire_reel',
      plafond: 15
    },
    'commerce': {
      nom: 'Commerce',
      bareme: [
        { annees: 3, taux: 3 },
        { annees: 6, taux: 6 },
        { annees: 9, taux: 9 },
        { annees: 12, taux: 12 },
        { annees: 15, taux: 15 }
      ],
      base: 'salaire_reel',
      plafond: 15
    },
    'restauration': {
      nom: 'HCR (Hôtels, Cafés, Restaurants)',
      bareme: [
        { annees: 1, taux: 1 },
        { annees: 3, taux: 3 },
        { annees: 5, taux: 5 },
        { annees: 10, taux: 10 },
        { annees: 15, taux: 15 }
      ],
      base: 'salaire_reel',
      plafond: 15
    },
    'transport': {
      nom: 'Transport routier',
      bareme: [
        { annees: 2, taux: 2 },
        { annees: 5, taux: 4 },
        { annees: 10, taux: 6 },
        { annees: 15, taux: 8 },
        { annees: 20, taux: 10 }
      ],
      base: 'salaire_reel',
      plafond: 10
    }
  }

  const calculatePrime = () => {
    const salaire = parseFloat(formData.salaireBrut) || 0
    const salaireMini = parseFloat(formData.salaireMini) || salaire
    const tempsPartiel = parseFloat(formData.tempsPartiel) || 100
    
    // Calcul de l'ancienneté
    const dateEntree = formData.dateEntree ? new Date(formData.dateEntree) : new Date()
    const aujourd = new Date()
    const ancienneteMs = aujourd - dateEntree
    const ancienneteAnnees = Math.floor(ancienneteMs / (365.25 * 24 * 60 * 60 * 1000))
    const ancienneteMois = Math.floor((ancienneteMs % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000))
    
    const convention = conventions[formData.convention]
    
    // Déterminer le taux applicable
    let tauxApplicable = 0
    let palierAtteint = null
    
    for (let i = convention.bareme.length - 1; i >= 0; i--) {
      if (ancienneteAnnees >= convention.bareme[i].annees) {
        tauxApplicable = convention.bareme[i].taux
        palierAtteint = convention.bareme[i]
        break
      }
    }
    
    // Prochain palier
    let prochainPalier = null
    let anneesRestantes = 0
    for (let palier of convention.bareme) {
      if (palier.annees > ancienneteAnnees) {
        prochainPalier = palier
        anneesRestantes = palier.annees - ancienneteAnnees
        break
      }
    }
    
    // Base de calcul selon la convention
    const baseCalcul = convention.base === 'salaire_mini' ? salaireMini : salaire
    
    // Calcul de la prime mensuelle
    const primeMensuelle = (baseCalcul * tauxApplicable / 100) * (tempsPartiel / 100)
    const primeAnnuelle = primeMensuelle * 12
    
    // Calcul du manque à gagner si non versée
    const retardPaiement = primeMensuelle * 6 // Simulation 6 mois de retard
    const dommagesInterets = primeMensuelle * 3 // Estimation dommages
    
    // Comparaison avec d'autres conventions
    const comparaisons = []
    if (compareMode) {
      Object.entries(conventions).forEach(([key, conv]) => {
        if (key !== formData.convention) {
          let tauxComp = 0
          for (let i = conv.bareme.length - 1; i >= 0; i--) {
            if (ancienneteAnnees >= conv.bareme[i].annees) {
              tauxComp = conv.bareme[i].taux
              break
            }
          }
          const primeComp = (salaire * tauxComp / 100) * (tempsPartiel / 100)
          comparaisons.push({
            nom: conv.nom,
            taux: tauxComp,
            prime: primeComp.toFixed(2),
            difference: (primeComp - primeMensuelle).toFixed(2)
          })
        }
      })
    }
    
    // Évolution sur 5 ans
    const evolution = []
    for (let i = 0; i <= 5; i++) {
      const anneesFutures = ancienneteAnnees + i
      let tauxFutur = 0
      for (let j = convention.bareme.length - 1; j >= 0; j--) {
        if (anneesFutures >= convention.bareme[j].annees) {
          tauxFutur = convention.bareme[j].taux
          break
        }
      }
      const primeFuture = (baseCalcul * tauxFutur / 100) * (tempsPartiel / 100)
      evolution.push({
        annee: i === 0 ? 'Aujourd\'hui' : `+${i} an${i > 1 ? 's' : ''}`,
        anciennete: anneesFutures,
        taux: tauxFutur,
        prime: primeFuture.toFixed(2)
      })
    }
    
    setResultats({
      // Ancienneté
      ancienneteAnnees,
      ancienneteMois,
      dateEntree: dateEntree.toLocaleDateString('fr-FR'),
      
      // Prime actuelle
      tauxApplicable,
      palierAtteint,
      baseCalcul: baseCalcul.toFixed(2),
      primeMensuelle: primeMensuelle.toFixed(2),
      primeAnnuelle: primeAnnuelle.toFixed(2),
      
      // Progression
      prochainPalier,
      anneesRestantes,
      
      // Préjudice potentiel
      retardPaiement: retardPaiement.toFixed(2),
      dommagesInterets: dommagesInterets.toFixed(2),
      totalPrejudice: (retardPaiement + dommagesInterets).toFixed(2),
      
      // Données complémentaires
      convention: convention.nom,
      plafond: convention.plafond,
      comparaisons,
      evolution
    })
    
    setShowDetails(true)
  }

  // Calcul automatique si date entrée
  useEffect(() => {
    if (formData.dateEntree && formData.salaireBrut) {
      const timer = setTimeout(() => {
        calculatePrime()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [formData.dateEntree, formData.salaireBrut])

  const downloadPDF = () => {
    alert('Génération du PDF en cours... Cette fonctionnalité sera bientôt disponible!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link href="/" className="hover:text-orange-600">Accueil</Link></li>
            <li>/</li>
            <li><Link href="/calculateurs" className="hover:text-orange-600">Calculateurs</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Prime d'ancienneté</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-full mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Calculateur de Prime d'Ancienneté
          </h1>
          <p className="text-lg text-gray-600">
            Vérifiez le montant de votre prime selon votre convention collective
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            100% Gratuit • Barèmes officiels 2024
          </div>
        </div>

        {/* Toggle comparaison */}
        <div className="flex justify-center mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={compareMode}
              onChange={(e) => setCompareMode(e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Comparer avec d'autres conventions
            </span>
          </label>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-orange-600" />
            Informations sur votre emploi
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Date d'entrée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'entrée dans l'entreprise
              </label>
              <input
                type="date"
                value={formData.dateEntree}
                onChange={(e) => setFormData({...formData, dateEntree: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Salaire brut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salaire brut mensuel (€)
              </label>
              <input
                type="number"
                value={formData.salaireBrut}
                onChange={(e) => setFormData({...formData, salaireBrut: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="2500"
              />
            </div>

            {/* Convention collective */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Convention collective
              </label>
              <select
                value={formData.convention}
                onChange={(e) => setFormData({...formData, convention: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {Object.entries(conventions).map(([key, conv]) => (
                  <option key={key} value={key}>{conv.nom}</option>
                ))}
              </select>
            </div>

            {/* Classification */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classification
              </label>
              <select
                value={formData.classification}
                onChange={(e) => setFormData({...formData, classification: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="cadre">Cadre</option>
                <option value="technicien">Technicien / Agent de maîtrise</option>
                <option value="employe">Employé</option>
                <option value="ouvrier">Ouvrier</option>
              </select>
            </div>

            {/* Salaire minimum conventionnel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salaire minimum conventionnel (€)
                <span className="text-xs text-gray-500 ml-1">(si applicable)</span>
              </label>
              <input
                type="number"
                value={formData.salaireMini}
                onChange={(e) => setFormData({...formData, salaireMini: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="2200"
              />
            </div>

            {/* Temps de travail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temps de travail (%)
              </label>
              <select
                value={formData.tempsPartiel}
                onChange={(e) => setFormData({...formData, tempsPartiel: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="100">Temps plein (100%)</option>
                <option value="80">80%</option>
                <option value="60">60%</option>
                <option value="50">Mi-temps (50%)</option>
              </select>
            </div>
          </div>

          {/* Barème de la convention sélectionnée */}
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              Barème {conventions[formData.convention].nom}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {conventions[formData.convention].bareme.slice(0, 8).map((palier, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-600">{palier.annees} ans:</span>
                  <span className="font-medium">{palier.taux}%</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={calculatePrime}
            className="w-full mt-8 bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calculer ma prime d'ancienneté
          </button>
        </div>

        {/* Résultats */}
        {resultats && showDetails && (
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Votre prime d'ancienneté détaillée
            </h2>

            {/* Résultat principal */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 mb-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-90 mb-2">Prime mensuelle due</p>
                  <p className="text-4xl font-bold mb-1">
                    {resultats.primeMensuelle} €
                  </p>
                  <p className="text-sm opacity-90">
                    Soit {resultats.primeAnnuelle} € par an
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{resultats.tauxApplicable}%</p>
                  <p className="text-sm opacity-90">Taux actuel</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {resultats.ancienneteAnnees} ans et {resultats.ancienneteMois} mois d'ancienneté
                </p>
              </div>
            </div>

            {/* Progression */}
            {resultats.prochainPalier && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800">
                  <Info className="inline w-4 h-4 mr-1" />
                  <strong>Prochain palier :</strong> {resultats.prochainPalier.taux}% dans {resultats.anneesRestantes} an{resultats.anneesRestantes > 1 ? 's' : ''}
                  {' '}(+{((resultats.baseCalcul * (resultats.prochainPalier.taux - resultats.tauxApplicable) / 100)).toFixed(2)}€/mois)
                </p>
              </div>
            )}

            {/* Évolution sur 5 ans */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Évolution de votre prime</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  {resultats.evolution.map((evo, i) => (
                    <div key={i} className={`text-center ${i === 0 ? 'font-semibold' : ''}`}>
                      <p className="text-gray-600">{evo.annee}</p>
                      <p className="text-lg font-bold text-gray-900">{evo.taux}%</p>
                      <p className="text-gray-700">{evo.prime}€</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comparaisons si activées */}
            {compareMode && resultats.comparaisons.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Comparaison avec d'autres conventions</h3>
                <div className="space-y-2">
                  {resultats.comparaisons.map((comp, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{comp.nom}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{comp.taux}%</span>
                        <span className="font-semibold">{comp.prime}€</span>
                        <span className={`text-sm ${parseFloat(comp.difference) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {parseFloat(comp.difference) > 0 ? '+' : ''}{comp.difference}€
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Si prime non versée */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Si votre prime n'est pas versée
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Arriérés (6 mois estimés)</span>
                  <span className="font-semibold text-red-600">{resultats.retardPaiement} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Dommages et intérêts potentiels</span>
                  <span className="font-semibold text-red-600">{resultats.dommagesInterets} €</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-red-200">
                  <span className="font-medium text-gray-900">Préjudice total estimé</span>
                  <span className="font-bold text-red-600 text-lg">{resultats.totalPrejudice} €</span>
                </div>
              </div>
            </div>

            {/* Détails du calcul */}
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Date d'entrée</span>
                <span className="font-semibold">{resultats.dateEntree}</span>
              </div>
              
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Base de calcul</span>
                <span className="font-semibold">{resultats.baseCalcul} €</span>
              </div>
              
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Convention applicable</span>
                <span className="font-semibold">{resultats.convention}</span>
              </div>
              
              <div className="flex justify-between py-3">
                <span className="text-gray-600">Plafond convention</span>
                <span className="font-semibold">{resultats.plafond}%</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <button 
                onClick={downloadPDF}
                className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Télécharger le détail
              </button>
              <Link 
                href="/diagnostic"
                className="bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
              >
                Faire le diagnostic gratuit
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* CTA si prime non versée */}
            {parseFloat(resultats.primeMensuelle) > 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-900 mb-2">
                      Votre prime n'est pas versée ?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      C'est une violation de votre convention collective. Notre diagnostic gratuit par l'IA Claude 
                      peut analyser vos bulletins de salaire et évaluer vos chances de succès aux prud'hommes.
                    </p>
                    <Link 
                      href="/diagnostic"
                      className="inline-flex items-center gap-2 text-red-600 font-medium hover:text-red-700"
                    >
                      Faire le diagnostic gratuit
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Avertissement */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <AlertCircle className="inline w-4 h-4 mr-1" />
                Ce calcul est basé sur les barèmes standards. Certaines entreprises peuvent avoir des accords 
                spécifiques. Vérifiez votre contrat et vos bulletins de salaire. Pour une analyse complète, 
                utilisez notre diagnostic gratuit.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}