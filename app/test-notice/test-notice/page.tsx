'use client';

import { useState, useEffect } from 'react';

export default function TestNoticePage() {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    fetch('/api/legal/notice')
      .then(res => {
        if (!res.ok) throw new Error('Erreur chargement');
        return res.text();
      })
      .then(text => {
        const processed = text
          .replace(/{{DATE}}/g, new Date().toLocaleDateString('fr-FR'))
          .replace(/{{HEURE}}/g, new Date().toLocaleTimeString('fr-FR'))
          .replace(/{{REFERENCE_DOSSIER}}/g, 'TEST-2024-001');
        setContent(processed);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Erreur:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">⏳ Chargement de la notice légale...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">❌ Erreur : {error}</div>
      </div>
    );
  }

  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-3xl font-bold mb-4 mt-6 text-blue-900">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-bold mb-3 mt-5 text-blue-700">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-semibold mb-2 mt-4 text-blue-600">{line.substring(4)}</h3>;
      }
      if (line === '---') {
        return <hr key={i} className="my-6 border-gray-300" />;
      }
      if (line.includes('**')) {
        const parts = line.split('**');
        const formatted = parts.map((part, j) => 
          j % 2 === 1 ? <strong key={j} className="font-bold text-gray-900">{part}</strong> : part
        );
        return <p key={i} className="my-2 text-gray-700">{formatted}</p>;
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return <li key={i} className="ml-6 my-1 text-gray-700">{line.substring(2)}</li>;
      }
      if (line.startsWith('✓ ') || line.startsWith('☑️ ')) {
        return <li key={i} className="ml-6 my-1 text-green-700">{line}</li>;
      }
      if (line.startsWith('❌ ') || line.startsWith('✗ ')) {
        return <p key={i} className="my-2 text-red-600 font-semibold">{line}</p>;
      }
      if (line.startsWith('✅ ')) {
        return <p key={i} className="my-2 text-green-600 font-semibold">{line}</p>;
      }
      if (line.startsWith('⚠️ ')) {
        return <p key={i} className="my-3 text-orange-600 font-bold text-lg">{line}</p>;
      }
      if (line.startsWith('🔴 ')) {
        return <p key={i} className="my-3 text-red-700 font-bold text-xl">{line}</p>;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return <p key={i} className="my-2 text-gray-700">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold mb-2">JustiJob v5.0.0</h1>
          <p className="text-blue-100">Notice Légale - Protection Juridique Intégrée</p>
        </div>
        
        {/* Contenu */}
        <div className="bg-white shadow-lg p-8">
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="text-sm text-gray-600">
              📅 Généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
            </p>
            <p className="text-sm text-gray-600">
              📁 Référence: TEST-2024-001
            </p>
          </div>
          
          <div className="prose max-w-none">
            {formatContent(content)}
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-red-600 text-white p-4 rounded-b-lg text-center">
          <p className="font-bold">⚠️ ENVIRONNEMENT DE TEST - NE PAS UTILISER EN PRODUCTION ⚠️</p>
        </div>
      </div>
    </div>
  );
}