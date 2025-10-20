
// src/components/QuestionnaireGenerator.js
'use client';

import React from 'react';
import { Download, FileText, CheckCircle, AlertCircle, Printer, Mail } from 'lucide-react';

const QuestionnaireGenerator = ({ diagnosticData, onComplete }) => {
  
  // Générer le questionnaire personnalisé selon les problèmes identifiés
  const generateQuestionnaire = () => {
    const { problemes, typeContrat, anciennete } = diagnosticData;
    
    let htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Questionnaire Prud'hommes - JUSTIJOB</title>
    <style>
        @media print {
            .no-print { display: none; }
            body { margin: 0; }
        }
        body {
            font-family: 'Times New Roman', serif;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            line-height: 1.8;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        h1 {
            color: #1e40af;
            font-size: 28px;
            margin: 0 0 10px 0;
        }
        h2 {
            color: #1e40af;
            font-size: 20px;
            margin-top: 30px;
            padding: 10px;
            background: #eff6ff;
            border-left: 4px solid #2563eb;
        }
        h3 {
            color: #374151;
            font-size: 16px;
            margin-top: 20px;
            text-decoration: underline;
        }
        .info-box {
            background: #fef3c7;
            border: 2px solid #fbbf24;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .question {
            margin: 20px 0;
            padding: 15px;
            background: #f9fafb;
            border-left: 3px solid #6b7280;
        }
        .question-number {
            font-weight: bold;
            color: #2563eb;
            margin-right: 10px;
        }
        .response-space {
            border: 1px solid #d1d5db;
            min-height: 60px;
            margin: 10px 0;
            padding: 10px;
            background: white;
        }
        .checkbox-item {
            margin: 10px 0;
            padding: 5px;
        }
        .checkbox {
            display: inline-block;
            width: 15px;
            height: 15px;
            border: 2px solid #374151;
            margin-right: 10px;
            vertical-align: middle;
        }
        .pieces-list {
            background: #dcfce7;
            border: 2px solid #22c55e;
            padding: 20px;
            margin: 30px 0;
            page-break-inside: avoid;
        }
        .piece-item {
            margin: 10px 0;
            padding: 8px;
            background: white;
            border-radius: 3px;
        }
        .obligatoire {
            color: #dc2626;
            font-weight: bold;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }
        .signature-box {
            margin-top: 40px;
            border: 1px solid #000;
            padding: 20px;
        }
        @page {
            margin: 15mm;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>QUESTIONNAIRE PRÉPARATOIRE</h1>
        <p style="font-size: 18px; color: #4b5563;">Conseil de Prud'hommes</p>
        <p style="color: #6b7280;">Document généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        <p style="color: #dc2626; font-weight: bold;">⚠️ À REMPLIR LISIBLEMENT EN MAJUSCULES</p>
    </div>

    <div class="info-box">
        <strong>📌 IMPORTANT :</strong> Ce questionnaire a été personnalisé selon votre situation. 
        Répondez à TOUTES les questions de manière détaillée et précise. 
        Vos réponses permettront de générer un dossier prud'homal sur mesure.
        <br/><br/>
        <strong>Votre référence :</strong> ${diagnosticData.referenceNumber || 'DIAG-' + Date.now()}
    </div>

    <!-- SECTION 1 : IDENTIFICATION -->
    <h2>1. IDENTIFICATION DU DEMANDEUR</h2>
    
    <div class="question">
        <span class="question-number">1.1</span> NOM DE NAISSANCE :
        <div class="response-space"></div>
    </div>
    
    <div class="question">
        <span class="question-number">1.2</span> NOM D'USAGE (si différent) :
        <div class="response-space"></div>
    </div>
    
    <div class="question">
        <span class="question-number">1.3</span> Prénom(s) :
        <div class="response-space"></div>
    </div>
    
    <div class="question">
        <span class="question-number">1.4</span> Date de naissance : ____/____/________ 
        <span style="margin-left: 30px;">Lieu : _______________________</span>
    </div>
    
    <div class="question">
        <span class="question-number">1.5</span> Nationalité :
        <div class="response-space"></div>
    </div>
    
    <div class="question">
        <span class="question-number">1.6</span> Adresse complète actuelle :
        <div class="response-space" style="min-height: 80px;"></div>
    </div>
    
    <div class="question">
        <span class="question-number">1.7</span> Téléphone : _________________ 
        <span style="margin-left: 30px;">Email : _______________________</span>
    </div>
    
    <div class="question">
        <span class="question-number">1.8</span> N° Sécurité Sociale : 
        <div class="response-space"></div>
    </div>

    <!-- SECTION 2 : EMPLOYEUR -->
    <h2>2. IDENTIFICATION DE L'EMPLOYEUR</h2>
    
    <div class="question">
        <span class="question-number">2.1</span> Raison sociale de l'entreprise :
        <div class="response-space"></div>
    </div>
    
    <div class="question">
        <span class="question-number">2.2</span> N° SIRET : _________________ 
        <span style="margin-left: 30px;">Code APE/NAF : _________</span>
    </div>
    
    <div class="question">
        <span class="question-number">2.3</span> Adresse du siège social :
        <div class="response-space" style="min-height: 80px;"></div>
    </div>
    
    <div class="question">
        <span class="question-number">2.4</span> Adresse de votre lieu de travail (si différente) :
        <div class="response-space" style="min-height: 80px;"></div>
    </div>
    
    <div class="question">
        <span class="question-number">2.5</span> Nom de votre supérieur hiérarchique direct :
        <div class="response-space"></div>
    </div>
    
    <div class="question">
        <span class="question-number">2.6</span> Convention collective applicable :
        <div class="response-space"></div>
    </div>

    <!-- SECTION 3 : CONTRAT DE TRAVAIL -->
    <h2>3. INFORMATIONS SUR LE CONTRAT DE TRAVAIL</h2>
    
    <div class="question">
        <span class="question-number">3.1</span> Date d'embauche : ____/____/________
    </div>
    
    <div class="question">
        <span class="question-number">3.2</span> Type de contrat :
        <div style="margin: 10px 0;">
            <div class="checkbox-item"><span class="checkbox">☐</span> CDI</div>
            <div class="checkbox-item"><span class="checkbox">☐</span> CDD (préciser dates : du ____/____/____ au ____/____/____)</div>
            <div class="checkbox-item"><span class="checkbox">☐</span> Intérim</div>
            <div class="checkbox-item"><span class="checkbox">☐</span> Autre : _________________</div>
        </div>
    </div>
    
    <div class="question">
        <span class="question-number">3.3</span> Intitulé exact du poste occupé :
        <div class="response-space"></div>
    </div>
    
    <div class="question">
        <span class="question-number">3.4</span> Classification/Coefficient :
        <div class="response-space"></div>
    </div>
    
    <div class="question">
        <span class="question-number">3.5</span> Salaire mensuel BRUT : _____________ €
        <span style="margin-left: 30px;">NET : _____________ €</span>
    </div>
    
    <div class="question">
        <span class="question-number">3.6</span> Horaires de travail habituels :
        <div class="response-space"></div>
    </div>
    
    <div class="question">
        <span class="question-number">3.7</span> Nombre d'heures hebdomadaires contractuelles : _______ heures
    </div>

    ${problemes.includes('heures-sup') ? `
    <!-- SECTION 4 : HEURES SUPPLÉMENTAIRES -->
    <h2 style="page-break-before: always;">4. DÉTAIL DES HEURES SUPPLÉMENTAIRES</h2>
    
    <div class="info-box">
        <strong>⚠️ SECTION CRITIQUE :</strong> Soyez le plus précis possible. 
        Ces informations sont essentielles pour calculer vos indemnités.
    </div>
    
    <div class="question">
        <span class="question-number">4.1</span> Depuis quand effectuez-vous des heures supplémentaires non payées ?
        <div class="response-space"></div>
    </div>
    
    <div class="question">
        <span class="question-number">4.2</span> Nombre moyen d'heures supplémentaires PAR SEMAINE :
        <div class="response-space"></div>
    </div>
    
    <div class="question">
        <span class="question-number">4.3</span> Détaillez une semaine type (lundi au dimanche) :
        <div style="margin: 10px 0;">
            <p>Lundi : Arrivée ___h___ Départ ___h___ Pause ___min Total : ___h</p>
            <p>Mardi : Arrivée ___h___ Départ ___h___ Pause ___min Total : ___h</p>
            <p>Mercredi : Arrivée ___h___ Départ ___h___ Pause ___min Total : ___h</p>
            <p>Jeudi : Arrivée ___h___ Départ ___h___ Pause ___min Total : ___h</p>
            <p>Vendredi : Arrivée ___h___ Départ ___h___ Pause ___min Total : ___h</p>
            <p>Samedi : Arrivée ___h___ Départ ___h___ Pause ___min Total : ___h</p>
            <p>Dimanche : Arrivée ___h___ Départ ___h___ Pause ___min Total : ___h</p>
        </div>
    </div>
    
    <div class="question">
        <span class="question-number">4.4</span> Comment enregistrez-vous vos heures ? (pointeuse, feuille, email...) :
        <div class="response-space"></div>
    </div>
    
    <div class="question">
        <span class="question-number">4.5</span> Votre manager est-il au courant de ces heures supplémentaires ?
        <div class="checkbox-item"><span class="checkbox">☐</span> OUI <span class="checkbox">☐</span> NON</div>
        Si OUI, quelle a été sa réaction ?
        <div class="response-space"></div>
    </div>
    
    <div class="question">
        <span class="question-number">4.6</span> Avez-vous des collègues dans la même situation qui pourraient témoigner ?
        <div class="response-space"></div>
    </div>
    ` : ''}

    ${problemes.includes('licenciement') ? `
    <!-- SECTION 5 : LICENCIEMENT -->
    <h2 style="page-break-before: always;">5. DÉTAILS DU LICENCIEMENT</h2>
    
    <div class="question">
        <span class="question-number">5.1</span> Date de la convocation à l'entretien préalable : ____/____/________
    </div>
    
    <div class="question">
        <span class="question-number">5.2</span> Date de l'entretien préalable : ____/____/________
    </div>
    
    <div class="question">
        <span class="question-number">5.3</span> Date de réception de la lettre de licenciement : ____/____/________
    </div>
    
    <div class="question">
        <span class="question-number">5.4</span> Motif EXACT inscrit dans la lettre de licenciement :
        <div class="response-space" style="min-height: 100px;"></div>
    </div>
    
    <div class="question">
        <span class="question-number">5.5</span> Ce motif est-il selon vous justifié ? Expliquez :
        <div class="response-space" style="min-height: 100px;"></div>
    </div>
    
    <div class="question">
        <span class="question-number">5.6</span> Aviez-vous reçu des avertissements/sanctions avant ?
        <div class="checkbox-item"><span class="checkbox">☐</span> OUI <span class="checkbox">☐</span> NON</div>
        Si OUI, détaillez (dates, motifs) :
        <div class="response-space" style="min-height: 80px;"></div>
    </div>
    
    <div class="question">
        <span class="question-number">5.7</span> Étiez-vous en arrêt maladie, congé maternité ou avez-vous dénoncé des faits dans l'entreprise avant le licenciement ?
        <div class="response-space" style="min-height: 80px;"></div>
    </div>
    ` : ''}

    ${problemes.includes('harcelement') ? `
    <!-- SECTION 6 : HARCÈLEMENT -->
    <h2 style="page-break-before: always;">6. FAITS DE HARCÈLEMENT</h2>
    
    <div class="info-box" style="background: #fee2e2; border-color: #dc2626;">
        <strong>⚠️ SECTION SENSIBLE :</strong> Décrivez les faits de manière factuelle et chronologique. 
        Chaque détail compte. N'hésitez pas à utiliser des feuilles supplémentaires si nécessaire.
    </div>
    
    <div class="question">
        <span class="question-number">6.1</span> Type de harcèlement subi :
        <div class="checkbox-item"><span class="checkbox">☐</span> Moral</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> Sexuel</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> Les deux</div>
    </div>
    
    <div class="question">
        <span class="question-number">6.2</span> Qui est l'auteur du harcèlement ? (nom, fonction) :
        <div class="response-space"></div>
    </div>
    
    <div class="question">
        <span class="question-number">6.3</span> Date du premier fait : ____/____/________
    </div>
    
    <div class="question">
        <span class="question-number">6.4</span> Fréquence des faits :
        <div class="checkbox-item"><span class="checkbox">☐</span> Quotidien</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> Plusieurs fois par semaine</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> Hebdomadaire</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> Autre : _________________</div>
    </div>
    
    <div class="question">
        <span class="question-number">6.5</span> Décrivez PRÉCISÉMENT 3 situations caractéristiques (date, lieu, personnes présentes, paroles/gestes, témoins) :
        
        <p style="font-weight: bold; margin-top: 20px;">SITUATION 1 :</p>
        <div class="response-space" style="min-height: 150px;"></div>
        
        <p style="font-weight: bold; margin-top: 20px;">SITUATION 2 :</p>
        <div class="response-space" style="min-height: 150px;"></div>
        
        <p style="font-weight: bold; margin-top: 20px;">SITUATION 3 :</p>
        <div class="response-space" style="min-height: 150px;"></div>
    </div>
    
    <div class="question">
        <span class="question-number">6.6</span> Avez-vous alerté quelqu'un dans l'entreprise ?
        <div class="checkbox-item"><span class="checkbox">☐</span> Direction/RH - Date : ____/____/____</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> Médecine du travail - Date : ____/____/____</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> CSE/Délégués - Date : ____/____/____</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> Inspection du travail - Date : ____/____/____</div>
        Quelle a été la réaction ?
        <div class="response-space" style="min-height: 80px;"></div>
    </div>
    
    <div class="question">
        <span class="question-number">6.7</span> Impact sur votre santé (arrêts maladie, traitement, suivi psy...) :
        <div class="response-space" style="min-height: 100px;"></div>
    </div>
    
    <div class="question">
        <span class="question-number">6.8</span> Témoins potentiels (nom, fonction, coordonnées si possible) :
        <div class="response-space" style="min-height: 100px;"></div>
    </div>
    ` : ''}

    ${problemes.includes('discrimination') ? `
    <!-- SECTION 7 : DISCRIMINATION -->
    <h2 style="page-break-before: always;">7. FAITS DE DISCRIMINATION</h2>
    
    <div class="question">
        <span class="question-number">7.1</span> Motif de discrimination subie :
        <div class="checkbox-item"><span class="checkbox">☐</span> Origine</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> Sexe</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> Âge</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> Handicap</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> Religion</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> Orientation sexuelle</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> Grossesse/Maternité</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> Activité syndicale</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> Autre : _________________</div>
    </div>
    
    <div class="question">
        <span class="question-number">7.2</span> En quoi consiste la discrimination (salaire, promotion, formation...) :
        <div class="response-space" style="min-height: 100px;"></div>
    </div>
    
    <div class="question">
        <span class="question-number">7.3</span> Pouvez-vous comparer votre situation avec des collègues ? Donnez des exemples précis :
        <div class="response-space" style="min-height: 100px;"></div>
    </div>
    ` : ''}

    <!-- SECTION INDEMNITÉS -->
    <h2 style="page-break-before: always;">8. CALCUL DES PRÉJUDICES</h2>
    
    <div class="question">
        <span class="question-number">8.1</span> Êtes-vous actuellement :
        <div class="checkbox-item"><span class="checkbox">☐</span> En poste</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> Au chômage depuis le : ____/____/____</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> En arrêt maladie depuis le : ____/____/____</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> Autre : _________________</div>
    </div>
    
    <div class="question">
        <span class="question-number">8.2</span> Montant des indemnités chômage (si applicable) : _________ €/mois
    </div>
    
    <div class="question">
        <span class="question-number">8.3</span> Avez-vous retrouvé un emploi ?
        <div class="checkbox-item"><span class="checkbox">☐</span> OUI - Date : ____/____/____ - Salaire : _________ €</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> NON</div>
    </div>
    
    <div class="question">
        <span class="question-number">8.4</span> Autres préjudices subis (décrivez tous les impacts : financiers, moraux, professionnels) :
        <div class="response-space" style="min-height: 150px;"></div>
    </div>

    <!-- SECTION NÉGOCIATION -->
    <h2>9. TENTATIVES DE RÉSOLUTION AMIABLE</h2>
    
    <div class="question">
        <span class="question-number">9.1</span> Avez-vous tenté de résoudre le conflit avec l'employeur ?
        <div class="checkbox-item"><span class="checkbox">☐</span> OUI <span class="checkbox">☐</span> NON</div>
        Si OUI, comment et quelle a été la réponse ?
        <div class="response-space" style="min-height: 80px;"></div>
    </div>
    
    <div class="question">
        <span class="question-number">9.2</span> Seriez-vous prêt à une conciliation ?
        <div class="checkbox-item"><span class="checkbox">☐</span> OUI, à quelles conditions : _________________</div>
        <div class="checkbox-item"><span class="checkbox">☐</span> NON, je veux aller jusqu'au jugement</div>
    </div>

    <!-- LISTE DES PIÈCES À FOURNIR -->
    <div class="pieces-list" style="page-break-before: always;">
        <h2 style="background: none; border: none; color: #16a34a;">📎 PIÈCES À RASSEMBLER ET JOINDRE OBLIGATOIREMENT</h2>
        
        <p style="color: #dc2626; font-weight: bold;">
            ⚠️ SANS CES DOCUMENTS, VOTRE DOSSIER NE POURRA PAS ÊTRE TRAITÉ
        </p>
        
        <h3>DOCUMENTS OBLIGATOIRES POUR TOUS :</h3>
        <div class="piece-item">
            ☐ <span class="obligatoire">OBLIGATOIRE</span> : Pièce d'identité (CNI ou passeport) recto-verso
        </div>
        <div class="piece-item">
            ☐ <span class="obligatoire">OBLIGATOIRE</span> : Contrat de travail (toutes les pages)
        </div>
        <div class="piece-item">
            ☐ <span class="obligatoire">OBLIGATOIRE</span> : 3 derniers bulletins de salaire minimum
        </div>
        <div class="piece-item">
            ☐ <span class="obligatoire">OBLIGATOIRE</span> : Certificat de travail (si rupture)
        </div>
        <div class="piece-item">
            ☐ <span class="obligatoire">OBLIGATOIRE</span> : Attestation Pôle Emploi (si rupture)
        </div>
        <div class="piece-item">
            ☐ <span class="obligatoire">OBLIGATOIRE</span> : RIB (pour versement éventuel d'indemnités)
        </div>
        
        ${problemes.includes('licenciement') ? `
        <h3>POUR LICENCIEMENT :</h3>
        <div class="piece-item">
            ☐ <span class="obligatoire">OBLIGATOIRE</span> : Lettre de convocation à l'entretien préalable
        </div>
        <div class="piece-item">
            ☐ <span class="obligatoire">OBLIGATOIRE</span> : Lettre de licenciement
        </div>
        <div class="piece-item">
            ☐ <span class="obligatoire">OBLIGATOIRE</span> : Solde de tout compte
        </div>
        <div class="piece-item">
            ☐ Si existant : Avertissements ou sanctions antérieures
        </div>
        ` : ''}
        
        ${problemes.includes('heures-sup') ? `
        <h3>POUR HEURES SUPPLÉMENTAIRES :</h3>
        <div class="piece-item">
            ☐ <span class="obligatoire">OBLIGATOIRE</span> : Tous les bulletins de salaire de la période concernée
        </div>
        <div class="piece-item">
            ☐ <span class="obligatoire">OBLIGATOIRE</span> : Plannings de travail
        </div>
        <div class="piece-item">
            ☐ Si existant : Relevés de pointage/badgeuse
        </div>
        <div class="piece-item">
            ☐ Si existant : Emails prouvant les horaires (convocations, demandes de travail)
        </div>
        <div class="piece-item">
            ☐ Si existant : Captures d'écran d'ordinateur avec horodatage
        </div>
        <div class="piece-item">
            ☐ Si existant : Agendas professionnels
        </div>
        ` : ''}
        
        ${problemes.includes('harcelement') ? `
        <h3>POUR HARCÈLEMENT :</h3>
        <div class="piece-item">
            ☐ <span class="obligatoire">OBLIGATOIRE</span> : Chronologie détaillée des faits (ce document)
        </div>
        <div class="piece-item">
            ☐ <span class="obligatoire">TRÈS IMPORTANT</span> : Certificats médicaux mentionnant l'impact
        </div>
        <div class="piece-item">
            ☐ <span class="obligatoire">TRÈS IMPORTANT</span> : Arrêts de travail
        </div>
        <div class="piece-item">
            ☐ Si existant : Emails, SMS, messages vocaux de l'harceleur
        </div>
        <div class="piece-item">
            ☐ Si existant : Témoignages écrits avec copie CNI du témoin
        </div>
        <div class="piece-item">
            ☐ Si existant : Courriers à l'employeur/RH signalant les faits
        </div>
        <div class="piece-item">
            ☐ Si existant : Compte-rendu médecine du travail
        </div>
        <div class="piece-item">
            ☐ Si existant : Main courante ou plainte
        </div>
        ` : ''}
        
        ${problemes.includes('discrimination') ? `
        <h3>POUR DISCRIMINATION :</h3>
        <div class="piece-item">
            ☐ <span class="obligatoire">OBLIGATOIRE</span> : Éléments de comparaison avec d'autres salariés
        </div>
        <div class="piece-item">
            ☐ Si existant : Organigramme de l'entreprise
        </div>
        <div class="piece-item">
            ☐ Si existant : Fiches de poste des collègues en situation comparable
        </div>
        <div class="piece-item">
            ☐ Si existant : Grille de salaires
        </div>
        <div class="piece-item">
            ☐ Si existant : Refus de formation, promotion (écrits)
        </div>
        ` : ''}
        
        <h3>TÉMOIGNAGES (si vous en avez) :</h3>
        <div class="piece-item">
            ☐ Attestations de témoins sur papier libre
        </div>
        <div class="piece-item">
            ☐ <span class="obligatoire">OBLIGATOIRE avec témoignage</span> : Copie CNI du témoin
        </div>
        
        <div style="background: #fef3c7; padding: 15px; margin-top: 20px; border-radius: 5px;">
            <p style="margin: 0;">
                <strong>💡 CONSEIL :</strong> Numérotez vos pièces et faites-en 5 copies : 
                1 pour vous, 1 pour le greffe, 2 pour les juges, 1 pour l'employeur.
            </p>
        </div>
    </div>

    <!-- SIGNATURE ET ENGAGEMENT -->
    <div class="signature-box" style="page-break-before: always;">
        <h2 style="background: none; border: none;">DÉCLARATION SUR L'HONNEUR</h2>
        
        <p style="line-height: 2;">
            Je soussigné(e) ___________________________________ certifie sur l'honneur que 
            les informations fournies dans ce questionnaire sont exactes et sincères.
        </p>
        
        <p style="line-height: 2;">
            Je comprends que toute fausse déclaration pourrait nuire à ma procédure et engager 
            ma responsabilité.
        </p>
        
        <p style="line-height: 2;">
            J'autorise JUSTIJOB à utiliser ces informations pour la préparation de mon dossier 
            prud'homal, dans le respect du secret professionnel et du RGPD.
        </p>
        
        <div style="margin-top: 40px;">
            <p>Fait à : _________________________ Le : ____/____/________</p>
            
            <p style="margin-top: 30px;">Signature (précédée de la mention "Lu et approuvé") :</p>
            
            <div style="height: 80px;"></div>
        </div>
    </div>

    <!-- INSTRUCTIONS FINALES -->
    <div style="page-break-before: always; background: #dcfce7; padding: 30px; margin-top: 30px;">
        <h2 style="background: none; border: none; text-align: center;">✅ PROCHAINES ÉTAPES</h2>
        
        <ol style="line-height: 2; font-size: 16px;">
            <li><strong>REMPLISSEZ</strong> ce questionnaire intégralement et lisiblement</li>
            <li><strong>RASSEMBLEZ</strong> toutes les pièces listées (cochez au fur et à mesure)</li>
            <li><strong>SCANNEZ</strong> ou photographiez l'ensemble en bonne qualité</li>
            <li><strong>UPLOADEZ</strong> sur notre plateforme sécurisée JUSTIJOB</li>
            <li><strong>PROCÉDEZ AU PAIEMENT</strong> (90€ ou 45€ via syndicat)</li>
            <li><strong>RECEVEZ</strong> votre dossier complet sous 48h</li>
        </ol>
        
        <div style="background: white; padding: 20px; margin-top: 20px; border: 2px solid #16a34a;">
            <p style="text-align: center; font-weight: bold; color: #16a34a; font-size: 18px;">
                📞 BESOIN D'AIDE ?
            </p>
            <p style="text-align: center;">
                Support JUSTIJOB : support@justijob.fr<br/>
                Réponse sous 24h ouvrées
            </p>
        </div>
    </div>

    <div class="footer">
        <p>Document généré par JUSTIJOB - La Défense Active</p>
        <p>Plateforme d'aide juridique aux salariés</p>
        <p>www.justijob.fr</p>
    </div>
</body>
</html>
    `;
    
    return htmlContent;
  };
  
  // Fonction pour télécharger le questionnaire
  const downloadQuestionnaire = () => {
    const htmlContent = generateQuestionnaire();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `questionnaire-prudhommes-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  
  // Fonction pour envoyer par email
  const sendByEmail = async () => {
    // Simulation d'envoi (en production, appeler votre API)
    alert('Le questionnaire a été envoyé à votre adresse email !');
    
    // En production :
    /*
    const response = await fetch('/api/send-questionnaire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: diagnosticData.email,
        questionnaire: generateQuestionnaire()
      })
    });
    */
  };
  
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-3">
          📋 Préparez votre dossier tranquillement
        </h2>
        <p className="text-blue-100">
          Téléchargez votre questionnaire personnalisé et la liste des documents nécessaires. 
          Prenez le temps de tout préparer avant de passer au paiement.
        </p>
      </div>
      
      {/* Explication du processus */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-4">
          Comment ça marche ?
        </h3>
        <ol className="space-y-3">
          <li className="flex items-start">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
            <div>
              <strong>Téléchargez le questionnaire</strong>
              <p className="text-sm text-gray-600">Personnalisé selon vos problèmes identifiés</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
            <div>
              <strong>Remplissez-le tranquillement chez vous</strong>
              <p className="text-sm text-gray-600">Prenez le temps, soyez précis et complet</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
            <div>
              <strong>Rassemblez tous les documents listés</strong>
              <p className="text-sm text-gray-600">La check-list vous guide pas à pas</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
            <div>
              <strong>Quand vous êtes prêt, uploadez tout</strong>
              <p className="text-sm text-gray-600">Sur notre plateforme sécurisée</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">5</span>
            <div>
              <strong>Payez et recevez votre dossier sous 48h</strong>
              <p className="text-sm text-gray-600">90€ (ou 45€ via syndicat)</p>
            </div>
          </li>
        </ol>
      </div>
      
      {/* Boutons d'action */}
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={downloadQuestionnaire}
          className="bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
        >
          <Download className="mr-3" size={24} />
          Télécharger le questionnaire (PDF)
        </button>
        
        <button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
        >
          <Printer className="mr-3" size={24} />
          Imprimer le questionnaire
        </button>
      </div>
      
      <div className="text-center">
        <button
          onClick={sendByEmail}
          className="text-blue-600 hover:underline font-medium"
        >
          <Mail className="inline mr-2" size={20} />
          Recevoir aussi par email
        </button>
      </div>
      
      {/* Informations importantes */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="text-amber-600 mr-3 mt-0.5" size={24} />
          <div>
            <h4 className="font-semibold text-amber-900 mb-2">
              Points importants
            </h4>
            <ul className="space-y-1 text-sm text-amber-800">
              <li>• Le questionnaire fait environ 10-15 pages selon votre situation</li>
              <li>• Prévoyez 1 à 2 heures pour le remplir correctement</li>
              <li>• Écrivez lisiblement en MAJUSCULES</li>
              <li>• N'hésitez pas à ajouter des feuilles si nécessaire</li>
              <li>• La signature et la déclaration sur l'honneur sont obligatoires</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Garantie */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <CheckCircle className="text-green-600 mx-auto mb-2" size={32} />
        <p className="text-green-800 font-medium">
          Ce questionnaire est 100% GRATUIT et sans engagement
        </p>
        <p className="text-sm text-green-700 mt-1">
          Vous ne payez que si vous décidez de faire analyser votre dossier
        </p>
      </div>
      
      {/* Bouton pour continuer */}
      {onComplete && (
        <div className="text-center pt-4">
          <button
            onClick={onComplete}
            className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-8 rounded-lg font-medium transition-all duration-200"
          >
            J'ai téléchargé, continuer →
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireGenerator;