
GUIDE COMPLET 
INTÉGRATION API CLAUDE DANS JUSTIJOB
SOMMAIRE
1.	Créer un compte Anthropic
1.	Obtenir la clé API
1.	Configurer la clé dans JustiJob
1.	Installer le SDK Claude
1.	Créer le service Claude
1.	Connecter Claude au diagnostic
1.	Connecter Claude au questionnaire
1.	Tester l'intégration
1.	Gérer les coûts
ÉTAPE 1 : CRÉER UN COMPTE ANTHROPIC 
1.1 Accéder au site Anthropic
1.	Ouvrez votre navigateur
1.	Allez sur : https://console.anthropic.com
1.	Cliquez sur "Sign up" (en haut à droite)
1.2 Créer votre compte
📝 Informations à fournir :
- Email professionnel : [votre-email@justijob.fr]
- Mot de passe sécurisé
- Nom de l'organisation : JustiJob
- Utilisation prévue : "Legal tech platform for labor law assistance"

1.3 Valider votre email
1.	Vérifiez votre boîte mail
1.	Cliquez sur le lien de confirmation
1.	Connectez-vous à la console
Résultat : Accès à la console Anthropic
ÉTAPE 2 : OBTENIR VOTRE CLÉ API 
2.1 Accéder aux API Keys
1.	Dans la console Anthropic, cliquez sur "API Keys" dans le menu latéral
1.	Cliquez sur "Create Key"
2.2 Configurer la clé
 Configuration recommandée :
- Name : "JustiJob Production"
- Permissions : Full access
- Rate limits : Default (pour commencer)

2.3 Copier et sauvegarder la clé
TRÈS IMPORTANT :
1.	La clé ressemble à : sk-ant-api03-xxxxxxxxxxxxxxxxxxxxx
1.	Copiez-la immédiatement (elle ne sera plus visible après)
1.	Sauvegardez-la dans un endroit sûr temporairement
2.4 Activer un mode de paiement
1.	Cliquez sur "Billing" dans le menu
1.	Ajoutez une carte bancaire
1.	Configurez les alertes de dépenses : 
·	Alert à 50€
·	Limite stricte à 100€ (pour commencer)
 Résultat : Clé API obtenue et compte configuré
TARIFICATION CLAUDE (À CONNAÎTRE)
Modèle Claude 3 Opus (Le plus puissant - Recommandé)
Coûts actuels (août 2025) :
- Input : 15$ pour 1 million de tokens (~750k mots)
- Output : 75$ pour 1 million de tokens (~750k mots)


Pour JustiJob :
- Diagnostic (500 mots) : ~0.02€ par analyse
- Dossier complet (5000 mots) : ~0.20€ par génération
- Estimation mensuelle (100 dossiers) : ~25€

Modèles alternatifs (plus économiques)
·	Claude 3.5 Sonnet : 5x moins cher, presque aussi performant
·	Claude 3 Haiku : 20x moins cher, pour tâches simples
ÉTAPE 3 : CONFIGURER LA CLÉ DANS JUSTIJOB 
3.1 Ouvrir le fichier .env.local
1.	Dans votre éditeur de code (VS Code)
1.	Ouvrez le fichier .env.local à la racine du projet
1.	Si le fichier n'existe pas, créez-le
3.2 Ajouter la clé API
# IA Claude (REMPLACEZ par votre vraie clé)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxx

# Configuration Claude
CLAUDE_MODEL=claude-3-opus-20240229
CLAUDE_MAX_TOKENS=4000
CLAUDE_TEMPERATURE=0.7

# Sécurité
NEXT_PUBLIC_APP_URL=http://localhost:3000



3.3 Vérifier le .gitignore
SÉCURITÉ CRITIQUE : Assurez-vous que .env.local est dans .gitignore :
# Dans le fichier .gitignore
.env.local
.env

 Résultat : Clé API configurée et sécurisée
ÉTAPE 4 : INSTALLER LE SDK ANTHROPIC 
4.1 Ouvrir le terminal
1.	Appuyez sur Windows + R
1.	Tapez cmd et Entrée
1.	Naviguez vers votre projet :
cd C:\[votre-chemin]\justijob-nextjs-version-1

4.2 Installer le package Anthropic
npm install @anthropic-ai/sdk

4.3 Vérifier l'installation
npm list @anthropic-ai/sdk

Vous devriez voir : @anthropic-ai/sdk@0.x.x
Résultat : SDK Claude installé


ÉTAPE 5 : CRÉER LE SERVICE CLAUDE
5.1 Créer le fichier service
1.	Naviguez vers src/lib/ai/
1.	Créez un nouveau fichier : claude-service.js
5.2 Copier ce code complet
// src/lib/ai/claude-service.js
import Anthropic from '@anthropic-ai/sdk';

// Initialiser Claude avec la clé API
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Analyser un diagnostic avec Claude
 */
export async function analyzeDiagnostic(formData) {
  try {
    const prompt = `
Tu es un expert en droit du travail français. Analyse cette situation et donne un score de viabilité sur 100 pour un dossier prud'homal.

Situation du salarié :
- Secteur : ${formData.secteur}
- Type de contrat : ${formData.typeContrat}
- Ancienneté : ${formData.anciennete} ans
- Salaire mensuel : ${formData.salaire}€
- Nature du litige : ${formData.natureLitige}
- Description : ${formData.description}
- Preuves disponibles : ${formData.preuves}

Réponds au format JSON avec :
1. score : un nombre entre 0 et 100
2. analyse : une analyse en 3-4 phrases
3. points_forts : liste de 3 points forts du dossier
4. points_faibles : liste des points à améliorer
5. recommandations : 3 recommandations concrètes
6. estimation_indemnites : montant estimé en euros
`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Parser la réponse JSON de Claude
    const content = response.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback si pas de JSON
    return {
      score: 50,
      analyse: content,
      points_forts: ["Analyse en cours"],
      points_faibles: ["Données à compléter"],
      recommandations: ["Consultez un avocat"],
      estimation_indemnites: 0
    };

  } catch (error) {
    console.error('Erreur Claude API:', error);
    
    // Retour par défaut en cas d'erreur
    return {
      score: 0,
      analyse: "Erreur lors de l'analyse. Veuillez réessayer.",
      points_forts: [],
      points_faibles: ["Erreur technique"],
      recommandations: ["Réessayez plus tard"],
      estimation_indemnites: 0,
      error: true
    };
  }
}

/**
 * Générer un dossier complet avec Claude
 */
export async function generateDossier(questionnaire) {
  try {
    const prompt = `
Tu es un expert juridique spécialisé en droit du travail. Génère un dossier prud'homal complet basé sur ces informations :

INFORMATIONS DU SALARIÉ :
${JSON.stringify(questionnaire, null, 2)}

Génère un dossier au format JSON contenant :
1. requete_cpf : texte complet de la requête (minimum 500 mots)
2. arguments_juridiques : 5 arguments avec articles de loi et jurisprudence
3. calcul_indemnites : détail de tous les montants (licenciement, congés, dommages)
4. pieces_necessaires : liste de 10 pièces à fournir
5. strategie_procedurale : plan d'action en 5 étapes
6. chances_succes : pourcentage et justification
7. duree_estimee : délai en mois
8. tribunal_competent : nom et adresse du CPH compétent

Sois précis, professionnel et cite des articles de loi réels.
`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      temperature: 0.5, // Plus bas pour plus de précision
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const dossier = JSON.parse(jsonMatch[0]);
      
      // Enrichir avec des données calculées
      dossier.date_generation = new Date().toISOString();
      dossier.reference = `JJ-${Date.now()}`;
      dossier.powered_by = "Claude AI (Anthropic)";
      
      return dossier;
    }

    throw new Error("Format de réponse invalide");

  } catch (error) {
    console.error('Erreur génération dossier:', error);
    throw error;
  }
}

/**
 * Analyser un contrat de travail
 */
export async function analyzeContract(contractText) {
  try {
    const prompt = `
Analyse ce contrat de travail et identifie les points importants et anomalies éventuelles :

CONTRAT :
${contractText}

Fournis une analyse structurée avec :
1. type_contrat : CDI/CDD/autre
2. clauses_importantes : liste des clauses clés
3. anomalies_detectees : problèmes potentiels
4. clauses_abusives : clauses potentiellement illégales
5. recommandations : actions suggérées
`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
      temperature: 0.6,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return response.content[0].text;

  } catch (error) {
    console.error('Erreur analyse contrat:', error);
    throw error;
  }
}

/**
 * Vérifier le statut de l'API
 */
export async function checkApiStatus() {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 10,
      messages: [
        {
          role: 'user',
          content: 'Réponds juste "OK"'
        }
      ]
    });
    
    return { 
      status: 'active', 
      message: 'API Claude opérationnelle',
      model: 'claude-3-opus-20240229'
    };

  } catch (error) {
    return { 
      status: 'error', 
      message: error.message,
      model: null
    };
  }
}

// Export par défaut
export default {
  analyzeDiagnostic,
  generateDossier,
  analyzeContract,
  checkApiStatus
};

Résultat : Service Claude créé et prêt à l'emploi
ÉTAPE 6 : CONNECTER CLAUDE AU DIAGNOSTIC {etape-6}
6.1 Mettre à jour l'API diagnostic
Ouvrez src/app/api/analyze-diagnostic/route.js et remplacez par :
import { NextResponse } from 'next/server';
import { analyzeDiagnostic } from '@/lib/ai/claude-service';

export async function POST(request) {
  try {
    const formData = await request.json();
    
    // Appeler Claude pour l'analyse
    const analysis = await analyzeDiagnostic(formData);
    
    // Retourner les résultats
    return NextResponse.json({
      success: true,
      ...analysis,
      powered_by: 'Claude AI (Anthropic)'
    });

  } catch (error) {
    console.error('Erreur API diagnostic:', error);
    
    return NextResponse.json({
      success: false,
      score: 0,
      analyse: "Erreur lors de l'analyse. Veuillez réessayer.",
      error: error.message
    }, { status: 500 });
  }
}

6.2 Mettre à jour le composant DiagnosticForm
Dans src/components/DiagnosticForm.js, vérifiez que l'appel API est bien fait :
// Cherchez la fonction handleSubmit et assurez-vous qu'elle appelle l'API
const response = await fetch('/api/analyze-diagnostic', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});

Résultat : Diagnostic connecté à Claude
ÉTAPE 7 : CONNECTER CLAUDE AU QUESTIONNAIRE 
7.1 Mettre à jour l'API génération dossier
Ouvrez src/app/api/generate-dossier/route.js et remplacez par :
import { NextResponse } from 'next/server';
import { generateDossier } from '@/lib/ai/claude-service';

