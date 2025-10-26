'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import syndicatsData from '@/data/syndicats-partners.json'

export default function PaiementPage() {
  const router = useRouter()
  const [selectedSyndicat, setSelectedSyndicat] = useState(null)
  const [promoCode, setPromoCode] = useState('')
  const [promoValid, setPromoValid] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [finalPrice, setFinalPrice] = useState(120)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  })

  // Validation du code promo en temps réel
  const validatePromoCode = (code, syndicatId) => {
    if (!code || !syndicatId) {
      setPromoValid(false)
      setPromoError('')
      setFinalPrice(120)
      return
    }

    const syndicat = syndicatsData.syndicats.find(s => s.id === syndicatId)
    if (!syndicat) {
      setPromoError('Syndicat invalide')
      setPromoValid(false)
      setFinalPrice(120)
      return
    }

    const codeUpperCase = code.toUpperCase().trim()
    const isValid = syndicat.promoCodes.some(
      validCode => validCode.toUpperCase() === codeUpperCase
    )

    if (isValid) {
      setPromoValid(true)
      setPromoError('')
      setFinalPrice(syndicat.priceDiscounted)
    } else {
      setPromoValid(false)
      setPromoError('Code promo invalide pour ce syndicat')
      setFinalPrice(120)
    }
  }

  // Effet pour valider automatiquement quand code promo ou syndicat change
  useEffect(() => {
    validatePromoCode(promoCode, selectedSyndicat)
  }, [promoCode, selectedSyndicat])

  // Gestion de la soumission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.nom || !formData.prenom || !formData.email) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    setLoading(true)

    try {
      // Créer la session Stripe
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerInfo: formData,
          syndicatId: selectedSyndicat,
          promoCode: promoValid ? promoCode : null,
          price: finalPrice
        })
      })

      const data = await response.json()

      if (data.url) {
        // Rediriger vers Stripe Checkout
        window.location.href = data.url
      } else {
        throw new Error('URL de paiement manquante')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Analyse Premium JustiJob
          </h1>
          <p className="text-lg text-gray-600">
            Obtenez votre dossier complet analysé par notre IA juridique
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Colonne gauche - Formulaire */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Vos informations
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre nom"
                />
              </div>

              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre prénom"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="votre@email.fr"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone (optionnel)
                </label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              {/* Sélecteur Syndicat */}
              <div className="pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  🏢 Membre d'un syndicat partenaire ?
                </label>
                <select
                  value={selectedSyndicat || ''}
                  onChange={(e) => setSelectedSyndicat(e.target.value || null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Non, je ne suis pas syndiqué(e)</option>
                  {syndicatsData.syndicats.map(syndicat => (
                    <option key={syndicat.id} value={syndicat.id}>
                      {syndicat.name} - {syndicat.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Code Promo (si syndicat sélectionné) */}
              {selectedSyndicat && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎟️ Code promo syndicat
                  </label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                    placeholder="Entrez votre code promo"
                  />
                  {promoValid && (
                    <p className="mt-2 text-sm text-green-600 font-medium flex items-center gap-2">
                      ✅ Code valide ! Réduction de 50% appliquée
                    </p>
                  )}
                  {promoError && (
                    <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-2">
                      ❌ {promoError}
                    </p>
                  )}
                </div>
              )}

              {/* Bouton de paiement */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Chargement...
                  </span>
                ) : (
                  `Payer ${finalPrice}€ de manière sécurisée`
                )}
              </button>

              {/* Badges de sécurité */}
              <div className="flex items-center justify-center gap-4 pt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Paiement 100% sécurisé
                </div>
                <div className="flex items-center gap-1">
                  🔒 RGPD conforme
                </div>
                <div className="flex items-center gap-1">
                  💳 Powered by Stripe
                </div>
              </div>
            </form>
          </div>

          {/* Colonne droite - Récapitulatif */}
          <div>
            {/* Carte de prix */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white mb-6">
              <h3 className="text-xl font-bold mb-6">Récapitulatif</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-lg">
                  <span>Analyse Premium</span>
                  <span className={finalPrice < 120 ? 'line-through opacity-50' : 'font-bold'}>
                    120€
                  </span>
                </div>
                
                {selectedSyndicat && promoValid && (
                  <>
                    <div className="flex justify-between items-center text-green-300 font-medium">
                      <span>Réduction syndicat (-50%)</span>
                      <span>-60€</span>
                    </div>
                    <div className="border-t border-white/30 pt-4 flex justify-between items-center">
                      <span className="text-2xl font-bold">Prix final</span>
                      <span className="text-4xl font-bold">60€</span>
                    </div>
                  </>
                )}

                {(!selectedSyndicat || !promoValid) && (
                  <div className="border-t border-white/30 pt-4 flex justify-between items-center">
                    <span className="text-2xl font-bold">Prix final</span>
                    <span className="text-4xl font-bold">120€</span>
                  </div>
                )}
              </div>

              {/* Ce qui est inclus */}
              <div className="space-y-3 pt-6 border-t border-white/30">
                <h4 className="font-bold mb-4">✨ Ce que vous obtenez :</h4>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Analyse IA complète par Claude (Anthropic)</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Dossier juridique de 30 pages</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Jurisprudence pertinente</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Arguments juridiques détaillés</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Calcul des indemnités possibles</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Téléchargement PDF instantané</span>
                </div>
              </div>
            </div>

            {/* Info syndicats */}
            {!selectedSyndicat && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                  💡 Vous êtes syndiqué(e) ?
                </h4>
                <p className="text-sm text-yellow-800">
                  Nos partenaires syndicaux (CGT, CFDT, FO, CFE-CGC, CFTC, UNSA, FSU, Solidaires) 
                  bénéficient d'un tarif préférentiel à <strong>60€</strong> au lieu de 120€.
                </p>
                <p className="text-sm text-yellow-800 mt-2">
                  Sélectionnez votre syndicat ci-dessus et entrez votre code promo !
                </p>
              </div>
            )}

            {/* Garantie */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🛡️</div>
                <h4 className="font-bold text-gray-900 mb-2">Garantie 100% Satisfait</h4>
                <p className="text-sm text-gray-600">
                  Si vous n'êtes pas satisfait de votre analyse, nous vous remboursons intégralement sous 14 jours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
