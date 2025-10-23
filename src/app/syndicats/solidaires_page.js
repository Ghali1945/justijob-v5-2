// ============================================
// SOLIDAIRES
// ============================================
'use client';

import SyndicatDashboard from '@/components/syndicats/SyndicatDashboard';

export default function SolidairesDashboard() {
  const syndicatInfo = {
    name: 'Solidaires',
    fullName: 'Union Syndicale Solidaires',
    email: 'solidaires@justijob.fr',
    color: 'yellow',
    stats: {
      totalMembers: 69,
      activeMembers: 13,
      newCases: 6,
      successRate: 85
    }
  };

  return <SyndicatDashboard syndicatInfo={syndicatInfo} />;
}
