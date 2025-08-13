
'use client';

import { useState } from 'react';

export default function PolitiqueConfidentialitePage() {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      id: 1,
      title: "Données collectées",
      icon: "📊",
      content: {
        auto: ["Adresse IP", "Type de navigateur", "Pages visitées", "Durée de visite"],
        volontaire: ["Nom et prénom", "Email", "Adresse", "Informations employeur", "Documents"]
      }
    },
    {
      id: 2,
      title: "Utilisation de l'IA Claude",
      icon: "🤖",
      content: "Vos données sont analysées par Claude, l'IA d'Anthropic, pour calculer votre score et générer des arguments juridiques. Anthropic ne conserve pas vos données après traitement."
    },
    {
      id: 3,
      title: "Vos droits RGPD",
      icon: "⚖️",
      droits: [
        "Droit d'accès à vos données",
        "Droit de rectification",
        "Droit à l'effacement",
        "Droit à la portabilité",
        "Droit d'opposition",
        "Droit de retirer votre consentement"
      ]
    },
    {
      id: 4,
      title: "Sécurité",
      icon: "🔒",
      mesures: [
        "Chiffrement SSL/TLS",
        "Chiffrement des données sensibles",
        "Authentification forte",
        "Audits réguliers"
      ]
    },
    {
      id: 5,
      title: "Conservation",
      icon: "⏱️",
      durees: [
        { type: "Diagnostic gratuit", duree: "6 mois" },
        { type: "Compte client", duree: "3 ans" },
        { type: "Documents", duree: "1 an" },
        { type: "Facturation", duree: "10 ans" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">
              JustiJob
            </a>
            <nav className="flex gap-4 text-sm">
              <a href="/cgu" className="text-gray-600 hover:text-blue-600">CGU</a>
              <a href="/cgv" className="text-gray-600 hover:text-blue-600">CGV</a>
              <a href="/mentions-legales" className="text-gray-600 hover:text-blue-600">Mentions</a>
              <a href="/politique-confidentialite" className="text-blue-600 font-semibold">RGPD</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Politique de Confidentialité & RGPD
        </h1>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
          <p className="text-blue-800 font-semibold text-lg">
            🤖 Protection de vos données avec l'Agent IA Claude d'Anthropic
          </p>
          <p className="text-gray-600 mt-2">
            JustiJob attache une importance particulière à la protection de vos données 
            personnelles conformément au RGPD.
          </p>
        </div>

        {/* Sections interactives */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow">
              <button
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
                </div>
                <span className="text-2xl">
                  {activeSection === section.id ? '−' : '+'}
                </span>
              </button>
              
              {activeSection === section.id && (
                <div className="px-6 pb-6">
                  {/* Section 1: Données collectées */}
                  {section.id === 1 && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded p-4">
                        <h3 className="font-semibold mb-2">Collecte automatique :</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {section.content.auto.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-green-50 rounded p-4">
                        <h3 className="font-semibold mb-2">Données fournies :</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {section.content.volontaire.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {/* Section 2: IA Claude */}
                  {section.id === 2 && (
                    <div className="bg-purple-50 rounded p-4">
                      <p className="text-gray-700">{section.content}</p>
                      <div className="mt-3 text-sm text-purple-700">
                        ✓ Transmission sécurisée à l'API Claude<br/>
                        ✓ Aucune conservation par Anthropic<br/>
                        ✓ Respect des standards SOC 2 Type 2
                      </div>
                    </div>
                  )}
                  
                  {/* Section 3: Droits RGPD */}
                  {section.id === 3 && (
                    <div className="space-y-3">
                      {section.droits.map((droit, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded">
                          <span className="text-green-600">✓</span>
                          <span className="text-gray-700">{droit}</span>
                        </div>
                      ))}
                      <div className="bg-blue-50 rounded p-4 mt-4">
                        <p className="font-semibold">Pour exercer vos droits :</p>
                        <p className="text-blue-600">rgpd@justijob.fr</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Section 4: Sécurité */}
                  {section.id === 4 && (
                    <div className="grid md:grid-cols-2 gap-3">
                      {section.mesures.map((mesure, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                          <span className="text-blue-600">🔐</span>
                          <span className="text-gray-700">{mesure}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Section 5: Conservation */}
                  {section.id === 5 && (
                    <div className="space-y-2">
                      {section.durees.map((item, i) => (
                        <div key={i} className="flex justify-between p-3 bg-gray-50 rounded">
                          <span className="text-gray-700">{item.type}</span>
                          <span className="font-semibold text-blue-600">{item.duree}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact DPO */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📧 Délégué à la Protection des Données
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Questions RGPD :</p>
              <p className="text-blue-600">dpo@justijob.fr</p>
            </div>
            <div>
              <p className="font-semibold">Réclamation CNIL :</p>
              <a href="https://www.cnil.fr" className="text-blue-600 hover:underline">
                www.cnil.fr
              </a>
            </div>
          </div>
        </div>

        {/* Cookies */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            🍪 Gestion des cookies
          </h3>
          <p className="text-gray-700 mb-4">
            Nous utilisons des cookies essentiels et analytiques pour améliorer votre expérience.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Gérer mes préférences
          </button>
        </div>

        {/* Bouton retour */}
        <div className="mt-12 text-center">
          <a 
            href="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}