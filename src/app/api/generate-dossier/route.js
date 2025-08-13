
// src/app/api/generate-dossier/route.js
import { NextResponse } from 'next/server'

// Simulateur de génération PDF
// En production, utiliser jsPDF, puppeteer ou react-pdf
async function generatePDFDocument(userData, questionnaire, analysis) {
  // Simulation de génération avec délai réaliste
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Structure du dossier prud'hommes
  const dossier = {
    // Métadonnées
    id: `CPH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    dateGeneration: new Date().toISOString(),
    version: '2.0',
    
    // Informations du demandeur
    demandeur: {
      nom: questionnaire.nom,
      prenom: questionnaire.prenom,
      dateNaissance: questionnaire.dateNaissance,
      adresse: `${questionnaire.adresse}, ${questionnaire.codePostal} ${questionnaire.ville}`,
      telephone: questionnaire.telephone,
      email: questionnaire.email
    },
    
    // Informations de l'employeur
    defendeur: {
      entreprise: questionnaire.nomEntreprise,
      siret: questionnaire.siret,
      adresse: questionnaire.adresseSiege,
      convention: questionnaire.conventionCollective
    },
    
    // Analyse du litige
    litige: {
      type: questionnaire.typeLitige,
      dateDebut: questionnaire.dateDebutConflit,
      description: questionnaire.descriptionFaits,
      prejudiceFinancier: questionnaire.prejudiceFinancier,
      prejudiceMoral: questionnaire.prejudiceMoral
    },
    
    // Calculs et estimations
    calculs: {
      indemnites: calculateIndemnites(questionnaire),
      dommagesInterets: calculateDommages(questionnaire),
      total: 0
    }
  }
  
  // Calcul du total
  dossier.calculs.total = Object.values(dossier.calculs.indemnites).reduce((a, b) => a + b, 0) +
                          Object.values(dossier.calculs.dommagesInterets).reduce((a, b) => a + b, 0)
  
  return dossier
}

// Calcul des indemnités
function calculateIndemnites(questionnaire) {
  const salaire = parseFloat(questionnaire.salaireBrutActuel) || 0
  const anciennete = calculateAnciennete(questionnaire.dateEmbauche)
  
  const indemnites = {
    licenciement: 0,
    congesPayes: 0,
    preavis: 0,
    heuresSup: 0
  }
  
  // Indemnité de licenciement
  if (questionnaire.typeLitige?.includes('icenciement')) {
    if (anciennete <= 10) {
      indemnites.licenciement = (salaire / 4) * anciennete
    } else {
      indemnites.licenciement = (salaire / 4) * 10 + (salaire / 3) * (anciennete - 10)
    }
  }
  
  // Congés payés (estimation)
  indemnites.congesPayes = salaire * 0.1 * (anciennete > 0 ? 1 : anciennete)
  
  // Préavis
  if (questionnaire.typeLitige?.includes('icenciement')) {
    const moisPreavis = anciennete < 0.5 ? 0 : anciennete < 2 ? 1 : 2
    indemnites.preavis = salaire * moisPreavis
  }
  
  // Heures supplémentaires
  if (questionnaire.typeLitige?.includes('heures')) {
    indemnites.heuresSup = salaire * 0.25 * 6 // Estimation 6 mois
  }
  
  return indemnites
}

// Calcul des dommages et intérêts
function calculateDommages(questionnaire) {
  const salaire = parseFloat(questionnaire.salaireBrutActuel) || 0
  const anciennete = calculateAnciennete(questionnaire.dateEmbauche)
  
  const dommages = {
    licenciementAbusif: 0,
    harcelement: 0,
    discrimination: 0,
    souffranceTravail: 0
  }
  
  // Licenciement sans cause réelle et sérieuse
  if (questionnaire.licenciementAbusif || questionnaire.typeLitige?.includes('abusif')) {
    dommages.licenciementAbusif = Math.max(salaire * 6, salaire * anciennete * 0.5)
  }
  
  // Harcèlement
  if (questionnaire.harcelement || questionnaire.typeLitige?.includes('harcèlement')) {
    dommages.harcelement = salaire * 3
  }
  
  // Discrimination
  if (questionnaire.discrimination || questionnaire.typeLitige?.includes('discrimination')) {
    dommages.discrimination = salaire * 6
  }
  
  // Préjudice moral / Souffrance au travail
  if (questionnaire.prejudiceMoral === 'important' || questionnaire.prejudiceMoral === 'tres-important') {
    dommages.souffranceTravail = salaire * 2
  }
  
  return dommages
}

// Calcul de l'ancienneté
function calculateAnciennete(dateEmbauche) {
  if (!dateEmbauche) return 0
  const debut = new Date(dateEmbauche)
  const fin = new Date()
  return Math.floor((fin - debut) / (365.25 * 24 * 60 * 60 * 1000))
}

// Génération des arguments juridiques
function generateArgumentsJuridiques(questionnaire) {
  const argumentsJuridiques = []
  
  // Arguments selon le type de litige
  if (questionnaire.typeLitige?.includes('icenciement')) {
    argumentsJuridiques.push({
      titre: "Absence de cause réelle et sérieuse",
      articles: ["L1232-1", "L1234-1", "L1234-5", "L1234-9"],
      developpement: "Le licenciement ne repose sur aucun motif réel et sérieux au sens de l'article L1232-1 du Code du travail.",
      jurisprudence: [
        "Cass. soc., 11 juillet 2018, n° 17-10.554",
        "Cass. soc., 30 mars 2022, n° 20-20.264"
      ]
    })
  }
  
  if (questionnaire.typeLitige?.includes('harcèlement')) {
    argumentsJuridiques.push({
      titre: "Harcèlement moral caractérisé",
      articles: ["L1152-1", "L1152-2", "L1152-3"],
      developpement: "Les agissements répétés subis ont eu pour effet une dégradation des conditions de travail.",
      jurisprudence: [
        "Cass. soc., 8 juin 2016, n° 14-13.418",
        "Cass. soc., 27 novembre 2019, n° 18-10.551"
      ]
    })
  }
  
  if (questionnaire.typeLitige?.includes('discrimination')) {
    argumentsJuridiques.push({
      titre: "Discrimination prohibée",
      articles: ["L1132-1", "L1132-2", "L1134-1"],
      developpement: "Le traitement défavorable subi constitue une discrimination au sens de l'article L1132-1.",
      jurisprudence: [
        "Cass. soc., 3 novembre 2021, n° 20-13.832",
        "Cass. soc., 15 décembre 2021, n° 20-13.339"
      ]
    })
  }
  
  if (questionnaire.heuresSupNonPayees || questionnaire.typeLitige?.includes('heures')) {
    argumentsJuridiques.push({
      titre: "Non-paiement des heures supplémentaires",
      articles: ["L3121-28", "L3121-30", "L3171-4"],
      developpement: "L'employeur n'a pas respecté son obligation de paiement des heures supplémentaires effectuées.",
      jurisprudence: [
        "Cass. soc., 14 novembre 2018, n° 17-16.959",
        "Cass. soc., 18 mars 2020, n° 18-10.919"
      ]
    })
  }
  
  return argumentsJuridiques
}

// Génération de la liste des pièces
function generateListePieces(questionnaire) {
  const pieces = []
  let numero = 1
  
  // Pièces obligatoires
  pieces.push({
    numero: numero++,
    intitule: "Pièce d'identité du demandeur",
    description: "Copie recto-verso de la carte d'identité ou du passeport",
    obligatoire: true
  })
  
  if (questionnaire.documents?.contratTravail) {
    pieces.push({
      numero: numero++,
      intitule: "Contrat de travail",
      description: "Original ou copie du contrat de travail et ses avenants",
      obligatoire: true
    })
  }
  
  if (questionnaire.documents?.fichesPaie) {
    pieces.push({
      numero: numero++,
      intitule: "Bulletins de salaire",
      description: "12 derniers bulletins de salaire minimum",
      obligatoire: true
    })
  }
  
  if (questionnaire.documents?.courriers) {
    pieces.push({
      numero: numero++,
      intitule: "Courriers échangés",
      description: "Lettres recommandées, courriers de l'employeur",
      obligatoire: false
    })
  }
  
  if (questionnaire.documents?.emails) {
    pieces.push({
      numero: numero++,
      intitule: "Emails professionnels",
      description: "Impressions des échanges par email pertinents",
      obligatoire: false
    })
  }
  
  if (questionnaire.dateReceptionLettreL) {
    pieces.push({
      numero: numero++,
      intitule: "Lettre de licenciement",
      description: "Original de la lettre de licenciement avec AR",
      obligatoire: true
    })
  }
  
  if (questionnaire.documents?.certificatsMedicaux) {
    pieces.push({
      numero: numero++,
      intitule: "Certificats médicaux",
      description: "Certificats médicaux et arrêts de travail",
      obligatoire: false
    })
  }
  
  if (questionnaire.documents?.attestationsTemoin) {
    pieces.push({
      numero: numero++,
      intitule: "Attestations de témoins",
      description: "Attestations manuscrites avec copie de pièce d'identité",
      obligatoire: false
    })
  }
  
  return pieces
}

// API principale
export async function POST(request) {
  try {
    const body = await request.json()
    const { questionnaire, userId, sessionId } = body
    
    if (!questionnaire) {
      return NextResponse.json(
        { error: 'Questionnaire manquant' },
        { status: 400 }
      )
    }
    
    // Validation des champs obligatoires
    if (!questionnaire.nom || !questionnaire.prenom || !questionnaire.typeLitige) {
      return NextResponse.json(
        { 
          error: 'Champs obligatoires manquants',
          missingFields: {
            nom: !questionnaire.nom,
            prenom: !questionnaire.prenom,
            typeLitige: !questionnaire.typeLitige
          }
        },
        { status: 400 }
      )
    }
    
    // Génération du dossier
    const dossier = await generatePDFDocument(
      { userId, sessionId },
      questionnaire,
      { score: 85 } // Score du diagnostic
    )
    
    // Génération des arguments juridiques
    const argumentsJuridiques = generateArgumentsJuridiques(questionnaire)
    
    // Génération de la liste des pièces
    const listePieces = generateListePieces(questionnaire)
    
    // Structure complète du dossier
    const dossierComplet = {
      ...dossier,
      
      // Requête principale
      requete: {
        tribunal: determinerTribunal(questionnaire),
        demandes: questionnaire.objectifs || [],
        argumentsJuridiques,
        
        // Chiffrage des demandes
        chiffrage: {
          principal: dossier.calculs.total,
          provision: Math.floor(dossier.calculs.total * 0.3),
          article700: 1500, // Frais d'avocat
          interets: true,
          executionProvisoire: true
        }
      },
      
      // Documents à joindre
      pieces: listePieces,
      
      // Modèles de lettres
      modeles: {
        saisine: generateModeleSaisine(questionnaire, dossier),
        demandePieces: generateDemandesPieces(questionnaire),
        miseEnDemeure: generateMiseEnDemeure(questionnaire, dossier)
      },
      
      // Guide de procédure personnalisé
      guide: {
        etapes: generateEtapesProcedure(questionnaire),
        delais: calculateDelais(questionnaire),
        conseils: generateConseils(questionnaire)
      },
      
      // Métadonnées
      metadata: {
        genereeLe: new Date().toISOString(),
        version: '2.0',
        validiteJuridique: '6 mois',
        prochaineMiseAJour: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
    
    // Stockage temporaire (en production : base de données)
    const downloadToken = Buffer.from(JSON.stringify({
      dossierId: dossierComplet.id,
      userId: userId || 'anonymous',
      timestamp: Date.now()
    })).toString('base64')
    
    // Réponse avec lien de téléchargement
    return NextResponse.json({
      success: true,
      message: 'Dossier généré avec succès',
      dossier: {
        id: dossierComplet.id,
        dateGeneration: dossierComplet.dateGeneration,
        montantTotal: dossierComplet.calculs.total,
        nombrePieces: listePieces.length,
        tribunal: dossierComplet.requete.tribunal
      },
      downloadToken,
      downloadUrl: `/telecharger-dossier?token=${downloadToken}`,
      validite: '48h',
      
      // Résumé pour l'utilisateur
      resume: {
        indemnites: Object.entries(dossierComplet.calculs.indemnites)
          .filter(([_, v]) => v > 0)
          .map(([k, v]) => ({ type: k, montant: v })),
        dommagesInterets: Object.entries(dossierComplet.calculs.dommagesInterets)
          .filter(([_, v]) => v > 0)
          .map(([k, v]) => ({ type: k, montant: v })),
        total: dossierComplet.calculs.total,
        arguments: argumentsJuridiques.length,
        pieces: listePieces.filter(p => p.obligatoire).length
      }
    })
    
  } catch (error) {
    console.error('Erreur génération dossier:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la génération du dossier',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// Déterminer le tribunal compétent
function determinerTribunal(questionnaire) {
  const ville = questionnaire.ville || 'Paris'
  const codePostal = questionnaire.codePostal || '75000'
  
  // En production : utiliser une vraie base de données des CPH
  const departement = codePostal.substring(0, 2)
  
  return {
    nom: `Conseil de Prud'hommes de ${ville}`,
    adresse: `Tribunal de ${ville}`,
    section: determinerSection(questionnaire),
    departement
  }
}

