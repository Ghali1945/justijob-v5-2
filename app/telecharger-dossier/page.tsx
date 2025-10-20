
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  Download, FileText, CheckCircle, AlertCircle, Clock, 
  Euro, Scale, BookOpen, Shield, Mail, Printer,
  ChevronRight, Copy, Share2, MessageSquare, Phone
} from 'lucide-react'
import Link from 'next/link'

function TelechargerDossierContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  
  const [loading, setLoading] = useState(true)
  const [dossierData, setDossierData] = useState(null)
  const [error, setError] = useState(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [showGuide, setShowGuide] = useState(false)
  
  useEffect(() => {
    if (token) {
      fetchDossierData()
    } else {
      setError('Token manquant')
      setLoading(false)
    }
  }, [token])
  
  const fetchDossierData = async () => {
    try {
      // Simulation de récupération des données
      // En production : appel API réel
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Données simulées basées sur le token
      const mockData = {
        id: 'CPH-2024-ABC123',
        dateGeneration: new Date().toISOString(),
        demandeur: {
          nom: 'MARTIN',
          prenom: 'Sophie',
          email: 'sophie.martin@email.com'
        },
        defendeur: {
          entreprise: 'TECH SOLUTIONS SAS',
          siret: '123 456 789 00010'
        },
        tribunal: {
          nom: 'Conseil de Prud\'hommes de Paris',
          section: 'Encadrement',
          adresse: '27 rue Louis Blanc, 75010 Paris'
        },
        montants: {
          indemnites: {
            licenciement: 12500,
            congesPayes: 3200,
            preavis: 6000,
            heuresSup: 4800
          },
          dommagesInterets: {
            licenciementAbusif: 18000,
            souffranceTravail: 5000
          },
          total: 49500,
          article700: 1500
        },
        documents: [
          { nom: 'Requête CPH complète', pages: 12, format: 'PDF', taille: '2.3 MB' },
          { nom: 'Bordereau de pièces', pages: 2, format: 'PDF', taille: '156 KB' },
          { nom: 'Calcul des indemnités', pages: 4, format: 'PDF', taille: '340 KB' },
          { nom: 'Modèles de lettres', pages: 6, format: 'PDF', taille: '245 KB' },
          { nom: 'Guide de procédure', pages: 8, format: 'PDF', taille: '1.1 MB' }
        ],
        pieces: {
          obligatoires: 5,
          fournies: 3,
          manquantes: ['Contrat de travail', 'Derniers bulletins de salaire']
        },
        etapes: [
          { titre: 'Mise en demeure', delai: 'Immédiat', statut: 'a_faire' },
          { titre: 'Saisine CPH', delai: '8 jours', statut: 'a_faire' },
          { titre: 'Audience conciliation', delai: '1-3 mois', statut: 'futur' },
          { titre: 'Audience jugement', delai: '6-12 mois', statut: 'futur' }
        ],
        validite: '48h',
        expiration: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
      }
      
      setDossierData(mockData)
      setLoading(false)
    } catch (err) {
      setError('Erreur lors de la récupération du dossier')
      setLoading(false)
    }
  }
  
  const handleDownload = async (document) => {
    setDownloadProgress(0)
    
    // Simulation de téléchargement
    for (let i = 0; i <= 100; i += 10) {
      setDownloadProgress(i)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    // En production : téléchargement réel
    alert(`Téléchargement de ${document.nom} terminé !`)
    setDownloadProgress(0)
  }
  
  const handleDownloadAll = async () => {
    setDownloadProgress(0)
    
    for (let i = 0; i <= 100; i += 5) {
      setDownloadProgress(i)
      await new Promise(resolve => setTimeout(resolve, 150))
    }
    
    alert('Tous les documents ont été téléchargés !')
    setDownloadProgress(0)
  }
  
  const handlePrint = () => {
    window.print()
  }
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mon dossier prud\'hommes',
        text: 'Dossier généré par JustiJob',
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Lien copié dans le presse-papier !')
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre dossier...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header avec succès */}
        <div className="bg-green-600 text-white rounded-2xl p-8 mb-8 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">
            Votre dossier est prêt !
          </h1>
          <p className="text-lg opacity-90 mb-4">
            Dossier n°{dossierData.id} généré avec succès
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div>
              <Clock className="w-5 h-5 inline mr-1" />
              Valide {dossierData.validite}
            </div>
            <div>
              <FileText className="w-5 h-5 inline mr-1" />
              {dossierData.documents.length} documents
            </div>
            <div>
              <Euro className="w-5 h-5 inline mr-1" />
              {dossierData.montants.total.toLocaleString()}€ réclamés
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Résumé du dossier */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                Résumé de votre dossier
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Demandeur</h3>
                  <p className="text-sm text-gray-600">
                    {dossierData.demandeur.prenom} {dossierData.demandeur.nom}<br />
                    {dossierData.demandeur.email}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Défendeur</h3>
                  <p className="text-sm text-gray-600">
                    {dossierData.defendeur.entreprise}<br />
                    SIRET : {dossierData.defendeur.siret}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Tribunal compétent</h3>
                  <p className="text-sm text-gray-600">
                    {dossierData.tribunal.nom}<br />
                    Section : {dossierData.tribunal.section}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Montant total</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {dossierData.montants.total.toLocaleString()} €
                  </p>
                </div>
              </div>
            </div>

            {/* Détail des montants */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Euro className="w-5 h-5 text-green-600" />
                Détail des montants réclamés
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Indemnités</h3>
                  <div className="space-y-2">
                    {Object.entries(dossierData.montants.indemnites).map(([key, value]) => (
                      value > 0 && (
                        <div key={key} className="flex justify-between py-2 border-b">
                          <span className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="font-medium">{value.toLocaleString()} €</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Dommages et intérêts</h3>
                  <div className="space-y-2">
                    {Object.entries(dossierData.montants.dommagesInterets).map(([key, value]) => (
                      value > 0 && (
                        <div key={key} className="flex justify-between py-2 border-b">
                          <span className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="font-medium">{value.toLocaleString()} €</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total général</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {dossierData.montants.total.toLocaleString()} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Article 700 (frais)</span>
                    <span className="font-medium">+{dossierData.montants.article700} €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents à télécharger */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Documents générés
                </h2>
                <button
                  onClick={handleDownloadAll}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Download className="w-4 h-4" />
                  Tout télécharger
                </button>
              </div>
              
              {downloadProgress > 0 && (
                <div className="mb-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Téléchargement... {downloadProgress}%
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                {dossierData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.nom}</p>
                        <p className="text-sm text-gray-600">
                          {doc.pages} pages • {doc.format} • {doc.taille}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button
                  onClick={handlePrint}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <Printer className="w-5 h-5" />
                  Imprimer
                </button>
                
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <Share2 className="w-5 h-5" />
                  Partager
                </button>
                
                <button
                  onClick={() => navigator.clipboard.writeText(dossierData.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <Copy className="w-5 h-5" />
                  Copier n° dossier
                </button>
              </div>
            </div>

            {/* Pièces manquantes */}
            {dossierData.pieces.manquantes.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Pièces manquantes
                </h3>
                <ul className="space-y-2 text-sm text-orange-800">
                  {dossierData.pieces.manquantes.map((piece, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">•</span>
                      {piece}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-orange-700 mt-3">
                  Ces documents devront être fournis avant l'audience
                </p>
              </div>
            )}

            {/* Prochaines étapes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Prochaines étapes
              </h3>
              <div className="space-y-3">
                {dossierData.etapes.map((etape, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      etape.statut === 'fait' ? 'bg-green-100 text-green-600' :
                      etape.statut === 'a_faire' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{etape.titre}</p>
                      <p className="text-xs text-gray-600">{etape.delai}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setShowGuide(true)}
                className="w-full mt-4 text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                Voir le guide complet →
              </button>
            </div>

            {/* Support */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Besoin d'aide ?</h3>
              <div className="space-y-3">
                <a
                  href="mailto:support@justijob.fr"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600"
                >
                  <Mail className="w-5 h-5" />
                  support@justijob.fr
                </a>
                <a
                  href="tel:0180881234"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600"
                >
                  <Phone className="w-5 h-5" />
                  01 80 88 12 34
                </a>
                <Link
                  href="/faq"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600"
                >
                  <MessageSquare className="w-5 h-5" />
                  FAQ / Chat en ligne
                </Link>
              </div>
            </div>

            {/* Garanties */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Dossier sécurisé</p>
                  <p className="text-xs text-gray-600">Conformité RGPD</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                Votre dossier est disponible pendant 48h. 
                Pensez à le sauvegarder sur votre ordinateur.
              </p>
            </div>
          </div>
        </div>

        {/* Informations importantes */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Informations importantes</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Votre dossier est complet et prêt à être déposé au greffe du Conseil de Prud'hommes</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Respectez les délais indiqués pour chaque étape de la procédure</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Conservez tous les originaux de vos documents</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>En cas de convocation, présentez-vous avec l'ensemble des pièces</span>
            </li>
          </ul>
        </div>

        {/* Modal Guide */}
        {showGuide && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  Guide complet de la procédure
                </h2>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="prose max-w-none">
                <h3>1. Tentative de résolution amiable (Immédiat)</h3>
                <p>
                  Envoyez la mise en demeure fournie à votre employeur en recommandé avec AR. 
                  Gardez une copie et le récépissé.
                </p>
                
                <h3>2. Saisine du Conseil de Prud'hommes (J+8)</h3>
                <p>
                  Si pas de réponse satisfaisante sous 8 jours, déposez votre dossier au greffe. 
                  Adresse : {dossierData.tribunal.adresse}
                </p>
                
                <h3>3. Convocation à l'audience de conciliation (1-3 mois)</h3>
                <p>
                  Vous recevrez une convocation. Présentez-vous avec tous vos documents. 
                  Cette étape est obligatoire et vise à trouver un accord.
                </p>
                
                <h3>4. Audience de jugement (6-12 mois)</h3>
                <p>
                  Si pas d'accord en conciliation, l'affaire passe en jugement. 
                  Préparez votre argumentation et vos preuves.
                </p>
                
                <h3>5. Jugement et exécution</h3>
                <p>
                  Le jugement est rendu sous 1-2 mois. En cas de victoire, 
                  l'employeur dispose d'1 mois pour faire appel.
                </p>
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="font-semibold text-green-900 mb-2">💡 Conseils pratiques :</p>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Arrivez 15 minutes en avance aux audiences</li>
                    <li>• Habillez-vous de manière professionnelle</li>
                    <li>• Préparez un argumentaire clair et chronologique</li>
                    <li>• Restez factuel et courtois</li>
                    <li>• N'hésitez pas à demander l'aide d'un conseiller du salarié</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => handleDownload({ nom: 'Guide de procédure' })}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Télécharger le guide PDF
                </button>
                <button
                  onClick={() => setShowGuide(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TelechargerDossier() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <TelechargerDossierContent />
    </Suspense>
  )
}