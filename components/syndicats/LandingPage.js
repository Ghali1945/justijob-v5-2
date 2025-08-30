
// ============================================
// 📁 src/components/syndicats/LandingPage.js (BONUS)
// ============================================
'use client';

import React from 'react';
import { 
  Users, 
  Shield, 
  BarChart3, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  DollarSign,
  Star,
  Target
} from 'lucide-react';
import Link from 'next/link';

const SyndicatsLanding = () => {
  const syndicatsPartenaires = [
    { nom: 'CGT Métallurgie', logo: '⚒️', adherents: '1,247', departements: '8', actif: true },
    { nom: 'CFDT Services', logo: '🏢', adherents: '892', departements: '4', actif: true },
    { nom: 'FO Transport', logo: '🚛', adherents: '0', departements: '0', actif: false },
    { nom: 'CGT Santé', logo: '🏥', adherents: '0', departements: '0', actif: false }
  ];

  const avantages = [
    {
      icon: DollarSign,
      titre: 'Revenus Supplémentaires',
      description: '15€ de commission par dossier traité pour votre syndicat',
      couleur: 'green'
    },
    {
      icon: Users,
      titre: 'Valeur Ajoutée Adhérents',
      description: 'Service premium exclusif : -50% sur tous les dossiers JustiJob',
      couleur: 'blue'
    },
    {
      icon: BarChart3,
      titre: 'Données Stratégiques',
      description: 'Analytics en temps réel : conflits, tendances, entreprises à risque',
      couleur: 'purple'
    },
    {
      icon: Shield,
      titre: 'Modernisation',
      description: 'Premier syndicat 100% digital de France, leadership technologique',
      couleur: 'red'
    }
  ];

  const resultats = [
    { label: 'Adhérents Satisfaits', valeur: '94%', couleur: 'green' },
    { label: 'Taux de Réussite', valeur: '87%', couleur: 'blue' },
    { label: 'Économie par Adhérent', valeur: '1,910€', couleur: 'purple' },
    { label: 'Nouveaux Adhérents/Mois', valeur: '+35%', couleur: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center space-x-4 mb-8">
              <span className="text-6xl">⚒️</span>
              <span className="text-6xl">🏢</span>
              <span className="text-6xl">🚛</span>
              <span className="text-6xl">🏥</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              JustiJob <span className="text-red-600">Syndicats</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Révolutionnez l'accompagnement de vos adhérents avec la première plateforme 
              d'IA juridique dédiée aux syndicats français.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/syndicats/connexion" className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors">
                Accès Partenaires
              </Link>
              <button className="bg-white text-red-600 border-2 border-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-50 transition-colors">
                Devenir Partenaire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Syndicats Partenaires */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Syndicats Partenaires Pionniers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {syndicatsPartenaires.map((syndicat, index) => (
              <div key={index} className={`bg-white border-2 rounded-lg p-6 text-center ${
                syndicat.actif ? 'border-green-200 shadow-lg' : 'border-gray-200 opacity-60'
              }`}>
                <div className="text-4xl mb-4">{syndicat.logo}</div>
                <h3 className="font-bold text-gray-900 mb-2">{syndicat.nom}</h3>
                {syndicat.actif ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="text-green-500 mr-2" size={16} />
                      <span className="text-green-600 font-medium">ACTIF</span>
                    </div>
                    <p className="text-sm text-gray-600">{syndicat.adherents} adhérents</p>
                    <p className="text-sm text-gray-600">{syndicat.departements} départements</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="text-gray-400 font-medium">EN NÉGOCIATION</span>
                    <p className="text-sm text-gray-400">Bientôt disponible</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Avantages */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi Devenir Partenaire JustiJob ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {avantages.map((avantage, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-8">
                <div className={`bg-${avantage.couleur}-100 p-3 rounded-lg w-fit mb-4`}>
                  <avantage.icon className={`text-${avantage.couleur}-600`} size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{avantage.titre}</h3>
                <p className="text-gray-600">{avantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Résultats Mesurables
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {resultats.map((resultat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl font-bold text-${resultat.couleur}-600 mb-2`}>
                  {resultat.valeur}
                </div>
                <p className="text-gray-600">{resultat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Témoignages */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Témoignages Syndicats
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">⚒️</span>
                <div>
                  <h4 className="font-bold">Marie Dupont</h4>
                  <p className="text-gray-600">Responsable CGT Métallurgie</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "JustiJob a révolutionné notre accompagnement. Nos adhérents ont enfin 
                un outil professionnel accessible 24h/24. Les résultats parlent d'eux-mêmes !"
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🏢</span>
                <div>
                  <h4 className="font-bold">Jean Moreau</h4>
                  <p className="text-gray-600">Secrétaire CFDT Services</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "La technologie au service de nos valeurs. JustiJob nous positionne 
                comme le syndicat de l'innovation sociale. Nos adhérents adorent !"
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-16 bg-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Rejoignez la Révolution Numérique Syndicale
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Soyez le premier syndicat de votre secteur à proposer l'IA juridique à vos adhérents.
            L'avenir appartient aux pionniers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-50 transition-colors flex items-center justify-center">
              Demander une Démo
              <ArrowRight className="ml-2" size={20} />
            </button>
            <Link href="/syndicats/connexion" className="bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-800 transition-colors">
              Espace Partenaires
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            JustiJob Syndicats - Révolutionner l'accès au droit pour tous les salariés français
          </p>
          <p className="text-gray-500 mt-2">
            Contact partenariats : syndicats@justijob.fr | 01.44.55.66.77
          </p>
        </div>
      </div>
    </div>
  );
};

export default SyndicatsLanding;