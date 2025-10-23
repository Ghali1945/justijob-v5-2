// ============================================
// CFE-CGC
// ============================================
'use client';

import SyndicatDashboard from '@/components/syndicats/SyndicatDashboard';

export default function CFECGCDashboard() {
  const syndicatInfo = {
    name: 'CFE-CGC',
    fullName: 'Confédération Française de l\'Encadrement - CGC',
    email: 'cfe-cgc@justijob.fr',
    color: 'blue',
    stats: {
      totalMembers: 98,
      activeMembers: 19,
      newCases: 9,
      successRate: 93
    }
  };

  return <SyndicatDashboard syndicatInfo={syndicatInfo} />;
}
