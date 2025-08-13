
// src/components/HeuresSupCalculator.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HeuresSupCalculator = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    // Informations de base
    salaireHoraireBrut: '',
    heuresContrat: 35,
    conventionCollective: '',
    
    // Périodes de calcul
    periodeDebut: '',
    periodeFin: '',
    
    // Détail par semaine/mois
    methodeCalcul: 'hebdomadaire', // hebdomadaire ou mensuel
    detailHeures: [],
    
    // Preuves
    preuves: {
      pointeuse: false,
      emails: false,
      planning: false,
      temoins: false,
      autres: ''
    }
  });
  
  const [resultats, setResultats] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Conventions collectives courantes
  const conventions = [
    { value: 'syntec', label: 'Syntec (informatique, ingénierie)', majorations: { h1_8: 25, h9_plus: 50 } },
    { value: 'metallurgie', label: 'Métallurgie', majorations: { h1_8: 25, h9_plus: 50 } },
    { value: 'btp', label: 'BTP', majorations: { h1_8: 25, h9_plus: 50 } },
    { value: 'commerce', label: 'Commerce', majorations: { h1_8: 10, h9_plus: 20 } },
    { value: 'hotellerie', label: 'Hôtellerie-Restauration', majorations: { h1_8: 10, h9_plus: 20 } },
    { value: 'transport', label: 'Transport', majorations: { h1_8: 25, h9_plus: 50 } },
    { value: 'autre', label: 'Autre / Je ne sais pas', majorations: { h1_8: 25, h9_plus: 50 } }
  ];

  // Calculer le nombre de semaines entre deux dates
  const calculateWeeks = () => {
    if (!formData.periodeDebut || !formData.periodeFin) return 0;
    const debut = new Date(formData.periodeDebut);
    const fin = new Date(formData.periodeFin);
    const diffTime = Math.abs(fin - debut);
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  };

  // Initialiser le tableau des heures
  useEffect(() => {
    const weeks = calculateWeeks();
    if (weeks > 0 && weeks <= 52) {
      const newDetailHeures = [];
      for (let i = 0; i < weeks; i++) {
        newDetailHeures.push({
          semaine: i + 1,
          heuresTravaillees: formData.heuresContrat,
          heuresSupplementaires: 0
        });
      }
      setFormData(prev => ({ ...prev, detailHeures: newDetailHeures }));
    }
  }, [formData.periodeDebut, formData.periodeFin]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreuveChange = (preuve) => {
    setFormData(prev => ({
      ...prev,
      preuves: {
        ...prev.preuves,
        [preuve]: !prev.preuves[preuve]
      }
    }));
  };

  const handleHeuresChange = (index, field, value) => {
    const newDetailHeures = [...formData.detailHeures];
    newDetailHeures[index] = {
      ...newDetailHeures[index],
      [field]: parseFloat(value) || 0
    };
    
    // Calculer automatiquement les heures sup
    if (field === 'heuresTravaillees') {
      newDetailHeures[index].heuresSupplementaires = Math.max(0, parseFloat(value) - formData.heuresContrat);
    }
    
    setFormData(prev => ({ ...prev, detailHeures: newDetailHeures }));
  };

  const calculerResultats = () => {
    if (!formData.salaireHoraireBrut || formData.detailHeures.length === 0) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    const convention = conventions.find(c => c.value === formData.conventionCollective) || conventions[6];
    const salaireHoraire = parseFloat(formData.salaireHoraireBrut);
    
    let totalHeuresSup = 0;
    let totalHeuresSup25 = 0;
    let totalHeuresSup50 = 0;
    let montantTotal = 0;
    let detailCalcul = [];

    formData.detailHeures.forEach((semaine, index) => {
      const heuresSup = semaine.heuresSupplementaires;
      if (heuresSup > 0) {
        // Répartition selon la loi : 8 premières à 25%, au-delà à 50%
        const heures25 = Math.min(heuresSup, 8);
        const heures50 = Math.max(0, heuresSup - 8);
        
        const montant25 = heures25 * salaireHoraire * (1 + convention.majorations.h1_8 / 100);
        const montant50 = heures50 * salaireHoraire * (1 + convention.majorations.h9_plus / 100);
        const montantSemaine = montant25 + montant50;
        
        totalHeuresSup += heuresSup;
        totalHeuresSup25 += heures25;
        totalHeuresSup50 += heures50;
        montantTotal += montantSemaine;
        
        detailCalcul.push({
          semaine: semaine.semaine,
          heuresSup,
          heures25,
          heures50,
          montant25,
          montant50,
          montantTotal: montantSemaine
        });
      }
    });

    // Calcul des cotisations et net
    const cotisationsSalariales = montantTotal * 0.23; // Approximation 23%
    const montantNet = montantTotal - cotisationsSalariales;
    
    // Calcul des dommages et intérêts potentiels
    const dommagesInterets = montantTotal * 0.10; // 10% de D&I possible
    
    setResultats({
      totalHeuresSup,
      totalHeuresSup25,
      totalHeuresSup50,
      montantBrut: montantTotal,
      cotisationsSalariales,
      montantNet,
      dommagesInterets,
      montantTotalAvecDI: montantNet + dommagesInterets,
      detailCalcul,
      convention: convention.label,
      periode: `Du ${formData.periodeDebut} au ${formData.periodeFin}`,
      nbSemaines: formData.detailHeures.length,
      tauxHoraire: salaireHoraire,
      majoration25: convention.majorations.h1_8,
      majoration50: convention.majorations.h9_plus
    });
  };

  const telechargerPDF = () => {
    if (!resultats) return;
    
    // Créer le contenu HTML pour le PDF
    const contenuPDF = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Calcul Heures Supplémentaires - ${new Date().toLocaleDateString('fr-FR')}</title>
          <style>
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header { 
              border-bottom: 3px solid #1e40af; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            h1 { 
              color: #1e40af; 
              margin: 0 0 10px 0;
            }
            .info-box {
              background-color: #f3f4f6;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .montant-box {
              background-color: #dcfce7;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              text-align: center;
            }
            .montant { 
              font-size: 32px; 
              font-weight: bold; 
              color: #059669; 
              margin: 10px 0;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 12px; 
              text-align: left; 
            }
            th { 
              background-color: #f3f4f6; 
              font-weight: bold;
            }
            .section { 
              margin: 30px 0; 
            }
            .footer { 
              margin-top: 50px; 
              padding-top: 20px; 
              border-top: 2px solid #ddd; 
              font-size: 12px;
              color: #666;
            }
            .badge {
              display: inline-block;
              padding: 4px 8px;
              background-color: #dbeafe;
              color: #1e40af;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CALCUL DES HEURES SUPPLÉMENTAIRES IMPAYÉES</h1>
            <p><strong>Document généré le :</strong> ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><span class="badge">DOCUMENT GRATUIT - JUSTIJOB</span></p>
          </div>
          
          <div class="section">
            <h2>📊 Récapitulatif de la période</h2>
            <div class="info-box">
              <p><strong>Période analysée :</strong> ${resultats.periode}</p>
              <p><strong>Nombre de semaines :</strong> ${resultats.nbSemaines} semaines</p>
              <p><strong>Convention collective :</strong> ${resultats.convention}</p>
              <p><strong>Taux horaire brut :</strong> ${resultats.tauxHoraire.toFixed(2)} €</p>
              <p><strong>Majorations appliquées :</strong> ${resultats.majoration25}% (8 premières heures) / ${resultats.majoration50}% (au-delà)</p>
            </div>
          </div>
          
          <div class="section">
            <h2>💶 Montant total calculé</h2>
            <div class="montant-box">
              <p>Montant total estimé avec dommages et intérêts :</p>
              <div class="montant">${resultats.montantTotalAvecDI.toFixed(2)} €</div>
            </div>
          </div>
          
          <div class="section">
            <h2>📋 Détail du calcul</h2>
            <table>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Montant</th>
              </tr>
              <tr>
                <td>Total heures supplémentaires</td>
                <td style="text-align: right;"><strong>${resultats.totalHeuresSup} heures</strong></td>
              </tr>
              <tr>
                <td>• Heures majorées à ${resultats.majoration25}%</td>
                <td style="text-align: right;">${resultats.totalHeuresSup25} heures</td>
              </tr>
              <tr>
                <td>• Heures majorées à ${resultats.majoration50}%</td>
                <td style="text-align: right;">${resultats.totalHeuresSup50} heures</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td><strong>Montant brut dû</strong></td>
                <td style="text-align: right;"><strong>${resultats.montantBrut.toFixed(2)} €</strong></td>
              </tr>
              <tr>
                <td>Cotisations salariales estimées (-23%)</td>
                <td style="text-align: right;">- ${resultats.cotisationsSalariales.toFixed(2)} €</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td><strong>Montant net</strong></td>
                <td style="text-align: right;"><strong>${resultats.montantNet.toFixed(2)} €</strong></td>
              </tr>
              <tr>
                <td>Dommages et intérêts possibles (+10%)</td>
                <td style="text-align: right;">+ ${resultats.dommagesInterets.toFixed(2)} €</td>
              </tr>
              <tr style="background-color: #dcfce7;">
                <td><strong>TOTAL POTENTIEL</strong></td>
                <td style="text-align: right;"><strong style="color: #059669;">${resultats.montantTotalAvecDI.toFixed(2)} €</strong></td>
              </tr>
            </table>
          </div>
          
          <div class="section">
            <h2>✅ Prochaines étapes recommandées</h2>
            <ol style="line-height: 1.8;">
              <li><strong>Envoyez ce document à votre employeur</strong> par lettre recommandée avec accusé de réception</li>
              <li><strong>Conservez une copie</strong> de ce calcul et tous les justificatifs (plannings, emails, pointages)</li>
              <li><strong>Contactez un syndicat</strong> ou l'inspection du travail pour un accompagnement gratuit</li>
              <li><strong>En cas de refus,</strong> vous disposez de 3 ans pour saisir le conseil de prud'hommes</li>
            </ol>
          </div>
          
          <div class="footer">
            <p><strong>⚠️ Avertissement légal :</strong></p>
            <p>Ce document est un calcul estimatif basé sur les informations que vous avez fournies. Il ne constitue pas un avis juridique et les montants réels peuvent varier selon votre situation spécifique et l'appréciation du juge prud'homal. Pour une analyse juridique complète, consultez un professionnel du droit du travail.</p>
            <br>
            <p><strong>Document généré gratuitement par JUSTIJOB - La Défense Active</strong></p>
            <p>Plateforme d'aide aux salariés en difficulté - www.justijob.fr</p>
          </div>
        </body>
      </html>
    `;
    
    // Créer un blob et télécharger
    const blob = new Blob([contenuPDF], { type: 'text/html;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `calcul-heures-sup-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    // Message de confirmation
    alert('📥 Document téléchargé ! Vous pouvez l\'ouvrir et l\'imprimer depuis votre dossier de téléchargements.');
  };

  const genererRapport = () => {
    if (!resultats) return;
    
    // Créer un élément HTML pour le rapport
    const rapport = `
      <html>
        <head>
          <title>Rapport Heures Supplémentaires</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1e40af; }
            .header { border-bottom: 2px solid #1e40af; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin: 20px 0; }
            .montant { font-size: 24px; font-weight: bold; color: #059669; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Calcul des Heures Supplémentaires Impayées</h1>
            <p>Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          
          <div class="section">
            <h2>Période analysée</h2>
            <p>${resultats.periode} (${resultats.nbSemaines} semaines)</p>
          </div>
          
          <div class="section">
            <h2>Convention collective</h2>
            <p>${resultats.convention}</p>
            <p>Majoration 25% : ${resultats.majoration25}% | Majoration 50% : ${resultats.majoration50}%</p>
          </div>
          
          <div class="section">
            <h2>Résumé du calcul</h2>
            <table>
              <tr>
                <th>Total heures supplémentaires</th>
                <td>${resultats.totalHeuresSup} heures</td>
              </tr>
              <tr>
                <th>Heures majorées à ${resultats.majoration25}%</th>
                <td>${resultats.totalHeuresSup25} heures</td>
              </tr>
              <tr>
                <th>Heures majorées à ${resultats.majoration50}%</th>
                <td>${resultats.totalHeuresSup50} heures</td>
              </tr>
              <tr>
                <th>Montant brut dû</th>
                <td class="montant">${resultats.montantBrut.toFixed(2)} €</td>
              </tr>
              <tr>
                <th>Montant net estimé</th>
                <td>${resultats.montantNet.toFixed(2)} €</td>
              </tr>
              <tr>
                <th>Dommages et intérêts possibles</th>
                <td>${resultats.dommagesInterets.toFixed(2)} €</td>
              </tr>
              <tr style="background-color: #dcfce7;">
                <th>TOTAL POTENTIEL</th>
                <td class="montant">${resultats.montantTotalAvecDI.toFixed(2)} €</td>
              </tr>
            </table>
          </div>
          
          <div class="footer">
            <p><strong>Important :</strong> Ce document est un calcul estimatif basé sur les informations fournies. 
            Il ne constitue pas un avis juridique. Consultez un avocat ou un syndicat pour valider vos droits.</p>
            <p>Document généré par JUSTIJOB - La Défense Active</p>
          </div>
        </body>
      </html>
    `;
    
    // Ouvrir dans une nouvelle fenêtre pour impression
    const printWindow = window.open('', '_blank');
    printWindow.document.write(rapport);
    printWindow.document.close();
    printWindow.print();
  };

  const sauvegarderCalcul = () => {
    // Sauvegarder dans le localStorage pour l'instant
    const calcul = {
      date: new Date().toISOString(),
      formData,
      resultats
    };
    
    const calculsExistants = JSON.parse(localStorage.getItem('heuresSupCalculs') || '[]');
    calculsExistants.push(calcul);
    localStorage.setItem('heuresSupCalculs', JSON.stringify(calculsExistants));
    
    alert('Calcul sauvegardé ! Vous pouvez le retrouver dans votre historique.');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Calculateur d'heures supplémentaires
        </h1>
        <p className="text-gray-600 mb-6">
          Calculez précisément le montant de vos heures supplémentaires impayées
        </p>
        
        {/* Formulaire de base */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salaire horaire brut (€)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.salaireHoraireBrut}
              onChange={(e) => handleInputChange('salaireHoraireBrut', e.target.value)}
              placeholder="Ex: 15.50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Divisez votre salaire mensuel brut par 151.67
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Convention collective
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.conventionCollective}
              onChange={(e) => handleInputChange('conventionCollective', e.target.value)}
            >
              <option value="">Sélectionnez votre convention</option>
              {conventions.map(conv => (
                <option key={conv.value} value={conv.value}>
                  {conv.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heures hebdomadaires contractuelles
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.heuresContrat}
              onChange={(e) => handleInputChange('heuresContrat', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période de calcul
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.periodeDebut}
                onChange={(e) => handleInputChange('periodeDebut', e.target.value)}
              />
              <span className="self-center">à</span>
              <input
                type="date"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.periodeFin}
                onChange={(e) => handleInputChange('periodeFin', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Détail des heures */}
        {formData.detailHeures.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Détail par semaine</h2>
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-600 hover:text-blue-700"
              >
                {showDetails ? 'Masquer' : 'Afficher'} le détail
              </button>
            </div>
            
            {showDetails && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-2 text-left">Semaine</th>
                      <th className="border p-2 text-left">Heures travaillées</th>
                      <th className="border p-2 text-left">Heures sup.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.detailHeures.slice(0, 10).map((semaine, index) => (
                      <tr key={index}>
                        <td className="border p-2">Semaine {semaine.semaine}</td>
                        <td className="border p-2">
                          <input
                            type="number"
                            className="w-20 px-2 py-1 border rounded"
                            value={semaine.heuresTravaillees}
                            onChange={(e) => handleHeuresChange(index, 'heuresTravaillees', e.target.value)}
                          />
                        </td>
                        <td className="border p-2 font-semibold">
                          {semaine.heuresSupplementaires}h
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {formData.detailHeures.length > 10 && (
                  <p className="text-sm text-gray-500 mt-2">
                    ... et {formData.detailHeures.length - 10} semaines supplémentaires
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Preuves disponibles */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Preuves disponibles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries({
              pointeuse: 'Pointeuse/Badgeuse',
              emails: 'Emails de travail',
              planning: 'Plannings',
              temoins: 'Témoins'
            }).map(([key, label]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.preuves[key]}
                  onChange={() => handlePreuveChange(key)}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Bouton de calcul */}
        <button
          onClick={calculerResultats}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Calculer mes heures supplémentaires
        </button>
      </div>
      
      {/* Résultats */}
      {resultats && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Résultats du calcul
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Total heures supplémentaires</h3>
              <p className="text-3xl font-bold text-blue-600">{resultats.totalHeuresSup} heures</p>
              <p className="text-sm text-blue-700 mt-1">
                {resultats.totalHeuresSup25}h à 25% + {resultats.totalHeuresSup50}h à 50%
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Montant total estimé</h3>
              <p className="text-3xl font-bold text-green-600">
                {resultats.montantTotalAvecDI.toFixed(2)} €
              </p>
              <p className="text-sm text-green-700 mt-1">
                Incluant dommages et intérêts potentiels
              </p>
            </div>
          </div>
          
          {/* Détail du calcul */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-3">Détail du calcul</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Montant brut des heures sup :</span>
                <span className="font-semibold">{resultats.montantBrut.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Cotisations salariales (-23%) :</span>
                <span>- {resultats.cotisationsSalariales.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Montant net :</span>
                <span className="font-semibold">{resultats.montantNet.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Dommages et intérêts (+10%) :</span>
                <span>+ {resultats.dommagesInterets.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold">
                <span>TOTAL POTENTIEL :</span>
                <span className="text-green-600">{resultats.montantTotalAvecDI.toFixed(2)} €</span>
              </div>
            </div>
          </div>
          
          {/* Actions gratuites uniquement */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              ✨ Téléchargez votre calcul (Service 100% gratuit)
            </h3>
            <p className="text-sm text-blue-800 mb-4">
              Votre calcul détaillé est prêt. Téléchargez-le ou imprimez-le pour vos démarches.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={telechargerPDF}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                📥 Télécharger le calcul (PDF)
              </button>
              <button
                onClick={genererRapport}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                🖨️ Imprimer le calcul
              </button>
            </div>
          </div>
          
          {/* Guide d'utilisation du document */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">💡 Comment utiliser ce document ?</h4>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">1.</span>
                <span><strong>Conservez ce calcul</strong> comme preuve de vos heures supplémentaires dues</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">2.</span>
                <span><strong>Envoyez-le à votre employeur</strong> par lettre recommandée avec accusé de réception</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">3.</span>
                <span><strong>En cas de refus,</strong> utilisez ce document pour saisir les prud'hommes</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">4.</span>
                <span><strong>Contactez un syndicat</strong> ou l'inspection du travail pour un accompagnement gratuit</span>
              </li>
            </ol>
            <div className="mt-4 p-3 bg-blue-100 rounded">
              <p className="text-xs text-blue-800">
                <strong>Note :</strong> Ce calcul est fourni gratuitement. Vous pouvez l'utiliser librement dans toutes vos démarches.
              </p>
            </div>
          </div>
          
          {/* Avertissement */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>⚠️ Important :</strong> Ce calcul est une estimation basée sur les informations fournies. 
              Les montants réels peuvent varier selon votre situation spécifique. 
              Nous recommandons de consulter un avocat ou un syndicat pour valider vos droits.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeuresSupCalculator;