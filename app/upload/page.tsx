
// src/app/upload/page.js
'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, FileText, Check, X, AlertCircle, 
  Shield, Lock, Send, Loader, CheckCircle,
  File, Image, FileCheck
} from 'lucide-react'
import Link from 'next/link'

export default function UploadPage() {
  const [files, setFiles] = useState({
    questionnaire: null,
    contrat: null,
    fichePaie: null,
    autres: []
  })
  
  const [uploading, setUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})

  // Configuration du dropzone
  const onDrop = useCallback((acceptedFiles, fileType) => {
    if (fileType === 'autres') {
      setFiles(prev => ({
        ...prev,
        autres: [...prev.autres, ...acceptedFiles]
      }))
    } else {
      setFiles(prev => ({
        ...prev,
        [fileType]: acceptedFiles[0]
      }))
    }
  }, [])

  const removeFile = (fileType, index = null) => {
    if (fileType === 'autres' && index !== null) {
      setFiles(prev => ({
        ...prev,
        autres: prev.autres.filter((_, i) => i !== index)
      }))
    } else {
      setFiles(prev => ({
        ...prev,
        [fileType]: null
      }))
    }
  }

  const validateFiles = () => {
    const newErrors = {}
    
    if (!files.questionnaire) {
      newErrors.questionnaire = 'Le questionnaire rempli est obligatoire'
    }
    if (!files.contrat) {
      newErrors.contrat = 'Le contrat de travail est obligatoire'
    }
    if (!files.fichePaie) {
      newErrors.fichePaie = 'Au moins une fiche de paie est obligatoire'
    }
    if (!email || !email.includes('@')) {
      newErrors.email = 'Email valide requis'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateFiles()) return
    
    setUploading(true)
    
    // Simulation de l'upload
    // En production : vraie API avec FormData
    const formData = new FormData()
    formData.append('questionnaire', files.questionnaire)
    formData.append('contrat', files.contrat)
    formData.append('fichePaie', files.fichePaie)
    files.autres.forEach(file => formData.append('autres', file))
    formData.append('email', email)
    
    try {
      // await fetch('/api/upload', { method: 'POST', body: formData })
      
      // Simulation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setUploadComplete(true)
    } catch (error) {
      console.error('Erreur upload:', error)
    } finally {
      setUploading(false)
    }
  }

  const FileDropzone = ({ fileType, label, accept, required = false, icon: Icon }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (files) => onDrop(files, fileType),
      accept,
      multiple: fileType === 'autres'
    })

    const currentFile = fileType === 'autres' ? files.autres : files[fileType]
    const hasFile = fileType === 'autres' ? files.autres.length > 0 : !!currentFile

    return (
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 
            hasFile ? 'border-green-500 bg-green-50' : 
            errors[fileType] ? 'border-red-500 bg-red-50' : 
            'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          
          {!hasFile ? (
            <>
              <Icon className={`w-12 h-12 mx-auto mb-3 ${
                errors[fileType] ? 'text-red-400' : 'text-gray-400'
              }`} />
              <p className="text-sm text-gray-600">
                {isDragActive ? 'Déposez le fichier ici' : 'Cliquez ou glissez-déposez'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, JPG, PNG (max 10MB)
              </p>
            </>
          ) : (
            <div>
              {fileType === 'autres' ? (
                <div className="space-y-2">
                  {files.autres.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white rounded-lg p-2">
                      <div className="flex items-center">
                        <FileCheck className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFile('autres', index)
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileCheck className="w-6 h-6 text-green-600 mr-2" />
                    <span className="text-sm text-gray-700">{currentFile.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({(currentFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(fileType)
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {errors[fileType] && (
          <p className="text-red-500 text-sm mt-1">{errors[fileType]}</p>
        )}
      </div>
    )
  }

  if (uploadComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Documents reçus avec succès !</h1>
            <p className="text-gray-600 mb-8">
              Nous analysons votre dossier. Vous recevrez votre rapport complet 
              de 30 pages dans les 24 heures à l'adresse : <strong>{email}</strong>
            </p>
            
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold mb-3">Prochaines étapes :</h3>
              <ol className="text-left space-y-2 text-sm">
                <li>1. Notre IA analyse vos documents (2-4h)</li>
                <li>2. Génération du rapport personnalisé (4-8h)</li>
                <li>3. Vérification par notre équipe juridique</li>
                <li>4. Envoi du dossier complet par email</li>
              </ol>
            </div>
            
            <Link 
              href="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Upload sécurisé de vos documents</h1>
          <p className="text-gray-600 text-lg">
            Tous vos documents sont cryptés et traités de manière confidentielle
          </p>
          
          {/* Badges de sécurité */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="w-5 h-5 mr-2 text-green-600" />
              SSL 256-bit
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Lock className="w-5 h-5 mr-2 text-blue-600" />
              RGPD Compliant
            </div>
          </div>
        </div>

        {/* Formulaire d'upload */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Documents obligatoires</h2>
            <p className="text-gray-600">Ces documents sont essentiels pour analyser votre dossier</p>
          </div>

          {/* Questionnaire */}
          <FileDropzone
            fileType="questionnaire"
            label="Questionnaire JustiJob rempli"
            accept={{
              'application/pdf': ['.pdf'],
              'image/*': ['.png', '.jpg', '.jpeg']
            }}
            required={true}
            icon={FileText}
          />

          {/* Contrat de travail */}
          <FileDropzone
            fileType="contrat"
            label="Contrat de travail"
            accept={{
              'application/pdf': ['.pdf'],
              'image/*': ['.png', '.jpg', '.jpeg']
            }}
            required={true}
            icon={File}
          />

          {/* Fiche de paie */}
          <FileDropzone
            fileType="fichePaie"
            label="Dernière(s) fiche(s) de paie"
            accept={{
              'application/pdf': ['.pdf'],
              'image/*': ['.png', '.jpg', '.jpeg']
            }}
            required={true}
            icon={File}
          />

          {/* Documents supplémentaires */}
          <FileDropzone
            fileType="autres"
            label="Documents supplémentaires (optionnel)"
            accept={{
              'application/pdf': ['.pdf'],
              'image/*': ['.png', '.jpg', '.jpeg']
            }}
            required={false}
            icon={Image}
          />

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email de réception <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Résumé */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-3">Résumé de votre envoi :</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                {files.questionnaire ? (
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <X className="w-5 h-5 text-gray-400 mr-2" />
                )}
                <span className={files.questionnaire ? 'text-green-700' : 'text-gray-500'}>
                  Questionnaire rempli
                </span>
              </div>
              <div className="flex items-center">
                {files.contrat ? (
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <X className="w-5 h-5 text-gray-400 mr-2" />
                )}
                <span className={files.contrat ? 'text-green-700' : 'text-gray-500'}>
                  Contrat de travail
                </span>
              </div>
              <div className="flex items-center">
                {files.fichePaie ? (
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <X className="w-5 h-5 text-gray-400 mr-2" />
                )}
                <span className={files.fichePaie ? 'text-green-700' : 'text-gray-500'}>
                  Fiche(s) de paie
                </span>
              </div>
              {files.autres.length > 0 && (
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-blue-700">
                    {files.autres.length} document(s) supplémentaire(s)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bouton submit */}
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center ${
              uploading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
            }`}
          >
            {uploading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Envoyer mes documents
              </>
            )}
          </button>

          {/* Info sécurité */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Vos documents sont cryptés pendant le transfert et stockés de manière sécurisée. 
                Ils seront automatiquement supprimés 30 jours après le traitement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}