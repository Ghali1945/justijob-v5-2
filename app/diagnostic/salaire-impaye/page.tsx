'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FormData {
  // ÉTAPE 1 : Informations générales
  typeContrat: string;
  anciennete: string;
  salaireBrutMensuel: string;
  dernierJourTravaille: string;
  
  // ÉTAPE 2 : Détails du non-paiement
  periodeImpayee: string;
  elementsImpayes: string[];
  montantTotalDu: string;
  datePaiementPrevu: string;
  nombreMoisImpayes: string;
  
  // ÉTAPE 3 : Contexte et circonstances
  raisonInvoquee: string;
  situationEntreprise: string;
  autresSalariesConcernes: string;
  demarchesEffectuees: string[];
  
  // ÉTAPE 4 : Preuves disponibles
  preuvesDisponibles: string[];
  qualitePreuves: string;
  
  // ÉTAPE 5 : Réclamations et suite
  reclamationsEcrites: string;
  reponseEmployeur: string;
  ruptureContrat: string;
  procedurePrudhomale: string;
}

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function DiagnosticSalaireImpaye() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    // Étape 1
    typeContrat: '',
    anciennete: '',
    salaireBrutMensuel: '',
    dernierJourTravaille: '',
    
    // Étape 2
    periodeImpayee: '',
    elementsImpayes: [],
    montantTotalDu: '',
    datePaiementPrevu: '',
    nombreMoisImpayes: '',
    
    // Étape 3
    raisonInvoquee: '',
    situationEntreprise: '',
    autresSalariesConcernes: '',
    demarchesEffectuees: [],
    
    // Étape 4
    preuvesDisponibles: [],
    qualitePreuves: '',
    
    // Étape 5
    reclamationsEcrites: '',
    reponseEmployeur: '',
    ruptureContrat: '',
    procedurePrudhomale: '',
  });

  // ============================================================================
  // FONCTIONS UTILITAIRES
  // ============================================================================

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof FormData, value: string) => {
    const currentValues = formData[field] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setFormData(prev => ({ ...prev, [field]: newValues }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ============================================================================
  // CALCUL DU SCORE
  // ============================================================================

  const calculateScore = () => {
    let score = 0;

    // 1. PREUVES DOCUMENTAIRES (35 points)
    const preuvesPoints: { [key: string]: number } = {
      'Contrat de travail signé': 8,
      'Bulletins de salaire des mois impayés': 10,
      'Courriers recommandés ou emails': 6,
      'Relevés bancaires': 5,
      'Mise en demeure envoyée': 4,
      'Témoignages de collègues': 2,
    };
    
    formData.preuvesDisponibles.forEach(preuve => {
      score += preuvesPoints[preuve] || 0;
    });

    // Qualité des preuves
    const qualiteBonus = {
      'Excellente - Documents originaux complets': 5,
      'Bonne - La plupart des documents': 3,
      'Moyenne - Quelques documents': 1,
      'Faible - Peu de documents': 0,
    };
    score += qualiteBonus[formData.qualitePreuves as keyof typeof qualiteBonus] || 0;

    // 2. MONTANT ET ANCIENNETÉ (25 points)
    const montant = parseFloat(formData.montantTotalDu) || 0;
    if (montant >= 10000) score += 15;
    else if (montant >= 5000) score += 12;
    else if (montant >= 3000) score += 9;
    else if (montant >= 1500) score += 6;
    else score += 3;

    const anciennitePoints = {
      'Plus de 5 ans': 10,
      'Entre 2 et 5 ans': 7,
      'Entre 1 et 2 ans': 5,
      'Entre 6 mois et 1 an': 3,
      'Moins de 6 mois': 1,
    };
    score += anciennitePoints[formData.anciennete as keyof typeof anciennitePoints] || 0;

    // 3. GRAVITÉ DU MANQUEMENT (25 points)
    const nombreMois = parseInt(formData.nombreMoisImpayes) || 0;
    if (nombreMois >= 4) score += 15;
    else if (nombreMois >= 3) score += 12;
    else if (nombreMois >= 2) score += 9;
    else score += 6;

    const elementsImpayes = formData.elementsImpayes.length;
    score += Math.min(elementsImpayes * 2, 10);

    // 4. CONTEXTE FAVORABLE (15 points)
    const demarchesPoints = {
      'Réclamation orale': 2,
      'Email ou courrier simple': 3,
      'Mise en demeure recommandée': 5,
      'Saisine de l\'inspection du travail': 3,
      'Prise de contact avec un avocat': 2,
    };
    
    formData.demarchesEffectuees.forEach(demarche => {
      score += demarchesPoints[demarche as keyof typeof demarchesPoints] || 0;
    });

    return Math.min(Math.round(score), 100);
  };

  // ============================================================================
  // CALCULS FINANCIERS
  // ============================================================================

  const calculateFinancialImpact = () => {
    const montantDu = parseFloat(formData.montantTotalDu) || 0;
    const nombreMois = parseInt(formData.nombreMoisImpayes) || 1;
    
    // Calcul des intérêts légaux (environ 4.3% annuel)
    const tauxInteret = 0.043;
    const dureeEnMois = nombreMois;
    const interetsLegaux = montantDu * (tauxInteret / 12) * dureeEnMois;
    
    // Dommages et intérêts selon la gravité
    let dommagesInterets = 0;
    if (nombreMois >= 4) {
      dommagesInterets = montantDu * 0.20; // 20% pour manquement grave
    } else if (nombreMois >= 3) {
      dommagesInterets = montantDu * 0.15; // 15%
    } else if (nombreMois >= 2) {
      dommagesInterets = montantDu * 0.10; // 10%
    } else {
      dommagesInterets = montantDu * 0.05; // 5%
    }
    
    const totalRecuperable = montantDu + interetsLegaux + dommagesInterets;
    
    return {
      montantDu,
      interetsLegaux,
      dommagesInterets,
      totalRecuperable,
    };
  };

  // ============================================================================
  // RECOMMANDATIONS PERSONNALISÉES
  // ============================================================================

  const getRecommendations = () => {
    const score = calculateScore();
    const nombreMois = parseInt(formData.nombreMoisImpayes) || 1;
    const hasStrongProof = formData.preuvesDisponibles.includes('Contrat de travail signé') &&
                           formData.preuvesDisponibles.includes('Bulletins de salaire des mois impayés');
    
    const recommendations = [];

    if (score >= 75) {
      recommendations.push({
        icon: '⚖️',
        title: 'Dossier solide - Action immédiate recommandée',
        description: 'Votre situation présente tous les éléments pour une action en justice réussie.',
        priority: 'high',
      });
    }

    if (!formData.demarchesEffectuees.includes('Mise en demeure recommandée')) {
      recommendations.push({
        icon: '📮',
        title: 'Envoyez une mise en demeure',
        description: 'Élément indispensable avant toute action en justice. Modèle disponible dans votre dossier.',
        priority: 'high',
      });
    }

    if (nombreMois >= 2) {
      recommendations.push({
        icon: '⚠️',
        title: 'Urgence - Délais de prescription',
        description: 'Le délai de prescription est de 3 ans. Agissez rapidement pour préserver vos droits.',
        priority: 'high',
      });
    }

    if (!hasStrongProof) {
      recommendations.push({
        icon: '📑',
        title: 'Renforcez vos preuves',
        description: 'Rassemblez tous documents possibles : contrat, bulletins, emails, SMS.',
        priority: 'medium',
      });
    }

    if (formData.situationEntreprise === 'Difficultés financières graves') {
      recommendations.push({
        icon: '🏦',
        title: 'Vérifiez la procédure collective',
        description: 'Si l\'entreprise est en liquidation, déclarez rapidement votre créance.',
        priority: 'high',
      });
    }

    recommendations.push({
      icon: '👨‍⚖️',
      title: 'Conseil d\'un avocat spécialisé',
      description: 'Un avocat en droit du travail maximisera vos chances de succès.',
      priority: 'medium',
    });

    return recommendations;
  };

  // ============================================================================
  // RENDU CONDITIONNEL - PAGE DE RÉSULTATS
  // ============================================================================

  if (showResults) {
    const score = calculateScore();
    const financial = calculateFinancialImpact();
    const recommendations = getRecommendations();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  💰 Diagnostic Salaire Impayé
                </h1>
                <p className="text-gray-600 mt-2">Analyse complète de votre situation</p>
              </div>
              <Link 
                href="/diagnostic"
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
              >
                ← Retour
              </Link>
            </div>
          </div>
        </div>

        {/* Contenu des résultats */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Score principal */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Votre Score de Solidité Juridique
              </h2>
              <p className="text-gray-600">
                Basé sur {formData.preuvesDisponibles.length + formData.demarchesEffectuees.length} critères analysés
              </p>
            </div>

            <div className="flex justify-center items-center mb-8">
              {/* Cercle de score - CORRIGÉ POUR CENTRAGE */}
              <div className="relative w-64 h-64">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="#e5e7eb"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke={score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(score / 100) * 753.6} 753.6`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* CORRECTION : Ajout de inset-0 flex flex-col items-center justify-center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {score}
                  </div>
                  <div className="text-2xl text-gray-600 font-semibold">/100</div>
                  <div className="text-sm text-gray-500 mt-2 font-medium">
                    {score >= 75 ? 'Excellent' : score >= 50 ? 'Correct' : 'À renforcer'}
                  </div>
                </div>
              </div>
            </div>

            {/* Interprétation du score */}
            <div className={`p-6 rounded-xl ${
              score >= 75 ? 'bg-green-50 border-2 border-green-200' :
              score >= 50 ? 'bg-amber-50 border-2 border-amber-200' :
              'bg-red-50 border-2 border-red-200'
            }`}>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-3">
                {score >= 75 ? '✅' : score >= 50 ? '⚠️' : '❌'}
                {score >= 75 ? 'Dossier très solide' :
                 score >= 50 ? 'Dossier à renforcer' :
                 'Dossier nécessitant amélioration'}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {score >= 75 ? 
                  'Votre dossier présente de solides arguments juridiques et des preuves convaincantes. Vous avez d\'excellentes chances d\'obtenir gain de cause aux prud\'hommes.' :
                 score >= 50 ?
                  'Votre dossier contient des éléments favorables mais pourrait être renforcé. Suivez nos recommandations pour maximiser vos chances de succès.' :
                  'Votre dossier nécessite d\'être renforcé avant d\'engager une procédure. Concentrez-vous sur la collecte de preuves et les démarches préalables.'}
              </p>
            </div>
          </div>

          {/* Calculs financiers */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              💰 Montants récupérables estimés
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="text-sm text-blue-600 font-semibold mb-2">Salaire impayé</div>
                <div className="text-3xl font-bold text-blue-900">
                  {financial.montantDu.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </div>
              </div>

              <div className="p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
                <div className="text-sm text-purple-600 font-semibold mb-2">Intérêts légaux</div>
                <div className="text-3xl font-bold text-purple-900">
                  {financial.interetsLegaux.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </div>
                <div className="text-xs text-purple-600 mt-1">Taux légal ~4.3%</div>
              </div>

              <div className="p-6 bg-amber-50 rounded-xl border-2 border-amber-200">
                <div className="text-sm text-amber-600 font-semibold mb-2">Dommages et intérêts</div>
                <div className="text-3xl font-bold text-amber-900">
                  {financial.dommagesInterets.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </div>
                <div className="text-xs text-amber-600 mt-1">Selon gravité</div>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl border-2 border-green-300">
                <div className="text-sm text-green-700 font-semibold mb-2">TOTAL ESTIMÉ</div>
                <div className="text-4xl font-bold text-green-900">
                  {financial.totalRecuperable.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>💡 Note :</strong> Ces montants sont des estimations basées sur les informations fournies. 
                Les montants réels dépendront de la décision du conseil de prud'hommes et de votre situation spécifique.
              </p>
            </div>
          </div>

          {/* Recommandations personnalisées */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              🎯 Vos recommandations personnalisées
            </h2>

            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl border-2 ${
                    rec.priority === 'high'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{rec.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                        {rec.title}
                        {rec.priority === 'high' && (
                          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            URGENT
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-700">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Premium - BOUTON ROUGE ULTRA-VISIBLE */}
          <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl shadow-2xl p-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                📄 Obtenez votre dossier juridique complet
              </h2>
              <p className="text-blue-100 text-lg">
                Un dossier de 30 pages pour maximiser vos chances de succès
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl mb-3">⚖️</div>
                <h3 className="font-bold text-lg mb-2">Arguments juridiques</h3>
                <p className="text-blue-100 text-sm">
                  Articles de loi et jurisprudence pertinents
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl mb-3">📝</div>
                <h3 className="font-bold text-lg mb-2">Modèles de courriers</h3>
                <p className="text-blue-100 text-sm">
                  Mise en demeure, requête prud'homale
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-bold text-lg mb-2">Stratégie personnalisée</h3>
                <p className="text-blue-100 text-sm">
                  Plan d'action adapté à votre cas
                </p>
              </div>
            </div>

            {/* BOUTON ROUGE ULTRA-VISIBLE - CORRIGÉ DÈS LE DÉPART */}
            <Link
              href="/paiement"
              className="block w-full px-8 py-5 bg-red-600 hover:bg-red-700 text-white text-center rounded-xl font-bold border-4 border-red-800 shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
              style={{ fontSize: '20px' }}
            >
              ✓ VOIR MES RÉSULTATS
            </Link>

            <p className="text-center text-blue-100 mt-6 text-sm">
              💳 <strong>120€</strong> tarif standard • <strong>60€</strong> pour les membres d'organisations syndicales
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDU PRINCIPAL - FORMULAIRE PAR ÉTAPES
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                💰 Diagnostic Salaire Impayé
              </h1>
              <p className="text-gray-600 mt-2">Évaluez vos chances de récupération</p>
            </div>
            <Link 
              href="/diagnostic"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
            >
              ← Retour
            </Link>
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600">
              Étape {currentStep} sur 5
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / 5) * 100)}% complété
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-3 text-xs text-gray-500">
            <span className={currentStep >= 1 ? 'text-blue-600 font-semibold' : ''}>Infos</span>
            <span className={currentStep >= 2 ? 'text-blue-600 font-semibold' : ''}>Détails</span>
            <span className={currentStep >= 3 ? 'text-blue-600 font-semibold' : ''}>Contexte</span>
            <span className={currentStep >= 4 ? 'text-blue-600 font-semibold' : ''}>Preuves</span>
            <span className={currentStep >= 5 ? 'text-blue-600 font-semibold' : ''}>Suite</span>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* ÉTAPE 1 : Informations générales */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  📋 Informations générales
                </h2>
                <p className="text-gray-600">
                  Commençons par les informations de base sur votre situation
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quel est votre type de contrat ?
                </label>
                <div className="space-y-2">
                  {[
                    'CDI (Contrat à Durée Indéterminée)',
                    'CDD (Contrat à Durée Déterminée)',
                    'Contrat d\'intérim',
                    'Contrat d\'apprentissage ou professionnalisation',
                    'Autre',
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <input
                        type="radio"
                        name="typeContrat"
                        value={option}
                        checked={formData.typeContrat === option}
                        onChange={(e) => handleInputChange('typeContrat', e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quelle est votre ancienneté dans l'entreprise ?
                </label>
                <div className="space-y-2">
                  {[
                    'Moins de 6 mois',
                    'Entre 6 mois et 1 an',
                    'Entre 1 et 2 ans',
                    'Entre 2 et 5 ans',
                    'Plus de 5 ans',
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <input
                        type="radio"
                        name="anciennete"
                        value={option}
                        checked={formData.anciennete === option}
                        onChange={(e) => handleInputChange('anciennete', e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quel est votre salaire mensuel brut habituel ?
                </label>
                <input
                  type="number"
                  value={formData.salaireBrutMensuel}
                  onChange={(e) => handleInputChange('salaireBrutMensuel', e.target.value)}
                  placeholder="Ex: 2500"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
                <p className="mt-2 text-sm text-gray-500">
                  💡 Indiquez le montant en euros, avant prélèvements
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quel a été votre dernier jour de travail effectif ?
                </label>
                <input
                  type="date"
                  value={formData.dernierJourTravaille}
                  onChange={(e) => handleInputChange('dernierJourTravaille', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : Détails du non-paiement */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  💸 Détails du non-paiement
                </h2>
                <p className="text-gray-600">
                  Précisez les éléments de rémunération qui ne vous ont pas été versés
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Sur quelle période vos salaires sont-ils impayés ?
                </label>
                <input
                  type="text"
                  value={formData.periodeImpayee}
                  onChange={(e) => handleInputChange('periodeImpayee', e.target.value)}
                  placeholder="Ex: Janvier à Mars 2024"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Combien de mois de salaire sont impayés ?
                </label>
                <input
                  type="number"
                  value={formData.nombreMoisImpayes}
                  onChange={(e) => handleInputChange('nombreMoisImpayes', e.target.value)}
                  placeholder="Ex: 2"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quels éléments de rémunération sont impayés ? (plusieurs choix possibles)
                </label>
                <div className="space-y-2">
                  {[
                    'Salaire de base',
                    'Heures supplémentaires',
                    'Primes (13ème mois, objectifs, etc.)',
                    'Commissions',
                    'Indemnités de congés payés',
                    'Remboursement de frais professionnels',
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={formData.elementsImpayes.includes(option)}
                        onChange={() => handleCheckboxChange('elementsImpayes', option)}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quel est le montant total qui vous est dû ?
                </label>
                <input
                  type="number"
                  value={formData.montantTotalDu}
                  onChange={(e) => handleInputChange('montantTotalDu', e.target.value)}
                  placeholder="Ex: 5000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
                <p className="mt-2 text-sm text-gray-500">
                  💡 Montant brut total de tous les éléments impayés
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  À quelle date le premier salaire aurait-il dû être payé ?
                </label>
                <input
                  type="date"
                  value={formData.datePaiementPrevu}
                  onChange={(e) => handleInputChange('datePaiementPrevu', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : Contexte et circonstances */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  📝 Contexte et circonstances
                </h2>
                <p className="text-gray-600">
                  Ces informations nous aideront à évaluer la solidité de votre dossier
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quelle raison l'employeur a-t-il invoquée pour le non-paiement ?
                </label>
                <div className="space-y-2">
                  {[
                    'Aucune explication fournie',
                    'Difficultés financières temporaires',
                    'Contestation sur le montant',
                    'Problème administratif ou technique',
                    'Litige sur les heures travaillées',
                    'Autre raison',
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <input
                        type="radio"
                        name="raisonInvoquee"
                        value={option}
                        checked={formData.raisonInvoquee === option}
                        onChange={(e) => handleInputChange('raisonInvoquee', e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quelle est la situation actuelle de l'entreprise ?
                </label>
                <div className="space-y-2">
                  {[
                    'Activité normale apparente',
                    'Difficultés financières connues',
                    'Difficultés financières graves',
                    'Procédure collective en cours (sauvegarde, redressement)',
                    'Liquidation judiciaire',
                    'Entreprise fermée/disparue',
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <input
                        type="radio"
                        name="situationEntreprise"
                        value={option}
                        checked={formData.situationEntreprise === option}
                        onChange={(e) => handleInputChange('situationEntreprise', e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  D'autres salariés sont-ils également concernés par des impayés ?
                </label>
                <div className="space-y-2">
                  {[
                    'Oui, plusieurs autres salariés',
                    'Oui, quelques autres salariés',
                    'Non, je suis le seul concerné',
                    'Je ne sais pas',
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <input
                        type="radio"
                        name="autresSalariesConcernes"
                        value={option}
                        checked={formData.autresSalariesConcernes === option}
                        onChange={(e) => handleInputChange('autresSalariesConcernes', e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quelles démarches avez-vous déjà effectuées ? (plusieurs choix possibles)
                </label>
                <div className="space-y-2">
                  {[
                    'Réclamation orale',
                    'Email ou courrier simple',
                    'Mise en demeure recommandée',
                    'Saisine de l\'inspection du travail',
                    'Prise de contact avec un avocat',
                    'Aucune démarche pour l\'instant',
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={formData.demarchesEffectuees.includes(option)}
                        onChange={() => handleCheckboxChange('demarchesEffectuees', option)}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 4 : Preuves disponibles */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  📑 Preuves disponibles
                </h2>
                <p className="text-gray-600">
                  Les preuves sont essentielles pour établir vos droits et obtenir gain de cause
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quels documents pouvez-vous fournir ? (plusieurs choix possibles)
                </label>
                <div className="space-y-2">
                  {[
                    'Contrat de travail signé',
                    'Bulletins de salaire des mois impayés',
                    'Courriers recommandés ou emails',
                    'Relevés bancaires',
                    'Mise en demeure envoyée',
                    'Témoignages de collègues',
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={formData.preuvesDisponibles.includes(option)}
                        onChange={() => handleCheckboxChange('preuvesDisponibles', option)}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Comment évalueriez-vous la qualité de vos preuves ?
                </label>
                <div className="space-y-2">
                  {[
                    'Excellente - Documents originaux complets',
                    'Bonne - La plupart des documents',
                    'Moyenne - Quelques documents',
                    'Faible - Peu de documents',
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <input
                        type="radio"
                        name="qualitePreuves"
                        value={option}
                        checked={formData.qualitePreuves === option}
                        onChange={(e) => handleInputChange('qualitePreuves', e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
                <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                  💡 Conseil important
                </h3>
                <p className="text-amber-800 text-sm leading-relaxed">
                  Les bulletins de salaire et le contrat de travail sont les preuves les plus importantes. 
                  Si vous ne les avez pas, demandez-les par courrier recommandé avec accusé de réception. 
                  L'employeur a l'obligation de vous les fournir.
                </p>
              </div>
            </div>
          )}

          {/* ÉTAPE 5 : Réclamations et suite */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  🎯 Réclamations et suite envisagée
                </h2>
                <p className="text-gray-600">
                  Dernières informations pour compléter votre diagnostic
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Avez-vous effectué des réclamations écrites à votre employeur ?
                </label>
                <div className="space-y-2">
                  {[
                    'Oui, plusieurs fois par courrier recommandé',
                    'Oui, par email ou courrier simple',
                    'Non, seulement des réclamations orales',
                    'Non, aucune réclamation formelle',
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <input
                        type="radio"
                        name="reclamationsEcrites"
                        value={option}
                        checked={formData.reclamationsEcrites === option}
                        onChange={(e) => handleInputChange('reclamationsEcrites', e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quelle a été la réponse de l'employeur à vos réclamations ?
                </label>
                <div className="space-y-2">
                  {[
                    'Promesse de régularisation jamais tenue',
                    'Contestation du montant dû',
                    'Absence totale de réponse',
                    'Reconnaissance du dû mais incapacité de payer',
                    'Autre',
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <input
                        type="radio"
                        name="reponseEmployeur"
                        value={option}
                        checked={formData.reponseEmployeur === option}
                        onChange={(e) => handleInputChange('reponseEmployeur', e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Votre contrat de travail est-il toujours en cours ?
                </label>
                <div className="space-y-2">
                  {[
                    'Oui, je suis toujours en poste',
                    'Non, j\'ai démissionné',
                    'Non, j\'ai été licencié',
                    'Non, le contrat est arrivé à terme (CDD)',
                    'Autre situation',
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <input
                        type="radio"
                        name="ruptureContrat"
                        value={option}
                        checked={formData.ruptureContrat === option}
                        onChange={(e) => handleInputChange('ruptureContrat', e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Envisagez-vous de saisir le conseil de prud'hommes ?
                </label>
                <div className="space-y-2">
                  {[
                    'Oui, c\'est ma priorité',
                    'Oui, si nécessaire',
                    'J\'hésite encore',
                    'Non, je préfère négocier',
                    'Je ne sais pas',
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <input
                        type="radio"
                        name="procedurePrudhomale"
                        value={option}
                        checked={formData.procedurePrudhomale === option}
                        onChange={(e) => handleInputChange('procedurePrudhomale', e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  ⚖️ Bon à savoir
                </h3>
                <p className="text-blue-800 text-sm leading-relaxed mb-2">
                  Le délai de prescription pour réclamer des salaires impayés est de 3 ans à compter 
                  du jour où le salaire aurait dû être versé. Il est important d'agir rapidement.
                </p>
                <p className="text-blue-800 text-sm leading-relaxed">
                  La saisine du conseil de prud'hommes est gratuite et peut se faire sans avocat, 
                  bien qu'un avocat augmente significativement vos chances de succès.
                </p>
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
              >
                ← Étape précédente
              </button>
            )}
            {currentStep === 1 && <div />}
            
            <button
              onClick={nextStep}
              className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {currentStep === 5 ? 'Voir mon diagnostic →' : 'Étape suivante →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
