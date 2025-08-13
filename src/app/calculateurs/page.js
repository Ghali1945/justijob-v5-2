
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator, ArrowLeft, Home, TrendingUp, Clock, Calendar, Briefcase, ChevronRight, Shield, Users, CheckCircle, Euro } from 'lucide-react'

export default function CalculateursPage() {
  const calculateurs = [
    {
      id: 'licenciement',
      title: 'Indemnités de licenciement',
      description: 'Calculez vos indemnités légales et conventionnelles',
      icon: '⚖️',
      color: 'blue',
      link: '/calculateurs/licenciement',
      details: ['Indemnité légale', 'Indemnité conventionnelle', 'Préavis', 'Congés payés'],
      estimation: '500€ à 50 000€'
    },
    {
      id: 'heures-sup',
      title: 'Heures supplémentaires',
      description: 'Estimez vos heures supplémentaires non payées',
      icon: '⏰',
      color: 'green',
      link: '/calculateurs/heures-sup',
      details: ['Majoration 25%', 'Majoration 50%', 'Repos compensateur', 'Calcul sur 3 ans'],
      estimation: '100€ à 10 000€'
    },
    {
      id: 'conges-payes',
      title: 'Congés payés',
      description: 'Calculez vos congés non pris et indemnités',
      icon: '🏖️',
      color: 'orange',
      link: '/calculateurs/conges-payes',
      details: ['Congés acquis', 'Congés non pris', 'Indemnité compensatrice', 'Fractionnement'],
      estimation: '500€ à 5 000€'
    },
    {
      id: 'prime-anciennete',
      title: "Prime d'ancienneté",
      description: 'Vérifiez le montant de votre prime selon votre convention',
      icon: '💰',
      color: 'purple',
      link: '/calculateurs/prime-anciennete',
      details: ['6 conventions', 'Calcul automatique', 'Rappel sur 3 ans', 'Comparaison'],
      estimation: '50€ à 500€/mois'
    }
  ]

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
              <Link href="/diagnostic" className="text-sm text-gray-600 hover:text-blue-600 hidden md:inline">
                Diagnostic
              </Link>
              <Link href="/urgence" className="text-sm text-gray-600 hover:text-blue-600 hidden md:inline">
                Guide urgence
              </Link>
              <Link href="/diagnostic" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                Faire le diagnostic
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
            <span className="text-blue-600 font-semibold">Calculateurs gratuits</span>
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Calculateurs de droits gratuits
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Estimez précisément vos indemnités et droits selon le Code du travail et votre convention collective
            </p>
            <div className="mt-4 space-y-2">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-2" />
                100% Gratuit • Calculs conformes au droit français
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium ml-2">
                🤖 Powered by Claude AI (Anthropic)
              </div>
            </div>
          </div>

          {/* Grille des calculateurs */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {calculateurs.map((calc) => (
              <div key={calc.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{calc.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{calc.title}</h3>
                        <p className="text-sm text-gray-600">{calc.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Ce calculateur inclut :</p>
                    <div className="grid grid-cols-2 gap-2">
                      {calc.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Estimation moyenne</p>
                      <p className="font-semibold text-gray-900">{calc.estimation}</p>
                    </div>
                    <Link
                      href={calc.link}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Calculer
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Besoin d'un dossier complet ?
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Après avoir calculé vos droits, constituez votre dossier prud'hommes complet avec l'aide de l'Agent IA Claude d'Anthropic
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/diagnostic"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Faire le diagnostic gratuit
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/urgence"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                >
                  Guide des procédures
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>

          {/* Informations complémentaires */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Données sécurisées</h3>
              <p className="text-sm text-gray-600">
                Vos calculs sont confidentiels et ne sont pas conservés
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Calculs précis</h3>
              <p className="text-sm text-gray-600">
                Basés sur le Code du travail et les conventions collectives 2024
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">+5000 utilisateurs</h3>
              <p className="text-sm text-gray-600">
                Font confiance à nos calculateurs chaque mois
              </p>
            </div>
          </div>

          {/* FAQ rapide */}
          <div className="mt-12 bg-blue-50 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Bon à savoir</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Les calculs sont-ils fiables ?
                </h4>
                <p className="text-sm text-gray-600">
                  Oui, nos calculateurs sont basés sur les textes officiels et mis à jour régulièrement. 
                  L'Agent IA Claude vérifie la conformité juridique de tous les calculs.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Puis-je utiliser ces calculs aux prud'hommes ?
                </h4>
                <p className="text-sm text-gray-600">
                  Nos calculs constituent une base solide pour votre dossier. 
                  Pour une procédure complète, utilisez notre service de génération de dossier avec Claude AI.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Faut-il créer un compte ?
                </h4>
                <p className="text-sm text-gray-600">
                  Non, tous les calculateurs sont 100% gratuits et sans inscription. 
                  Seul le dossier complet nécessite un paiement.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Mes données sont-elles conservées ?
                </h4>
                <p className="text-sm text-gray-600">
                  Non, aucune donnée n'est stockée. Tous les calculs sont effectués en temps réel 
                  et rien n'est conservé, conformément au RGPD.
                </p>
              </div>
            </div>
          </div>

          {/* Message de confiance */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              <Shield className="w-4 h-4 inline mr-1" />
              Calculs vérifiés par l'Agent IA Claude d'Anthropic • Conformes au Code du travail 2024
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