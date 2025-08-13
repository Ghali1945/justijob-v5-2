
'use client'

import { useState } from 'react'
import { Calendar, Sun, Euro, AlertCircle, Calculator, Download, ArrowRight, CheckCircle, Info } from 'lucide-react'
import Link from 'next/link'

export default function CongesPayesCalculator() {
  const [formData, setFormData] = useState({
    salaireBrut: '',
    dateDebut: '',
    dateFin: '',
    joursAcquis: '25',
    joursPris: '0',
    methodeCalcul: 'maintien', // 'maintien' ou 'dixieme'
    primes: '',
    heuresSup: '',
    typeContrat: 'CDI',
    tempsPartiel: '100',
    convention: 'general'
  })

  const [resultats, setResultats] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [activeTab, setActiveTab] = useState('calcul') // 'calcul' ou 'droits'

  // Méthodes de calcul selon les conventions
  const conventions = {
    'general': { nom: 'Code du travail', base: 2.5, acquisition: 'mensuelle' },
    'syntec': { nom: 'Syntec', base: 2.5, acquisition: 'mensuelle', bonus: true },
    'batiment': { nom: 'Bâtiment', base: 2.5, acquisition: 'mensuelle', caisse: true },
    'metallurgie': { nom: 'Métallurgie', base: 2.5, acquisition: 'mensuelle' },
    'commerce': { nom: 'Commerce', base: 2.5, acquisition: 'mensuelle' },
    'restauration': { nom: 'HCR', base: 2.5, acquisition: 'mensuelle', specifique: true }
  }

  const calculateConges = () => {
    const salaire = parseFloat(formData.salaireBrut) || 0
    const joursAcquis = parseFloat(formData.joursAcquis) || 0
    const joursPris = parseFloat(formData.joursPris) || 0
    const primes = parseFloat(formData.primes) || 0
    const heuresSup = parseFloat(formData.heuresSup) || 0
    const tempsPartiel = parseFloat(formData.tempsPartiel) || 100
    
    // Calcul de la période de référence
    const dateDebut = formData.dateDebut ? new Date(formData.dateDebut) : new Date(new Date().getFullYear() - 1, 5, 1) // 1er juin année précédente
    const dateFin = formData.dateFin ? new Date(formData.dateFin) : new Date(new Date().getFullYear(), 4, 31) // 31 mai année courante
    const moisTravailles = Math.round((dateFin - dateDebut) / (1000 * 60 * 60 * 24 * 30))
    
    // Calcul du salaire de référence (incluant primes et heures sup)
    const salaireMensuelTotal = salaire + (primes / 12) + heuresSup
    const salaireAnnuelBrut = salaireMensuelTotal * 12
    
    // Méthode du maintien de salaire
    const salaireJournalier = salaireMensuelTotal / 21.67 // Base légale jours ouvrables
    const indemniteMaintienv = salaireJournalier * joursAcquis
    
    // Méthode du 1/10ème (minimum légal)
    const salairePeriodeRef = salaireMensuelTotal * moisTravailles
    const indemniteDixieme = salairePeriodeRef * 0.1
    
    // Calcul pour temps partiel
    const coefficientTempsPartiel = tempsPartiel / 100
    const indemniteFinaleMainten = indemniteMaintienv * coefficientTempsPartiel
    const indemniteFinaleDixieme = indemniteDixieme * coefficientTempsPartiel
    
    // La plus favorable des deux méthodes
    const indemniteRetenue = Math.max(indemniteFinaleMainten, indemniteFinaleDixieme)
    const methodeRetenue = indemniteFinaleMainten > indemniteFinaleDixieme ? 'maintien' : 'dixieme'
    
    // Calcul des jours restants
    const joursRestants = joursAcquis - joursPris
    const indemniteJoursRestants = (indemniteRetenue / joursAcquis) * joursRestants
    
    // Fractionnement (jours supplémentaires si congés pris hors période mai-octobre)
    const joursFractionnement = joursRestants > 12 ? 2 : joursRestants > 6 ? 1 : 0
    const indemniteFractionnement = joursFractionnement * salaireJournalier
    
    // Calcul des cotisations
    const csgCrds = indemniteRetenue * 0.097
    const netApresCharges = indemniteRetenue - csgCrds
    
    // Droits acquis pour l'année suivante (projection)
    const droitsAnneeProchaine = Math.min(30, (moisTravailles * 2.5))
    
    setResultats({
      // Données de base
      periodeReference: `${dateDebut.toLocaleDateString('fr-FR')} - ${dateFin.toLocaleDateString('fr-FR')}`,
      moisTravailles,
      joursAcquis,
      joursPris,
      joursRestants,
      
      // Calculs financiers
      salaireReference: salaireMensuelTotal.toFixed(2),
      salaireJournalier: salaireJournalier.toFixed(2),
      indemniteMaintienv: indemniteFinaleMainten.toFixed(2),
      indemniteDixieme: indemniteFinaleDixieme.toFixed(2),
      indemniteRetenue: indemniteRetenue.toFixed(2),
      methodeRetenue,
      
      // Indemnités spécifiques
      indemniteJoursRestants: indemniteJoursRestants.toFixed(2),
      joursFractionnement,
      indemniteFractionnement: indemniteFractionnement.toFixed(2),
      
      // Total et net
      totalBrut: (indemniteJoursRestants + indemniteFractionnement).toFixed(2),
      csgCrds: csgCrds.toFixed(2),
      netApresCharges: netApresCharges.toFixed(2),
      
      // Projections
      droitsAnneeProchaine,
      convention: conventions[formData.convention].nom
    })
    
    setShowDetails(true)
  }

  const downloadPDF = () => {
    alert('Génération du PDF en cours... Cette fonctionnalité sera bientôt disponible!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link href="/" className="hover:text-purple-600">Accueil</Link></li>
            <li>/</li>
            <li><Link href="/calculateurs" className="hover:text-purple-600">Calculateurs</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Congés payés</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            <Sun className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Calculateur de Congés Payés
          </h1>
          <p className="text-lg text-gray-600">
            Calculez vos indemnités de congés payés et vérifiez vos droits acquis
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            100% Gratuit • Conforme au Code du travail
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
            <button
              onClick={() => setActiveTab('calcul')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'calcul' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calculator className="w-4 h-4 inline mr-2" />
              Calculer l'indemnité
            </button>
            <button
              onClick={() => setActiveTab('droits')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'droits' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Vérifier mes droits
            </button>
          </div>
        </div>

        {activeTab === 'calcul' ? (
          <>
            {/* Formulaire de calcul */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Euro className="w-5 h-5 text-purple-600" />
                Calcul de l'indemnité
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Salaire brut mensuel */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salaire brut mensuel (€)
                  </label>
                  <input
                    type="number"
                    value={formData.salaireBrut}
                    onChange={(e) => setFormData({...formData, salaireBrut: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="2500"
                  />
                </div>

                {/* Jours acquis */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jours de congés acquis
                    <span className="text-xs text-gray-500 ml-1">(2.5 jours/mois)</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.joursAcquis}
                    onChange={(e) => setFormData({...formData, joursAcquis: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="25"
                  />
                </div>

                {/* Jours déjà pris */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jours déjà pris
                  </label>
                  <input
                    type="number"
                    value={formData.joursPris}
                    onChange={(e) => setFormData({...formData, joursPris: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {Object.entries(conventions).map(([key, conv]) => (
                      <option key={key} value={key}>{conv.nom}</option>
                    ))}
                  </select>
                </div>

                {/* Primes annuelles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primes annuelles (€)
                    <span className="text-xs text-gray-500 ml-1">(13ème mois, etc.)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.primes}
                    onChange={(e) => setFormData({...formData, primes: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="2500"
                  />
                </div>

                {/* Heures supplémentaires mensuelles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heures sup moyennes/mois (€)
                  </label>
                  <input
                    type="number"
                    value={formData.heuresSup}
                    onChange={(e) => setFormData({...formData, heuresSup: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="200"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="100">Temps plein (100%)</option>
                    <option value="80">80%</option>
                    <option value="60">60%</option>
                    <option value="50">Mi-temps (50%)</option>
                  </select>
                </div>

                {/* Type de contrat */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de contrat
                  </label>
                  <select
                    value={formData.typeContrat}
                    onChange={(e) => setFormData({...formData, typeContrat: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="interim">Intérim</option>
                  </select>
                </div>
              </div>

              {/* Info box */}
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800">
                  <Info className="inline w-4 h-4 mr-1" />
                  Le calcul compare automatiquement la méthode du maintien de salaire et celle du 1/10ème 
                  pour retenir la plus favorable.
                </p>
              </div>

              <button
                onClick={calculateConges}
                className="w-full mt-8 bg-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calculer mes indemnités
              </button>
            </div>
          </>
        ) : (
          /* Tab Vérifier mes droits */
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Vérification de vos droits
            </h2>
            
            <div className="space-y-6">
              {/* Période de référence */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début de période
                  </label>
                  <input
                    type="date"
                    value={formData.dateDebut}
                    onChange={(e) => setFormData({...formData, dateDebut: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin de période
                  </label>
                  <input
                    type="date"
                    value={formData.dateFin}
                    onChange={(e) => setFormData({...formData, dateFin: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Points de vérification */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Points à vérifier :</h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-sm text-gray-700">
                      Vérifiez que tous vos congés de l'année précédente ont été soldés avant le 31 mai
                    </span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-sm text-gray-700">
                      Contrôlez que vos bulletins mentionnent bien l'acquisition de 2.5 jours/mois
                    </span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-sm text-gray-700">
                      Assurez-vous que les primes sont incluses dans le calcul de l'indemnité
                    </span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-sm text-gray-700">
                      Vérifiez vos droits au fractionnement si vous prenez des congés hors période estivale
                    </span>
                  </label>
                </div>
              </div>

              <button
                onClick={calculateConges}
                className="w-full bg-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Analyser ma situation
              </button>
            </div>
          </div>
        )}

        {/* Résultats */}
        {resultats && showDetails && (
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sun className="w-6 h-6 text-yellow-500" />
              Vos indemnités de congés payés
            </h2>

            {/* Résultat principal */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 mb-6 text-white">
              <p className="text-sm opacity-90 mb-2">Indemnité totale à percevoir</p>
              <p className="text-4xl font-bold mb-1">
                {resultats.totalBrut} €
              </p>
              <p className="text-sm opacity-90">
                Net après charges : {resultats.netApresCharges} €
              </p>
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-sm">
                  {resultats.joursRestants} jours restants × {resultats.salaireJournalier}€/jour
                </p>
              </div>
            </div>

            {/* Détails du calcul */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-purple-600" />
                  Méthode du maintien
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salaire journalier</span>
                    <span className="font-medium">{resultats.salaireJournalier} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Indemnité totale</span>
                    <span className="font-medium">{resultats.indemniteMaintienv} €</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  Méthode du 1/10ème
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base de calcul</span>
                    <span className="font-medium">10% du brut annuel</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Indemnité totale</span>
                    <span className="font-medium">{resultats.indemniteDixieme} €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Méthode retenue */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-medium">
                <CheckCircle className="inline w-4 h-4 mr-1" />
                Méthode la plus favorable retenue : {resultats.methodeRetenue === 'maintien' ? 'Maintien de salaire' : '1/10ème'}
                {' '}({resultats.indemniteRetenue} €)
              </p>
            </div>

            {/* Détails complémentaires */}
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Période de référence</span>
                <span className="font-semibold">{resultats.periodeReference}</span>
              </div>
              
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Jours acquis / pris / restants</span>
                <span className="font-semibold">
                  {resultats.joursAcquis} / {resultats.joursPris} / {resultats.joursRestants}
                </span>
              </div>

              {resultats.joursFractionnement > 0 && (
                <div className="flex justify-between py-3 border-b bg-orange-50 px-3 rounded">
                  <span className="text-gray-700">
                    Jours de fractionnement ({resultats.joursFractionnement} jours)
                  </span>
                  <span className="font-semibold text-orange-600">
                    +{resultats.indemniteFractionnement} €
                  </span>
                </div>
              )}
              
              <div className="flex justify-between py-3">
                <span className="text-gray-600">CSG/CRDS (9.7%)</span>
                <span className="text-red-600">-{resultats.csgCrds} €</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <button 
                onClick={downloadPDF}
                className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Télécharger le calcul détaillé
              </button>
              <Link 
                href="/diagnostic"
                className="bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                Faire le diagnostic gratuit
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Projection */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <Info className="inline w-4 h-4 mr-1" />
                <strong>Projection :</strong> À ce rythme, vous aurez acquis {resultats.droitsAnneeProchaine} jours 
                de congés pour l'année prochaine.
              </p>
            </div>

            {/* Avertissement */}
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <AlertCircle className="inline w-4 h-4 mr-1" />
                Ce calcul est une estimation. Pour une analyse complète incluant RTT, compte épargne-temps 
                et spécificités conventionnelles, utilisez notre diagnostic gratuit.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}