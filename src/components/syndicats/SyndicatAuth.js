
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SyndicatAuth() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Identifiants des syndicats partenaires
  const syndicatCredentials = {
    'cgt@justijob.fr': { password: 'CGT2024', name: 'CGT', dashboard: '/syndicats/cgt' },
    'cfdt@justijob.fr': { password: 'CFDT2024', name: 'CFDT', dashboard: '/syndicats/cfdt' },
    'fo@justijob.fr': { password: 'FO2024', name: 'FO', dashboard: '/syndicats/fo' },
    'cfe-cgc@justijob.fr': { password: 'CFECGC2024', name: 'CFE-CGC', dashboard: '/syndicats/cfe-cgc' },
    'cftc@justijob.fr': { password: 'CFTC2024', name: 'CFTC', dashboard: '/syndicats/cftc' },
    'unsa@justijob.fr': { password: 'UNSA2024', name: 'UNSA', dashboard: '/syndicats/unsa' },
    'fsu@justijob.fr': { password: 'FSU2024', name: 'FSU', dashboard: '/syndicats/fsu' },
    'solidaires@justijob.fr': { password: 'SOLIDAIRES2024', name: 'Solidaires', dashboard: '/syndicats/solidaires' }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulation d'un délai de vérification
    await new Promise(resolve => setTimeout(resolve, 800));

    const syndicat = syndicatCredentials[credentials.email.toLowerCase()];

    if (syndicat && syndicat.password === credentials.password) {
      // Connexion réussie - Redirection vers le tableau de bord du syndicat
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
    <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Accès Syndical
          </h1>
          <p className="text-gray-600">
            Espace réservé aux syndicats partenaires
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email du syndicat
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              placeholder="exemple@syndicat.fr"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Vous êtes un syndicat et souhaitez devenir partenaire ?
            <br />
            Contactez-nous à{' '}
            <a href="mailto:partenariats@justijob.fr" className="text-red-600 hover:underline">
              partenariats@justijob.fr
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
