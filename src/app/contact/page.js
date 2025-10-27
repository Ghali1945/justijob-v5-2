'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  });
  const [status, setStatus] = useState(''); // 'success', 'error', 'sending'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    // Simulation d'envoi (à remplacer par vraie API)
    setTimeout(() => {
      setStatus('success');
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                <span className="text-blue-600">JUSTI</span>
                <span className="text-gray-900">JOB</span>
              </div>
              <span className="text-sm text-gray-600 hidden sm:inline">La Défense Active</span>
            </Link>
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une question ? Un besoin d'assistance ? Notre équipe est là pour vous aider.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formulaire de contact */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Envoyez-nous un message
            </h2>

            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  ✅ Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">
                  ❌ Une erreur est survenue. Veuillez réessayer.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="jean.dupont@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone (optionnel)
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet *
                </label>
                <select
                  name="sujet"
                  value={formData.sujet}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="question-diagnostic">Question sur le diagnostic</option>
                  <option value="question-paiement">Question sur le paiement</option>
                  <option value="partenariat-syndicat">Partenariat syndicat</option>
                  <option value="assistance-technique">Assistance technique</option>
                  <option value="autre">Autre demande</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Décrivez votre demande..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? '📨 Envoi en cours...' : '📧 Envoyer le message'}
              </button>

              <p className="text-sm text-gray-500 text-center">
                * Champs obligatoires
              </p>
            </form>
          </div>

          {/* Informations de contact */}
          <div className="space-y-8">
            {/* Coordonnées */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Nos coordonnées
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <a href="mailto:contact@justijob.fr" className="text-blue-600 hover:text-blue-700">
                      contact@justijob.fr
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      Réponse sous 24-48h
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Société</h3>
                    <p className="text-gray-700">JustiJob SAS</p>
                    <p className="text-sm text-gray-500 mt-1">
                      SIREN: 992 255 745
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Horaires</h3>
                    <p className="text-gray-700">Lundi - Vendredi</p>
                    <p className="text-sm text-gray-500 mt-1">
                      9h00 - 18h00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Rapide */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Questions fréquentes
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    💰 Combien coûte le diagnostic complet ?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    120€ pour le grand public, 60€ pour les membres de nos syndicats partenaires (CGT, CFDT, etc.)
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    ⚡ Le diagnostic gratuit est-il vraiment gratuit ?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Oui ! Vous obtenez un score et une analyse préliminaire sans aucun engagement.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    🔒 Mes données sont-elles sécurisées ?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Absolument. Nous respectons le RGPD et vos données sont chiffrées et protégées.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    🏢 Proposez-vous des partenariats syndicaux ?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Oui ! Contactez-nous pour discuter d'un partenariat avantageux pour vos membres.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-blue-200">
                <Link 
                  href="/"
                  className="inline-flex items-center justify-center w-full bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  🏠 Retour à l'accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
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
              <h3 className="font-semibold mb-4">Liens rapides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-gray-400 hover:text-white">Accueil</Link></li>
                <li><Link href="/diagnostic" className="text-gray-400 hover:text-white">Diagnostic gratuit</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Informations</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cgv" className="text-gray-400 hover:text-white">CGV</Link></li>
                <li><Link href="/mentions-legales" className="text-gray-400 hover:text-white">Mentions Légales</Link></li>
                <li><Link href="/confidentialite" className="text-gray-400 hover:text-white">Confidentialité</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 JustiJob SAS - SIREN: 992 255 745 - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
