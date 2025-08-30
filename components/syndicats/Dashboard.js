
'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  MapPin,
  Clock,
  Star,
  Gift,
  LogOut
} from 'lucide-react';

const Dashboard = ({ user, syndicat, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`bg-${color}-100 p-3 rounded-lg`}>
          <Icon className={`text-${color}-600`} size={24} />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const AlertCard = ({ alert }) => {
    const colors = {
      urgent: 'red',
      tendance: 'orange', 
      opportunite: 'green'
    };
    const color = colors[alert.type];
    
    return (
      <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}>
        <div className="flex items-center">
          <AlertTriangle className={`text-${color}-600 mr-3`} size={20} />
          <div className="flex-1">
            <p className={`text-${color}-800 font-medium`}>{alert.message}</p>
            <p className={`text-${color}-600 text-sm`}>{alert.count} cas détectés</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{syndicat.logo}</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{syndicat.nom}</h1>
                <p className="text-gray-600">Dashboard {user.role}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Connecté : {user.nom}
              </span>
              <button
                onClick={onLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
              >
                <LogOut className="mr-2" size={16} />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vue d'ensemble */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Adhérents Actifs"
            value={syndicat.adherents_actifs}
            subtitle={`sur ${syndicat.adherents_total} total`}
            color="blue"
          />
          <StatCard
            icon={FileText}
            title="Dossiers ce mois"
            value={syndicat.stats.dossiers_ce_mois}
            subtitle={`${syndicat.stats.dossiers_urgents} urgents`}
            color="green"
          />
          <StatCard
            icon={DollarSign}
            title="Revenus syndicat"
            value={`${syndicat.stats.revenue_syndicat_mois}€`}
            subtitle="Commission ce mois"
            color="purple"
          />
          <StatCard
            icon={Star}
            title="Satisfaction"
            value={`${syndicat.stats.satisfaction}%`}
            subtitle={`${syndicat.stats.taux_reussite}% succès`}
            color="yellow"
          />
        </div>

        {/* Alertes */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="mr-2 text-red-600" size={24} />
            Alertes & Tendances
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {syndicat.alertes.map((alert, index) => (
              <AlertCard key={index} alert={alert} />
            ))}
          </div>
        </div>

        {/* Dossiers récents */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FileText className="mr-2 text-blue-600" size={24} />
              Dossiers Récents
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adhérent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Problème</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Potentiel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {syndicat.dossiers_recents.map((dossier) => (
                  <tr key={dossier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dossier.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dossier.adherent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dossier.entreprise}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dossier.probleme}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        dossier.score >= 80 ? 'bg-green-100 text-green-800' :
                        dossier.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {dossier.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dossier.montant_potentiel.toLocaleString()}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        dossier.statut === 'urgent' ? 'bg-red-100 text-red-800' :
                        dossier.statut === 'en_cours' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {dossier.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Codes promo */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Gift className="mr-2 text-purple-600" size={24} />
              Codes Promo Actifs
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {syndicat.codes_promo.map((code, index) => (
                <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-lg font-bold text-purple-800">{code.code}</span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                      -{code.reduction}%
                    </span>
                  </div>
                  <p className="text-sm text-purple-600">
                    Utilisé {code.usage}/{code.limite} fois
                  </p>
                  <div className="mt-2 bg-purple-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{width: `${(code.usage / code.limite) * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;