// ============================================
// CFTC
// ============================================
'use client';

import SyndicatDashboard from '@/components/syndicats/SyndicatDashboard';

export default function CFTCDashboard() {
  const syndicatInfo = {
    name: 'CFTC',
    fullName: 'Confédération Française des Travailleurs Chrétiens',
    email: 'cftc@justijob.fr',
    color: 'purple',
    stats: {
      totalMembers: 87,
      activeMembers: 16,
      newCases: 8,
      successRate: 88
    }
  };

  return <SyndicatDashboard syndicatInfo={syndicatInfo} />;
}
