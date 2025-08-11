
'use client'

import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader, Brain, Shield, AlertTriangle, Info, Download, Send, X, Camera } from 'lucide-react';

export default function ContractAnalyzer() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Gestion du drag & drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type === 'application/pdf' || file.type.includes('image')) {
      setFile(file);
      
      // Preview pour les images
      if (file.type.includes('image')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);
      }
    } else {
      alert('Veuillez uploader un PDF ou une image de votre contrat');
    }
  };

  // Simulation de l'analyse OCR + IA
  const analyzeContract = async () => {
    setIsAnalyzing(true);
    
    // Simulation du temps de traitement
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Résultats simulés de l'analyse
    const mockAnalysis = {
      // Informations extraites
      extracted: {
        poste: "Boulanger",
        typeContrat: "CDI",
        dateDebut: "01/03/2022",
        salaireBase: "1 800€",
        horaireHebdo: "35 heures",
        convention: "Convention collective nationale de la boulangerie-pâtisserie française",
        lieuTravail: "Boulangerie Au Bon Pain, Paris",
        periodeEssai: "2 mois renouvelable une fois"
      },
      
      // Clauses analysées
      clauses: {
        heuresSup: {
          status: 'warning',
          text: "Forfait de 10 heures supplémentaires incluses dans le salaire",
          analyse: "Cette clause pourrait être illégale. Les heures sup doivent être payées ou récupérées distinctement.",
          articles: ["Article L3121-28 du Code du travail"]
        },
        
        mobilite: {
          status: 'danger',
          text: "Le salarié pourra être muté dans tout établissement de l'entreprise en France",
          analyse: "Clause de mobilité excessive sans contrepartie. Doit être limitée géographiquement.",
          articles: ["Article L1121-1 du Code du travail"]
        },
        
        nonConcurrence: {
          status: 'danger',
          text: "Interdiction d'exercer dans la boulangerie pendant 2 ans dans toute la France",
          analyse: "Clause manifestement excessive : durée trop longue et zone trop large sans contrepartie financière.",
          articles: ["Article L1121-1 du Code du travail", "Jurisprudence Cass. Soc. 2002"]
        },
        
        conges: {
          status: 'success',
          text: "5 semaines de congés payés + 2 jours d'ancienneté après 3 ans",
          analyse: "Conforme et même avantageux par rapport au minimum légal.",
          articles: ["Article L3141-3 du Code du travail"]
        },
        
        rupture: {
          status: 'warning',
          text: "Préavis de 3 mois en cas de démission",
          analyse: "Préavis excessif pour un poste de boulanger. Maximum 1 mois selon la convention.",
          articles: ["Convention collective boulangerie Art. 38"]
        }
      },
      
      // Points d'attention
      alerts: [
        {
          level: 'high',
          title: 'Heures supplémentaires forfaitisées',
          description: 'Le forfait de 10h sup incluses pourrait masquer des heures non payées',
          action: 'Tenir un décompte précis de vos heures réelles'
        },
        {
          level: 'high',
          title: 'Clause de non-concurrence abusive',
          description: '2 ans sur toute la France sans contrepartie = nullité probable',
          action: 'Cette clause est probablement inapplicable en l\'état'
        },
        {
          level: 'medium',
          title: 'Clause de mobilité trop large',
          description: 'Mutation possible dans toute la France sans précision',
          action: 'Demander une limitation géographique'
        },
        {
          level: 'low',
          title: 'Préavis de démission',
          description: '3 mois au lieu d\'1 mois selon la convention',
          action: 'Négociable au moment de la rupture'
        }
      ],
      
      // Score global
      score: {
        value: 45,
        label: 'Contrat à risque',
        color: 'orange'
      },
      
      // Recommandations
      recommendations: [
        'Faire retirer ou modifier la clause de non-concurrence',
        'Clarifier le système de paiement des heures supplémentaires',
        'Limiter géographiquement la clause de mobilité',
        'Conserver toutes vos fiches de paie et pointages'
      ]
    };
    
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  // Écran de chargement
  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-lg w-full">
          <Brain className="mx-auto text-blue-600 animate-pulse mb-6" size={80} />
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Analyse de votre contrat en cours...
          </h2>
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Loader className="animate-spin mr-3" size={20} />
              <span>Extraction du texte (OCR)...</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Loader className="animate-spin mr-3" size={20} />
              <span>Identification des clauses importantes...</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Loader className="animate-spin mr-3" size={20} />
              <span>Vérification de la conformité légale...</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Loader className="animate-spin mr-3" size={20} />
              <span>Comparaison avec la convention collective...</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-6">
            Cela peut prendre jusqu'à 30 secondes...
          </p>
        </div>
      </div>
    );
  }

  // Écran de résultats
  if (analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* En-tête des résultats */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Analyse de votre contrat terminée</h1>
                  <p className="text-blue-100">
                    {analysis.extracted.typeContrat} - {analysis.extracted.poste} - {analysis.extracted.salaireBase}/mois
                  </p>
                </div>
                <div className="text-center">
                  <div className={`text-5xl font-bold mb-2 ${
                    analysis.score.value >= 70 ? 'text-green-300' :
                    analysis.score.value >= 50 ? 'text-yellow-300' :
                    'text-orange-300'
                  }`}>
                    {analysis.score.value}/100
                  </div>
                  <div className="text-white/90">{analysis.score.label}</div>
                </div>
              </div>
            </div>

            {/* Informations extraites */}
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FileText className="mr-2 text-blue-600" size={24} />
                Informations extraites
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {Object.entries(analysis.extracted).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()} :</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
              </div>

              {/* Analyse des clauses */}
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="mr-2 text-blue-600" size={24} />
                Analyse détaillée des clauses
              </h3>
              <div className="space-y-4 mb-8">
                {Object.entries(analysis.clauses).map(([key, clause]) => (
                  <div key={key} className={`border rounded-lg p-4 ${
                    clause.status === 'danger' ? 'border-red-200 bg-red-50' :
                    clause.status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                    'border-green-200 bg-green-50'
                  }`}>
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        {clause.status === 'danger' ? 
                          <AlertTriangle className="text-red-600" size={20} /> :
                          clause.status === 'warning' ?
                          <AlertCircle className="text-yellow-600" size={20} /> :
                          <CheckCircle className="text-green-600" size={20} />
                        }
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p className="text-sm text-gray-700 italic mb-2">"{clause.text}"</p>
                        <p className="text-sm text-gray-800 mb-2">{clause.analyse}</p>
                        <div className="text-xs text-gray-500">
                          📖 {clause.articles.join(' • ')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Points d'attention */}
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <AlertTriangle className="mr-2 text-orange-600" size={24} />
                Points d'attention prioritaires
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {analysis.alerts.map((alert, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    alert.level === 'high' ? 'border-red-300 bg-red-50' :
                    alert.level === 'medium' ? 'border-yellow-300 bg-yellow-50' :
                    'border-blue-300 bg-blue-50'
                  }`}>
                    <h4 className="font-semibold mb-2">{alert.title}</h4>
                    <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                    <p className="text-sm font-medium text-gray-800">
                      ➡️ {alert.action}
                    </p>
                  </div>
                ))}
              </div>

              {/* Recommandations */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  🎯 Nos recommandations
                </h3>
                <ol className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
                  <Download className="mr-2" size={20} />
                  Télécharger l'Analyse Complète
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
                  <Send className="mr-2" size={20} />
                  Consulter un Avocat
                </button>
                <button 
                  onClick={() => {
                    setAnalysis(null);
                    setFile(null);
                    setPreview(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                >
                  <X className="mr-2" size={20} />
                  Analyser un Autre Contrat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Écran d'upload
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* En-tête */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">
              <FileText className="mr-3 text-blue-600" size={36} />
              Analyseur de Contrat de Travail
            </h1>
            <p className="text-gray-600">
              Notre IA vérifie la conformité de votre contrat et détecte les clauses abusives
            </p>
          </div>

          {/* Zone d'upload */}
          <div 
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!file ? (
              <>
                <Upload className="mx-auto text-gray-400 mb-4" size={60} />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Glissez votre contrat ici
                </h3>
                <p className="text-gray-500 mb-6">
                  ou cliquez pour sélectionner un fichier
                </p>
                <input
                  type="file"
                  onChange={(e) => handleFile(e.target.files[0])}
                  accept=".pdf,image/*"
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium cursor-pointer transition-all inline-block"
                >
                  Choisir un fichier
                </label>
                <div className="mt-6 flex justify-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Camera className="mr-1" size={16} />
                    Photo
                  </span>
                  <span className="flex items-center">
                    <FileText className="mr-1" size={16} />
                    PDF
                  </span>
                </div>
              </>
            ) : (
              <>
                {preview && (
                  <img 
                    src={preview} 
                    alt="Aperçu du contrat" 
                    className="max-h-64 mx-auto mb-4 rounded-lg shadow-lg"
                  />
                )}
                <div className="flex items-center justify-center mb-4">
                  <FileText className="text-green-600 mr-2" size={24} />
                  <span className="font-semibold text-gray-700">{file.name}</span>
                </div>
                <button
                  onClick={analyzeContract}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  <Brain className="inline mr-2" size={20} />
                  Analyser mon contrat
                </button>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="block mx-auto mt-4 text-gray-500 hover:text-gray-700 text-sm"
                >
                  Choisir un autre fichier
                </button>
              </>
            )}
          </div>

          {/* Informations */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <Info className="mr-2" size={20} />
              Ce que notre IA va vérifier :
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 flex-shrink-0 text-blue-600" size={16} />
                <span>Conformité avec le Code du travail et votre convention collective</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 flex-shrink-0 text-blue-600" size={16} />
                <span>Détection des clauses abusives ou illégales</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 flex-shrink-0 text-blue-600" size={16} />
                <span>Vérification du calcul du salaire et des heures</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 flex-shrink-0 text-blue-600" size={16} />
                <span>Analyse des clauses de mobilité, non-concurrence, etc.</span>
              </li>
            </ul>
          </div>

          {/* Sécurité */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <Shield className="inline mr-2" size={16} />
            Vos documents sont analysés de manière sécurisée et ne sont jamais conservés
          </div>
        </div>
      </div>
    </div>
  );
}