'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DiagnosticSelectionPage() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState(null)

  const diagnosticTypes = [
    {
      id: 'heures-sup',
      icon: '⏰',
      title: 'Heures Supplémentaires',
      subtitle: 'Non payées ou mal calculées',
      description: 'Diagnostic détaillé avec calcul des majorations légales et conventionnelles',
      available: true,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Calcul précis des heures dues',
        'Majorations 25% et 50%',
        'Prescription triennale',
        'Analyse des preuves'
      ]
    },
    {
      id: 'salaire-impaye',
      icon: '💰',
      title: 'Salaire Impayé',
      subtitle: 'Retard ou non-paiement',
      description: 'Calcul des sommes dues et des pénalités applicables',
      available: true,
      color: 'from-green-500 to-green-600',
      features: [
        'Calcul salaires dus',
        'Intérêts légaux',
        'Dommages & intérêts',
        'Mise en demeure'
      ]
    },
    {
      id: 'conges-payes',
      icon: '🏖️',
      title: 'Congés Payés Non Pris',
      subtitle: 'Indemnité compensatrice non versée',
      description: 'Calcul de indemnité compensatrice selon les 2 méthodes légales (1/10ème ou maintien)',
      available: true,
      color: 'from-green-500 to-green-600',
      features: [
        'Double méthode de calcul',
        'Congés sur congés (+10%)',
        'Délai de prescription 3 ans',
        'Recommandations personnalisées'
      ]
    },
    {
      id: 'licenciement',
      icon: '📋',
      title: 'Licenciement',
      subtitle: 'Abusif, sans cause réelle et sérieuse',
      description: 'Analyse juridique approfondie de la procédure et du motif invoqué',
      available: true,
      color: 'from-red-500 to-red-600',
      features: [
        'Vérification de la procédure',
        'Analyse du motif',
        'Calcul barème Macron',
        'Dommages & intérêts'
      ]
    },
    {
      id: 'harcelement',
      icon: '🛡️',
      title: 'Harcèlement et Discrimination',
      subtitle: 'Moral, sexuel ou discrimination au travail',
      description: 'Évaluation complète de votre situation avec analyse juridique approfondie',
      available: true,
      color: 'from-red-500 to-orange-500',
      features: [
        'Analyse gravité des faits',
        'Évaluation des preuves',
        'Calcul des réparations',
        'Accompagnement juridique complet'
      ]
    },
    {
      id: 'rupture-conventionnelle',
      icon: '🤝',
      title: 'Rupture Conventionnelle',
      subtitle: 'Négociation et indemnités',
      description: 'Analyse de votre proposition et calcul des montants optimaux',
      available: true,
      color: 'from-indigo-500 to-purple-600',
      features: [
        'Calcul indemnité légale minimale',
        'Recommandation Accepter/Négocier/Refuser',
        'Détection pression employeur',
        'Montant optimal recommandé'
      ]
    }
  ]

  const handleCardClick = (diagnostic) => {
    if (diagnostic.available) {
      router.push(`/diagnostic/${diagnostic.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header - FOND BLANC avec texte NOIR bien visible */}
      <header className="bg-white shadow-md border-b-2 border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-bold">
                <span className="text-blue-600">JUSTI</span>
                <span className="text-gray-900">JOB</span>
              </span>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">La Défense Active</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/contact"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors hidden sm:inline"
              >
                Contact
              </Link>
              <Link href="/">
                <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors">
                  <span>←</span>
                  <span className="hidden sm:inline">Retour accueil</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
            <span className="text-4xl">🎯</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Diagnostic Juridique Gratuit
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Évaluez gratuitement votre situation en 15 minutes. 
            Diagnostic conforme au Code du travail 2025.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <span>✓</span>
              <span>100% Confidentiel</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <span>✓</span>
              <span>Résultat Immédiat</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <span>✓</span>
              <span>Sans Engagement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostic Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Choisissez votre diagnostic
          </h2>
          <p className="text-lg text-gray-600">
            Sélectionnez le problème que vous rencontrez pour démarrer votre évaluation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {diagnosticTypes.map((diagnostic) => (
            <div
              key={diagnostic.id}
              onClick={() => handleCardClick(diagnostic)}
              onMouseEnter={() => setHoveredCard(diagnostic.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`
                relative bg-white rounded-2xl border-2 shadow-lg overflow-hidden
                transition-all duration-300 cursor-pointer
                ${hoveredCard === diagnostic.id 
                  ? 'transform -translate-y-2 shadow-2xl border-blue-300' 
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${!diagnostic.available ? 'opacity-60 cursor-not-allowed' : ''}
              `}
            >
              {/* Gradient Header */}
              <div className={`bg-gradient-to-r ${diagnostic.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-5xl">{diagnostic.icon}</span>
                  {diagnostic.id === 'conges-payes' && (
                    <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                      NOUVEAU ✨
                    </span>
                  )}
                  {diagnostic.id === 'rupture-conventionnelle' && (
                    <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                      NOUVEAU ✨
                    </span>
                  )}
                  {!diagnostic.available && (
                    <span className="bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Bientôt
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-1">{diagnostic.title}</h3>
                <p className="text-sm text-white/90">{diagnostic.subtitle}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {diagnostic.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {diagnostic.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  disabled={!diagnostic.available}
                  className={`
                    w-full py-3 rounded-xl font-semibold transition-all duration-300
                    ${diagnostic.available
                      ? `bg-gradient-to-r ${diagnostic.color} text-white hover:shadow-lg hover:scale-105`
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {diagnostic.available ? 'Commencer le diagnostic →' : 'Prochainement'}
                </button>
              </div>

              {/* Hover Effect Border */}
              {hoveredCard === diagnostic.id && diagnostic.available && (
                <div className="absolute inset-0 border-4 border-blue-400 rounded-2xl pointer-events-none animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-4xl">💼</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Besoin d'un accompagnement personnalisé ?
              </h3>
              <p className="text-gray-600 mb-4">
                Nos avocats partenaires peuvent vous accompagner dans vos démarches juridiques.
                Tarif préférentiel pour les membres CGT et CFDT.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link 
                  href="/contact"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Nous contacter
                </Link>
                <Link
                  href="/tarifs"
                  className="px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:border-blue-400 transition-all"
                >
                  Voir les tarifs
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
            <div className="text-gray-600 font-medium">Taux de satisfaction</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-4xl font-bold text-green-600 mb-2">15 min</div>
            <div className="text-gray-600 font-medium">Durée moyenne</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600 font-medium">Disponibilité</div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Ils nous font confiance
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚩</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">CGT</h4>
                <p className="text-sm text-gray-600">
                  Tarif préférentiel 60€ pour 800 000+ adhérents
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">CFDT</h4>
                <p className="text-sm text-gray-600">
                  Tarif préférentiel 60€ pour 800 000+ adhérents
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - FOND SOMBRE avec texte BLANC bien visible */}
      <footer className="bg-gray-900 text-white py-12 mt-20 border-t-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">
                <span className="text-blue-400">JUSTI</span>JOB
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                La plateforme de diagnostic juridique alimentée par l'IA pour défendre vos droits au travail.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-white">📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-white">🐦</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-white">💼</span>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Diagnostics Gratuits</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/diagnostic/heures-sup" className="text-gray-300 hover:text-white transition-colors">⏰ Heures supplémentaires</Link></li>
                <li><Link href="/diagnostic/salaire-impaye" className="text-gray-300 hover:text-white transition-colors">💰 Salaires impayés</Link></li>
                <li><Link href="/diagnostic/conges-payes" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  🏖️ Congés payés non pris 
                  <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">NEW</span>
                </Link></li>
                <li><Link href="/diagnostic/licenciement" className="text-gray-300 hover:text-white transition-colors">📋 Licenciement</Link></li>
                <li><Link href="/diagnostic/harcelement" className="text-gray-300 hover:text-white transition-colors">🛡️ Harcèlement</Link></li>
                <li><Link href="/diagnostic/rupture-conventionnelle" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  🤝 Rupture conventionnelle
                  <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">NEW</span>
                </Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Informations</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/cgv" className="text-gray-300 hover:text-white transition-colors">CGV</Link></li>
                <li><Link href="/mentions-legales" className="text-gray-300 hover:text-white transition-colors">Mentions Légales</Link></li>
                <li><Link href="/confidentialite" className="text-gray-300 hover:text-white transition-colors">Confidentialité</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-sm text-gray-300 mb-2">
              © 2025 JustiJob SAS - SIREN: 992 255 745 - Tous droits réservés
            </p>
            <p className="text-xs text-gray-400">
              Propulsé par Claude 4 (Anthropic) | Conforme RGPD
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
