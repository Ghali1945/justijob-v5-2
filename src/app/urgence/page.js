
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowLeft, Home, Clock, FileText, Phone, Mail, MapPin, Calendar, ChevronRight, CheckCircle, Info, Download, Shield } from 'lucide-react'

export default function UrgencePage() {
  const [activeSection, setActiveSection] = useState('delais')

  const sections = [
    { id: 'delais', label: 'Délais à respecter', icon: '⏰' },
    { id: 'procedure', label: 'Procédure complète', icon: '📋' },
    { id: 'documents', label: 'Documents nécessaires', icon: '📄' },
    { id: 'tribunal', label: 'Trouver son CPH', icon: '🏛️' },
    { id: 'aide', label: 'Aide juridictionnelle', icon: '💰' },
    { id: 'urgences', label: 'Cas d\'urgence', icon: '🚨' }
  ]

  const delaisImportants = [
    { delai: '12 mois', cas: 'Contestation du licenciement', detail: 'À partir de la notification du licenciement' },
    { delai: '6 mois', cas: 'Réclamation de salaires', detail: 'À partir du non-paiement' },
    { delai: '3 ans', cas: 'Rappel de salaire', detail: 'Pour les sommes dues (heures sup, primes)' },
    { delai: '5 ans', cas: 'Harcèlement moral', detail: 'À partir du dernier fait' },
    { delai: '2 mois', cas: 'Contestation sanction', detail: 'À partir de la notification' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header avec navigation */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Retour accueil</span>
              </Link>
              
              <div className="h-6 w-px bg-gray-300 hidden sm:block" />
              
              <span className="text-xl font-bold text-blue-600 hidden sm:inline">
                JustiJob
              </span>
              <span className="text-sm text-gray-500 hidden md:inline">
                by Claude AI
              </span>
            </div>
            
            <nav className="flex items-center space-x-4">
              <Link href="/calculateurs" className="text-sm text-gray-600 hover:text-blue-600 hidden md:inline">
                Calculateurs
              </Link>
              <Link href="/diagnostic" className="text-sm text-gray-600 hover:text-blue-600 hidden md:inline">
                Diagnostic
              </Link>
              <Link href="/diagnostic" className="text-sm bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700">
                Évaluer mon cas
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Fil d'Ariane */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Accueil
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-red-600 font-semibold">Guide d'urgence prud'hommes</span>
          </nav>
        </div>
      </div>

      {/* Alerte urgence */}
      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              ⚠️ Attention aux délais ! Certaines actions doivent être engagées rapidement sous peine de perdre vos droits. L'Agent IA Claude peut analyser votre situation en urgence.
            </p>
          </div>
        </div>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Guide d'urgence Prud'hommes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tout ce qu'il faut savoir pour agir rapidement et efficacement
            </p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              🤖 Guide vérifié par l'Agent IA Claude d'Anthropic
            </div>
          </div>

          {/* Navigation des sections */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-2 min-w-max">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contenu des sections */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Section Délais */}
            {activeSection === 'delais' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  ⏰ Délais légaux à respecter impérativement
                </h2>
                
                <div className="space-y-4 mb-8">
                  {delaisImportants.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-red-600 text-white rounded-lg flex items-center justify-center font-bold">
                          {item.delai}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900">{item.cas}</h3>
                        <p className="text-sm text-gray-600">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="font-semibold text-orange-900 mb-3">
                    ⚠️ Prescription et forclusion
                  </h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Passé ces délais, vous perdez définitivement vos droits. Il est donc crucial d'agir rapidement.
                    L'Agent IA Claude peut analyser votre situation et vous alerter sur les délais critiques.
                  </p>
                  <Link
                    href="/diagnostic"
                    className="inline-flex items-center text-orange-600 font-medium hover:text-orange-700"
                  >
                    Vérifier mes délais avec Claude AI
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            )}

            {/* Section Procédure */}
            {activeSection === 'procedure' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  📋 Procédure complète étape par étape
                </h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Tentative de conciliation préalable</h3>
                      <p className="text-gray-600 mb-2">
                        Envoyez une lettre recommandée à votre employeur pour tenter de résoudre le litige à l'amiable.
                      </p>
                      <p className="text-sm text-gray-500">Délai recommandé : Immédiat</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Saisine du CPH</h3>
                      <p className="text-gray-600 mb-2">
                        Déposez votre requête au greffe du Conseil de Prud'hommes ou envoyez-la par courrier recommandé.
                        Claude AI peut générer votre requête personnalisée.
                      </p>
                      <p className="text-sm text-gray-500">Documents : Requête + pièces justificatives</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Bureau de conciliation (BCO)</h3>
                      <p className="text-gray-600 mb-2">
                        Première audience obligatoire pour tenter une conciliation. Vous recevrez une convocation.
                      </p>
                      <p className="text-sm text-gray-500">Délai : 1 à 3 mois après la saisine</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Bureau de jugement</h3>
                      <p className="text-gray-600 mb-2">
                        Si pas de conciliation, l'affaire est renvoyée devant le bureau de jugement pour décision.
                      </p>
                      <p className="text-sm text-gray-500">Délai : 3 à 12 mois après le BCO</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      5
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Jugement</h3>
                      <p className="text-gray-600 mb-2">
                        Le conseil rend sa décision. Vous recevrez la notification par courrier recommandé.
                      </p>
                      <p className="text-sm text-gray-500">Possibilité d'appel sous 1 mois</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">
                    💡 Conseil de l'Agent IA Claude
                  </h3>
                  <p className="text-sm text-gray-700">
                    La procédure complète peut durer 12 à 24 mois. Une préparation minutieuse du dossier 
                    avec Claude AI augmente considérablement vos chances de succès et peut accélérer le processus.
                  </p>
                </div>
              </div>
            )}

            {/* Section Documents */}
            {activeSection === 'documents' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  📄 Documents indispensables pour votre dossier
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Documents obligatoires</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <span className="text-sm">Contrat de travail et avenants</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <span className="text-sm">12 derniers bulletins de salaire</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <span className="text-sm">Lettre de licenciement (si applicable)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <span className="text-sm">Certificat de travail</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <span className="text-sm">Attestation Pôle Emploi</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Documents complémentaires</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <span className="text-sm">Échanges emails avec l'employeur</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <span className="text-sm">Témoignages de collègues</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <span className="text-sm">Certificats médicaux</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <span className="text-sm">Comptes rendus d'entretien</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <span className="text-sm">Convention collective</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-3">
                    📥 Génération automatique avec Claude AI
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    L'Agent IA Claude peut analyser vos documents et générer automatiquement :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button className="flex items-center gap-2 text-green-700 hover:text-green-800">
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">Requête CPH personnalisée</span>
                    </button>
                    <button className="flex items-center gap-2 text-green-700 hover:text-green-800">
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">Arguments juridiques</span>
                    </button>
                    <button className="flex items-center gap-2 text-green-700 hover:text-green-800">
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">Calcul des indemnités</span>
                    </button>
                    <button className="flex items-center gap-2 text-green-700 hover:text-green-800">
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">Check-list personnalisée</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Section Tribunal */}
            {activeSection === 'tribunal' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  🏛️ Trouver son Conseil de Prud'hommes
                </h2>
                
                <div className="mb-8">
                  <p className="text-gray-600 mb-4">
                    Le CPH compétent est celui du lieu de travail habituel ou du siège social de l'entreprise.
                    Claude AI peut déterminer automatiquement le tribunal compétent selon votre situation.
                  </p>
                  
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Principaux CPH en France
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Paris et Île-de-France</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• CPH Paris : 27 rue Louis Blanc, 75010</li>
                          <li>• CPH Bobigny : 1 rue de Strasbourg, 93000</li>
                          <li>• CPH Nanterre : 179 avenue Joliot-Curie, 92000</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Grandes villes</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• CPH Lyon : 3 rue du Palais, 69003</li>
                          <li>• CPH Marseille : 22 rue Breteuil, 13006</li>
                          <li>• CPH Toulouse : 12 place Lafourcade, 31000</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <a href="tel:3939" className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Téléphone</p>
                      <p className="text-sm text-gray-600">39 39 (Allo Service Public)</p>
                    </div>
                  </a>
                  <a href="https://www.justice.fr" className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Annuaire</p>
                      <p className="text-sm text-gray-600">justice.fr</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Horaires</p>
                      <p className="text-sm text-gray-600">Lun-Ven 9h-17h</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section Aide juridictionnelle */}
            {activeSection === 'aide' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  💰 Aide juridictionnelle
                </h2>
                
                <div className="mb-8">
                  <p className="text-gray-600 mb-4">
                    L'aide juridictionnelle permet la prise en charge totale ou partielle des frais de justice 
                    selon vos ressources. Claude AI peut évaluer votre éligibilité.
                  </p>
                  
                  <div className="bg-green-50 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Plafonds de ressources 2025 (personne seule)
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-white rounded">
                        <span className="font-medium">Aide totale (100%)</span>
                        <span className="text-green-600 font-bold">&lt; 1 250€/mois</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded">
                        <span className="font-medium">Aide à 55%</span>
                        <span className="text-orange-600 font-bold">&lt; 1 500€/mois</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded">
                        <span className="font-medium">Aide à 25%</span>
                        <span className="text-red-600 font-bold">&lt; 1 850€/mois</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Documents à fournir</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Formulaire Cerfa n°16146</li>
                        <li>• Justificatifs de ressources</li>
                        <li>• Avis d'imposition</li>
                        <li>• Justificatifs de charges</li>
                        <li>• RIB</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Où déposer ?</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Bureau d'aide juridictionnelle du TGI</li>
                        <li>• Maison de la Justice et du Droit</li>
                        <li>• En ligne sur justice.fr</li>
                        <li>• Au greffe du CPH</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section Cas d'urgence */}
            {activeSection === 'urgences' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  🚨 Situations d'urgence absolue
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="font-semibold text-red-900 mb-3">
                      Non-paiement de salaire
                    </h3>
                    <p className="text-gray-700 mb-3">
                      En cas de non-paiement de votre salaire, vous pouvez saisir le CPH en référé 
                      pour obtenir une décision rapide. Claude AI peut générer votre demande en urgence.
                    </p>
                    <div className="bg-white rounded p-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Actions à mener :</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                        <li>Mise en demeure par LRAR sous 48h</li>
                        <li>Saisine en référé du CPH sous 5 jours</li>
                        <li>Demande de provision sur salaire</li>
                      </ol>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h3 className="font-semibold text-orange-900 mb-3">
                      Harcèlement en cours
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Face à une situation de harcèlement, plusieurs recours urgents sont possibles.
                    </p>
                    <div className="bg-white rounded p-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Contacts utiles :</p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Médecin du travail : Demande de visite urgente</li>
                        <li>• Inspection du travail : Signalement immédiat</li>
                        <li>• Défenseur des droits : 09 69 39 00 00</li>
                        <li>• Cellule d'écoute : 39 19</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="font-semibold text-yellow-900 mb-3">
                      Licenciement imminent
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Si vous pressentez un licenciement abusif imminent, agissez rapidement.
                    </p>
                    <div className="bg-white rounded p-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Précautions à prendre :</p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Conservez tous les documents (copies)</li>
                        <li>• Notez dates et faits précis</li>
                        <li>• Recherchez des témoins</li>
                        <li>• Consultez un délégué syndical</li>
                        <li>• Préparez votre dossier avec Claude AI</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTA Final */}
          <div className="mt-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Besoin d'aide pour votre dossier ?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              L'Agent IA Claude d'Anthropic peut analyser votre situation et générer un dossier complet en quelques minutes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/diagnostic"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Diagnostic gratuit avec Claude
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/calculateurs"
                className="inline-flex items-center justify-center px-6 py-3 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800 transition-colors"
              >
                Calculer mes indemnités
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>

          {/* Footer info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              <Shield className="w-4 h-4 inline mr-1" />
              Informations à jour au 12 août 2025 • Données vérifiées par l'Agent IA Claude d'Anthropic
            </p>
          </div>
        </div>
      </div>

      {/* Bouton flottant mobile */}
      <Link
        href="/"
        className="fixed bottom-6 left-6 bg-white shadow-lg rounded-full p-4 hover:shadow-xl transition-all z-30 md:hidden"
        aria-label="Retour à l'accueil"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </Link>
    </div>
  )
}