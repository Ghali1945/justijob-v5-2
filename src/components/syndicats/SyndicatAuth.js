
'use client';

import React, { useState } from 'react';
import { Users, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { DEMO_SYNDICATS } from './data';

const SyndicatAuth = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulation authentification
    setTimeout(() => {
      let userFound = null;
      let syndicatFound = null;

      // Chercher dans tous les syndicats
      Object.values(DEMO_SYNDICATS).forEach(syndicat => {
        const user = syndicat.users.find(u => 
          u.email === credentials.email && u.password === credentials.password
        );
        if (user) {
          userFound = user;
          syndicatFound = syndicat;
        }
      });

      if (userFound && syndicatFound) {
        onLogin(userFound, syndicatFound);
      } else {
        setError('Email ou mot de passe incorrect');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Users size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            JustiJob Syndicats
          </h1>
          <p className="text-gray-600 mt-2">
            Espace réservé aux partenaires syndicaux
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email professionnel
            </label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({...prev, email: e.target.value}))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="votre.email@syndicat.fr"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Mot de passe sécurisé"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Connexion...
              </>
            ) : (
              <>
                <Lock className="mr-2" size={20} />
                Se connecter
              </>
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Shield className="text-gray-600 mr-2" size={16} />
            <span className="text-sm font-medium text-gray-700">Comptes de démonstration</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>CGT :</strong> marie.dupont@cgt-metal.fr / revolution2025</p>
            <p><strong>CFDT :</strong> jean.moreau@cfdt-services.fr / innovation2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyndicatAuth;