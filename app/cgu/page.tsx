
'use client';

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header avec navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">
              JustiJob
            </a>
            <nav className="flex gap-4">
              <a href="/cgu" className="text-blue-600 font-semibold">CGU</a>
              <a href="/cgv" className="text-gray-600 hover:text-blue-600">CGV</a>
              <a href="/mentions-legales" className="text-gray-600 hover:text-blue-600">Mentions légales</a>
              <a href="/politique-confidentialite" className="text-gray-600 hover:text-blue-600">Confidentialité</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Contenu CGU */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Conditions Générales d'Utilisation
        </h1>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <p className="text-blue-700">
            <strong>Plateforme assistée par l'Agent IA Claude d'Anthropic</strong>
          </p>
          <p className="text-sm text-blue-600 mt-1">
            Dernière mise à jour : 12 août 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 1 - Acceptation des conditions
            </h2>
            <p className="text-gray-600 leading-relaxed">
              L'utilisation du site JustiJob implique l'acceptation pleine et entière des 
              présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser 
              notre service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 2 - Description du service
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">JustiJob est une plateforme web qui propose :</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Des outils de calcul de droits sociaux</li>
                <li>Un diagnostic juridique assisté par l'Agent IA Claude d'Anthropic</li>
                <li>La génération de dossiers prud'homaux personnalisés</li>
                <li>Des ressources juridiques gratuites</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 3 - Accès au service
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  3.1 Conditions d'accès
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Service accessible 24h/24, 7j/7</li>
                  <li>Interruptions possibles pour maintenance</li>
                  <li>Connexion internet requise</li>
                  <li>Navigateur web récent recommandé</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">
                  3.2 Inscription
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Aucune inscription pour services gratuits</li>
                  <li>Email requis pour services payants</li>
                  <li>Informations exactes obligatoires</li>
                  <li>Mise à jour des données requise</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-purple-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">
              Article 4 - Utilisation de l'Agent IA Claude
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-purple-800 mb-3">
                  4.1 Fonctionnement
                </h3>
                <p className="text-gray-700 mb-3">
                  Notre service utilise Claude, l'assistant IA développé par Anthropic, pour :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Analyser les situations juridiques</li>
                  <li>Calculer les scores de viabilité</li>
                  <li>Générer des arguments juridiques</li>
                  <li>Personnaliser les documents</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-purple-800 mb-3">
                  4.2 Limites de l'IA
                </h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-gray-700 mb-3">L'utilisateur comprend que :</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Claude est un outil d'aide à la décision</li>
                    <li>Les résultats doivent être vérifiés</li>
                    <li>L'IA ne remplace pas un conseil juridique professionnel</li>
                    <li>Les analyses sont basées sur les informations fournies</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 5 - Obligations de l'utilisateur
            </h2>
            <div className="bg-red-50 rounded-lg p-6">
              <p className="text-gray-700 mb-3">L'utilisateur s'engage à :</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Fournir des informations véridiques</li>
                <li>Ne pas utiliser le service à des fins illégales</li>
                <li>Respecter les droits de propriété intellectuelle</li>
                <li>Ne pas tenter de contourner les mesures de sécurité</li>
                <li>Ne pas surcharger les serveurs par des requêtes automatisées</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 6 - Contenu utilisateur
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  6.1 Responsabilité
                </h3>
                <p className="text-gray-700">L'utilisateur est seul responsable :</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>Des informations qu'il fournit</li>
                  <li>Des documents qu'il télécharge</li>
                  <li>De l'usage des documents générés</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">
                  6.2 Licence d'utilisation
                </h3>
                <p className="text-gray-700">
                  En soumettant du contenu, l'utilisateur accorde à JustiJob une licence 
                  limitée pour traiter ces informations aux fins de fourniture du service.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 7 - Propriété intellectuelle
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-orange-800 mb-3">
                  7.1 Droits de JustiJob
                </h3>
                <p className="text-gray-700 mb-2">Sont propriété de JustiJob :</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>Le site web et son design</li>
                  <li>Les algorithmes et méthodes</li>
                  <li>Les modèles de documents</li>
                  <li>La marque et les logos</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">
                  7.2 Technologie Anthropic
                </h3>
                <p className="text-gray-700">
                  Claude et les technologies associées sont la propriété d'Anthropic 
                  et utilisées sous licence.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 8 - Données personnelles
            </h2>
            <p className="text-gray-700">
              Le traitement des données personnelles est détaillé dans notre{' '}
              <a href="/politique-confidentialite" className="text-blue-600 hover:underline">
                Politique de Confidentialité
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 9 - Exclusion de garantie
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-gray-700 font-semibold mb-3">
                LE SERVICE EST FOURNI "EN L'ÉTAT". JUSTIJOB NE GARANTIT PAS :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>L'absence d'erreurs ou d'interruptions</li>
                <li>L'adéquation à un besoin particulier</li>
                <li>L'exactitude absolue des résultats</li>
                <li>Le succès d'une procédure judiciaire</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 10 - Limitation de responsabilité
            </h2>
            <p className="text-gray-700">
              JustiJob ne pourra être tenu responsable des dommages indirects, consécutifs 
              ou punitifs résultant de l'utilisation ou de l'impossibilité d'utiliser le service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 11 - Modification du service
            </h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-gray-700 mb-3">JustiJob se réserve le droit de :</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Modifier les fonctionnalités</li>
                <li>Suspendre temporairement l'accès</li>
                <li>Cesser définitivement le service avec préavis</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 12 - Résiliation
            </h2>
            <div className="bg-red-50 rounded-lg p-6">
              <p className="text-gray-700 mb-3">
                JustiJob peut suspendre ou résilier l'accès en cas de :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Violation des présentes CGU</li>
                <li>Comportement frauduleux</li>
                <li>Utilisation abusive du service</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 13 - Droit applicable
            </h2>
            <p className="text-gray-700">
              Les présentes CGU sont régies par le droit français.
            </p>
          </section>

        </div>

        {/* Bouton retour */}
        <div className="mt-12 text-center">
          <a 
            href="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}