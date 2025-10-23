'use client';

import Link from 'next/link';
import { FiArrowLeft, FiUsers, FiFileText, FiTrendingUp, FiActivity, FiSettings, FiBarChart2 } from 'react-icons/fi';

export default function SyndicatDashboard({ syndicatInfo }) {
  const {
    name,
    fullName,
    email,
    color = 'red',
    stats = {
      totalMembers: 0,
      activeMembers: 0,
      newCases: 0,
      successRate: 0
    }
  } = syndicatInfo;

  // Activités récentes simulées
  const recentActivities = [
    { id: 1, type: 'nouveau', user: 'Jean D.', action: 'Nouveau membre', time: 'Il y a 2h' },
    { id: 2, type: 'dossier', user: 'Marie L.', action: 'Dossier créé', time: 'Il y a 5h' },
    { id: 3, type: 'diagnostic', user: 'Pierre M.', action: 'Diagnostic complété', time: 'Il y a 1j' },
    { id: 4, type: 'document', user: 'Sophie B.', action: 'Documents générés', time: 'Il y a 2j' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      
      {/* En-tête */}
      <div className={`bg-gradient-to-r from-${color}-600 to-${color}-700 text-white shadow-lg`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/syndicats"
                className="inline-flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
              >
                <FiArrowLeft />
                <span className="font-medium">Déconnexion</span>
              </Link>
              <div className="h-8 w-px bg-white/30"></div>
              <div>
                <h1 className="text-2xl font-bold">{name}</h1>
                <p className="text-sm opacity-90">{fullName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Connecté en tant que</p>
              <p className="font-semibold">{email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          
          {/* Total membres */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`bg-${color}-100 p-3 rounded-lg`}>
                <FiUsers className={`text-2xl text-${color}-600`} />
              </div>
              <span className={`text-${color}-600 text-sm font-semibold`}>+12%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              {stats.totalMembers}
            </h3>
            <p className="text-gray-600 text-sm">Membres total</p>
          </div>

          {/* Membres actifs */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FiActivity className="text-2xl text-green-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold">+8%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              {stats.activeMembers}
            </h3>
            <p className="text-gray-600 text-sm">Actifs ce mois</p>
          </div>

          {/* Nouveaux dossiers */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FiFileText className="text-2xl text-blue-600" />
              </div>
              <span className="text-blue-600 text-sm font-semibold">+15%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              {stats.newCases}
            </h3>
            <p className="text-gray-600 text-sm">Nouveaux dossiers</p>
          </div>

          {/* Taux de succès */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FiTrendingUp className="text-2xl text-purple-600" />
              </div>
              <span className="text-purple-600 text-sm font-semibold">+3%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              {stats.successRate}%
            </h3>
            <p className="text-gray-600 text-sm">Taux de succès</p>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Activités récentes */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FiActivity className={`text-${color}-600`} />
              Dernières activités
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                    {activity.type === 'nouveau' && <FiUsers className={`text-${color}-600`} />}
                    {activity.type === 'dossier' && <FiFileText className={`text-${color}-600`} />}
                    {activity.type === 'diagnostic' && <FiBarChart2 className={`text-${color}-600`} />}
                    {activity.type === 'document' && <FiFileText className={`text-${color}-600`} />}
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

          {/* Actions rapides */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FiSettings className={`text-${color}-600`} />
              Actions rapides
            </h2>
            <div className="space-y-3">
              <button className={`w-full bg-${color}-600 text-white py-3 px-4 rounded-lg hover:bg-${color}-700 transition-colors font-semibold text-left flex items-center gap-3`}>
                <FiUsers />
                Gérer les membres
              </button>
              <button className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-left flex items-center gap-3`}>
                <FiBarChart2 />
                Voir les statistiques
              </button>
              <button className={`w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-left flex items-center gap-3`}>
                <FiFileText />
                Documents
              </button>
              <button className={`w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-semibold text-left flex items-center gap-3`}>
                <FiSettings />
                Paramètres
              </button>
            </div>

            <div className={`mt-6 p-4 bg-${color}-50 rounded-lg border border-${color}-200`}>
              <p className={`text-sm text-${color}-800 font-medium mb-2`}>
                💡 Astuce du jour
              </p>
              <p className={`text-xs text-${color}-700`}>
                Utilisez JustiJob pour accompagner vos adhérents dans leurs démarches juridiques !
              </p>
            </div>
          </div>

        </div>

        {/* Graphique placeholder */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FiTrendingUp className={`text-${color}-600`} />
            Évolution mensuelle
          </h2>
          <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-400 text-sm">Graphique des statistiques (à venir)</p>
          </div>
        </div>

      </div>
    </div>
  );
}
