
// src/app/paiement/annule/page.js
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, HelpCircle, MessageCircle, RefreshCw } from 'lucide-react';

export default function PaymentCancelPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Nettoyer les données de paiement en cours si nécessaire
    sessionStorage.removeItem('pendingPayment');
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Message d'annulation */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="text-red-600" size={48} />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Paiement annulé
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            Votre paiement a été annulé. Aucun montant n'a été débité.
          </p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 max-w-lg mx-auto">
            <p className="text-amber-800 text-sm">
              <strong>💡 Bon à savoir :</strong> Votre diagnostic et vos résultats sont sauvegardés. 
              Vous pouvez reprendre le paiement à tout moment sans refaire le diagnostic.
            </p>
          </div>
          
          {/* Raisons possibles de l'annulation */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
            <h3 className="font-semibold text-gray-900 mb-4">
              Pourquoi avez-vous annulé ?
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/diagnostic')}
                className="w-full text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-start">
                  <RefreshCw className="text-blue-600 mr-3 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium">Je veux revoir mon diagnostic</p>
                    <p className="text-sm text-gray-600">Affiner votre analyse avant de commander</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/contact')}
                className="w-full text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
              >
                <div className="flex items-start">
                  <HelpCircle className="text-green-600 mr-3 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium">J'ai besoin d'aide</p>
                    <p className="text-sm text-gray-600">Poser une question à notre équipe</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => window.open('/cgv', '_blank')}
                className="w-full text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
              >
                <div className="flex items-start">
                  <MessageCircle className="text-purple-600 mr-3 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium">Questions sur le service</p>
                    <p className="text-sm text-gray-600">Consulter nos conditions et garanties</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
          
          {/* Actions principales */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/paiement?retry=true')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Réessayer le paiement
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
            >
              <ArrowLeft className="mr-2" size={20} />
              Retour à l'accueil
            </button>
          </div>
        </div>
        
        {/* Rappel des services gratuits */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            En attendant, profitez de nos services gratuits
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold mb-2">Votre diagnostic</h3>
              <p className="text-sm text-gray-600 mb-3">
                Consultez votre scoring de victoire et vos recommandations
              </p>
              <button
                onClick={() => router.push('/diagnostic')}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Voir mon diagnostic →
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧮</span>
              </div>
              <h3 className="font-semibold mb-2">Calculateurs</h3>
              <p className="text-sm text-gray-600 mb-3">
                Calculez vos indemnités et heures supplémentaires
              </p>
              <button
                onClick={() => router.push('/calculateurs')}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Accéder aux calculateurs →
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-semibold mb-2">Guide prud'hommes</h3>
              <p className="text-sm text-gray-600 mb-3">
                Guide complet pour saisir les prud'hommes vous-même
              </p>
              <button
                onClick={() => router.push('/urgence')}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Consulter le guide →
              </button>
            </div>
          </div>
        </div>
        
        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">
            Votre diagnostic est sauvegardé pendant 30 jours
          </p>
          <p className="text-sm text-gray-500">
            Vous pouvez reprendre votre commande à tout moment sans refaire l'analyse
          </p>
        </div>
      </div>
    </div>
  );
}