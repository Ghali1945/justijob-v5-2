'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PaiementSucces() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  
  const [loading, setLoading] = useState(true)
  const [paymentInfo, setPaymentInfo] = useState(null)

  useEffect(() => {
    if (sessionId) {
      // Vérifier le paiement
      fetch(`/api/payment/verify-payment?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setPaymentInfo(data)
          setLoading(false)
        })
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p>Vérification de votre paiement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Icône de succès */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            🎉 Paiement réussi !
          </h1>
          <p className="text-lg text-gray-600">
            Votre analyse premium est maintenant accessible
          </p>
        </div>

        {/* Détails du paiement */}
        {paymentInfo && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Récapitulatif</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Client :</span>
                <span className="font-medium">{paymentInfo.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email :</span>
                <span className="font-medium">{paymentInfo.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Montant payé :</span>
                <span className="font-bold text-green-600">{paymentInfo.amount}€</span>
              </div>
              {paymentInfo.syndicatInfo && (
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">Syndicat :</span>
                  <span className="font-medium text-green-600">
                    {paymentInfo.syndicatInfo.syndicatName}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bouton vers questionnaire */}
        <button
          onClick={() => router.push(`/questionnaire?session_id=${sessionId}`)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all mb-4"
        >
          📝 Accéder au questionnaire expert
        </button>

        {/* Info */}
        <div className="text-center text-sm text-gray-600">
          <p>Vous allez remplir un questionnaire détaillé</p>
          <p>Temps estimé : 10-15 minutes</p>
        </div>

        {/* Email de confirmation */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
          <p className="font-medium mb-1">📧 Email de confirmation envoyé</p>
          <p>Vous recevrez un email à {paymentInfo?.customerEmail} avec le lien d'accès au questionnaire.</p>
        </div>
      </div>
    </div>
  )
}
