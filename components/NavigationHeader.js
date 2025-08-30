
'use client';

import { usePathname } from 'next/navigation';

export default function NavigationHeader() {
  const pathname = usePathname();
  
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo + Retour accueil */}
          <div className="flex items-center space-x-4">
            <a href="/" className="flex items-center space-x-2 group">
              <svg 
                className="w-6 h-6 text-gray-500 group-hover:text-blue-600 transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-2xl font-bold text-blue-600">JustiJob</span>
              <span className="text-sm text-gray-500 hidden sm:inline">by Claude AI</span>
            </a>
          </div>
          
          {/* Navigation principale */}
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="/calculateurs" 
              className={`${pathname === '/calculateurs' ? 'text-blue-600 font-semibold' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
            >
              Calculateurs
            </a>
            <a 
              href="/diagnostic" 
              className={`${pathname === '/diagnostic' ? 'text-blue-600 font-semibold' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
            >
              Diagnostic
            </a>
            <a 
              href="/urgence" 
              className={`${pathname === '/urgence' ? 'text-blue-600 font-semibold' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
            >
              Guide
            </a>
            <a 
              href="/dashboard" 
              className={`${pathname === '/dashboard' ? 'text-blue-600 font-semibold' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
            >
              Dashboard
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
  );
}