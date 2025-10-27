'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    objet: '',
    message: '',
    syndicat: '',
    accepteRGPD: false
  })

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    loading: false
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormStatus({ submitted: false, error: false, loading: true })

    try {
      // TODO: Remplacer par ton API d'envoi d'email
      // Pour l'instant, simulation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulation succès
      setFormStatus({ submitted: true, error: false, loading: false })
      
      // Réinitialiser le formulaire après 3 secondes
      setTimeout(() => {
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          objet: '',
          message: '',
          syndicat: '',
          accepteRGPD: false
        })
        setFormStatus({ submitted: false, error: false, loading: false })
      }, 3000)

    } catch (error) {
      console.error('Erreur envoi formulaire:', error)
      setFormStatus({ submitted: false, error: true, loading: false })
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors group"
              >
                <span className="text-xl">←</span>
                <span className="font-medium">Retour accueil</span>
              </Link>
              
              <div className="h-6 w-px bg-gray-300 hidden sm:block" />
              
              <span className="text-xl font-bold text-blue-600 hidden sm:inline">
                JustiJob
              </span>
              <span className="text-sm text-gray-500 hidden md:inline">
                La Défense Active
              </span>
            </div>
            
            <Link href="/diagnostic">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                Diagnostic Gratuit
              </button>
            </Link>
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
            <span className="text-blue-600 font-semibold">Contact</span>
          </nav>
        </div>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header de la page */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contactez-nous
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une question ? Un besoin d'accompagnement ? Notre équipe est à votre écoute
              pour vous aider dans vos démarches juridiques.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Colonne gauche - Informations de contact */}
            <div className="lg:col-span-1 space-y-6">
              {/* Coordonnées */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Nos coordonnées
                </h2>
                
                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📧</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Email</p>
                      <a 
                        href="mailto:contact@justijob.fr" 
                        className="text-blue-600 hover:underline"
                      >
                        contact@justijob.fr
                      </a>
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📞</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Téléphone</p>
                      <a 
                        href="tel:+33123456789" 
                        className="text-gray-600 hover:text-blue-600"
                      >
                        01 23 45 67 89
                      </a>
                      <p className="text-xs text-gray-500 mt-1">Lun-Ven 9h-18h</p>
                    </div>
                  </div>

                  {/* Adresse */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📍</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Adresse</p>
                      <p className="text-gray-600 text-sm">
                        JustiJob SAS<br />
                        SIREN: 992 255 745<br />
                        Paris, France
                      </p>
                    </div>
                  </div>

                  {/* Horaires */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">⏰</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Horaires</p>
                      <p className="text-gray-600 text-sm">
                        Lundi - Vendredi<br />
                        9h00 - 18h00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges de confiance */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  🛡️ Nos engagements
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Réponse sous 24h ouvrées</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Conformité RGPD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Données sécurisées</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Accompagnement personnalisé</span>
                  </div>
                </div>
              </div>

              {/* Partenaires syndicaux */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  🤝 Nos partenaires syndicaux
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  JustiJob collabore avec les principales organisations syndicales françaises
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">CGT</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">CFDT</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">FO</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">CFE-CGC</span>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">CFTC</span>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-semibold">UNSA</span>
                </div>
              </div>
            </div>

            {/* Colonne droite - Formulaire */}
            <div className="lg:col-span-2">
              {/* Messages de statut */}
              {formStatus.submitted && (
                <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-xl p-4 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">✅</span>
                    <div>
                      <p className="font-bold text-green-900">Message envoyé avec succès !</p>
                      <p className="text-sm text-green-700">
                        Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {formStatus.error && (
                <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">⚠️</span>
                    <div>
                      <p className="font-bold text-red-900">Erreur d'envoi</p>
                      <p className="text-sm text-red-700">
                        Une erreur est survenue. Veuillez réessayer ou nous contacter directement par email.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulaire */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Envoyez-nous un message
                </h2>
                <p className="text-gray-600 mb-6">
                  Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nom et Prénom */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        name="prenom"
                        required
                        value={formData.prenom}
                        onChange={handleChange}
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
                        required
                        value={formData.nom}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Dupont"
                      />
                    </div>
                  </div>

                  {/* Email et Téléphone */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="jean.dupont@email.fr"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
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
                  </div>

                  {/* Objet */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objet de votre demande *
                    </label>
                    <select
                      name="objet"
                      required
                      value={formData.objet}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionnez un objet</option>
                      <option value="diagnostic">Question sur le diagnostic</option>
                      <option value="dossier">Question sur mon dossier</option>
                      <option value="paiement">Question sur le paiement</option>
                      <option value="syndicat">Partenariat syndical</option>
                      <option value="technique">Problème technique</option>
                      <option value="juridique">Question juridique</option>
                      <option value="autre">Autre demande</option>
                    </select>
                  </div>

                  {/* Syndicat (optionnel) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vous êtes membre d'un syndicat ?
                    </label>
                    <select
                      name="syndicat"
                      value={formData.syndicat}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Non / Je préfère ne pas répondre</option>
                      <option value="CGT">CGT</option>
                      <option value="CFDT">CFDT</option>
                      <option value="FO">Force Ouvrière (FO)</option>
                      <option value="CFE-CGC">CFE-CGC</option>
                      <option value="CFTC">CFTC</option>
                      <option value="UNSA">UNSA</option>
                      <option value="FSU">FSU</option>
                      <option value="Solidaires">Solidaires</option>
                      <option value="autre">Autre syndicat</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Votre message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Décrivez votre demande en détail..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 20 caractères
                    </p>
                  </div>

                  {/* RGPD */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="accepteRGPD"
                      required
                      checked={formData.accepteRGPD}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <label className="text-sm text-gray-600">
                      J'accepte que mes données soient utilisées pour traiter ma demande conformément 
                      à la <Link href="/confidentialite" className="text-blue-600 hover:underline">politique de confidentialité</Link>.
                    </label>
                  </div>

                  {/* Bouton submit */}
                  <button
                    type="submit"
                    disabled={formStatus.loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {formStatus.loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">📨</span>
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Info délai de réponse */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⏱️</span>
                  <div>
                    <p className="font-semibold text-blue-900 text-sm">Délai de réponse</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Notre équipe s'engage à vous répondre sous 24h ouvrées. 
                      Pour les urgences, privilégiez le contact téléphonique.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section FAQ rapide */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              ⚡ Besoin d'une réponse immédiate ?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Consultez notre diagnostic gratuit avec l'IA Claude pour obtenir une première évaluation 
              de votre situation en moins de 5 minutes.
            </p>
            <Link href="/diagnostic">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:shadow-xl transform hover:scale-105 transition-all">
                🚀 Lancer le diagnostic gratuit
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bouton flottant mobile */}
      <Link
        href="/"
        className="fixed bottom-6 left-6 bg-white shadow-lg rounded-full p-4 hover:shadow-xl transition-all z-30 md:hidden"
        aria-label="Retour à l'accueil"
      >
        <span className="text-2xl">←</span>
      </Link>
    </div>
  )
}