// Déterminer la section prud'homale
function determinerSection(questionnaire) {
  const poste = questionnaire.intitulePoste?.toLowerCase() || ''
  const convention = questionnaire.conventionCollective?.toLowerCase() || ''
  
  if (convention.includes('métallurgie') || convention.includes('industrie')) {
    return 'Industrie'
  }
  if (convention.includes('commerce') || poste.includes('vendeur')) {
    return 'Commerce'
  }
  if (poste.includes('cadre') || poste.includes('ingénieur')) {
    return 'Encadrement'
  }
  if (convention.includes('agriculture')) {
    return 'Agriculture'
  }
  
  return 'Activités diverses'
}

// Générer le modèle de saisine
function generateModeleSaisine(questionnaire, dossier) {
  return {
    titre: "Saisine du Conseil de Prud'hommes",
    contenu: `
CONSEIL DE PRUD'HOMMES DE ${questionnaire.ville?.toUpperCase() || 'PARIS'}

DEMANDEUR :
${questionnaire.prenom} ${questionnaire.nom}
${questionnaire.adresse}
${questionnaire.codePostal} ${questionnaire.ville}

DÉFENDEUR :
${questionnaire.nomEntreprise}
${questionnaire.siret ? `SIRET : ${questionnaire.siret}` : ''}
${questionnaire.adresseSiege}

OBJET : Saisine du Conseil de Prud'hommes

Madame, Monsieur le Président,

J'ai l'honneur de saisir votre juridiction d'un litige m'opposant à mon employeur.

Type de litige : ${questionnaire.typeLitige}
Date du conflit : ${questionnaire.dateDebutConflit}

DEMANDES :
${questionnaire.objectifs?.map(o => `- ${o}`).join('\n') || ''}

Montant total des demandes : ${dossier.calculs.total} €

Je vous prie de bien vouloir convoquer les parties à une audience de conciliation.

Fait à ${questionnaire.ville}, le ${new Date().toLocaleDateString('fr-FR')}

Signature : ${questionnaire.prenom} ${questionnaire.nom}

PIÈCES JOINTES : Voir bordereau
    `
  }
}

