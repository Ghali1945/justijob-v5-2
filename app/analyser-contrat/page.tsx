'use client'

import React, { useState } from 'react';

export default function AnalyserContratPage() {
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
        
        nonConcurrence: {
          status: 'danger',
          text: "Interdiction d'exercer dans la boulangerie pendant 2 ans dans toute la France",
          analyse: "Clause manifestement excessive : durée trop longue et zone trop large sans contrepartie financière.",
          articles: ["Article L1121-1 du Code du travail"]
        },
        
        conges: {
          status: 'success',
          text: "5 semaines de congés payés + 2 jours d'ancienneté après 3 ans",
          analyse: "Conforme et même avantageux par rapport au minimum légal.",
          articles: ["Article L3141-3 du Code du travail"]
        }
      },
      
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
          <div className="text-center">
            <div className="text-6xl mb-6">🧠</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Analyse de votre contrat en cours...
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-center text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-3"></div>
                <span>Extraction du texte (OCR)...</span>
              </div>
              <div className="flex items-center justify-center text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-3"></div>
                <span>Identification des clauses importantes...</span>
              </div>
              <div className="flex items-center justify-center text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-3"></div>
                <span>Vérification de la conformité légale...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Écran de résultats
  if (analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Analyse terminée !</h1>
                  <p className="text-blue-100">
                    {analysis.extracted.typeContrat} - {analysis.extracted.poste} - {analysis.extracted.salaireBase}/mois
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2 text-orange-300">
                    {analysis.score.value}/100
                  </div>
                  <div className="text-white/90">{analysis.score.label}</div>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Alerte principale */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">⚠️</span>
                  <div>
                    <h3 className="font-bold text-red-900 mb-1">Attention : Forfait heures sup détecté !</h3>
                    <p className="text-red-800">
                      Votre contrat inclut 10h supplémentaires forfaitisées. 
                      Si vous travaillez plus, ces heures ne sont pas payées !
                    </p>
                    <a href="/calculateurs/heures-sup" className="text-red-600 underline text-sm mt-2 inline-block">
                      → Calculer vos vraies heures supplémentaires
                    </a>
                  </div>
                </div>
              </div>

              {/* Clauses analysées */}
              <h3 className="text-xl font-bold text-gray-800 mb-4">Clauses analysées</h3>
              <div className="space-y-4 mb-8">
                {Object.entries(analysis.clauses).map(([key, clause]) => (
                  <div key={key} className={`border rounded-lg p-4 ${
                    clause.status === 'danger' ? 'border-red-200 bg-red-50' :
                    clause.status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                    'border-green-200 bg-green-50'
                  }`}>
                    <div className="flex items-start">
                      <div className="mr-3 text-xl">
                        {clause.status === 'danger' ? '🚫' :
                         clause.status === 'warning' ? '⚠️' : '✅'}
                      </div>
                      <div>
                        <p className="font-semibold mb-1">{clause.text}</p>
                        <p className="text-sm text-gray-700">{clause.analyse}</p>
                        <p className="text-xs text-gray-500 mt-1">📖 {clause.articles.join(' • ')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommandations */}
              <div className="bg-blue-50 rounded-xl p-6 mb-8">
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 transform hover:scale-105">
                  📥 Télécharger l'Analyse
                </button>
                <button 
                  onClick={() => {
                    setAnalysis(null);
                    setFile(null);
                    setPreview(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  📄 Analyser un Autre Contrat
                </button>
              </div>

              {/* Lien retour */}
              <div className="text-center mt-8">
                <a href="/" className="text-blue-600 hover:underline">
                  ← Retour à l'accueil
                </a>
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              📄 Analyseur de Contrat de Travail
            </h1>
            <p className="text-gray-600">
              Notre IA détecte les clauses abusives et calcule vos droits
            </p>
          </div>

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
                <div className="text-6xl mb-4">📤</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Glissez votre contrat ici
                </h3>
                <p className="text-gray-500 mb-6">
                  ou cliquez pour sélectionner
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
                  <span>📷 Photo</span>
                  <span>📄 PDF</span>
                </div>
              </>
            ) : (
              <>
                {preview && (
                  <img 
                    src={preview} 
                    alt="Aperçu" 
                    className="max-h-64 mx-auto mb-4 rounded-lg shadow-lg"
                  />
                )}
                <div className="mb-4">
                  <div className="text-5xl mb-2">✅</div>
                  <p className="font-semibold">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={analyzeContract}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  🧠 Analyser mon contrat
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

          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">
              ℹ️ Ce que notre IA vérifie :
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>✓ Conformité avec le Code du travail</li>
              <li>✓ Clauses abusives ou illégales</li>
              <li>✓ Heures supplémentaires cachées</li>
              <li>✓ Clauses de non-concurrence excessives</li>
              <li>✓ Période d'essai et préavis</li>
            </ul>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            🔒 Vos documents sont analysés de manière sécurisée et ne sont jamais conservés
          </div>

          {/* Lien retour */}
          <div className="text-center mt-6">
            <a href="/" className="text-blue-600 hover:underline">
              ← Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}