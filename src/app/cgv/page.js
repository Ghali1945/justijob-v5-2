
'use client';

export default function CGVPage() {
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
              <a href="/cgu" className="text-gray-600 hover:text-blue-600">CGU</a>
              <a href="/cgv" className="text-blue-600 font-semibold">CGV</a>
              <a href="/mentions-legales" className="text-gray-600 hover:text-blue-600">Mentions légales</a>
              <a href="/politique-confidentialite" className="text-gray-600 hover:text-blue-600">Confidentialité</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Contenu CGV */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Conditions Générales de Vente
        </h1>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <p className="text-blue-700">
            <strong>Service propulsé par l'Agent IA Claude d'Anthropic</strong>
          </p>
          <p className="text-sm text-blue-600 mt-1">
            Dernière mise à jour : 12 août 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 1 - Objet et champ d'application
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des relations 
              entre JustiJob, plateforme de génération de dossiers prud'hommes assistée par 
              l'IA Claude d'Anthropic, et ses utilisateurs clients.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 2 - Description des services
            </h2>
            
            <div className="bg-green-50 rounded-lg p-6 mb-4">
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                2.1 Services gratuits
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Accès aux 4 calculateurs de droits (licenciement, congés payés, heures supplémentaires, prime d'ancienneté)</li>
                <li>Diagnostic gratuit avec scoring par l'Agent IA Claude</li>
                <li>Guide des procédures prud'homales</li>
                <li>Conseils juridiques généraux</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                2.2 Services payants
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Génération complète d'un dossier prud'hommes personnalisé</li>
                <li>Analyse approfondie par l'Agent IA Claude</li>
                <li>Production de documents juridiques (requête CPH, calculs d'indemnités, arguments juridiques)</li>
                <li>Guide de procédure personnalisé</li>
                <li>Support par email pendant 30 jours</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 3 - Prix et modalités de paiement
            </h2>
            
            <div className="bg-yellow-50 rounded-lg p-6 mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                3.1 Tarifs
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded">
                  <span className="font-medium">Tarif grand public</span>
                  <span className="text-2xl font-bold text-blue-600">90€ TTC</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded">
                  <span className="font-medium">Tarif adhérent syndical</span>
                  <span className="text-2xl font-bold text-green-600">45€ TTC</span>
                </div>
                <p className="text-sm text-gray-600 italic">
                  * -50% sur présentation d'un code syndicat valide
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                3.2 Paiement
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Paiement en ligne via la plateforme sécurisée Stripe</li>
                <li>Moyens acceptés : Carte bancaire (Visa, Mastercard, American Express)</li>
                <li>Paiement exigible immédiatement à la commande</li>
                <li>Option de paiement en 2 fois sans frais disponible (2×45€)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 4 - Processus de commande
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Réalisation du diagnostic gratuit avec Claude</li>
              <li>Si score &gt; 50 : proposition de service payant</li>
              <li>Saisie du code syndicat (optionnel)</li>
              <li>Paiement sécurisé via Stripe</li>
              <li>Accès immédiat au questionnaire expert</li>
              <li>Génération du dossier par l'IA Claude</li>
              <li>Téléchargement des documents PDF</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 5 - Droit de rétractation
            </h2>
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
              <p className="text-gray-700">
                Conformément à l'article L221-28 du Code de la consommation, le droit de 
                rétractation ne s'applique pas aux services pleinement exécutés avant la fin 
                du délai de rétractation et dont l'exécution a commencé avec l'accord préalable 
                exprès du consommateur.
              </p>
              <p className="text-gray-700 mt-3">
                L'utilisateur reconnaît et accepte que l'accès au questionnaire expert et la 
                génération du dossier constituent le commencement d'exécution du service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 6 - Garanties et responsabilités
            </h2>
            
            <div className="space-y-4">
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-red-800 mb-3">
                  6.1 Nature du service
                </h3>
                <p className="text-gray-700">
                  JustiJob fournit un service d'aide à la constitution de dossier prud'homal. 
                  Les documents générés constituent une aide à la rédaction et ne remplacent 
                  pas les conseils d'un avocat.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">
                  6.2 Utilisation de l'IA Claude
                </h3>
                <p className="text-gray-700">
                  L'analyse et les recommandations sont effectuées par l'Agent IA Claude d'Anthropic. 
                  Bien que nous nous efforçons d'assurer la qualité et la pertinence des résultats, 
                  l'utilisateur reste responsable de la vérification et de l'utilisation des 
                  informations fournies.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  6.3 Limitation de responsabilité
                </h3>
                <p className="text-gray-700 mb-3">JustiJob ne peut être tenu responsable :</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Des décisions prises sur la base des documents générés</li>
                  <li>Des résultats de la procédure prud'homale</li>
                  <li>Des erreurs ou omissions dans les informations fournies par l'utilisateur</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 7 - Propriété intellectuelle
            </h2>
            <p className="text-gray-700">
              Les documents générés sont la propriété de l'utilisateur. JustiJob conserve 
              les droits sur la structure, les modèles et les algorithmes utilisés.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 8 - Protection des données
            </h2>
            <p className="text-gray-700">
              Voir notre{' '}
              <a href="/politique-confidentialite" className="text-blue-600 hover:underline">
                Politique de Confidentialité
              </a>{' '}
              pour les détails sur le traitement des données personnelles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 9 - Service client
            </h2>
            <div className="bg-green-50 rounded-lg p-6">
              <ul className="space-y-2 text-gray-700">
                <li><strong>Email :</strong> support@justijob.fr</li>
                <li><strong>Délai de réponse :</strong> 48h ouvrées</li>
                <li><strong>Support inclus :</strong> 30 jours après l'achat</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 10 - Modification des CGV
            </h2>
            <p className="text-gray-700">
              JustiJob se réserve le droit de modifier les présentes CGV. Les modifications 
              s'appliquent aux commandes postérieures à leur publication.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Article 11 - Droit applicable et juridiction
            </h2>
            <p className="text-gray-700">
              Les présentes CGV sont soumises au droit français. En cas de litige, une solution 
              amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux 
              français seront compétents.
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