// Générer les demandes de pièces
function generateDemandesPieces(questionnaire) {
  return {
    titre: "Demande de communication de pièces",
    contenu: `Liste des pièces à demander à l'employeur :
- Registre unique du personnel
- Livre de paie
- Planning et pointages des 12 derniers mois
- Contrat de travail et avenants
- Règlement intérieur
- Accords d'entreprise applicables`
  }
}

// Générer la mise en demeure
function generateMiseEnDemeure(questionnaire, dossier) {
  return {
    titre: "Mise en demeure préalable",
    contenu: `Lettre recommandée avec AR

Objet : Mise en demeure - Régularisation de situation

Madame, Monsieur,

Par la présente, je vous mets en demeure de procéder à la régularisation de ma situation.

[Détails du litige]

Montant réclamé : ${dossier.calculs.total} €

Sans réponse sous 8 jours, je saisirai le Conseil de Prud'hommes.

Cordialement,`
  }
}

// Générer les étapes de procédure
function generateEtapesProcedure(questionnaire) {
  return [
    {
      numero: 1,
      titre: "Tentative de résolution amiable",
      delai: "Immédiat",
      description: "Envoyer la mise en demeure à l'employeur",
      fait: false
    },
    {
      numero: 2,
      titre: "Saisine du CPH",
      delai: "Si échec amiable",
      description: "Déposer le dossier au greffe du tribunal",
      fait: false
    },
    {
      numero: 3,
      titre: "Audience de conciliation",
      delai: "1-3 mois",
      description: "Tentative de conciliation obligatoire",
      fait: false
    },
    {
      numero: 4,
      titre: "Audience de jugement",
      delai: "6-12 mois",
      description: "Si échec de la conciliation",
      fait: false
    },
    {
      numero: 5,
      titre: "Jugement",
      delai: "1-2 mois après audience",
      description: "Décision du tribunal",
      fait: false
    }
  ]
}

