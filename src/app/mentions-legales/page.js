
'use client';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header avec navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">
              JustiJob
            </a>
            <nav className="flex gap-4 text-sm">
              <a href="/cgu" className="text-gray-600 hover:text-blue-600">CGU</a>
              <a href="/cgv" className="text-gray-600 hover:text-blue-600">CGV</a>
              <a href="/mentions-legales" className="text-blue-600 font-semibold">Mentions</a>
              <a href="/politique-confidentialite" className="text-gray-600 hover:text-blue-600">RGPD</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Mentions Légales
        </h1>

        <div className="space-y-8">
          
          {/* Éditeur */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📝 Éditeur du site
            </h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>JustiJob</strong></p>
              <p>Email : contact@justijob.fr</p>
              <p className="text-sm text-orange-600">
                [Forme juridique, Capital, RCS, TVA à compléter lors de la création de société]
              </p>
            </div>
          </section>

          {/* Technologie IA */}
          <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              🤖 Technologie IA
            </h2>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold text-lg">Agent IA Claude - Anthropic</p>
              <p>JustiJob utilise Claude, l'assistant IA développé par Anthropic PBC</p>
              <p className="text-sm">
                548 Market St, PMB 97242<br/>
                San Francisco, CA 94104<br/>
                United States<br/>
                <a href="https://www.anthropic.com" className="text-blue-600 hover:underline">
                  www.anthropic.com
                </a>
              </p>
            </div>
          </section>

          {/* Hébergement */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🌐 Hébergement
            </h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Vercel Inc.</strong></p>
              <p className="text-sm">
                340 S Lemon Ave #4133<br/>
                Walnut, CA 91789<br/>
                United States<br/>
                <a href="https://vercel.com" className="text-blue-600 hover:underline">
                  vercel.com
                </a>
              </p>
            </div>
          </section>

          {/* Technologies */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              💻 Conception et développement
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>Site développé avec :</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Framework : Next.js 14</li>
                <li>Intelligence Artificielle : Claude (Anthropic)</li>
                <li>Paiement sécurisé : Stripe</li>
                <li>Hébergement : Vercel</li>
              </ul>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section className="bg-yellow-50 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ⚖️ Propriété intellectuelle
            </h2>
            <p className="text-gray-700 mb-3">
              L'ensemble du contenu de ce site est protégé par le droit d'auteur 
              et est la propriété exclusive de JustiJob.
            </p>
            <p className="text-gray-700">
              <strong>Claude®</strong> est une marque déposée d'Anthropic PBC, utilisée sous licence.
            </p>
          </section>

          {/* Protection des données */}
          <section className="bg-green-50 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🔒 Protection des données
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>Délégué à la Protection des Données (DPO) : dpo@justijob.fr</p>
              <p>Pour exercer vos droits RGPD : rgpd@justijob.fr</p>
              <p className="mt-3">
                <strong>CNIL</strong><br/>
                3 Place de Fontenoy - TSA 80715<br/>
                75334 PARIS CEDEX 07<br/>
                <a href="https://www.cnil.fr" className="text-blue-600 hover:underline">
                  www.cnil.fr
                </a>
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🍪 Cookies
            </h2>
            <p className="text-gray-700">
              Ce site utilise des cookies techniques nécessaires à son fonctionnement 
              et des cookies analytiques. Pour plus d'informations, consultez notre{' '}
              <a href="/politique-confidentialite" className="text-blue-600 hover:underline">
                Politique de Confidentialité
              </a>.
            </p>
          </section>

          {/* Médiation */}
          <section className="bg-blue-50 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🤝 Médiation
            </h2>
            <p className="text-gray-700 mb-3">
              En cas de litige, vous pouvez recourir gratuitement au médiateur de la consommation.
            </p>
            <p className="text-gray-700">
              Plateforme européenne de règlement en ligne des litiges :{' '}
              <a href="https://ec.europa.eu/consumers/odr/" className="text-blue-600 hover:underline">
                ec.europa.eu/consumers/odr
              </a>
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📧 Contact
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold mb-2">Support général</p>
                <p className="text-gray-700">support@justijob.fr</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Signalement</p>
                <p className="text-gray-700">signalement@justijob.fr</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Accessibilité</p>
                <p className="text-gray-700">accessibilite@justijob.fr</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Protection des données</p>
                <p className="text-gray-700">rgpd@justijob.fr</p>
              </div>
            </div>
          </section>

        </div>

        {/* Bouton retour */}
        <div className="mt-12 text-center">
          <a 
            href="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}