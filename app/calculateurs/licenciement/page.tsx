
'use client'

import { useState } from 'react'
import { Calculator, AlertCircle, FileText, Euro, TrendingUp, ArrowRight, Download } from 'lucide-react'
import Link from 'next/link'

export default function LicenciementCalculator() {
  const [formData, setFormData] = useState({
    salaireBrut: '',
    anciennete: '',
    typeContrat: 'CDI',
    motif: 'economique',
    convention: 'syntec',
    salaires12Mois: '',
    primes: ''
  })

  const [resultats, setResultats] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  // Conventions collectives populaires avec leurs formules
  const conventions = {
    'syntec': { nom: 'Syntec', coef: 0.25, bonusAnciennete: true },
    'metallurgie': { nom: 'Métallurgie', coef: 0.25, bonusAnciennete: true },
    'batiment': { nom: 'Bâtiment', coef: 0.23, bonusAnciennete: false },
    'commerce': { nom: 'Commerce', coef: 0.20, bonusAnciennete: false },
    'restauration': { nom: 'HCR', coef: 0.20, bonusAnciennete: false },
    'autre': { nom: 'Code du travail', coef: 0.20, bonusAnciennete: false }
  }

  const calculateIndemnite = () => {
    const salaire = parseFloat(formData.salaireBrut) || 0
    const anciennete = parseFloat(formData.anciennete) || 0
    const salaires12 = parseFloat(formData.salaires12Mois) || salaire * 12
    const primes = parseFloat(formData.primes) || 0
    
    // Calcul du salaire de référence (le plus avantageux)
    const salaireRef1 = salaire // Dernier mois
    const salaireRef2 = (salaires12 + primes) / 12 // Moyenne 12 mois
    const salaireRef3 = (salaires12 + primes) / 36 // Moyenne 3 ans si applicable
    
    const salaireReference = Math.max(salaireRef1, salaireRef2)

    // Calcul légal (Code du travail)
    let indemniteL = 0
    if (anciennete <= 10) {
      indemniteL = (salaireReference / 4) * anciennete
    } else {
      indemniteL = (salaireReference / 4) * 10 + (salaireReference / 3) * (anciennete - 10)
    }

    // Calcul conventionnel
    const conv = conventions[formData.convention]
    let indemniteC = salaireReference * conv.coef * anciennete
    
    // Bonus ancienneté pour certaines conventions
    if (conv.bonusAnciennete && anciennete > 15) {
      indemniteC *= 1.15
    }

    // Majoration licenciement sans cause réelle
    let majorationAbusif = 0
    if (formData.motif === 'abusif') {
      majorationAbusif = Math.max(salaireReference * 6, indemniteL * 2)
    }

    // Calcul final
    const indemniteFinale = Math.max(indemniteL, indemniteC)
    const totalAvecMajoration = indemniteFinale + majorationAbusif

    // Charges et net
    const csg = indemniteFinale * 0.097
    const netApresCharges = indemniteFinale - csg

    setResultats({
      salaireReference: salaireReference.toFixed(2),
      indemniteL: indemniteL.toFixed(2),
      indemniteC: indemniteC.toFixed(2),
      indemniteFinale: indemniteFinale.toFixed(2),
      majorationAbusif: majorationAbusif.toFixed(2),
      totalAvecMajoration: totalAvecMajoration.toFixed(2),
      csg: csg.toFixed(2),
      netApresCharges: netApresCharges.toFixed(2),
      convention: conv.nom
    })
    
    setShowDetails(true)
  }

  const downloadPDF = () => {
    // Simulation du téléchargement PDF
    alert('PDF en cours de génération... Cette fonctionnalité sera bientôt disponible!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link href="/" className="hover:text-blue-600">Accueil</Link></li>
            <li>/</li>
            <li><Link href="/calculateurs" className="hover:text-blue-600">Calculateurs</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Indemnité de licenciement</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Calculateur d'Indemnité de Licenciement
          </h1>
          <p className="text-lg text-gray-600">
            Calculez précisément vos indemnités selon le Code du travail et votre convention
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            100% Gratuit
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Salaire brut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salaire brut mensuel (€)
              </label>
              <input
                type="number"
                value={formData.salaireBrut}
                onChange={(e) => setFormData({...formData, salaireBrut: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2500"
              />
            </div>

            {/* Ancienneté */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ancienneté (années)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.anciennete}
                onChange={(e) => setFormData({...formData, anciennete: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(conventions).map(([key, conv]) => (
                  <option key={key} value={key}>{conv.nom}</option>
                ))}
              </select>
            </div>

            {/* Motif */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motif du licenciement
              </label>
              <select
                value={formData.motif}
                onChange={(e) => setFormData({...formData, motif: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="economique">Économique</option>
                <option value="personnel">Personnel</option>
                <option value="abusif">Sans cause réelle (abusif)</option>
              </select>
            </div>

            {/* Salaires 12 derniers mois */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total salaires 12 derniers mois (€)
                <span className="text-xs text-gray-500 ml-1">(optionnel)</span>
              </label>
              <input
                type="number"
                value={formData.salaires12Mois}
                onChange={(e) => setFormData({...formData, salaires12Mois: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="30000"
              />
            </div>

            {/* Primes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primes annuelles (€)
                <span className="text-xs text-gray-500 ml-1">(optionnel)</span>
              </label>
              <input
                type="number"
                value={formData.primes}
                onChange={(e) => setFormData({...formData, primes: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2000"
              />
            </div>
          </div>

          <button
            onClick={calculateIndemnite}
            className="w-full mt-8 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calculer mes indemnités
          </button>
        </div>

        {/* Résultats */}
        {resultats && showDetails && (
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Vos indemnités détaillées
            </h2>

            {/* Résultat principal */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 mb-6 text-white">
              <p className="text-sm opacity-90 mb-2">Indemnité totale estimée</p>
              <p className="text-4xl font-bold mb-1">
                {resultats.totalAvecMajoration} €
              </p>
              <p className="text-sm opacity-90">
                Net après charges : {resultats.netApresCharges} €
              </p>
            </div>

            {/* Détails */}
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Salaire de référence</span>
                <span className="font-semibold">{resultats.salaireReference} €</span>
              </div>
              
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Indemnité légale (Code du travail)</span>
                <span className="font-semibold">{resultats.indemniteL} €</span>
              </div>
              
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Indemnité conventionnelle ({resultats.convention})</span>
                <span className="font-semibold">{resultats.indemniteC} €</span>
              </div>
              
              <div className="flex justify-between py-3 border-b bg-green-50 px-3 rounded">
                <span className="text-gray-700 font-medium">Indemnité retenue (la plus favorable)</span>
                <span className="font-bold text-green-600">{resultats.indemniteFinale} €</span>
              </div>

              {parseFloat(resultats.majorationAbusif) > 0 && (
                <div className="flex justify-between py-3 border-b bg-orange-50 px-3 rounded">
                  <span className="text-gray-700 font-medium">
                    <AlertCircle className="inline w-4 h-4 mr-1" />
                    Dommages et intérêts (licenciement abusif)
                  </span>
                  <span className="font-bold text-orange-600">+{resultats.majorationAbusif} €</span>
                </div>
              )}
              
              <div className="flex justify-between py-3">
                <span className="text-gray-600">CSG/CRDS déductibles</span>
                <span className="text-red-600">-{resultats.csg} €</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <button 
                onClick={downloadPDF}
                className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Télécharger le détail PDF
              </button>
              <Link 
                href="/diagnostic"
                className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Faire le diagnostic gratuit
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* CTA Diagnostic Gratuit */}
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-900 mb-2">
                    Vérifiez vos droits gratuitement
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Notre diagnostic IA analyse votre situation et calcule un score de succès 
                    aux prud'hommes. Si votre dossier est solide, nous vous accompagnons 
                    pour constituer le dossier complet.
                  </p>
                  <Link 
                    href="/diagnostic"
                    className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700"
                  >
                    Lancer le diagnostic gratuit
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Avertissement */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <AlertCircle className="inline w-4 h-4 mr-1" />
                Ce calcul est une estimation basée sur les informations fournies. Utilisez notre 
                diagnostic gratuit pour une analyse approfondie de votre situation et connaître 
                vos chances de succès aux prud'hommes.
              </p>
            </div>
          </div>
        )}

        {/* Autres calculateurs */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Autres calculateurs gratuits</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/calculateurs/heures-sup" className="p-4 bg-white rounded-lg border hover:border-blue-500 transition-colors">
              <Calculator className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium">Heures supplémentaires</p>
            </Link>
            <Link href="/calculateurs/conges-payes" className="p-4 bg-white rounded-lg border hover:border-blue-500 transition-colors">
              <Calculator className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium">Congés payés</p>
            </Link>
            <Link href="/calculateurs/prime-anciennete" className="p-4 bg-white rounded-lg border hover:border-blue-500 transition-colors">
              <Calculator className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium">Prime d'ancienneté</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}