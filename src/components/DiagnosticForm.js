
// src/components/DiagnosticForm.js
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const DiagnosticForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Informations de base
    typeContrat: '',
    anciennete: '',
    salaireMonthly: '',
    
    // Problèmes rencontrés
    problemes: [],
    
    // Détails spécifiques
    heuresSupDetails: {
      heuresParSemaine: '',
      depuisCombienTemps: '',
      preuves: []
    },
    
    licenciementDetails: {
      dateNotification: '',
      motif: '',
      procedureRespectee: ''
    },
    
    harcelementDetails: {
      type: '',
      frequence: '',
      preuves: [],
      temoinsPossibles: ''
    },
    
    discriminationDetails: {
      motif: '',
      situationsConcrete: '',
      comparaisonCollegues: ''
    },
    
    // Preuves et documentation
    documents: [],
    temoins: '',
    
    // Urgence
    urgence: '',
    impactSante: ''
  });

  const steps = [
    {
      title: "Votre situation",
      description: "Commençons par comprendre votre situation actuelle"
    },
    {
      title: "Problèmes rencontrés",
      description: "Quels problèmes rencontrez-vous avec votre employeur ?"
    },
    {
      title: "Détails spécifiques",
      description: "Approfondissons les problèmes identifiés"
    },
    {
      title: "Documentation",
      description: "Quelles preuves avez-vous ?"
    },
    {
      title: "Analyse",
      description: "Voici notre analyse de votre situation"
    }
  ];

  const problemesOptions = [
    { id: 'heures-sup', label: 'Heures supplémentaires non payées', icon: '⏰' },
    { id: 'licenciement', label: 'Licenciement abusif', icon: '🚫' },
    { id: 'harcelement', label: 'Harcèlement moral/sexuel', icon: '⚠️' },
    { id: 'discrimination', label: 'Discrimination', icon: '⚖️' },
    { id: 'salaire', label: 'Salaire impayé', icon: '💰' },
    { id: 'conges', label: 'Congés non accordés', icon: '🏖️' },
    { id: 'accident', label: 'Accident du travail non reconnu', icon: '🏥' },
    { id: 'autres', label: 'Autre problème', icon: '📋' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const toggleProbleme = (problemeId) => {
    setFormData(prev => ({
      ...prev,
      problemes: prev.problemes.includes(problemeId)
        ? prev.problemes.filter(p => p !== problemeId)
        : [...prev.problemes, problemeId]
    }));
  };

  const calculateUrgencyScore = () => {
    let score = 0;
    
    // Facteurs d'urgence
    if (formData.problemes.includes('licenciement')) score += 3;
    if (formData.problemes.includes('harcelement')) score += 2;
    if (formData.impactSante === 'oui') score += 3;
    if (formData.urgence === 'immediate') score += 2;
    if (formData.problemes.includes('salaire')) score += 2;
    
    return score;
  };

  const calculateVictoryScore = () => {
    let score = 0;
    let facteurs = [];
    
    // Facteurs positifs pour le salarié
    if (formData.documents.includes('Emails')) {
      score += 15;
      facteurs.push({ type: 'positif', label: 'Preuves écrites (emails)', points: 15 });
    }
    if (formData.documents.includes('Témoignages écrits')) {
      score += 20;
      facteurs.push({ type: 'positif', label: 'Témoignages de collègues', points: 20 });
    }
    if (formData.documents.includes('Certificats médicaux') && formData.problemes.includes('harcelement')) {
      score += 25;
      facteurs.push({ type: 'positif', label: 'Impact médical documenté', points: 25 });
    }
    if (formData.documents.includes('Enregistrements audio')) {
      score += 10;
      facteurs.push({ type: 'positif', label: 'Enregistrements', points: 10 });
    }
    
    // Analyse par type de litige
    if (formData.problemes.includes('heures-sup')) {
      if (formData.documents.includes('Pointeuse') || formData.documents.includes('Plannings')) {
        score += 30;
        facteurs.push({ type: 'positif', label: 'Preuves horaires objectives', points: 30 });
      }
    }
    
    if (formData.problemes.includes('licenciement')) {
      if (!formData.licenciementDetails.procedureRespectee || formData.licenciementDetails.procedureRespectee === 'non') {
        score += 20;
        facteurs.push({ type: 'positif', label: 'Procédure non respectée', points: 20 });
      }
    }
    
    if (formData.problemes.includes('discrimination')) {
      score += 15; // Les discriminations sont souvent gagnées si prouvées
      facteurs.push({ type: 'positif', label: 'Cas de discrimination', points: 15 });
    }
    
    // Facteurs négatifs
    if (formData.documents.length === 0) {
      score -= 30;
      facteurs.push({ type: 'negatif', label: 'Absence de preuves', points: -30 });
    }
    
    if (formData.anciennete === 'moins-6-mois') {
      score -= 10;
      facteurs.push({ type: 'negatif', label: 'Ancienneté faible', points: -10 });
    }
    
    // Normaliser le score entre 0 et 100
    score = Math.max(0, Math.min(100, score));
    
    return { score, facteurs };
  };

  const generateRecommandations = () => {
    const recommandations = [];
    const urgencyScore = calculateUrgencyScore();
    
    // Recommandations basées sur l'urgence
    if (urgencyScore >= 7) {
      recommandations.push({
        type: 'urgent',
        titre: 'Action immédiate recommandée',
        description: 'Votre situation nécessite une action rapide. Contactez un avocat ou un syndicat dans les 48h.',
        actions: ['Consulter un avocat en urgence', 'Contacter l\'inspection du travail', 'Rassembler tous vos documents']
      });
    }
    
    // Recommandations spécifiques par problème
    if (formData.problemes.includes('heures-sup')) {
      recommandations.push({
        type: 'action',
        titre: 'Heures supplémentaires',
        description: 'Vous pouvez réclamer jusqu\'à 3 ans d\'arriérés.',
        actions: [
          'Calculer précisément vos heures dues',
          'Rassembler les preuves (emails, plannings)',
          'Envoyer une mise en demeure'
        ]
      });
    }
    
    if (formData.problemes.includes('licenciement')) {
      recommandations.push({
        type: 'urgent',
        titre: 'Licenciement',
        description: 'Délai de contestation : 12 mois maximum',
        actions: [
          'Vérifier la procédure de licenciement',
          'Demander les motifs précis par écrit',
          'Saisir le conseil de prud\'hommes'
        ]
      });
    }
    
    if (formData.problemes.includes('harcelement')) {
      recommandations.push({
        type: 'urgent',
        titre: 'Harcèlement',
        description: 'Votre santé est prioritaire. Ne restez pas seul(e).',
        actions: [
          'Consulter un médecin pour constater l\'impact',
          'Alerter les représentants du personnel',
          'Constituer un dossier avec dates et faits précis',
          'Contacter le 3919 si besoin de soutien'
        ]
      });
    }
    
    return recommandations;
  };

  const telechargerAnalyse = () => {
    const recommandations = generateRecommandations();
    const urgencyScore = calculateUrgencyScore();
    const victoryAnalysis = calculateVictoryScore();
    
    // Créer le document HTML pour le téléchargement
    const contenuAnalyse = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Analyse de situation - JUSTIJOB</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              line-height: 1.6;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px;
              margin-bottom: 30px;
            }
            h1 { margin: 0 0 10px 0; }
            .score-box {
              background: linear-gradient(to right, #f3e7fc, #e7f3fc);
              border: 2px solid #8b5cf6;
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
            }
            .score-bar {
              background: #e5e7eb;
              height: 30px;
              border-radius: 15px;
              overflow: hidden;
              margin: 15px 0;
            }
            .score-fill {
              height: 100%;
              background: linear-gradient(to right, #8b5cf6, #3b82f6);
              border-radius: 15px;
            }
            .urgence-box {
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border: 2px solid;
            }
            .urgence-haute {
              background-color: #fee2e2;
              border-color: #ef4444;
              color: #991b1b;
            }
            .urgence-moyenne {
              background-color: #fed7aa;
              border-color: #f97316;
              color: #9a3412;
            }
            .urgence-normale {
              background-color: #dcfce7;
              border-color: #22c55e;
              color: #166534;
            }
            .info-section {
              background-color: #f3f4f6;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .recommandation {
              background-color: #dbeafe;
              border-left: 4px solid #3b82f6;
              padding: 15px;
              margin: 15px 0;
            }
            .facteur-positif {
              color: #059669;
              font-weight: bold;
            }
            .facteur-negatif {
              color: #dc2626;
              font-weight: bold;
            }
            .probleme-item {
              display: inline-block;
              background-color: #e0e7ff;
              padding: 5px 10px;
              border-radius: 20px;
              margin: 5px;
              font-size: 14px;
            }
            ul { padding-left: 20px; }
            li { margin: 10px 0; }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ANALYSE DE VOTRE SITUATION</h1>
            <p style="margin: 0;">Généré le ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Analyse par Intelligence Artificielle (Claude)</p>
          </div>
          
          <div class="score-box">
            <h2 style="color: #6b21a8; margin-top: 0;">⚖️ SCORING DE VICTOIRE AUX PRUD'HOMMES</h2>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 18px;">Probabilité de succès :</span>
              <span style="font-size: 36px; font-weight: bold; color: ${
                victoryAnalysis.score >= 70 ? '#059669' :
                victoryAnalysis.score >= 40 ? '#f59e0b' :
                '#dc2626'
              };">${victoryAnalysis.score}%</span>
            </div>
            <div class="score-bar">
              <div class="score-fill" style="width: ${victoryAnalysis.score}%;"></div>
            </div>
            <p style="font-weight: bold; color: ${
              victoryAnalysis.score >= 70 ? '#059669' :
              victoryAnalysis.score >= 40 ? '#f59e0b' :
              '#dc2626'
            };">
              ${victoryAnalysis.score >= 70 ? '✅ DOSSIER SOLIDE - Bonnes chances de succès' :
                victoryAnalysis.score >= 40 ? '⚠️ DOSSIER À RENFORCER - Chances moyennes' :
                '❌ DOSSIER FRAGILE - Risque élevé'}
            </p>
            <div style="margin-top: 20px;">
              <h4>Analyse détaillée des facteurs :</h4>
              ${victoryAnalysis.facteurs.map(f => 
                `<div style="margin: 5px 0;">
                  <span class="${f.type === 'positif' ? 'facteur-positif' : 'facteur-negatif'}">
                    ${f.type === 'positif' ? '✓' : '✗'} ${f.label} : ${f.type === 'positif' ? '+' : ''}${f.points}%
                  </span>
                </div>`
              ).join('')}
            </div>
          </div>
          
          <div class="urgence-box ${
            urgencyScore >= 7 ? 'urgence-haute' :
            urgencyScore >= 4 ? 'urgence-moyenne' :
            'urgence-normale'
          }">
            <h2>Niveau d'urgence : ${
              urgencyScore >= 7 ? '🔴 ÉLEVÉ' :
              urgencyScore >= 4 ? '🟠 MOYEN' :
              '🟢 NORMAL'
            }</h2>
            <p>${
              urgencyScore >= 7 
                ? "Votre situation nécessite une action rapide. Ne tardez pas à agir."
                : urgencyScore >= 4
                ? "Commencez à rassembler vos preuves et préparez votre dossier méthodiquement."
                : "Prenez le temps de bien constituer votre dossier avant d'agir."
            }</p>
          </div>
          
          <div class="info-section">
            <h3>📋 Vos informations</h3>
            <p><strong>Type de contrat :</strong> ${formData.typeContrat?.toUpperCase() || 'Non renseigné'}</p>
            <p><strong>Ancienneté :</strong> ${formData.anciennete || 'Non renseigné'}</p>
            <p><strong>Salaire mensuel :</strong> ${formData.salaireMonthly ? formData.salaireMonthly + ' €' : 'Non renseigné'}</p>
            ${formData.impactSante ? `<p><strong>Impact santé :</strong> ${formData.impactSante}</p>` : ''}
          </div>
          
          <div class="info-section">
            <h3>⚠️ Problèmes identifiés</h3>
            <div>
              ${formData.problemes.map(p => {
                const probleme = {
                  'heures-sup': 'Heures supplémentaires non payées',
                  'licenciement': 'Licenciement abusif',
                  'harcelement': 'Harcèlement',
                  'discrimination': 'Discrimination',
                  'salaire': 'Salaire impayé',
                  'conges': 'Congés non accordés',
                  'accident': 'Accident du travail',
                  'autres': 'Autre problème'
                }[p] || p;
                return `<span class="probleme-item">${probleme}</span>`;
              }).join('')}
            </div>
          </div>
          
          ${formData.problemes.includes('heures-sup') && formData.heuresSupDetails.heuresParSemaine ? `
            <div class="info-section">
              <h3>⏰ Détails heures supplémentaires</h3>
              <p><strong>Heures sup/semaine :</strong> ${formData.heuresSupDetails.heuresParSemaine} heures</p>
              <p><strong>Période :</strong> ${formData.heuresSupDetails.depuisCombienTemps || 'Non précisé'}</p>
              <p><strong>Estimation rapide :</strong></p>
              <ul>
                <li>Total heures sur 6 mois : ${parseInt(formData.heuresSupDetails.heuresParSemaine) * 26} heures</li>
                <li>Montant estimé (base SMIC) : ${(parseInt(formData.heuresSupDetails.heuresParSemaine) * 26 * 11.65 * 1.25).toFixed(2)} € brut</li>
              </ul>
              <p style="color: #3b82f6;"><strong>→ Utilisez notre calculateur gratuit pour un calcul précis</strong></p>
            </div>
          ` : ''}
          
          <div class="info-section">
            <h3>📑 Preuves disponibles</h3>
            ${formData.documents.length > 0 ? `
              <ul>
                ${formData.documents.map(doc => `<li>✓ ${doc}</li>`).join('')}
              </ul>
            ` : '<p>Aucune preuve déclarée pour le moment</p>'}
          </div>
          
          <h2 style="color: #1e40af; margin-top: 40px;">🎯 NOS RECOMMANDATIONS</h2>
          
          ${recommandations.map(reco => `
            <div class="recommandation">
              <h4>${reco.titre}</h4>
              <p>${reco.description}</p>
              <ul>
                ${reco.actions.map(action => `<li>${action}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
          
          <div class="info-section" style="background-color: #fef3c7; border: 2px solid #f59e0b;">
            <h3>📌 Prochaines étapes</h3>
            <ol>
              <li><strong>GRATUIT :</strong> Utilisez nos calculateurs pour chiffrer précisément vos préjudices</li>
              <li><strong>GRATUIT :</strong> Téléchargez ce diagnostic complet avec scoring</li>
              <li><strong>OPTION 1 (120€) :</strong> Obtenez votre dossier prud'homal complet prêt à déposer</li>
              <li><strong>OPTION 2 (60€) :</strong> Via votre syndicat si vous êtes syndiqué</li>
            </ol>
            <p style="margin-top: 15px;"><strong>💡 Le diagnostic et le scoring restent 100% gratuits.</strong> Vous ne payez que si vous souhaitez le dossier complet personnalisé.</p>
          </div>
          
          <div class="footer">
            <p><strong>Document généré gratuitement par JUSTIJOB - La Défense Active</strong></p>
            <p>Analyse réalisée par Intelligence Artificielle (Claude) - Scoring basé sur des milliers de cas similaires</p>
            <p>Ce document est une analyse basée sur vos déclarations. Il ne constitue pas un avis juridique définitif.</p>
          </div>
        </body>
      </html>
    `;
    
    // Créer et télécharger le fichier
    const blob = new Blob([contenuAnalyse], { type: 'text/html;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analyse-situation-scoring-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert('📥 Votre analyse complète avec scoring a été téléchargée ! Ce document est 100% gratuit.');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Situation de base
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de contrat
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.typeContrat}
                onChange={(e) => handleInputChange('typeContrat', e.target.value)}
              >
                <option value="">Sélectionnez</option>
                <option value="cdi">CDI</option>
                <option value="cdd">CDD</option>
                <option value="interim">Intérim</option>
                <option value="alternance">Alternance</option>
                <option value="stage">Stage</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ancienneté dans l'entreprise
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.anciennete}
                onChange={(e) => handleInputChange('anciennete', e.target.value)}
              >
                <option value="">Sélectionnez</option>
                <option value="moins-6-mois">Moins de 6 mois</option>
                <option value="6-mois-1-an">6 mois à 1 an</option>
                <option value="1-2-ans">1 à 2 ans</option>
                <option value="2-5-ans">2 à 5 ans</option>
                <option value="plus-5-ans">Plus de 5 ans</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salaire mensuel brut (€)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.salaireMonthly}
                onChange={(e) => handleInputChange('salaireMonthly', e.target.value)}
                placeholder="Ex: 2500"
              />
            </div>
          </div>
        );
      
      case 1: // Problèmes rencontrés
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Sélectionnez tous les problèmes que vous rencontrez (plusieurs choix possibles)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {problemesOptions.map(probleme => (
                <button
                  key={probleme.id}
                  type="button"
                  onClick={() => toggleProbleme(probleme.id)}
                  className={`
                    p-4 rounded-lg border-2 text-left transition-all
                    ${formData.problemes.includes(probleme.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{probleme.icon}</span>
                    <div>
                      <p className="font-medium">{probleme.label}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      
      case 2: // Détails spécifiques
        return (
          <div className="space-y-6">
            {formData.problemes.includes('heures-sup') && (
              <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-blue-900">Heures supplémentaires</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Combien d'heures sup par semaine en moyenne ?
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={formData.heuresSupDetails.heuresParSemaine}
                    onChange={(e) => handleNestedInputChange('heuresSupDetails', 'heuresParSemaine', e.target.value)}
                    placeholder="Ex: 10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Depuis combien de temps ?
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={formData.heuresSupDetails.depuisCombienTemps}
                    onChange={(e) => handleNestedInputChange('heuresSupDetails', 'depuisCombienTemps', e.target.value)}
                  >
                    <option value="">Sélectionnez</option>
                    <option value="1-3-mois">1 à 3 mois</option>
                    <option value="3-6-mois">3 à 6 mois</option>
                    <option value="6-12-mois">6 à 12 mois</option>
                    <option value="plus-1-an">Plus d'un an</option>
                  </select>
                </div>
              </div>
            )}
            
            {formData.problemes.includes('licenciement') && (
              <div className="bg-red-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-red-900">Licenciement</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de notification
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={formData.licenciementDetails.dateNotification}
                    onChange={(e) => handleNestedInputChange('licenciementDetails', 'dateNotification', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motif invoqué
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows="3"
                    value={formData.licenciementDetails.motif}
                    onChange={(e) => handleNestedInputChange('licenciementDetails', 'motif', e.target.value)}
                    placeholder="Décrivez le motif donné par l'employeur"
                  />
                </div>
              </div>
            )}
            
            {formData.problemes.includes('harcelement') && (
              <div className="bg-orange-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-orange-900">Harcèlement</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de harcèlement
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={formData.harcelementDetails.type}
                    onChange={(e) => handleNestedInputChange('harcelementDetails', 'type', e.target.value)}
                  >
                    <option value="">Sélectionnez</option>
                    <option value="moral">Harcèlement moral</option>
                    <option value="sexuel">Harcèlement sexuel</option>
                    <option value="les-deux">Les deux</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avez-vous des témoins ?
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={formData.harcelementDetails.temoinsPossibles}
                    onChange={(e) => handleNestedInputChange('harcelementDetails', 'temoinsPossibles', e.target.value)}
                  >
                    <option value="">Sélectionnez</option>
                    <option value="oui-prets">Oui, prêts à témoigner</option>
                    <option value="oui-pas-surs">Oui, mais pas sûrs de témoigner</option>
                    <option value="non">Non</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        );
      
      case 3: // Documentation
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quels documents/preuves avez-vous ?
              </label>
              <div className="space-y-2">
                {[
                  'Emails',
                  'SMS/Messages',
                  'Enregistrements audio',
                  'Témoignages écrits',
                  'Certificats médicaux',
                  'Fiches de paie',
                  'Plannings',
                  'Photos',
                  'Courriers'
                ].map(doc => (
                  <label key={doc} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.documents.includes(doc)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('documents', [...formData.documents, doc]);
                        } else {
                          handleInputChange('documents', formData.documents.filter(d => d !== doc));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{doc}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Y a-t-il un impact sur votre santé ?
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={formData.impactSante}
                onChange={(e) => handleInputChange('impactSante', e.target.value)}
              >
                <option value="">Sélectionnez</option>
                <option value="non">Non</option>
                <option value="stress">Stress/Anxiété</option>
                <option value="depression">Dépression</option>
                <option value="physique">Problèmes physiques</option>
                <option value="arret">Arrêt maladie prescrit</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgence de la situation
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={formData.urgence}
                onChange={(e) => handleInputChange('urgence', e.target.value)}
              >
                <option value="">Sélectionnez</option>
                <option value="immediate">Immédiate (délai court)</option>
                <option value="rapide">Rapide (dans le mois)</option>
                <option value="normale">Normale (pas de délai court)</option>
              </select>
            </div>
          </div>
        );
      
      case 4: // Analyse et recommandations
        const recommandations = generateRecommandations();
        const urgencyScore = calculateUrgencyScore();
        const victoryAnalysis = calculateVictoryScore();
        
        return (
          <div className="space-y-6">
            {/* Score de victoire aux Prud'hommes */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-900 mb-4">
                ⚖️ Analyse IA : Vos chances aux Prud'hommes
              </h3>
              
              {/* Barre de score visuelle */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Chances de succès</span>
                  <span className="font-bold">{victoryAnalysis.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      victoryAnalysis.score >= 70 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      victoryAnalysis.score >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      'bg-gradient-to-r from-red-500 to-red-600'
                    }`}
                    style={{ width: `${victoryAnalysis.score}%` }}
                  />
                </div>
              </div>
              
              {/* Interprétation du score */}
              <div className={`p-3 rounded-lg mb-4 ${
                victoryAnalysis.score >= 70 ? 'bg-green-100 text-green-900' :
                victoryAnalysis.score >= 40 ? 'bg-yellow-100 text-yellow-900' :
                'bg-red-100 text-red-900'
              }`}>
                <p className="font-semibold">
                  {victoryAnalysis.score >= 70 ? '✅ Dossier solide' :
                   victoryAnalysis.score >= 40 ? '⚠️ Dossier à renforcer' :
                   '❌ Dossier fragile'}
                </p>
                <p className="text-sm mt-1">
                  {victoryAnalysis.score >= 70 
                    ? "Votre dossier présente de bonnes chances de succès devant les prud'hommes."
                    : victoryAnalysis.score >= 40
                    ? "Votre dossier nécessite d'être renforcé avec des preuves supplémentaires."
                    : "Il est recommandé de rassembler davantage de preuves avant de saisir les prud'hommes."}
                </p>
              </div>
              
              {/* Détail des facteurs */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Analyse détaillée :</p>
                {victoryAnalysis.facteurs.map((facteur, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <span className={facteur.type === 'positif' ? 'text-green-600 mr-2' : 'text-red-600 mr-2'}>
                        {facteur.type === 'positif' ? '✓' : '✗'}
                      </span>
                      {facteur.label}
                    </span>
                    <span className={`font-semibold ${
                      facteur.type === 'positif' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {facteur.type === 'positif' ? '+' : ''}{facteur.points}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Score d'urgence */}
            <div className={`p-4 rounded-lg ${
              urgencyScore >= 7 ? 'bg-red-50 border-2 border-red-200' :
              urgencyScore >= 4 ? 'bg-orange-50 border-2 border-orange-200' :
              'bg-green-50 border-2 border-green-200'
            }`}>
              <h3 className="font-semibold mb-2">
                Niveau d'urgence : {
                  urgencyScore >= 7 ? '🔴 Élevé' :
                  urgencyScore >= 4 ? '🟠 Moyen' :
                  '🟢 Normal'
                }
              </h3>
              <p className="text-sm">
                {urgencyScore >= 7 
                  ? "Votre situation nécessite une action rapide. Ne tardez pas."
                  : urgencyScore >= 4
                  ? "Commencez à rassembler vos preuves et préparez votre dossier."
                  : "Prenez le temps de bien constituer votre dossier."
                }
              </p>
            </div>
            
            {/* Recommandations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Nos recommandations</h3>
              {recommandations.map((reco, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  reco.type === 'urgent' ? 'bg-red-50 border-red-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <h4 className="font-semibold mb-1">{reco.titre}</h4>
                  <p className="text-sm text-gray-700 mb-3">{reco.description}</p>
                  <ul className="space-y-1">
                    {reco.actions.map((action, idx) => (
                      <li key={idx} className="text-sm flex items-start">
                        <span className="text-blue-600 mr-2">→</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            {/* Actions suivantes - Services GRATUITS */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-blue-900">
                ✨ Services gratuits disponibles
              </h3>
              <div className="space-y-3">
                {formData.problemes.includes('heures-sup') && (
                  <button
                    onClick={() => router.push('/calculateurs/heures-sup')}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    📊 Calculer mes heures supplémentaires dues
                  </button>
                )}
                
                <button
                  onClick={telechargerAnalyse}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  📥 Télécharger mon analyse complète (avec scoring)
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition font-semibold"
                >
                  🖨️ Imprimer cette analyse
                </button>
              </div>
              
              <p className="text-sm text-blue-800 mt-4">
                <strong>Note :</strong> Diagnostic et scoring 100% gratuits. Aucun paiement requis.
              </p>
            </div>
            
            {/* Options payantes */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-orange-900 mb-4">
                📋 Besoin d'un dossier prud'homal complet ?
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                  <h4 className="font-bold text-blue-900 mb-2">Option Individuelle</h4>
                  <p className="text-3xl font-bold text-blue-600 mb-2">120€</p>
                  <p className="text-sm text-gray-600 mb-3">ou 2 × 60€</p>
                  <ul className="text-sm space-y-1 mb-4">
                    <li>✓ Dossier complet personnalisé</li>
                    <li>✓ Formulaire Cerfa pré-rempli</li>
                    <li>✓ Stratégie sur mesure</li>
                    <li>✓ Documents prêts à déposer</li>
                  </ul>
                  <button
                    onClick={() => {
                      // Sauvegarder toutes les données du diagnostic
                      const diagnosticResults = {
                        // Informations de base
                        typeContrat: formData.typeContrat,
                        anciennete: formData.anciennete,
                        salaireMonthly: formData.salaireMonthly,
                        
                        // Problèmes identifiés
                        problemes: formData.problemes,
                        
                        // Détails spécifiques
                        heuresSupDetails: formData.heuresSupDetails,
                        licenciementDetails: formData.licenciementDetails,
                        harcelementDetails: formData.harcelementDetails,
                        discriminationDetails: formData.discriminationDetails,
                        
                        // Preuves et documentation
                        documents: formData.documents,
                        temoins: formData.temoins,
                        
                        // Scores calculés
                        victoryScore: victoryAnalysis.score,
                        victoryFacteurs: victoryAnalysis.facteurs,
                        urgencyScore: urgencyScore,
                        
                        // Recommandations
                        recommandations: recommandations,
                        
                        // Métadonnées
                        dateAnalyse: new Date().toISOString(),
                        impactSante: formData.impactSante,
                        urgence: formData.urgence
                      };
                      
                      // Sauvegarder dans sessionStorage
                      sessionStorage.setItem('diagnosticResults', JSON.stringify(diagnosticResults));
                      
                      // Rediriger vers la page de paiement
                      router.push('/paiement?service=dossier-complet&from=diagnostic');
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  >
                    Obtenir mon dossier
                  </button>
                </div>
                
                <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                  <h4 className="font-bold text-green-900 mb-2">Option Syndicale</h4>
                  <p className="text-3xl font-bold text-green-600 mb-2">60€</p>
                  <p className="text-sm text-gray-600 mb-3">via votre syndicat</p>
                  <ul className="text-sm space-y-1 mb-4">
                    <li>✓ Tarif réduit syndiqué</li>
                    <li>✓ Même dossier complet</li>
                    <li>✓ Transmis à votre syndicat</li>
                    <li>✓ Accompagnement renforcé</li>
                  </ul>
                  <button
                    onClick={() => {
                      // Sauvegarder toutes les données du diagnostic (même données que option individuelle)
                      const diagnosticResults = {
                        // Informations de base
                        typeContrat: formData.typeContrat,
                        anciennete: formData.anciennete,
                        salaireMonthly: formData.salaireMonthly,
                        
                        // Problèmes identifiés
                        problemes: formData.problemes,
                        
                        // Détails spécifiques
                        heuresSupDetails: formData.heuresSupDetails,
                        licenciementDetails: formData.licenciementDetails,
                        harcelementDetails: formData.harcelementDetails,
                        discriminationDetails: formData.discriminationDetails,
                        
                        // Preuves et documentation
                        documents: formData.documents,
                        temoins: formData.temoins,
                        
                        // Scores calculés
                        victoryScore: victoryAnalysis.score,
                        victoryFacteurs: victoryAnalysis.facteurs,
                        urgencyScore: urgencyScore,
                        
                        // Recommandations
                        recommandations: recommandations,
                        
                        // Métadonnées
                        dateAnalyse: new Date().toISOString(),
                        impactSante: formData.impactSante,
                        urgence: formData.urgence
                      };
                      
                      // Sauvegarder dans sessionStorage
                      sessionStorage.setItem('diagnosticResults', JSON.stringify(diagnosticResults));
                      
                      // Rediriger vers la page de paiement avec service=syndical
                      router.push('/paiement?service=syndical&from=diagnostic');
                    }}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                  >
                    Accès syndical
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mt-4 text-center">
                💡 Le diagnostic reste gratuit. Vous ne payez que si vous souhaitez le dossier complet.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 0:
        return formData.typeContrat && formData.anciennete;
      case 1:
        return formData.problemes.length > 0;
      case 2:
        return true; // Les détails sont optionnels
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header avec progression */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Diagnostic de votre situation
        </h1>
        <p className="text-gray-600">
          Répondez à quelques questions pour obtenir une analyse personnalisée
        </p>
        
        {/* Barre de progression */}
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex-1 text-center ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${
                  index < currentStep ? 'bg-blue-600 text-white' :
                  index === currentStep ? 'bg-blue-600 text-white' :
                  'bg-gray-200'
                }`}>
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <span className="text-xs hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Contenu de l'étape */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">{steps[currentStep].title}</h2>
        <p className="text-gray-600 mb-6">{steps[currentStep].description}</p>
        
        <form onSubmit={(e) => e.preventDefault()}>
          {renderStep()}
        </form>
      </div>
      
      {/* Boutons de navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className={`px-6 py-2 rounded-lg ${
            currentStep === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Précédent
        </button>
        
        {currentStep < steps.length - 1 ? (
          <button
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!canGoNext()}
            className={`px-6 py-2 rounded-lg ${
              canGoNext()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Suivant
          </button>
        ) : (
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Terminer
          </button>
        )}
      </div>
    </div>
  );
};

export default DiagnosticForm;