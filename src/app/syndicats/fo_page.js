// ============================================
// FORCE OUVRIÈRE (FO)
// ============================================
'use client';

import SyndicatDashboard from '@/components/syndicats/SyndicatDashboard';

export default function FODashboard() {
  const syndicatInfo = {
    name: 'FO',
    fullName: 'Force Ouvrière',
    email: 'fo@justijob.fr',
    color: 'orange',
    stats: {
      totalMembers: 128,
      activeMembers: 27,
      newCases: 12,
      successRate: 87
    }
  };

  return <SyndicatDashboard syndicatInfo={syndicatInfo} />;
}
