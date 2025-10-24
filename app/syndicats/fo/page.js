'use client';

import Link from 'next/link';

export default function FODashboard() {
  const syndicatInfo = {
    name: 'FO',
    fullName: 'Force Ouvriere',
    email: 'fo@justijob.fr',
    color: 'amber',
    stats: {
      totalMembers: 1356,
      activeMembers: 967,
      newCases: 38,
      successRate: 85
    }
  };

  const recentActivities = [
    { id: 1, user: 'Michel R.', action: 'Nouveau membre', time: 'Il y a 2h' },
    { id: 2, user: 'Isabelle G.', action: 'Dossier cree', time: 'Il y a 4h' },
    { id: 3, user: 'François T.', action: 'Diagnostic complete', time: 'Il y a 8h' },
    { id: 4, user: 'Catherine L.', action: 'Documents generes', time: 'Il y a 1j' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">
      
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/syndicats"
                className="inline-flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
              >
                Deconnexion
              </Link>
              <div className="h-8 w-px bg-white/30"></div>
              <div>
                <h1 className="text-2xl font-bold">{syndicatInfo.name}</h1>
                <p className="text-sm opacity-90">{syndicatInfo.fullName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Connecte en tant que</p>
              <p className="font-semibold">{syndicatInfo.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <span className="text-amber-600 text-sm font-semibold">+10%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              {syndicatInfo.stats.totalMembers}
            </h3>
            <p className="text-gray-600 text-sm">Membres total</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <span className="text-green-600 text-sm font-semibold">+7%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              {syndicatInfo.stats.activeMembers}
            </h3>
            <p className="text-gray-600 text-sm">Actifs ce mois</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-2xl">📄</span>
              </div>
              <span className="text-blue-600 text-sm font-semibold">+13%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              {syndicatInfo.stats.newCases}
            </h3>
            <p className="text-gray-600 text-sm">Nouveaux dossiers</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
              <span className="text-purple-600 text-sm font-semibold">+2%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              {syndicatInfo.stats.successRate}%
            </h3>
            <p className="text-gray-600 text-sm">Taux de succes</p>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>⚡</span>
              Dernieres activites
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span>👤</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>⚙️</span>
              Actions rapides
            </h2>
            <div className="space-y-3">
              <button className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors font-semibold text-left flex items-center gap-3">
                <span>👥</span>
                Gerer les membres
              </button>
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-left flex items-center gap-3">
                <span>📊</span>
                Voir les statistiques
              </button>
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-left flex items-center gap-3">
                <span>📄</span>
                Documents
              </button>
              <button className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-semibold text-left flex items-center gap-3">
                <span>⚙️</span>
                Parametres
              </button>
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800 font-medium mb-2">
                💡 Astuce du jour
              </p>
              <p className="text-xs text-amber-700">
                Utilisez JustiJob pour accompagner vos adherents dans leurs demarches juridiques !
              </p>
            </div>
          </div>

        </div>

        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>📈</span>
            Evolution mensuelle
          </h2>
          <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-400 text-sm">Graphique des statistiques a venir</p>
          </div>
        </div>

      </div>
    </div>
  );
}
