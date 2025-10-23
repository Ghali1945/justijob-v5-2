'use client';

import SyndicatDashboard from '@/components/syndicats/SyndicatDashboard';

export default function CGTDashboard() {
  const syndicatInfo = {
    name: 'CGT',
    fullName: 'Confédération Générale du Travail',
    email: 'cgt@justijob.fr',
    color: 'red',
    stats: {
      totalMembers: 156,
      activeMembers: 23,
      newCases: 18,
      successRate: 89
    }
  };

  return <SyndicatDashboard syndicatInfo={syndicatInfo} />;
}
