
// src/app/paiement/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Lock, CheckCircle, CreditCard, AlertCircle, FileText, Users, Euro } from 'lucide-react';

export default function PaiementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Récupération des paramètres (type de service, montant, etc.)
  const serviceType = searchParams.get('service') || 'dossier-complet';
  const fromDiagnostic = searchParams.get('from') === 'diagnostic';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('once'); // 'once' ou 'twice'
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [diagnosticData, setDiagnosticData] = useState(null);
  
  // Configuration des tarifs
  const pricing = {
    'dossier-complet': {
      title: 'Dossier Prud\'homal Complet',
      price: 90,
      description: 'Dossier personnalisé prêt à déposer',
      features: [
        'Analyse juridique approfondie',
        'Formulaire Cerfa pré-rempli',
        'Stratégie personnalisée',
        'Calcul précis des indemnités',
        'Documents prêts à déposer',
        'Guide de procédure étape par étape'
      ]
    },
    'syndical': {
      title: 'Dossier via Syndicat',
      price: 45,
      description: 'Tarif réduit pour les syndiqués',
      features: [
        'Même dossier complet',
        'Transmis à votre syndicat',
        'Tarif solidaire réduit',
        'Accompagnement syndical',
        'Support prioritaire'
      ]
    }
  };
  
  const currentService = pricing[serviceType] || pricing['dossier-complet'];
  
  useEffect(() => {
    // Récupérer les données du diagnostic si disponibles
    const savedDiagnostic = sessionStorage.getItem('diagnosticResults');
    if (savedDiagnostic) {
      setDiagnosticData(JSON.parse(savedDiagnostic));
    }
  }, []);
  
  // Calcul du montant selon le mode de paiement
  const getAmount = () => {
    if (paymentMethod === 'twice' && serviceType === 'dossier-complet') {
      return {
        today: 45,
        later: 45,
        total: currentService.price
      };
    }
    return {
      today: currentService.price,
      later: 0,
      total: currentService.price
    };
  };
  
  const amount = getAmount();
  
  // Validation du formulaire
  const validateForm = () => {
    if (!email || !email.includes('@')) {
      setError('Email invalide');
      return false;
    }
    if (!name || name.length < 2) {
      setError('Nom requis');
      return false;
    }
    if (!acceptTerms) {
      setError('Vous devez accepter les conditions');
      return false;
    }
    return true;
  };
  
  // Gestion du paiement
  const handlePayment = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Appel à l'API pour créer une session Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          serviceType,
          paymentMethod,
          amount: amount.today,
          diagnosticData,
          metadata: {
            userId: email, // En attendant un vrai système d'auth
            service: currentService.title,
            paymentPlan: paymentMethod
          }
        }),
      });
      
      const { url, error: apiError } = await response.json();
      
      if (apiError) {
        throw new Error(apiError);
      }
      
      if (url) {
        // Redirection vers Stripe Checkout
        window.location.href = url;
      }
    } catch (error) {
      console.error('Erreur de paiement:', error);
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };
  
  // Paiement de test (développement)
  const handleTestPayment = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simuler un délai de traitement
    setTimeout(() => {
      // Sauvegarder les données de paiement
      const paymentData = {
        email,
        name,
        service: currentService.title,
        amount: amount.today,
        date: new Date().toISOString(),
        paymentId: 'TEST_' + Math.random().toString(36).substr(2, 9)
      };
      
      sessionStorage.setItem('paymentConfirmed', JSON.stringify(paymentData));
      
      // Rediriger vers la page de succès
      router.push('/paiement/succes');
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header avec sécurité */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <Shield className="text-green-600 mr-2" size={24} />
            <Lock className="text-green-600 mr-2" size={20} />
            <span className="text-sm text-gray-600">Paiement 100% sécurisé</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Finaliser votre commande
          </h1>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire de paiement */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Informations de paiement</h2>
              
              {/* Informations personnelles */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jean Dupont"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="jean.dupont@email.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Vous recevrez votre dossier et la facture à cette adresse
                  </p>
                </div>
              </div>
              
              {/* Options de paiement pour le dossier complet */}
              {serviceType === 'dossier-complet' && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Mode de paiement</h3>
                  <div className="space-y-3">
                    <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                           style={{ borderColor: paymentMethod === 'once' ? '#3B82F6' : '#E5E7EB' }}>
                      <input
                        type="radio"
                        name="payment"
                        value="once"
                        checked={paymentMethod === 'once'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1"
                      />
                      <div className="ml-3">
                        <div className="font-semibold">Paiement en une fois</div>
                        <div className="text-gray-600">90€ aujourd'hui</div>
                      </div>
                    </label>
                    
                    <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                           style={{ borderColor: paymentMethod === 'twice' ? '#3B82F6' : '#E5E7EB' }}>
                      <input
                        type="radio"
                        name="payment"
                        value="twice"
                        checked={paymentMethod === 'twice'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1"
                      />
                      <div className="ml-3">
                        <div className="font-semibold">Paiement en 2 fois</div>
                        <div className="text-gray-600">45€ aujourd'hui, 45€ dans 30 jours</div>
                        <div className="text-xs text-green-600 mt-1">Sans frais supplémentaires</div>
                      </div>
                    </label>
                  </div>
                </div>
              )}
              
              {/* Conditions générales */}
              <div className="mb-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    J'accepte les <a href="/cgv" className="text-blue-600 hover:underline">conditions générales de vente</a> et 
                    la <a href="/politique-confidentialite" className="text-blue-600 hover:underline"> politique de confidentialité</a>
                  </span>
                </label>
              </div>
              
              {/* Message d'erreur */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <AlertCircle className="text-red-500 mr-2 mt-0.5" size={20} />
                  <span className="text-red-700">{error}</span>
                </div>
              )}
              
              {/* Boutons d'action */}
              <div className="space-y-3">
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2" size={20} />
                      Payer {amount.today}€ maintenant
                    </>
                  )}
                </button>
                
                {/* Bouton de test en développement */}
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={handleTestPayment}
                    disabled={loading}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                  >
                    [DEV] Simuler le paiement
                  </button>
                )}
              </div>
              
              {/* Badges de sécurité */}
              <div className="mt-6 pt-6 border-t flex justify-center items-center space-x-6 text-gray-500">
                <div className="flex items-center text-sm">
                  <Lock size={16} className="mr-1" />
                  SSL sécurisé
                </div>
                <div className="flex items-center text-sm">
                  <Shield size={16} className="mr-1" />
                  Données cryptées
                </div>
                <div className="text-sm font-semibold">
                  Stripe
                </div>
              </div>
            </div>
          </div>
          
          {/* Récapitulatif de commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">Récapitulatif</h3>
              
              {/* Service sélectionné */}
              <div className="mb-4 pb-4 border-b">
                <h4 className="font-semibold mb-2">{currentService.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{currentService.description}</p>
                <ul className="space-y-2">
                  {currentService.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <CheckCircle className="text-green-500 mr-2 mt-0.5" size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Détail du prix */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{currentService.price}€</span>
                </div>
                {paymentMethod === 'twice' && serviceType === 'dossier-complet' && (
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>→ Aujourd'hui</span>
                      <span>{amount.today}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>→ Dans 30 jours</span>
                      <span>{amount.later}€</span>
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t font-bold text-lg">
                  <div className="flex justify-between">
                    <span>À payer maintenant</span>
                    <span className="text-blue-600">{amount.today}€</span>
                  </div>
                </div>
              </div>
              
              {/* Garanties */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Nos garanties</h4>
                <ul className="space-y-1 text-sm text-green-800">
                  <li>✓ Satisfaction ou remboursé sous 14 jours</li>
                  <li>✓ Dossier validé par nos juristes</li>
                  <li>✓ Support prioritaire inclus</li>
                  <li>✓ Données 100% sécurisées</li>
                </ul>
              </div>
              
              {/* Contact support */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Besoin d'aide ?
                </p>
                <a href="/contact" className="text-blue-600 hover:underline text-sm font-medium">
                  Contactez notre support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}