import './globals.css'

export const metadata = {
  title: 'JustiJob - Défendez vos droits avec l\'IA juridique',
  description: 'Plateforme IA d\'assistance juridique aux Prud\'hommes.',
  keywords: 'prud\'hommes, droit du travail, licenciement, justice, IA juridique',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