// Calculer les délais
function calculateDelais(questionnaire) {
  const dateConflit = new Date(questionnaire.dateDebutConflit || Date.now())
  const aujourd = new Date()
  const delaiEcoule = Math.floor((aujourd - dateConflit) / (24 * 60 * 60 * 1000))
  
  return {
    delaiEcoule,
    prescription: questionnaire.typeLitige?.includes('salaire') ? 3 * 365 : 2 * 365,
    joursRestants: Math.max(0, (2 * 365) - delaiEcoule),
    urgent: delaiEcoule > 365
  }
}

// Générer les conseils personnalisés
function generateConseils(questionnaire) {
  const conseils = []
  
  if (!questionnaire.documents?.contratTravail) {
    conseils.push({
      importance: 'haute',
      conseil: "Récupérez votre contrat de travail auprès de l'employeur ou demandez-en une copie"
    })
  }
  
  if (!questionnaire.temoins?.length) {
    conseils.push({
      importance: 'moyenne',
      conseil: "Recherchez des témoins de votre situation (collègues, clients, fournisseurs)"
    })
  }
  
  if (questionnaire.prejudiceMoral && !questionnaire.documents?.certificatsMedicaux) {
    conseils.push({
      importance: 'haute',
      conseil: "Consultez un médecin pour faire constater l'impact sur votre santé"
    })
  }
  
  conseils.push({
    importance: 'haute',
    conseil: "Conservez tous les nouveaux documents en lien avec votre litige"
  })
  
  return conseils
}

// GET pour vérifier le statut
export async function GET(request) {
  return NextResponse.json({
    status: 'operational',
    service: 'JustiJob - Générateur de dossier prud\'hommes',
    version: '2.0',
    capabilities: {
      requete: true,
      calculs: true,
      arguments: true,
      modeles: true,
      guide: true
    },
    formats: ['PDF', 'JSON'],
    documentation: '/api/generate-dossier/docs'
  })
}