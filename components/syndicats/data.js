
// ============================================
// 📁 src/components/syndicats/data.js
// DONNÉES UNIQUEMENT - PAS DE COMPOSANTS
// ============================================

export const DEMO_SYNDICATS = {
  'CGT-METAL-001': {
    nom: 'CGT Métallurgie Île-de-France',
    logo: '⚒️',
    territoire: ['75', '77', '78', '91', '92', '93', '94', '95'],
    secteur: 'Métallurgie & Automobile',
    adherents_total: 1247,
    adherents_actifs: 423,
    responsable: {
      nom: 'Marie Dupont',
      email: 'marie.dupont@cgt-metal.fr',
      telephone: '01.44.11.22.33'
    },
    users: [
      { email: 'marie.dupont@cgt-metal.fr', password: 'revolution2025', role: 'admin', nom: 'Marie Dupont' },
      { email: 'pierre.martin@cgt-metal.fr', password: 'solidarite2025', role: 'delegue', nom: 'Pierre Martin' },
      { email: 'sophie.bernard@cgt-metal.fr', password: 'justice2025', role: 'conseiller', nom: 'Sophie Bernard' }
    ],
    codes_promo: [
      { code: 'CGTMETAL50', reduction: 50, actif: true, usage: 23, limite: 1000 },
      { code: 'CGTNOEL25', reduction: 25, actif: true, usage: 5, limite: 100 },
      { code: 'CGTURGENT', reduction: 50, actif: true, usage: 12, limite: 50 }
    ],
    dossiers_recents: [
      { 
        id: 'JJ-2025-001', 
        adherent: 'Jean Dubois', 
        entreprise: 'Renault Flins',
        probleme: 'Licenciement abusif', 
        statut: 'urgent', 
        date: '2025-01-15',
        score: 87,
        montant_potentiel: 45000
      },
      { 
        id: 'JJ-2025-002', 
        adherent: 'Marie Leroux', 
        entreprise: 'PSA Poissy',
        probleme: 'Harcèlement moral', 
        statut: 'en_cours', 
        date: '2025-01-14',
        score: 72,
        montant_potentiel: 15000
      },
      { 
        id: 'JJ-2025-003', 
        adherent: 'Paul Durand', 
        entreprise: 'Airbus Toulouse',
        probleme: 'Heures sup impayées', 
        statut: 'nouveau', 
        date: '2025-01-13',
        score: 95,
        montant_potentiel: 8500
      }
    ],
    stats: {
      dossiers_ce_mois: 23,
      dossiers_urgents: 5,
      taux_reussite: 87,
      economie_moyenne: 1910, // vs 2000€ avocat
      satisfaction: 94,
      nouveaux_adherents_mois: 12,
      revenue_syndicat_mois: 1380 // 15€ commission × 92 dossiers
    },
    alertes: [
      { type: 'urgent', message: 'Pic de licenciements chez Renault Flins', count: 3 },
      { type: 'tendance', message: 'Augmentation harcèlement secteur auto', count: 7 },
      { type: 'opportunite', message: 'Action collective possible PSA', count: 12 }
    ]
  },
  'CFDT-SERVICES-002': {
    nom: 'CFDT Services Île-de-France',
    logo: '🏢',
    territoire: ['75', '92', '93', '94'],
    secteur: 'Services & Tertiaire',
    adherents_total: 892,
    adherents_actifs: 267,
    responsable: {
      nom: 'Jean Moreau',
      email: 'jean.moreau@cfdt-services.fr',
      telephone: '01.55.33.44.55'
    },
    users: [
      { email: 'jean.moreau@cfdt-services.fr', password: 'innovation2025', role: 'admin', nom: 'Jean Moreau' },
      { email: 'alice.petit@cfdt-services.fr', password: 'efficacite2025', role: 'delegue', nom: 'Alice Petit' }
    ],
    codes_promo: [
      { code: 'CFDTSERV50', reduction: 50, actif: true, usage: 18, limite: 500 }
    ],
    dossiers_recents: [
      { 
        id: 'JJ-2025-004', 
        adherent: 'Claire Martin', 
        entreprise: 'BNP Paribas',
        probleme: 'Discrimination salariale', 
        statut: 'en_cours', 
        date: '2025-01-12',
        score: 78,
        montant_potentiel: 25000
      }
    ],
    stats: {
      dossiers_ce_mois: 18,
      dossiers_urgents: 2,
      taux_reussite: 91,
      economie_moyenne: 1950,
      satisfaction: 96,
      nouveaux_adherents_mois: 8,
      revenue_syndicat_mois: 975
    },
    alertes: [
      { type: 'tendance', message: 'Télétravail disputes en hausse', count: 5 }
    ]
  }
};