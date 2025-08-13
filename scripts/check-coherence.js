
#!/usr/bin/env node
// scripts/check-coherence.js
// Script de vérification de cohérence pour JustiJob

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  prixPublic: '90€',
  prixSyndicat: '45€',
  mentionsInterdites: ['39€', 'diagnostic (39€)', 'Commencer le diagnostic (39€)'],
  mentionsObligatoires: {
    diagnostic: ['gratuit', 'sans engagement'],
    claude: ['Claude', 'Anthropic'],
    calculateurs: ['diagnostic gratuit']
  }
};

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Résultats
let errors = [];
let warnings = [];
let success = [];

/**
 * Vérification d'un fichier
 */
function checkFile(filePath) {
  const fileName = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  
  console.log(`\n${colors.blue}Vérification : ${fileName}${colors.reset}`);
  
  // 1. Vérifier les mentions de prix incorrects
  CONFIG.mentionsInterdites.forEach(mention => {
    if (content.includes(mention)) {
      errors.push({
        file: fileName,
        error: `Mention interdite trouvée : "${mention}"`,
        line: findLineNumber(content, mention)
      });
    }
  });
  
  // 2. Vérifications spécifiques par type de fichier
  if (fileName.includes('calculateurs')) {
    checkCalculateur(fileName, content);
  }
  
  if (fileName === 'page.js' && filePath.includes('diagnostic')) {
    checkDiagnostic(fileName, content);
  }
  
  if (fileName === 'page.js' && filePath.includes('questionnaire')) {
    checkQuestionnaire(fileName, content);
  }
  
  if (fileName.includes('route.js') && filePath.includes('generate-dossier')) {
    checkGenerateDossier(fileName, content);
  }
}

/**
 * Vérification spécifique calculateurs
 */
function checkCalculateur(fileName, content) {
  // Vérifier lien vers diagnostic gratuit
  if (!content.includes('href="/diagnostic"')) {
    warnings.push({
      file: fileName,
      warning: 'Pas de lien vers /diagnostic'
    });
  }
  
  if (!content.includes('diagnostic gratuit') && !content.includes('Diagnostic gratuit')) {
    errors.push({
      file: fileName,
      error: 'Mention "diagnostic gratuit" manquante'
    });
  }
  
  // Vérifier qu'il n'y a pas de prix mentionné
  if (content.includes('90€') || content.includes('45€')) {
    warnings.push({
      file: fileName,
      warning: 'Prix mentionné dans un calculateur gratuit'
    });
  }
  
  success.push({
    file: fileName,
    check: 'Structure calculateur OK'
  });
}

/**
 * Vérification page diagnostic
 */
function checkDiagnostic(fileName, content) {
  // Vérifier mention gratuit
  if (!content.includes('100% Gratuit') && !content.includes('100% gratuit')) {
    errors.push({
      file: fileName,
      error: 'Mention "100% Gratuit" manquante'
    });
  }
  
  // Vérifier prix correct
  if (!content.includes('90€')) {
    errors.push({
      file: fileName,
      error: 'Prix 90€ non mentionné'
    });
  }
  
  if (!content.includes('45€')) {
    warnings.push({
      file: fileName,
      warning: 'Prix syndicat 45€ non mentionné'
    });
  }
  
  // Vérifier code syndicat
  if (!content.includes('code syndicat') && !content.includes('code-syndicat')) {
    warnings.push({
      file: fileName,
      warning: 'Système de code syndicat non trouvé'
    });
  }
  
  success.push({
    file: fileName,
    check: 'Page diagnostic conforme'
  });
}

/**
 * Vérification questionnaire
 */
function checkQuestionnaire(fileName, content) {
  // Vérifier les 6 sections
  const sections = [
    'Informations personnelles',
    'Contrat de travail',
    'Nature du litige',
    'Preuves et témoignages',
    'Procédures suivies',
    'Objectifs et attentes'
  ];
  
  sections.forEach(section => {
    if (!content.includes(section)) {
      errors.push({
        file: fileName,
        error: `Section manquante : "${section}"`
      });
    }
  });
  
  // Vérifier sauvegarde
  if (!content.includes('localStorage')) {
    warnings.push({
      file: fileName,
      warning: 'Sauvegarde localStorage non implémentée'
    });
  }
  
  // Vérifier attestation
  if (!content.includes('attestation') || !content.includes('honneur')) {
    errors.push({
      file: fileName,
      error: 'Attestation sur l\'honneur manquante'
    });
  }
  
  success.push({
    file: fileName,
    check: 'Questionnaire structure OK'
  });
}

/**
 * Vérification API génération dossier
 */
