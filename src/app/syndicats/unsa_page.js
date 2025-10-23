// ============================================
// UNSA
// ============================================
'use client';

import SyndicatDashboard from '@/components/syndicats/SyndicatDashboard';

export default function UNSADashboard() {
  const syndicatInfo = {
    name: 'UNSA',
    fullName: 'Union Nationale des Syndicats Autonomes',
    email: 'unsa@justijob.fr',
    color: 'indigo',
    stats: {
      totalMembers: 76,
      activeMembers: 14,
      newCases: 7,
      successRate: 90
    }
  };

  return <SyndicatDashboard syndicatInfo={syndicatInfo} />;
}
