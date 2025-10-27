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
      id: 'salaire-impaye',
      icon: '💰',
      title: 'Salaire Impayé',
      subtitle: 'Retard ou non-paiement',
      description: 'Calcul des sommes dues et des pénalités applicables',
      available: false,
      color: 'from-green-500 to-green-600',
      features: [
        'Prochainement disponible'
      ]
    },
    {
      id: 'harcelement',
      icon: '🚫',
      title: 'Harcèlement',
      subtitle: 'Moral ou sexuel au travail',
      description: 'Évaluation de la situation et orientation juridique',
      available: false,
      color: 'from-purple-500 to-purple-600',
      features: [
        'Prochainement disponible'
      ]
    },
    {
      id: 'discrimination',
      icon: '⚖️',
      title: 'Discrimination',
      subtitle: 'Traitement inégalitaire',
      description: 'Analyse des éléments constitutifs de discrimination',
      available: false,
      color: 'from-indigo-500 to-indigo-600',
      features: [
        'Prochainement disponible'
      ]
    },
    {
      id: 'accident-travail',
      icon: '🏥',
      title: 'Accident du Travail',
      subtitle: 'Reconnaissance et indemnisation',
      description: 'Aide à la déclaration et au suivi de votre dossier',
      available: false,
      color: 'from-orange-500 to-orange-600',
      features: [
        'Prochainement disponible'
      ]
    }
  ]

  const handleDiagnosticSelect = (diagnosticId, available) => {
    if (available) {
      router.push(`/diagnostic/${diagnosticId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-bold">
                <span className="text-blue-600">JUSTI</span>
                <span className="text-gray-900">JOB</span>
              </span>
              <span className="text-sm text-gray-600 hidden sm:inline">La Défense Active</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/contact"
                className="text-gray-600 hover:text-blue-600 font-medium hidden sm:inline"
              >
                Contact
              </Link>
              <Link href="/">
                <button className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-2">
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
            Sélectionnez votre situation pour obtenir une analyse détaillée avec notre IA
            spécialisée en droit du travail
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <span>✅</span>
              <span>100% Gratuit</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <span>🤖</span>
              <span>IA Claude</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <span>📊</span>
              <span>Score précis</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <span>🔒</span>
              <span>Confidentiel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section titre */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Quelle est votre situation ?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choisissez le type de litige qui correspond à votre situation pour accéder
            à un diagnostic approfondi et personnalisé
          </p>
        </div>

        {/* Cartes de sélection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {diagnosticTypes.map((diagnostic) => (
            <div
              key={diagnostic.id}
              onMouseEnter={() => setHoveredCard(diagnostic.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleDiagnosticSelect(diagnostic.id, diagnostic.available)}
              className={`
                relative bg-white rounded-2xl shadow-lg overflow-hidden
                transition-all duration-300 transform
                ${diagnostic.available 
                  ? 'cursor-pointer hover:shadow-2xl hover:scale-105' 
                  : 'opacity-60 cursor-not-allowed'}
              `}
            >
              {/* Badge disponibilité */}
              {!diagnostic.available && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Bientôt
                  </span>
                </div>
              )}

              {/* Header avec gradient */}
              <div className={`bg-gradient-to-r ${diagnostic.color} p-6 text-white`}>
                <div className="text-5xl mb-3">{diagnostic.icon}</div>
                <h3 className="text-xl font-bold mb-1">{diagnostic.title}</h3>
                <p className="text-sm opacity-90">{diagnostic.subtitle}</p>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4">
                  {diagnostic.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {diagnostic.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Bouton d'action */}
                {diagnostic.available ? (
                  <button
                    className={`
                      w-full py-3 rounded-lg font-semibold text-white
                      bg-gradient-to-r ${diagnostic.color}
                      transition-all duration-300
                      ${hoveredCard === diagnostic.id ? 'shadow-lg' : ''}
                    `}
                  >
                    Commencer le diagnostic →
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 rounded-lg font-semibold text-gray-500 bg-gray-100 cursor-not-allowed"
                  >
                    Prochainement disponible
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Section informations */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Comment fonctionne notre diagnostic ?
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <span className="text-3xl">1️⃣</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Sélection</h4>
              <p className="text-sm text-gray-600">
                Choisissez votre type de litige
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <span className="text-3xl">2️⃣</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Questionnaire</h4>
              <p className="text-sm text-gray-600">
                Répondez aux questions détaillées (5-10 min)
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <span className="text-3xl">3️⃣</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Analyse IA</h4>
              <p className="text-sm text-gray-600">
                Claude analyse votre situation
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <span className="text-3xl">4️⃣</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Résultats</h4>
              <p className="text-sm text-gray-600">
                Score, recommandations et prochaines étapes
              </p>
            </div>
          </div>
        </div>

        {/* CTA Premium */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <span className="text-3xl">⭐</span>
          </div>
          <h3 className="text-2xl font-bold mb-4">
            Besoin d'un dossier complet avec jurisprudence ?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Après votre diagnostic gratuit, obtenez un dossier juridique de 30 pages
            avec analyse approfondie, jurisprudence applicable, et stratégie personnalisée
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold">120€</div>
              <div className="text-sm text-blue-100">Grand public</div>
            </div>
            <div className="bg-white/20 px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold">60€</div>
              <div className="text-sm text-blue-100">Membres syndicats</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-blue-400">JUSTI</span>
                <span className="text-white">JOB</span>
              </div>
              <p className="text-gray-400 text-sm">
                Plateforme éthique et solidaire d'aide aux salariés
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services Gratuits</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/diagnostic/heures-sup" className="hover:text-white">Diagnostic heures sup</Link></li>
                <li><Link href="/diagnostic/licenciement" className="hover:text-white">Diagnostic licenciement</Link></li>
                <li><Link href="/calculateurs" className="hover:text-white">Calculateurs</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Informations</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/cgv" className="hover:text-white">CGV</Link></li>
                <li><Link href="/mentions-legales" className="hover:text-white">Mentions Légales</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 JustiJob SAS - SIREN: 992 255 745 - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