export async function POST(request) {
  try {
    const questionnaire = await request.json();
    
    // Générer le dossier avec Claude
    const dossier = await generateDossier(questionnaire);
    
    // Sauvegarder en session (temporaire)
    // TODO: Sauvegarder en base de données
    
    return NextResponse.json({
      success: true,
      dossier,
      downloadUrl: `/telecharger-dossier?ref=${dossier.reference}`
    });

  } catch (error) {
    console.error('Erreur génération dossier:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

Résultat : Génération de dossier connectée à Claude
ÉTAPE 8 : TESTER L'INTÉGRATION
8.1 Créer une page de test
Créez src/app/test-claude/page.js :
'use client';

import { useState } from 'react';

export default function TestClaudePage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-claude');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      setStatus({ status: 'error', message: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Test API Claude
        </h1>

        <div className="bg-white rounded-lg shadow p-6">
          <button
            onClick={testApi}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Test en cours...' : 'Tester la connexion Claude'}
          </button>

          {status && (
            <div className={`mt-6 p-4 rounded-lg ${
              status.status === 'active' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <h3 className="font-bold mb-2">
                {status.status === 'active' ? '✅ Succès' : '❌ Erreur'}
              </h3>
              <p className="text-sm">{status.message}</p>
              {status.model && (
                <p className="text-xs mt-2">Modèle : {status.model}</p>
              )}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold mb-2">📊 Informations de test</h3>
            <ul className="text-sm space-y-1">
              <li>• Diagnostic : ~0.02€ par test</li>
              <li>• Dossier complet : ~0.20€ par test</li>
              <li>• Limite configurée : 100€/mois</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-blue-600 hover:underline">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}

8.2 Créer l'API de test
Créez src/app/api/test-claude/route.js :
import { NextResponse } from 'next/server';
import { checkApiStatus } from '@/lib/ai/claude-service';

export async function GET() {
  const status = await checkApiStatus();
  return NextResponse.json(status);
}

8.3 Lancer le test
1.	Démarrez le serveur : npm run dev
1.	Allez sur : http://localhost:3000/test-claude
1.	Cliquez sur "Tester la connexion Claude"
Résultat : Si tout est vert, Claude est opérationnel !
ÉTAPE 9 : GÉRER LES COÛTS ET MONITORING 
9.1 Créer un système de logs
Créez src/lib/ai/usage-tracker.js :
// Tracker simple pour suivre l'utilisation
let usageStats = {
  diagnostics: 0,
  dossiers: 0,
  totalCost: 0
};

export function logUsage(type, estimatedCost) {
  if (type === 'diagnostic') {
    usageStats.diagnostics++;
    usageStats.totalCost += 0.02;
  } else if (type === 'dossier') {
    usageStats.dossiers++;
    usageStats.totalCost += 0.20;
  }
  
  console.log(`[CLAUDE USAGE] ${type} - Coût estimé: ${estimatedCost}€`);
  console.log(`[CLAUDE STATS] Total ce mois: ${usageStats.totalCost.toFixed(2)}€`);
  
  // Alerte si dépassement
  if (usageStats.totalCost > 90) {
    console.warn('⚠️ ATTENTION: Proche de la limite de 100€');
  }
}

export function getUsageStats() {
  return usageStats;
}

9.2 Intégrer le tracking
Dans claude-service.js, ajoutez après chaque appel :
import { logUsage } from './usage-tracker';

// Dans analyzeDiagnostic
const response = await anthropic.messages.create(...);
logUsage('diagnostic', 0.02);

// Dans generateDossier  
const response = await anthropic.messages.create(...);
logUsage('dossier', 0.20);

9.3 Dashboard de monitoring
Dans la console Anthropic :
1.	Allez dans "Usage"
1.	Configurez les alertes : 
·	Alert email à 50€
·	Alert email à 75€
·	Limite stricte à 100€
CHECKLIST FINALE
Vérifications avant production :
·	[ ] Clé API dans .env.local
·	[ ] .env.local dans .gitignore
·	[ ] SDK Anthropic installé
·	[ ] Service Claude créé
·	[ ] APIs connectées
·	[ ] Test réussi
·	[ ] Alertes configurées
·	[ ] Mode de paiement actif
Tests à effectuer :
1.	Test diagnostic : Score et analyse
1.	Test dossier : Génération complète
1.	Test erreur : Clé invalide
1.	Test limite : Vérifier les coûts
SÉCURITÉ - RÈGLES D'OR
NE JAMAIS :
·	❌ Exposer la clé API côté client
·	❌ Commiter la clé sur GitHub
·	❌ Partager la clé par email
·	❌ Utiliser la même clé dev/prod

TOUJOURS :
·	 Utiliser les variables d'environnement
·	Appels API côté serveur uniquement
·	Limiter les tokens par requête
·	Monitorer les coûts quotidiennement
SUPPORT
Problèmes fréquents et solutions :
Erreur "Invalid API Key"
# Vérifier la clé
echo $ANTHROPIC_API_KEY
# Si vide, vérifier .env.local

Erreur "Rate limit exceeded"
·	Attendez 1 minute
·	Vérifiez vos limites dans la console
Erreur "Insufficient credits"
·	Ajoutez des crédits dans Billing
·	Vérifiez le mode de paiement
Ressources utiles :
·	Documentation API : https://docs.anthropic.com
·	Console : https://console.anthropic.com
·	Status : https://status.anthropic.com
·	Support : support@anthropic.com


FÉLICITATIONS !
Votre intégration Claude est complète !
JustiJob est maintenant propulsé par l'IA Claude d'Anthropic avec :
·	Diagnostic intelligent
·	Génération de dossiers
·	Analyse de contrats
·	Arguments juridiques IA
Prochaines optimisations possibles :
1.	Cache Redis : Économiser sur les requêtes répétées
1.	File d'attente : Gérer les pics de charge
1.	Modèles variés : Sonnet pour économiser
1.	Fine-tuning : Spécialisation juridique
Budget estimé : 25-50€/mois pour 100-200 dossiers                                                                ROI : 90€/dossier - 0,20€ de coût = Marge de 99,8% 
Guide créé pour le partenariat JustiJob et Claude (Anthropic)Version 4.0 - Août 2025