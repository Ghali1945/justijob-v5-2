// ============================================
// FSU
// ============================================
'use client';

import SyndicatDashboard from '@/components/syndicats/SyndicatDashboard';

export default function FSUDashboard() {
  const syndicatInfo = {
    name: 'FSU',
    fullName: 'Fédération Syndicale Unitaire',
    email: 'fsu@justijob.fr',
    color: 'pink',
    stats: {
      totalMembers: 93,
      activeMembers: 18,
      newCases: 10,
      successRate: 86
    }
  };

  return <SyndicatDashboard syndicatInfo={syndicatInfo} />;
}
