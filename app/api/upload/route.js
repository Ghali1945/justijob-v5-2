
// src/app/api/upload/route.js
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    // Récupération des fichiers
    const questionnaire = formData.get('questionnaire')
    const contrat = formData.get('contrat')
    const fichePaie = formData.get('fichePaie')
    const email = formData.get('email')
    
    // Validation
    if (!questionnaire || !contrat || !fichePaie || !email) {
      return NextResponse.json(
        { error: 'Documents manquants' },
        { status: 400 }
      )
    }
    
    // Créer le dossier uploads s'il n'existe pas
    const uploadDir = path.join(process.cwd(), 'uploads')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (err) {
      // Le dossier existe déjà
    }
    
    const timestamp = Date.now()
    
    // Traiter chaque fichier
    const files = [
      { file: questionnaire, name: `${timestamp}-questionnaire` },
      { file: contrat, name: `${timestamp}-contrat` },
      { file: fichePaie, name: `${timestamp}-fichePaie` }
    ]
    
    for (const { file, name } of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Sauvegarder le fichier
      await writeFile(
        path.join(uploadDir, `${name}-${file.name}`),
        buffer
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Documents uploadés avec succès',
      referenceId: timestamp
    })
    
  } catch (error) {
    console.error('Erreur upload:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload' },
      { status: 500 }
    )
  }
}