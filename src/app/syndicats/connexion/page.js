'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiLock, FiMail, FiAlertCircle } from 'react-icons/fi';

export default function ConnexionSyndicale() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Identifiants des syndicats partenaires
  const syndicatCredentials = {
    'cgt@justijob.fr': { 
      password: 'CGT2024', 
      name: 'CGT', 
      fullName: 'Confédération Générale du Travail',
      dashboard: '/syndicats/cgt' 
    },
    'cfdt@justijob.fr': { 
      password: 'CFDT2024', 
      name: 'CFDT', 
      fullName: 'Confédération Française Démocratique du Travail',
      dashboard: '/syndicats/cfdt' 
    },
    'fo@justijob.fr': { 
      password: 'FO2024', 
      name: 'FO', 
      fullName: 'Force Ouvrière',
      dashboard: '/syndicats/fo' 
    },
    'cfe-cgc@justijob.fr': { 
      password: 'CFECGC2024', 
      name: 'CFE-CGC', 
      fullName: 'Confédération Française de l\'Encadrement - CGC',
      dashboard: '/syndicats/cfe-cgc' 
    },
    'cftc@justijob.fr': { 
      password: 'CFTC2024', 
      name: 'CFTC', 
      fullName: 'Confédération Française des Travailleurs Chrétiens',
      dashboard: '/syndicats/cftc' 
    },
    'unsa@justijob.fr': { 
      password: 'UNSA2024', 
      name: 'UNSA', 
      fullName: 'Union Nationale des Syndicats Autonomes',
      dashboard: '/syndicats/unsa' 
    },
    'fsu@justijob.fr': { 
      password: 'FSU2024', 
      name: 'FSU', 
      fullName: 'Fédération Syndicale Unitaire',
      dashboard: '/syndicats/fsu' 
    },
    'solidaires@justijob.fr': { 
      password: 'SOLIDAIRES2024', 
      name: 'Solidaires', 
      fullName: 'Union Syndicale Solidaires',
      dashboard: '/syndicats/solidaires' 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulation d'un délai de vérification
    await new Promise(resolve => setTimeout(resolve, 800));

    const syndicat = syndicatCredentials[credentials.email.toLowerCase()];

    if (syndicat && syndicat.password === credentials.password) {
      // Connexion réussie
      router.push(syndicat.dashboard);
    } else {
      setError('Email ou mot de passe incorrect');
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      
      {/* En-tête avec bouton retour */}
      <div className="container mx-auto px-4 py-6">
        <Link 
          href="/syndicats"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Retour</span>
        </Link>
      </div>

      {/* Formulaire de connexion */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          
          {/* Carte de connexion */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            
            {/* En-tête */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <FiLock className="text-3xl text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Connexion Syndicale
              </h1>
              <p className="text-gray-600">
                Accédez à votre espace partenaire
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email du syndicat
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="exemple@syndicat.fr"
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  <FiAlertCircle className="flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Connexion en cours...
                  </span>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            {/* Aide */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  💡 Identifiants de test disponibles
                </p>
                <p className="text-xs text-blue-600">
                  CGT, CFDT, FO, CFE-CGC, CFTC, UNSA, FSU, Solidaires
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Problème de connexion ?{' '}
                <a 
                  href="mailto:support@justijob.fr" 
                  className="text-red-600 hover:underline font-medium"
                >
                  Contactez le support
                </a>
              </p>
            </div>

          </div>

          {/* Information partenariat */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Pas encore partenaire ?{' '}
              <a 
                href="mailto:partenariats@justijob.fr"
                className="text-blue-600 hover:underline font-semibold"
              >
                Rejoignez-nous
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
