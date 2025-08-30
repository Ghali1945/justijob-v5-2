'use client';

import { useState, useEffect } from 'react';

export default function TestNoticePage() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/legal/notice')
      .then(res => res.text())
      .then(text => {
        const processed = text
          .replace(/{{DATE}}/g, new Date().toLocaleDateString('fr-FR'))
          .replace(/{{HEURE}}/g, new Date().toLocaleTimeString('fr-FR'))
          .replace(/{{REFERENCE_DOSSIER}}/g, 'TEST-2024-001');
        setContent(processed);
        setIsLoading(false);
      })
      .catch(err => {
        setContent('Erreur de chargement de la notice');
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: '50px', maxWidth: '1200px', margin: '0 auto' }}>
      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'Arial' }}>{content}</pre>
    </div>
  );
}