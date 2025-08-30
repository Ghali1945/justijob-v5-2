'use client';

import { useState, useEffect } from 'react';

interface LegalNoticeProps {
  dossierRef?: string;
  asModal?: boolean;
}

export default function LegalNotice({ 
  dossierRef = "TEMP-" + Date.now(),
  asModal = false 
}: LegalNoticeProps) {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/legal/notice')
      .then(res => res.text())
      .then(text => {
        // Remplacer les variables dynamiques
        const processed = text
          .replace(/{{DATE}}/g, new Date().toLocaleDateString('fr-FR'))
          .replace(/{{HEURE}}/g, new Date().toLocaleTimeString('fr-FR'))
          .replace(/{{REFERENCE_DOSSIER}}/g, dossierRef);
        setContent(processed);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Erreur chargement notice:', err);
        setIsLoading(false);
      });
  }, [dossierRef]);

  if (isLoading) {
    return <div className="p-4">Chargement de la notice légale...</div>;
  }

  const formattedContent = content
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-2xl font-bold mb-4 mt-6">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-bold mb-3 mt-4">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-bold mb-2 mt-3">{line.substring(4)}</h3>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold my-2">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return <li key={i} className="ml-6 my-1">{line.substring(2)}</li>;
      }
      if (line.startsWith('✅') || line.startsWith('❌') || line.startsWith('☑️')) {
        return <p key={i} className="my-2">{line}</p>;
      }
      if (line === '---') {
        return <hr key={i} className="my-4 border-gray-300" />;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return <p key={i} className="my-2">{line}</p>;
    });

  if (asModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto p-8">
          <button 
            onClick={() => window.history.back()}
            className="float-right text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <div className="prose max-w-none">
            {formattedContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="legal-notice bg-white p-8 rounded-lg shadow-sm">
      <div className="prose max-w-none">
        {formattedContent}
      </div>
    </div>
  );
}