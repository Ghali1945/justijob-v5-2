// ===========================================
// 🏛️ src/app/syndicats/page.js (CORRIGÉ)
// ===========================================
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import SyndicatAuth from '../../components/syndicats/SyndicatAuth';
import Dashboard from '../../components/syndicats/Dashboard';

export default function SyndicatsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [syndicat, setSyndicat] = useState(null);

  const handleLogin = (loggedUser, userSyndicat) => {
    setUser(loggedUser);
    setSyndicat(userSyndicat);
  };

  const handleLogout = () => {
    setUser(null);
    setSyndicat(null);
  };

  // Si l'utilisateur n'est pas connecté, afficher la page de connexion
  if (!user || !syndicat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        {/* ✅ BOUTON RETOUR - AJOUTÉ ICI */}
        <div className="container mx-auto px-4 pt-8">
          <button
            onClick={() => router.push('/')}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Retour à l'accueil</span>
          </button>
        </div>

        {/* Composant de connexion */}
        <SyndicatAuth onLogin={handleLogin} />
      </div>
    );
  }

  // Si connecté, afficher le dashboard (avec son propre bouton de déconnexion)
  return <Dashboard user={user} syndicat={syndicat} onLogout={handleLogout} />;
}