function checkGenerateDossier(fileName, content) {
  // Vérifier pas d'utilisation de 'arguments' comme variable
  if (content.match(/const arguments\s*=/)) {
    errors.push({
      file: fileName,
      error: 'Variable "arguments" (mot réservé JS) utilisée'
    });
  }
  
  // Vérifier présence des fonctions clés
  const requiredFunctions = [
    'calculateIndemnites',
    'calculateDommages',
    'generateArgumentsJuridiques',
    'determinerTribunal'
  ];
  
  requiredFunctions.forEach(func => {
    if (!content.includes(func)) {
      errors.push({
        file: fileName,
        error: `Fonction manquante : ${func}`
      });
    }
  });
  
  success.push({
    file: fileName,
    check: 'API génération OK'
  });
}

/**
 * Trouver le numéro de ligne
 */
function findLineNumber(content, searchString) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchString)) {
      return i + 1;
    }
  }
  return 'N/A';
}

/**
 * Scanner tous les fichiers
 */
function scanDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.')) {
      scanDirectory(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      checkFile(filePath);
    }
  });
}

/**
 * Rapport final
 */
function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.blue}📊 RAPPORT DE COHÉRENCE JUSTIJOB${colors.reset}`);
  console.log('='.repeat(60));
  
  // Erreurs
  if (errors.length > 0) {
    console.log(`\n${colors.red}❌ ERREURS (${errors.length})${colors.reset}`);
    errors.forEach(err => {
      console.log(`  • ${err.file} : ${err.error}`);
      if (err.line) console.log(`    Ligne ${err.line}`);
    });
  }
  
  // Warnings
  if (warnings.length > 0) {
    console.log(`\n${colors.yellow}⚠️  WARNINGS (${warnings.length})${colors.reset}`);
    warnings.forEach(warn => {
      console.log(`  • ${warn.file} : ${warn.warning}`);
    });
  }
  
  // Succès
  console.log(`\n${colors.green}✅ VÉRIFICATIONS RÉUSSIES (${success.length})${colors.reset}`);
  success.forEach(succ => {
    console.log(`  • ${succ.file} : ${succ.check}`);
  });
  
  // Résumé
  console.log('\n' + '='.repeat(60));
  const total = errors.length + warnings.length + success.length;
  const score = Math.round((success.length / total) * 100);
  
  console.log(`📈 Score de cohérence : ${score}%`);
  
  if (errors.length === 0) {
    console.log(`${colors.green}🎉 Aucune erreur critique !${colors.reset}`);
  } else {
    console.log(`${colors.red}⚠️  ${errors.length} erreurs à corriger${colors.reset}`);
  }
  
  console.log('='.repeat(60));
  
  // Actions recommandées
  if (errors.length > 0 || warnings.length > 0) {
    console.log(`\n${colors.blue}🔧 ACTIONS RECOMMANDÉES :${colors.reset}`);
    console.log('1. Corriger toutes les erreurs (rouge)');
    console.log('2. Examiner les warnings (jaune)');
    console.log('3. Re-lancer le script après corrections');
    console.log('4. Viser un score de 100%');
  }
}

/**
 * Créer un fichier de corrections
 */
function generateFixFile() {
  const fixes = [];
  
  errors.forEach(err => {
    fixes.push({
      file: err.file,
      issue: err.error,
      fix: getSuggestedFix(err.error)
    });
  });
  
  const fixContent = `# Corrections à apporter\n\n${fixes.map(f => 
    `## ${f.file}\n**Problème:** ${f.issue}\n**Solution:** ${f.fix}\n`
  ).join('\n')}`;
  
  fs.writeFileSync('FIXES_REQUIRED.md', fixContent);
  console.log(`\n📝 Fichier de corrections créé : FIXES_REQUIRED.md`);
}

/**
 * Obtenir suggestion de correction
 */
function getSuggestedFix(error) {
  if (error.includes('39€')) {
    return 'Remplacer "39€" par "90€" ou retirer la mention du prix';
  }
  if (error.includes('diagnostic gratuit')) {
    return 'Ajouter un lien vers le diagnostic gratuit';
  }
  if (error.includes('arguments')) {
    return 'Renommer la variable "arguments" en "argumentsJuridiques"';
  }
  return 'Vérifier et corriger selon le contexte';
}

// Lancement du script
console.log(`${colors.blue}🔍 Démarrage de la vérification de cohérence...${colors.reset}`);
console.log(`📁 Répertoire : ${process.cwd()}`);

// Scanner le répertoire src
const srcPath = path.join(process.cwd(), 'src');
if (fs.existsSync(srcPath)) {
  scanDirectory(srcPath);
  generateReport();
  
  if (errors.length > 0) {
    generateFixFile();
  }
} else {
  console.error(`${colors.red}Erreur : Répertoire src/ non trouvé${colors.reset}`);
  console.log('Assurez-vous d\'exécuter ce script depuis la racine du projet');
}

// Code de sortie
process.exit(errors.length > 0 ? 1 : 0);