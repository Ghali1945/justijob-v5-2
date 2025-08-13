
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JustiJob - Agent IA Claude pour vos droits',
  description: 'Plateforme d\'aide juridique propulsée par l\'Agent IA Claude d\'Anthropic pour constituer votre dossier prud\'hommes',
  keywords: 'prud\'hommes, droit du travail, Claude AI, Anthropic, licenciement, indemnités',
  authors: [{ name: 'JustiJob' }],
  openGraph: {
    title: 'JustiJob - Agent IA Claude pour vos droits',
    description: 'Constituez votre dossier prud\'hommes avec l\'aide de l\'IA Claude',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://justijob.fr',
    siteName: 'JustiJob',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {/* Header Principal */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <a href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">JustiJob</span>
                <span className="text-sm text-gray-500 hidden sm:inline">by Claude AI</span>
              </a>
              
              {/* Navigation principale */}
              <nav className="hidden md:flex items-center space-x-6">
                <a href="/calculateurs" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Calculateurs
                </a>
                <a href="/diagnostic" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Diagnostic
                </a>
                <a href="/urgence" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Guide Urgence
                </a>
                <a href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Dashboard
                </a>
                <a 
                  href="/diagnostic" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Commencer →
                </a>
              </nav>

              {/* Menu mobile */}
              <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer avec liens légaux */}
        <footer className="bg-gray-900 text-white py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Grille du footer */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
              {/* Colonne 1 : À propos */}
              <div>
                <h3 className="text-lg font-bold mb-4">JustiJob</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Plateforme d'aide juridique propulsée par l'Agent IA Claude d'Anthropic
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>🤖</span>
                  <span>Powered by Claude AI</span>
                </div>
              </div>
              
              {/* Colonne 2 : Services */}
              <div>
                <h3 className="text-lg font-bold mb-4">Services</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/calculateurs" className="text-gray-400 hover:text-white transition-colors">
                      Calculateurs gratuits
                    </a>
                  </li>
                  <li>
                    <a href="/diagnostic" className="text-gray-400 hover:text-white transition-colors">
                      Diagnostic IA gratuit
                    </a>
                  </li>
                  <li>
                    <a href="/questionnaire" className="text-gray-400 hover:text-white transition-colors">
                      Dossier complet (90€)
                    </a>
                  </li>
                  <li>
                    <a href="/urgence" className="text-gray-400 hover:text-white transition-colors">
                      Guide d'urgence
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Colonne 3 : Informations légales */}
              <div>
                <h3 className="text-lg font-bold mb-4">Informations légales</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/cgv" className="text-gray-400 hover:text-white transition-colors">
                      Conditions Générales de Vente
                    </a>
                  </li>
                  <li>
                    <a href="/cgu" className="text-gray-400 hover:text-white transition-colors">
                      Conditions Générales d'Utilisation
                    </a>
                  </li>
                  <li>
                    <a href="/mentions-legales" className="text-gray-400 hover:text-white transition-colors">
                      Mentions légales
                    </a>
                  </li>
                  <li>
                    <a href="/politique-confidentialite" className="text-gray-400 hover:text-white transition-colors">
                      Politique de confidentialité (RGPD)
                    </a>
                  </li>
                  <li>
                    <a href="/gestion-cookies" className="text-gray-400 hover:text-white transition-colors">
                      Gestion des cookies
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Colonne 4 : Contact & Support */}
              <div>
                <h3 className="text-lg font-bold mb-4">Contact & Support</h3>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-center space-x-2">
                    <span>📧</span>
                    <span>support@justijob.fr</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>🔒</span>
                    <span>rgpd@justijob.fr</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>⚖️</span>
                    <span>dpo@justijob.fr</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>⏰</span>
                    <span>Réponse sous 48h</span>
                  </li>
                </ul>
                
                {/* Badges de confiance */}
                <div className="mt-6 flex items-center space-x-3">
                  <div className="bg-gray-800 rounded px-2 py-1 text-xs">
                    🔐 SSL
                  </div>
                  <div className="bg-gray-800 rounded px-2 py-1 text-xs">
                    💳 Stripe
                  </div>
                  <div className="bg-gray-800 rounded px-2 py-1 text-xs">
                    🇫🇷 RGPD
                  </div>
                </div>
              </div>
            </div>
            
            {/* Séparateur */}
            <div className="border-t border-gray-800 mt-8 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                {/* Copyright */}
                <div className="text-sm text-gray-400 mb-4 md:mb-0">
                  © 2025 JustiJob - Tous droits réservés
                </div>
                
                {/* Partenaires */}
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <a 
                    href="https://www.anthropic.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    🤖 Claude (Anthropic)
                  </a>
                  <a 
                    href="https://stripe.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    💳 Paiement sécurisé
                  </a>
                  <a 
                    href="https://vercel.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    ▲ Hébergé par Vercel
                  </a>
                </div>
              </div>
              
              {/* Message de confiance */}
              <div className="mt-6 text-center text-xs text-gray-500">
                <p>
                  JustiJob utilise l'Agent IA Claude d'Anthropic pour analyser votre situation 
                  et générer des documents juridiques personnalisés. Vos données sont protégées 
                  conformément au RGPD.
                </p>
              </div>
            </div>
          </div>
        </footer>

        {/* Bannière cookies (optionnel - décommentez si vous avez créé le composant) */}
        {/* <CookieBanner /> */}
      </body>
    </html>
  )
}