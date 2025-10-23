'use client';

import SyndicatDashboard from '@/components/syndicats/SyndicatDashboard';

export default function CFDTDashboard() {
  const syndicatInfo = {
    name: 'CFDT',
    fullName: 'Confédération Française Démocratique du Travail',
    email: 'cfdt@justijob.fr',
    color: 'green',
    stats: {
      totalMembers: 142,
      activeMembers: 31,
      newCases: 15,
      successRate: 91
    }
  };

  return <SyndicatDashboard syndicatInfo={syndicatInfo} />;
}
