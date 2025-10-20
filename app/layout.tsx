import './globals.css'

export const metadata = {
  title: 'JustiJob - La Défense Active',
  description: 'Protection juridique des salariés - Diagnostic gratuit avec IA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
