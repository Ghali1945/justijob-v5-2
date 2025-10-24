'use client';

import React from 'react';
import Link from 'next/link';

export default function SyndicatsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      {/* En-tête avec bouton retour */}
      <div className="container mx-auto px-4 py-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-medium"
        >
          ← Retour à l'accueil
        </Link>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              🤝 Espace Syndicats
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Accédez à votre espace dédié et accompagnez vos adhérents dans leurs démarches juridiques
            </p>
          </div>

          {/* Carte principale */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
            
            {/* Connexion */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Vous êtes un syndicat partenaire ?
              </h2>
              <p className="text-gray-600 mb-8">
                Connectez-vous pour accéder à votre tableau de bord
              </p>
              
              <Link
                href="/syndicats/connexion"
                className="inline-flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-all shadow-lg"
              >
                🔐 Se connecter
              </Link>
            </div>

            {/* Séparateur */}
            <div className="relative my-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Pas encore partenaire ?
                </span>
              </div>
            </div>

            {/* Contact */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Devenez partenaire JustiJob
              </h3>
              <p className="text-gray-600 mb-6">
                Rejoignez notre réseau de syndicats partenaires et offrez un accompagnement juridique de qualité à vos adhérents
              </p>
              
              
                href="mailto:partenariats@justijob.fr"
                className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                📧 Nous contacter
              </a>
            </div>
          </div>

          {/* Syndicats partenaires */}
          <div className="bg-gradient-to-r from-red-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Nos syndicats partenaires
            </h3>
            <div className="flex flex-wrap justify-center gap-4 text-lg font-semibold">
              <span className="bg-white/20 px-4 py-2 rounded-lg">CGT</span>
              <span className="bg-white/20 px-4 py-2 rounded-lg">CFDT</span>
              <span className="bg-white/20 px-4 py-2 rounded-lg">FO</span>
              <span className="bg-white/20 px-4 py-2 rounded-lg">CFE-CGC</span>
              <span className="bg-white/20 px-4 py-2 rounded-lg">CFTC</span>
              <span className="bg-white/20 px-4 py-2 rounded-lg">UNSA</span>
              <span className="bg-white/20 px-4 py-2 rounded-lg">FSU</span>
              <span className="bg-white/20 px-4 py-2 rounded-lg">Solidaires</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
