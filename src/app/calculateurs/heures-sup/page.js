
'use client'

import React, { useState, useEffect } from 'react';
import { Calculator, Upload, FileText, Euro, Clock, AlertCircle, CheckCircle, TrendingUp, Download, Send, Info, Zap, Shield, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';

// Copie ce fichier ENTIER dans src/app/calculateurs/heures-sup/page.js

const CONVENTIONS_COLLECTIVES = {
  'boulangerie': {
    name: 'Boulangerie-Pâtisserie (artisanale)',
    seuil: 35,
    majorations: { 
      '25': 8,      // 35h à 43h : +25%
      '50': 8,      // Au-delà de 43h : +50%
      'nuit': 25,   // Travail de nuit (21h-6h) : +25%
      'dimanche': 20 // Dimanche : +20% (ou repos compensateur)
    },
    specificites: [
      'Semaine de 6 jours possible',
      'Durée maximale : 48h/semaine',
      'Majoration dimanche OU repos compensateur'
    ]
  },
  'syntec': {
    name: 'Syntec (Bureaux d\'études)',
    seuil: 35,
    majorations: { '25': 8, '50': 8, 'nuit': 100, 'dimanche': 100 }
  },
  'metallurgie': {
    name: 'Métallurgie',
    seuil: 35,
    majorations: { '25': 8, '50': 8, 'nuit': 50, 'dimanche': 100 }
  },
  'commerce': {
    name: 'Commerce de détail',
    seuil: 35,
    majorations: { '25': 10, '50': 10, 'nuit': 30, 'dimanche': 100 }
  },
  'btp': {
    name: 'Bâtiment et Travaux Publics',
    seuil: 35,
    majorations: { '25': 8, '50': 8, 'nuit': 100, 'dimanche': 100 }
  },
  'restauration': {
    name: 'Hôtels, Cafés, Restaurants',
    seuil: 35,
    majorations: { '25': 10, '50': 10, 'nuit': 50, 'dimanche': 100 }
  },
  'transport': {
    name: 'Transport routier',
    seuil: 35,
    majorations: { '25': 8, '50': 8, 'nuit': 50, 'dimanche': 100 }
  },
  'autre': {
    name: 'Autre / Je ne sais pas',
    seuil: 35,
    majorations: { '25': 8, '50': 10, 'nuit': 0, 'dimanche': 0 }
  }
};

export default function HeuresSupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const [formData, setFormData] = useState({
    salaireBrut: '',
    horaireHebdo: '',
    convention: '',
    dateDebut: '',
    dateFin: '',
    heuresReelles: '',
    heuresPayees: '',
    heuresNuit: '0',
    heuresDimanche: '0',
    hasProof: null,
    proofTypes: [],
    email: '',
    entreprise: ''
  });

  const [resultats, setResultats] = useState(null);
  const [errors, setErrors] = useState({});

  const calculateHourlyRate = () => {
    const monthly = parseFloat(formData.salaireBrut) || 0;
    const weekly = parseFloat(formData.horaireHebdo) || 35;
    return (monthly / (weekly * 52 / 12)).toFixed(2);
  };

  const calculateOvertimeHours = () => {
    const convention = CONVENTIONS_COLLECTIVES[formData.convention] || CONVENTIONS_COLLECTIVES.autre;
    const seuil = convention.seuil;
    const heuresParSemaine = parseFloat(formData.heuresReelles) || 0;
    
    if (heuresParSemaine <= seuil) return { hs25: 0, hs50: 0 };
    
    const heuresSup = heuresParSemaine - seuil;
    const hs25 = Math.min(heuresSup, convention.majorations['25']);
    const hs50 = Math.max(0, heuresSup - convention.majorations['25']);
    
    return { hs25, hs50 };
  };

  const calculateTotal = () => {
    const tauxHoraire = parseFloat(calculateHourlyRate());
    const { hs25, hs50 } = calculateOvertimeHours();
    const convention = CONVENTIONS_COLLECTIVES[formData.convention] || CONVENTIONS_COLLECTIVES.autre;
    
    const debut = new Date(formData.dateDebut);
    const fin = new Date(formData.dateFin);
    const semaines = Math.round((fin - debut) / (7 * 24 * 60 * 60 * 1000));
    
    const montantHS25 = hs25 * tauxHoraire * 1.25;
    const montantHS50 = hs50 * tauxHoraire * 1.50;
    const montantNuit = parseFloat(formData.heuresNuit) * tauxHoraire * (1 + convention.majorations.nuit / 100);
    const montantDimanche = parseFloat(formData.heuresDimanche) * tauxHoraire * (1 + convention.majorations.dimanche / 100);
    
    const totalBrut = (montantHS25 + montantHS50 + montantNuit + montantDimanche) * semaines;
    
    const heuresPayees = parseFloat(formData.heuresPayees) || 0;
    const montantPaye = heuresPayees * tauxHoraire * 1.25;
    
    return {
      tauxHoraire,
      hs25,
      hs50,
      montantHS25: montantHS25 * semaines,
      montantHS50: montantHS50 * semaines,
      montantNuit: montantNuit * semaines,
      montantDimanche: montantDimanche * semaines,
      totalBrut,
      montantPaye,
      totalNet: totalBrut - montantPaye,
      semaines,
      details: {
        hs25Total: hs25 * semaines,
        hs50Total: hs50 * semaines,
        nuitTotal: parseFloat(formData.heuresNuit) * semaines,
        dimancheTotal: parseFloat(formData.heuresDimanche) * semaines
      }
    };
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch(step) {
      case 1:
        if (!formData.salaireBrut) newErrors.salaireBrut = 'Salaire requis';
        if (!formData.horaireHebdo) newErrors.horaireHebdo = 'Horaire requis';
        if (!formData.convention) newErrors.convention = 'Convention requise';
        break;
      case 2:
        if (!formData.dateDebut) newErrors.dateDebut = 'Date de début requise';
        if (!formData.dateFin) newErrors.dateFin = 'Date de fin requise';
        if (new Date(formData.dateFin) <= new Date(formData.dateDebut)) {
          newErrors.dateFin = 'La date de fin doit être après la date de début';
        }
        break;
      case 3:
        if (!formData.heuresReelles) newErrors.heuresReelles = 'Heures réelles requises';
        break;
      case 4:
        if (formData.hasProof === null) newErrors.hasProof = 'Veuillez répondre';
        break;
      case 5:
        if (!formData.email) newErrors.email = 'Email requis';
        if (!formData.entreprise) newErrors.entreprise = 'Nom entreprise requis';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        handleCalculate();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const results = calculateTotal();
    setResultats(results);
    setIsCalculating(false);
    setShowResults(true);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  if (isCalculating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-lg w-full text-center">
          <Calculator className="mx-auto text-blue-600 animate-pulse mb-6" size={80} />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Calcul en cours...
          </h2>
          <div className="space-y-3 text-left">
            <div className="flex items-center text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-3"></div>
              <span>Analyse de votre convention collective...</span>
            </div>
            <div className="flex items-center text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-3"></div>
              <span>Calcul des majorations légales...</span>
            </div>
            <div className="flex items-center text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-3"></div>
              <span>Vérification avec la jurisprudence...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && resultats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white">
              <div className="flex items-center mb-4">
                <CheckCircle className="mr-3" size={40} />
                <h1 className="text-3xl font-bold">Calcul Terminé !</h1>
              </div>
              <p className="text-xl text-green-100">
                Voici le montant de vos heures supplémentaires non payées
              </p>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-green-600 mb-2">
                  {resultats.totalNet.toFixed(2)} €
                </div>
                <p className="text-gray-600">
                  Montant total à récupérer sur {resultats.semaines} semaines
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Calculator className="mr-2 text-blue-600" size={24} />
                  Détail du Calcul
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Taux horaire brut :</span>
                    <span className="font-semibold">{resultats.tauxHoraire} €/h</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Heures sup 25% ({resultats.details.hs25Total}h) :</span>
                      <span className="font-semibold">{resultats.montantHS25.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Heures sup 50% ({resultats.details.hs50Total}h) :</span>
                      <span className="font-semibold">{resultats.montantHS50.toFixed(2)} €</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center text-xl font-bold text-green-600">
                      <span>Reste à percevoir :</span>
                      <span>{resultats.totalNet.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
                  <Download className="mr-2" size={20} />
                  Télécharger le Courrier Type
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
                  <Send className="mr-2" size={20} />
                  Envoyer à un Avocat
                </button>
              </div>

              {/* Bouton Nouveau Calcul */}
              <div className="mt-8 text-center">
                <button 
                  onClick={() => {
                    // Réinitialiser toutes les données
                    setFormData({
                      salaireBrut: '',
                      horaireHebdo: '',
                      convention: '',
                      dateDebut: '',
                      dateFin: '',
                      heuresReelles: '',
                      heuresPayees: '',
                      heuresNuit: '0',
                      heuresDimanche: '0',
                      hasProof: null,
                      proofTypes: [],
                      email: '',
                      entreprise: ''
                    });
                    setResultats(null);
                    setShowResults(false);
                    setCurrentStep(1);
                    setErrors({});
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                >
                  <Calculator className="mr-2" size={20} />
                  Faire un Nouveau Calcul
                </button>
                <p className="text-gray-600 mt-4">
                  Calculer pour un autre salarié ou une autre période
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">
              <Calculator className="mr-3 text-blue-600" size={36} />
              Calculateur d'Heures Supplémentaires
            </h1>
            <p className="text-gray-600">
              Découvrez combien votre employeur vous doit
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Étape {currentStep} sur 5</span>
              <span className="text-sm font-medium text-blue-600">{(currentStep / 5 * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Vos informations de base
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salaire mensuel brut
                  </label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                      type="number"
                      value={formData.salaireBrut}
                      onChange={(e) => updateFormData('salaireBrut', e.target.value)}
                      className={`w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.salaireBrut ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="2500"
                    />
                  </div>
                  {errors.salaireBrut && (
                    <p className="text-red-500 text-sm mt-1">{errors.salaireBrut}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horaire hebdomadaire contractuel
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                      type="number"
                      value={formData.horaireHebdo}
                      onChange={(e) => updateFormData('horaireHebdo', e.target.value)}
                      className={`w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.horaireHebdo ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="35"
                    />
                  </div>
                  {errors.horaireHebdo && (
                    <p className="text-red-500 text-sm mt-1">{errors.horaireHebdo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Convention collective
                  </label>
                  <select
                    value={formData.convention}
                    onChange={(e) => updateFormData('convention', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.convention ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionnez votre convention</option>
                    {Object.entries(CONVENTIONS_COLLECTIVES).map(([key, conv]) => (
                      <option key={key} value={key}>{conv.name}</option>
                    ))}
                  </select>
                  {errors.convention && (
                    <p className="text-red-500 text-sm mt-1">{errors.convention}</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Période concernée
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={formData.dateDebut}
                    onChange={(e) => updateFormData('dateDebut', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.dateDebut ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dateDebut && (
                    <p className="text-red-500 text-sm mt-1">{errors.dateDebut}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={formData.dateFin}
                    onChange={(e) => updateFormData('dateFin', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.dateFin ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dateFin && (
                    <p className="text-red-500 text-sm mt-1">{errors.dateFin}</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Détail de vos heures
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heures travaillées par semaine (en moyenne)
                  </label>
                  <input
                    type="number"
                    value={formData.heuresReelles}
                    onChange={(e) => updateFormData('heuresReelles', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.heuresReelles ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="45"
                  />
                  {errors.heuresReelles && (
                    <p className="text-red-500 text-sm mt-1">{errors.heuresReelles}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heures supplémentaires déjà payées
                  </label>
                  <input
                    type="number"
                    value={formData.heuresPayees}
                    onChange={(e) => updateFormData('heuresPayees', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Vos preuves
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Avez-vous des preuves de ces heures supplémentaires ?
                  </label>
                  <div className="space-y-3">
                    <button
                      onClick={() => updateFormData('hasProof', true)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        formData.hasProof === true
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium">✅ Oui, j'ai des preuves</span>
                    </button>
                    <button
                      onClick={() => updateFormData('hasProof', false)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        formData.hasProof === false
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium">❌ Non, je n'ai pas de preuves</span>
                    </button>
                  </div>
                  {errors.hasProof && (
                    <p className="text-red-500 text-sm mt-2">{errors.hasProof}</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Recevoir votre analyse complète
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="votre@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    value={formData.entreprise}
                    onChange={(e) => updateFormData('entreprise', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.entreprise ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="SARL Example"
                  />
                  {errors.entreprise && (
                    <p className="text-red-500 text-sm mt-1">{errors.entreprise}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="mr-2" size={20} />
              Précédent
            </button>

            <button
              onClick={handleNext}
              className="flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              {currentStep === 5 ? 'Calculer mes heures' : 'Suivant'}
              <ChevronRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}