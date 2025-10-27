'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageSquare, AlertCircle, CheckCircle2, User, Building2, Clock, Shield } from 'lucide-react'

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
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
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
              <MessageSquare className="w-8 h-8 text-white" />
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
                      <Mail className="w-5 h-5 text-blue-600" />
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
                      <Phone className="w-5 h-5 text-green-600" />
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
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Adresse</p>
                      <p className="text-gray-600 text-sm">
                        JustiJob SAS<br />
                        Paris, France
                      </p>
                    </div>
                  </div>

                  {/* Horaires */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Horaires</p>
                      <p className="text-sm text-gray-600">
                        Lundi - Vendredi<br />
                        9h00 - 18h00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support syndical */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-green-600" />
                  <h3 className="font-bold text-gray-900">Vous êtes syndiqué ?</h3>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Nos partenaires syndicaux bénéficient d'un tarif préférentiel de <strong>60€</strong> au lieu de 120€.
                </p>
                <div className="text-xs text-gray-600">
                  <p className="font-medium mb-2">Syndicats partenaires :</p>
                  <p>CGT, CFDT, FO, CFE-CGC, CFTC, UNSA, FSU, Solidaires</p>
                </div>
              </div>

              {/* RGPD */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600">
                      Vos données sont traitées de manière sécurisée et confidentielle, 
                      conformément au RGPD. Elles ne seront jamais partagées avec des tiers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite - Formulaire de contact */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Envoyez-nous un message
                </h2>
                <p className="text-gray-600 mb-8">
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </p>

                {/* Message de succès */}
                {formStatus.submitted && (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Message envoyé !</p>
                      <p className="text-sm text-green-700 mt-1">
                        Nous avons bien reçu votre message et vous répondrons sous 24h.
                      </p>
                    </div>
                  </div>
                )}

                {/* Message d'erreur */}
                {formStatus.error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">Erreur d'envoi</p>
                      <p className="text-sm text-red-700 mt-1">
                        Une erreur s'est produite. Veuillez réessayer ou nous contacter par email.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nom et Prénom */}
                  <div className="grid md:grid-cols-2 gap-4">
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
                        <Send className="w-5 h-5" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Info délai de réponse */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
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
              Besoin d'une réponse immédiate ?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Consultez notre diagnostic gratuit avec l'IA Claude pour obtenir une première évaluation 
              de votre situation en moins de 5 minutes.
            </p>
            <Link href="/diagnostic">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:shadow-xl transform hover:scale-105 transition-all">
                Lancer le diagnostic gratuit
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
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </Link>
    </div>
  )
}
